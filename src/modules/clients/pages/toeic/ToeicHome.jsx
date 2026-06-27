import React, { useEffect, useState } from "react";
import { getAllCollections } from "@/api/clients/toeicCollectionApi";
import {
  getAllTestsPaged,
  getAllTestsByCollectionPaged,
} from "@/api/clients/toeicTestApi";
import CollectionSidebar from "@/components/clients/toeic_page/home/CollectionSidebar";
import TestGrid from "@/components/clients/toeic_page/home/TestGrid";
import Pagination from "@/components/clients/Pagination";
import { logError } from "@/utils/LogError";
import RecommendationWidget from "@/components/clients/RecommendationWidget";
import { useClientAuthContext } from "@/hooks/clients/useClientAuthContext";
import {
  getUserLearningProfile,
  updateUserLearningProfile,
} from "@/api/clients/userLearningProfileApi";
import toast from "react-hot-toast";

const ToeicHome = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [tests, setTests] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingTests, setLoadingTests] = useState(false);

  // Search, sort, and pagination states
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("desc");
  const size = 9; // 3 columns grid: 9 items is perfect

  // Learning Profile popup states
  const { isLoggedIn } = useClientAuthContext();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [targetScore, setTargetScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      checkLearningProfile();
    }
  }, [isLoggedIn]);

  const checkLearningProfile = async () => {
    try {
      const profile = await getUserLearningProfile();
      if (!profile || !profile.target_score || !profile.exam_date) {
        setShowProfileModal(true);
      }
    } catch (err) {
      // Show profile modal if API returns 404 or fails
      setShowProfileModal(true);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (
      !targetScore ||
      isNaN(targetScore) ||
      targetScore < 0 ||
      targetScore > 990
    ) {
      toast.error("Điểm mục tiêu phải từ 0 đến 990");
      return;
    }
    if (!examDate) {
      toast.error("Vui lòng chọn ngày thi");
      return;
    }
    try {
      setSavingProfile(true);
      await updateUserLearningProfile({
        target_score: parseInt(targetScore, 10),
        exam_date: examDate,
      });
      toast.success("Thiết lập mục tiêu học tập thành công!");
      setShowProfileModal(false);
    } catch (err) {
      logError(err);
      toast.error("Không thể lưu mục tiêu. Vui lòng thử lại.");
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  useEffect(() => {
    loadTests();
  }, [selectedCollection, keyword, page, sortBy, direction]);

  const loadCollections = async () => {
    try {
      setLoadingCollections(true);

      const res = await getAllCollections();

      const enabledCollections = (res || []).filter((c) => c.enabled !== false);
      setCollections(enabledCollections);
    } catch (err) {
      logError(err);
    } finally {
      setLoadingCollections(false);
    }
  };

  const loadTests = async () => {
    try {
      setLoadingTests(true);

      let res;
      if (selectedCollection) {
        res = await getAllTestsByCollectionPaged(
          selectedCollection.id,
          page,
          size,
          sortBy,
          direction,
          keyword,
        );
      } else {
        res = await getAllTestsPaged(page, size, sortBy, direction, keyword);
      }

      setTests(res.content || []);

      setTotalPages(res.total_pages || 0);
      setTotalElements(res.total_elements || 0);
    } catch (err) {
      logError(err);

      setTests([]);

      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleSelectCollection = (collection) => {
    setSelectedCollection(collection);
    setPage(1);
  };

  const handleSelectAll = () => {
    setSelectedCollection(null);
    setPage(1);
  };

  const handleSortChange = (newSort, newDir) => {
    setSortBy(newSort);
    setDirection(newDir);
    setPage(1);
  };

  const handleSearchChange = (text) => {
    setKeyword(text);
    setPage(1);
  };

  return (
    <div className="w-full min-h-screen bg-surface-primary dark:bg-neutral-950 pt-[68px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-2">
            Luyện Thi TOEIC
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base">
            Cải thiện điểm số của bạn với hàng trăm đề thi TOEIC được cập nhật
            mới nhất.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar / Collections */}
          <CollectionSidebar
            collections={collections}
            selectedCollection={selectedCollection}
            onSelectCollection={handleSelectCollection}
            onSelectAll={handleSelectAll}
            loading={loadingCollections}
          />

          {/* Tests Grid */}
          <div className="flex-1 flex flex-col gap-6">
            <RecommendationWidget type="tests" />
            <TestGrid
              tests={tests}
              selectedCollection={selectedCollection}
              totalElements={totalElements}
              keyword={keyword}
              onChangeSearch={handleSearchChange}
              sortBy={sortBy}
              direction={direction}
              onChangeSort={handleSortChange}
              loading={loadingTests}
            />

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Goal Setup Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg p-6 max-w-md w-full mx-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              Thiết lập mục tiêu học tập
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
              Chào mừng bạn đến với chuyên trang luyện thi TOEIC! Hãy thiết lập
              mục tiêu điểm số và ngày thi để chúng tôi có thể cá nhân hóa lộ
              trình học phù hợp nhất cho bạn.
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
                  onClick={() => setShowProfileModal(false)}
                  className="w-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 py-2 px-4 rounded-md text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
                >
                  Bỏ qua
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToeicHome;
