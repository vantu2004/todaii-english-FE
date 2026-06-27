import React, { useEffect, useState } from "react";
import { Award, Calendar } from "lucide-react";
import {
  getUserLearningProfile,
  updateUserLearningProfile,
} from "@/api/clients/userLearningProfileApi";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import { logError } from "@/utils/LogError";
import toast from "react-hot-toast";

const UserLearningProfileWidget = ({ onProfileUpdated }) => {
  const { isLoggedIn } = useClientAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [targetScore, setTargetScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      const data = await getUserLearningProfile();
      setProfile(data);
      if (data) {
        setTargetScore(data.target_score || "");
        setExamDate(data.exam_date || "");
      }
    } catch (err) {
      console.log("No learning profile found yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isLoggedIn]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !targetScore ||
      isNaN(targetScore) ||
      targetScore < 10 ||
      targetScore > 990
    ) {
      toast.error("Điểm mục tiêu phải từ 10 đến 990");
      return;
    }
    if (!examDate) {
      toast.error("Vui lòng chọn ngày thi");
      return;
    }
    try {
      setSaving(true);
      const updated = await updateUserLearningProfile({
        target_score: parseInt(targetScore, 10),
        exam_date: examDate,
      });
      setProfile(updated);
      toast.success("Cập nhật mục tiêu học tập thành công!");
      setIsEditing(false);
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
    } catch (err) {
      logError(err);
      toast.error("Không thể lưu mục tiêu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoggedIn) return null;

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm animate-pulse space-y-3">
        <div className="h-4 bg-neutral-100 dark:bg-neutral-800 rounded w-1/3"></div>
        <div className="h-10 bg-neutral-105 dark:bg-neutral-800/60 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm animate-fade-in">
      <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
        <Award size={14} />
        Mục tiêu học tập
      </h3>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-3">
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">
              Điểm mục tiêu
            </label>
            <input
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              placeholder="Ví dụ: 550"
              min="10"
              max="990"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-neutral-400 uppercase mb-1">
              Ngày thi mục tiêu
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent px-3 py-1.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-xs font-semibold hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all flex items-center justify-center"
            >
              {saving ? "Lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          {profile && profile.target_score ? (
            <>
              <div className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-md p-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Mục tiêu:
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-white text-sm">
                    {profile.target_score}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Ngày thi:
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {new Date(profile.exam_date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {(() => {
                  const diffTime = new Date(profile.exam_date) - new Date();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) {
                    return (
                      <div className="text-[10px] text-brand-500 font-semibold mt-2.5 flex items-center gap-1">
                        <Calendar size={10} />
                        Còn {diffDays} ngày đến kỳ thi
                      </div>
                    );
                  } else if (diffDays === 0) {
                    return (
                      <div className="text-[10px] text-brand-500 font-semibold mt-2.5 flex items-center gap-1">
                        <Calendar size={10} />
                        Kỳ thi diễn ra hôm nay!
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
              <button
                onClick={() => {
                  setTargetScore(profile.target_score);
                  setExamDate(profile.exam_date);
                  setIsEditing(true);
                }}
                className="w-full border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 py-1.5 rounded-md text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-medium"
              >
                Cập nhật mục tiêu
              </button>
            </>
          ) : (
            <div className="text-center py-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-md p-3">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                Chưa thiết lập mục tiêu học tập.
              </p>
              <button
                onClick={() => {
                  setTargetScore("");
                  setExamDate("");
                  setIsEditing(true);
                }}
                className="mt-3 w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-1.5 rounded-md text-xs font-semibold hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all"
              >
                Thiết lập ngay
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserLearningProfileWidget;
