import React, { useState, useEffect } from "react";
import {
  getUserLearningProfile,
  updateUserLearningProfile,
} from "@/api/clients/userLearningProfileApi";
import { logError } from "@/utils/LogError";
import toast from "react-hot-toast";

const LearningGoalModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const [targetScore, setTargetScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Initialize values when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchCurrentProfile = async () => {
        try {
          const profile = await getUserLearningProfile();
          if (profile) {
            setTargetScore(profile.target_score || "");
            setExamDate(profile.exam_date || "");
          }
        } catch (err) {
          // No profile set yet
        }
      };
      fetchCurrentProfile();
    }
  }, [isOpen]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!targetScore || isNaN(targetScore) || targetScore < 10 || targetScore > 990) {
      toast.error("Điểm mục tiêu phải từ 10 đến 990");
      return;
    }
    if (!examDate) {
      toast.error("Vui lòng chọn ngày thi");
      return;
    }
    try {
      setSavingProfile(true);
      const updated = await updateUserLearningProfile({
        target_score: parseInt(targetScore, 10),
        exam_date: examDate,
      });
      toast.success("Thiết lập mục tiêu học tập thành công!");
      if (dontShowAgain) {
        localStorage.setItem("todaii_dismiss_learning_profile_prompt", "true");
      }
      if (onSaveSuccess) onSaveSuccess(updated);
      onClose();
    } catch (err) {
      logError(err);
      toast.error("Không thể lưu mục tiêu. Vui lòng thử lại.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem("todaii_dismiss_learning_profile_prompt", "true");
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg p-6 max-w-md w-full mx-4 animate-fade-in">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
          Thiết lập mục tiêu học tập
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
          Chào mừng bạn đến với chuyên trang luyện thi TOEIC! Hãy thiết lập mục tiêu điểm số và ngày thi để chúng tôi có thể cá nhân hóa lộ trình học phù hợp nhất cho bạn.
        </p>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Điểm TOEIC mục tiêu
            </label>
            <input
              type="number"
              min="10"
              max="990"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="Ví dụ: 550"
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Ngày thi dự kiến
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-neutral-300 dark:border-neutral-700 text-brand-500 focus:ring-brand-500 bg-transparent"
            />
            <label htmlFor="dontShowAgain" className="text-xs text-neutral-500 dark:text-neutral-400 select-none cursor-pointer">
              Không hiển thị lại thông báo này
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold py-2 px-4 rounded-md text-sm hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {savingProfile ? "Đang lưu..." : "Lưu mục tiêu"}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="w-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 py-2 px-4 rounded-md text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              Bỏ qua
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearningGoalModal;
