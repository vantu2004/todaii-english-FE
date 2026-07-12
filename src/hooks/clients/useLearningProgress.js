import { useEffect, useRef, useState, useCallback } from "react";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { getProgress, upsertProgress } from "@/api/clients/progressApi";
import { logError } from "@/utils/LogError";

// Chỉ còn 1 nhịp duy nhất: cứ mỗi PING_INTERVAL (ms) thì vừa kiểm tra hoạt động,
// vừa cộng dồn thời gian học, vừa lưu (ping) lên server luôn — không tách tick/save riêng nữa.
const PING_INTERVAL = 10000; // 10 giây

// Mỗi lần lưu, tối đa chỉ gửi lên tối đa 60s study_time_delta để tránh bị BE (anti-cheat) cắt bớt quá tay
const MAX_DELTA_PER_SAVE = 60;

// Ngưỡng "không hoạt động" tối thiểu/tối đa, dùng để tính thời gian chờ trước khi coi là idle.
// LƯU Ý: MIN phải <= MAX về mặt ý nghĩa (getInactivityLimit bên dưới đã tự phòng thủ nếu lỡ set ngược),
// và MIN nên >= PING_INTERVAL/1000, nếu không thì hầu như lần kiểm tra nào cũng rơi vào diện
// "đã idle quá ngưỡng" (vì khoảng cách giữa 2 lần tick còn dài hơn cả ngưỡng cho phép),
// khiến popup hiện gần như ngay lập tức và pendingDelta không bao giờ kịp cộng dồn để ping lên server.
const MIN_INACTIVITY_LIMIT = 60; // giây
const MAX_INACTIVITY_LIMIT = 120; // giây

const ACTIVITY_EVENTS = [
  "scroll",
  "click",
  "keydown",
  "touchstart",
  "mousemove",
];

function createEmptySession(contentId, contentType) {
  return {
    contentId: Number(contentId),
    contentType,
    estimateTime: 0, // thời lượng ước tính (giây), dùng để tính ngưỡng inactivity
    studyTime: 0, // tổng thời gian đã học tính đến hiện tại (giây)
    lastActivityTime: Date.now(), // mốc thời gian lần cuối user có tương tác (mouse/keyboard)
    lastTickAt: Date.now(), // mốc thời gian của lần ping gần nhất, dùng để tính elapsed time THỰC TẾ
    isTabActive: true, // tab hiện có đang được focus/hiển thị hay không (chỉ để tham khảo/debug)
    isPlaying: false, // (chỉ dùng cho video) video có đang phát hay không
    pendingDelta: 0, // số giây học được nhưng CHƯA gửi lên server
    position: 0, // vị trí hiện tại trong nội dung (giây, chỉ có ý nghĩa với video)
    lastSavedPosition: 0, // vị trí đã lưu thành công lần gần nhất
    isPopupShown: false, // popup đang hiển thị hay không (đang hiển thị thì tạm dừng đếm giờ)
  };
}

export function useLearningProgress({
  contentId,
  contentType,
  isPlaying = false, // trạng thái play/pause, chỉ áp dụng cho video
  playerRef = null, // ref tới player video, chỉ dùng cho video
}) {
  const { isLoggedIn } = useClientAuthContext();
  const [showPopup, setShowPopup] = useState(null); // 'idle' | null — có đang cần hiện popup nhắc user không
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialPosition, setInitialPosition] = useState(0);

  // Toàn bộ state "sống" của phiên học được lưu trong 1 ref (không phải useState)
  // để cập nhật liên tục trong interval mà KHÔNG làm re-render component.
  const sessionRef = useRef(createEmptySession(contentId, contentType));

  useEffect(() => {
    sessionRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // Tính ngưỡng "không hoạt động thì coi là rời đi" — tỉ lệ với thời lượng nội dung.
  // Dùng Math.min/Math.max trên chính 2 hằng số MIN/MAX trước, để dù lỡ khai báo
  // MIN > MAX (như set nhầm lúc test) thì công thức vẫn ra kết quả đúng nghĩa,
  // thay vì luôn collapse về đúng 1 giá trị cố định bất kể estimateTime.
  const getInactivityLimit = useCallback((estimateTime) => {
    const lowerBound = Math.min(MIN_INACTIVITY_LIMIT, MAX_INACTIVITY_LIMIT);
    const upperBound = Math.max(MIN_INACTIVITY_LIMIT, MAX_INACTIVITY_LIMIT);
    return Math.min(Math.max(estimateTime / 2, lowerBound), upperBound);
  }, []);

  // User được coi là "active" khi:
  // - Nếu đang xem VIDEO và video đang thực sự PHÁT (isPlaying=true) -> LUÔN active,
  //   vì xem video không cần rê chuột/gõ phím, không thể bắt idle theo mouse/keyboard được.
  // - Ngược lại (ARTICLE, hoặc video đang pause) -> xét theo thời gian idle kể từ lần
  //   tương tác cuối, so với ngưỡng inactivity limit. Không còn check isTabActive cứng nữa —
  //   chuyển tab chỉ đơn giản là không có tương tác mới, nên được hưởng cùng khoảng khoan (grace
  //   period) như khi ngồi yên không động chuột, thay vì bị chặn "không active" ngay lập tức.
  const isActive = useCallback(() => {
    const session = sessionRef.current;

    const isWatchingVideo =
      session.contentType !== "ARTICLE" && session.isPlaying;
    if (isWatchingVideo) return true;

    const idleFor = Date.now() - session.lastActivityTime;
    const limitMs = getInactivityLimit(session.estimateTime) * 1000;
    return idleFor < limitMs;
  }, [getInactivityLimit]);

  // Lấy vị trí phát hiện tại của video, hỗ trợ nhiều kiểu player khác nhau theo thứ tự ưu tiên:
  // 1. Player có sẵn hàm getCurrentTime() (ReactPlayer wrapper chuẩn)
  // 2. Player expose getInternalPlayer() -> lấy player gốc bên trong rồi thử getCurrentTime()/currentTime
  // 3. Bản thân player chính là thẻ <video> gốc (có thuộc tính currentTime)
  // 4. Không lấy được thì trả về vị trí đã biết trước đó (fallback an toàn)
  const getVideoPosition = useCallback(() => {
    const player = playerRef?.current;
    if (!player) return sessionRef.current.position;

    if (typeof player.getCurrentTime === "function") {
      return player.getCurrentTime();
    }

    if (typeof player.getInternalPlayer === "function") {
      const internal = player.getInternalPlayer();
      if (typeof internal?.getCurrentTime === "function") {
        return internal.getCurrentTime();
      }
      if (typeof internal?.currentTime === "number") {
        return internal.currentTime;
      }
    }

    if (typeof player.currentTime === "number") {
      return player.currentTime;
    }

    return sessionRef.current.position;
  }, [playerRef]);

  // Bài viết (ARTICLE) không có "vị trí phát" -> luôn 0. Video thì lấy từ player.
  const refreshPosition = useCallback(
    (session) => {
      session.position =
        session.contentType === "ARTICLE" ? 0 : getVideoPosition();
    },
    [getVideoPosition],
  );

  // Gửi tiến độ lên server (hoặc sendBeacon khi tab sắp đóng).
  const saveProgress = useCallback(
    (session, useBeacon = false) => {
      if (!isLoggedIn) return;

      refreshPosition(session);

      const nothingToSave =
        session.pendingDelta === 0 &&
        session.position === session.lastSavedPosition;
      if (nothingToSave) return;

      const deltaToSend = Math.min(session.pendingDelta, MAX_DELTA_PER_SAVE);
      const payload = {
        content_type: session.contentType,
        study_time_delta: deltaToSend,
        position: session.position,
      };

      session.pendingDelta = 0;

      if (useBeacon) {
        const baseUrl =
          import.meta.env.MODE === "development"
            ? "http://localhost:8081/todaii-english/client-side/api/v1"
            : "/todaii-english/client-side/api/v1";
        navigator.sendBeacon(
          `${baseUrl}/progress/${session.contentId}`,
          JSON.stringify(payload),
        );
        session.lastSavedPosition = session.position;
        return;
      }

      upsertProgress(session.contentId, payload)
        .then(() => {
          session.lastSavedPosition = session.position;
        })
        .catch((err) => {
          console.error(
            "Failed to save progress, will retry on next save:",
            err,
          );
          session.pendingDelta += deltaToSend; // trả lại delta để lần lưu sau thử lại
        });
    },
    [isLoggedIn, refreshPosition],
  );

  // Đổi content -> lưu tiến độ nội dung CŨ, rồi reset session sạch cho nội dung MỚI.
  useEffect(() => {
    const session = sessionRef.current;
    const isNewContent =
      session.contentId && session.contentId !== Number(contentId);
    if (isNewContent) saveProgress(session);

    Object.assign(session, createEmptySession(contentId, contentType));
  }, [contentId, contentType, saveProgress]);

  // Load tiến độ đã lưu trước đó từ server.
  useEffect(() => {
    if (!isLoggedIn || !contentId) {
      setIsInitialLoad(false);
      return;
    }

    setIsInitialLoad(true);
    getProgress(contentId, contentType)
      .then((data) => {
        const session = sessionRef.current;
        session.estimateTime = data.estimate_time || 0;
        session.studyTime = data.study_time || 0;
        session.position = data.position || 0;
        session.lastSavedPosition = data.position || 0;
        session.pendingDelta = 0;

        setInitialPosition(data.position || 0);
        setIsInitialLoad(false);
      })
      .catch((err) => {
        logError(err);
        setIsInitialLoad(false);
      });
  }, [contentId, contentType, isLoggedIn]);

  // Lắng nghe hoạt động của user và trạng thái hiển thị của tab.
  // isTabActive giờ chỉ mang tính tham khảo/debug, KHÔNG dùng để chặn cứng isActive() nữa.
  useEffect(() => {
    if (!isLoggedIn) return;

    const onActivity = () => {
      sessionRef.current.lastActivityTime = Date.now();
    };
    const onVisibilityChange = () => {
      sessionRef.current.isTabActive = document.visibilityState === "visible";
    };

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true }),
    );
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, onActivity),
      );
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isLoggedIn]);

  // Nhịp DUY NHẤT: mỗi PING_INTERVAL (~10s) làm luôn các việc:
  // 1. Cập nhật vị trí video mới nhất
  // 2. Tính elapsed THỰC TẾ kể từ lần tick trước (thay vì luôn cộng cứng đúng 10s), vì
  //    setInterval của trình duyệt không chính xác tuyệt đối — dễ bị trễ khi tab bị ẩn/throttle
  //    hoặc khi CPU bận decode video. Nhờ vậy studyTime vẫn phản ánh đúng thời gian thực đã trôi qua.
  // 3. Nếu user đang active (video đang phát LUÔN tính là active, xem isActive() ở trên)
  //    VÀ popup chưa hiện -> cộng dồn elapsed vào studyTime/pendingDelta.
  //    Nếu KHÔNG active -> hiện popup và ngừng đếm giờ từ tick tiếp theo cho tới khi user bấm "Tiếp tục".
  // 4. Gọi saveProgress để ping tiến độ lên server luôn trong cùng 1 lần, không cần interval riêng.
  useEffect(() => {
    if (!isLoggedIn || isInitialLoad) return;

    sessionRef.current.lastTickAt = Date.now();

    const pingIntervalId = setInterval(() => {
      const session = sessionRef.current;
      refreshPosition(session);

      const now = Date.now();
      const elapsedSec = (now - session.lastTickAt) / 1000;
      session.lastTickAt = now;

      const active = isActive();
      const isPlayingIfVideo =
        session.contentType === "ARTICLE" ? true : session.isPlaying;

      if (active && !session.isPopupShown && isPlayingIfVideo) {
        session.studyTime += elapsedSec;
        session.pendingDelta += elapsedSec;
      }

      // Không active (idle quá ngưỡng, video đang pause quá lâu) -> hiện popup và dừng đếm giờ
      if (!active && !session.isPopupShown) {
        session.isPopupShown = true;
        setShowPopup("idle");
      }

      saveProgress(session);
    }, PING_INTERVAL);

    return () => clearInterval(pingIntervalId);
  }, [isLoggedIn, isInitialLoad, isActive, refreshPosition, saveProgress]);

  // Lưu tiến độ khi tab đóng (sendBeacon) và khi component unmount / đổi route.
  useEffect(() => {
    if (!isLoggedIn) return;

    const onUnload = () => saveProgress(sessionRef.current, true);
    window.addEventListener("beforeunload", onUnload);

    return () => {
      window.removeEventListener("beforeunload", onUnload);
      saveProgress(sessionRef.current);
    };
  }, [isLoggedIn, saveProgress]);

  const triggerManualSave = useCallback(() => {
    saveProgress(sessionRef.current);
  }, [saveProgress]);

  // User bấm "Tiếp tục" trên popup: đóng popup, coi như vừa mới hoạt động lại -> đếm giờ tiếp tục bình thường.
  const handleContinue = useCallback(() => {
    setShowPopup(null);
    sessionRef.current.isPopupShown = false;
    sessionRef.current.lastActivityTime = Date.now();
  }, []);

  return {
    showPopup, // 'idle' | null — có popup nào cần hiện không
    handleContinue,
    isInitialLoad,
    initialPosition,
    triggerManualSave,
  };
}
