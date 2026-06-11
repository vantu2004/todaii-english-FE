import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTestById } from "@/api/clients/toeicTestApi";
import { getQuestionByPartNumber } from "@/api/clients/toeicQuestionApi";
import { getPassageByPartNumber } from "@/api/clients/toeicPassageApi";
import { getSessionDetails } from "@/api/clients/toeicSessionApi";
import { logError } from "@/utils/LogError";

// ─────────────────────────────────────────────────────────────────────────────
// BE DTOs (snake_case sau Jackson config):
//
// ToeicTestSessionDTO:
//   { id, mode, status, score_l, score_r, total_score,
//     correct_count, incorrect_count, skipped_count,
//     time_spent, parts_done, started_at, stopped_at, completed_at,
//     test_id, user_answers: ToeicUserAnswerDTO[] }
//
// ToeicUserAnswerDTO:
//   { id, question_id, user_choice, status, is_marked }
//   status: 1=đúng, 0=sai, 2=bỏ qua  — KHÔNG có correct_answer
//
// ToeicQuestionDTO:
//   { id, passage_id, part_number, image_url, audio_url,
//     question, option_a, option_b, option_c, option_d,
//     correct_ans, transcript, explanation, created_at, tags }
//
// ToeicPassageDTO:
//   { id, part_number, passage_text, passage_trans,
//     image_url, audio_url, created_at, questions: ToeicQuestionDTO[] }
// ─────────────────────────────────────────────────────────────────────────────

const loadPart = async (testId, partNumber) => {
  const [questions, passages] = await Promise.all([
    getQuestionByPartNumber(testId, partNumber).catch(() => []),
    getPassageByPartNumber(testId, partNumber).catch(() => []),
  ]);
  const standaloneQuestions = (questions || []).filter((q) => !q.passage_id);
  const items = [
    ...standaloneQuestions.map((q) => ({
      type: "question",
      data: q,
      createdAt: q.created_at,
    })),
    ...(passages || []).map((p) => ({
      type: "passage",
      data: p,
      createdAt: p.created_at,
    })),
  ];
  return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const useToeicResultData = (sessionId) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [test, setTest] = useState(null);
  const [selectedPartIds, setSelectedPartIds] = useState([]);
  const [partItems, setPartItems] = useState({});

  // answers map: { questionId: { user_choice, is_marked, status } }
  // status: 1=đúng, 0=sai, 2=bỏ qua
  const [userAnswersMap, setUserAnswersMap] = useState({});

  useEffect(() => {
    if (!sessionId) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const sessionData = await getSessionDetails(sessionId);

        if (sessionData.status !== "COMPLETED") {
          navigate(`/client/toeic/session/${sessionId}`, { replace: true });
          return;
        }
        setSession(sessionData);

        // Parts
        const partsDoneStr = sessionData.parts_done;
        let partIds = [1, 2, 3, 4, 5, 6, 7];
        if (partsDoneStr) {
          partIds = partsDoneStr
            .split(",")
            .map((s) => parseInt(s.trim()))
            .filter((id) => id >= 1 && id <= 7);
        }
        setSelectedPartIds(partIds);

        // Build userAnswersMap từ user_answers[]
        // ToeicUserAnswerDTO: { id, question_id, user_choice, status, is_marked }
        const map = {};
        (sessionData.user_answers || []).forEach((ans) => {
          map[ans.question_id] = {
            user_choice: ans.user_choice ?? null, // "A"|"B"|"C"|"D"|null
            is_marked: ans.is_marked ?? false,
            status: ans.status ?? 2, // 1=đúng, 0=sai, 2=bỏ qua
          };
        });
        setUserAnswersMap(map);

        // Fetch test + part items (questions có correct_ans trong ToeicQuestionDTO)
        const testInfo = await getTestById(sessionData.test_id);
        setTest(testInfo);

        const allPartItems = {};
        await Promise.all(
          partIds.map(async (partId) => {
            allPartItems[partId] = await loadPart(sessionData.test_id, partId);
          }),
        );
        setPartItems(allPartItems);
      } catch (err) {
        logError(err);
        navigate("/client/toeic");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId, navigate]);

  // ── Merge: kết hợp question data (có correct_ans) + user answer (có status) ──
  // answers shape cho Review components:
  // { [questionId]: { user_choice, correct_ans, is_marked, status } }
  const answers = useMemo(() => {
    const merged = {};
    // Duyệt qua tất cả questions trong partItems để lấy correct_ans
    Object.values(partItems).forEach((items) => {
      items.forEach((item) => {
        if (item.type === "question") {
          const q = item.data;
          const ua = userAnswersMap[q.id] || {};
          merged[q.id] = {
            user_choice: ua.user_choice ?? null,
            correct_ans: q.correct_ans ?? null, // từ ToeicQuestionDTO
            is_marked: ua.is_marked ?? false,
            status: ua.status ?? 2,
          };
        } else {
          // passage → duyệt questions bên trong
          (item.data.questions || []).forEach((q) => {
            const ua = userAnswersMap[q.id] || {};
            merged[q.id] = {
              user_choice: ua.user_choice ?? null,
              correct_ans: q.correct_ans ?? null,
              is_marked: ua.is_marked ?? false,
              status: ua.status ?? 2,
            };
          });
        }
      });
    });
    return merged;
  }, [partItems, userAnswersMap]);

  return { loading, session, test, selectedPartIds, partItems, answers };
};
