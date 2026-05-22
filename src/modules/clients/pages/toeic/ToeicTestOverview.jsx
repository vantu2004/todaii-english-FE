import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToeicTestById } from "@/api/clients/toeicApi";
import { ArrowLeft, BookOpen, Clock, Play, Headphones, BookText, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const PARTS_METADATA = [
  { id: 1, name: "Part 1", fullName: "Photographs", questions: 6, time: 3, type: "listening", tags: ["Listening", "Photographs"] },
  { id: 2, name: "Part 2", fullName: "Question-Response", questions: 25, time: 11, type: "listening", tags: ["Listening", "Question-Response"] },
  { id: 3, name: "Part 3", fullName: "Conversations", questions: 39, time: 18, type: "listening", tags: ["Listening", "Conversations", "Audio"] },
  { id: 4, name: "Part 4", fullName: "Talks", questions: 30, time: 14, type: "listening", tags: ["Listening", "Talks", "Audio"] },
  { id: 5, name: "Part 5", fullName: "Incomplete Sentences", questions: 30, time: 23, type: "reading", tags: ["Reading", "Incomplete Sentences", "Grammar"] },
  { id: 6, name: "Part 6", fullName: "Text Completion", questions: 16, time: 12, type: "reading", tags: ["Reading", "Text Completion", "Passage"] },
  { id: 7, name: "Part 7", fullName: "Reading Comprehension", questions: 54, time: 41, type: "reading", tags: ["Reading", "Comprehension", "Multi-passage"] },
];

const ToeicTestOverview = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [practiceMode, setPracticeMode] = useState("full"); // "full" or "parts"
  const [selectedParts, setSelectedParts] = useState([1, 2, 3, 4, 5, 6, 7]);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        setLoading(true);
        const data = await getToeicTestById(testId);
        setTest(data);
      } catch (err) {
        console.error("Failed to fetch test details", err);
        toast.error("Không thể tải thông tin đề thi.");
        navigate("/client/toeic");
      } finally {
        setLoading(false);
      }
    };
    fetchTestDetails();
  }, [testId, navigate]);

  const handleTogglePart = (partId) => {
    setSelectedParts(prev => {
      if (prev.includes(partId)) {
        return prev.filter(id => id !== partId);
      } else {
        return [...prev, partId].sort((a, b) => a - b);
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedParts([1, 2, 3, 4, 5, 6, 7]);
  };

  const handleDeselectAll = () => {
    setSelectedParts([]);
  };

  const totalQuestions = selectedParts.reduce((acc, partId) => {
    const part = PARTS_METADATA.find(p => p.id === partId);
    return acc + (part ? part.questions : 0);
  }, 0);

  const totalEstimatedTime = selectedParts.reduce((acc, partId) => {
    const part = PARTS_METADATA.find(p => p.id === partId);
    return acc + (part ? part.time : 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-[68px]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!test) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-[68px]">
      <Link
        to="/client/toeic"
        className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors mb-8 font-medium"
      >
        <ArrowLeft size={18} />
        <span>Quay lại danh sách</span>
      </Link>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4">
              {test.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-300 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <Clock className="text-brand-500" size={18} />
                <span className="font-semibold">120 phút</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
                <BookOpen className="text-brand-500" size={18} />
                <span className="font-semibold">7 phần thi</span>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl flex items-start gap-4">
                <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                  <Headphones className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Phần Nghe (Listening)</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Bao gồm Part 1 đến Part 4. Thời gian làm bài 45 phút. 100 câu hỏi đánh giá kỹ năng nghe hiểu tiếng Anh thông qua các đoạn hội thoại và bài nói ngắn.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-2xl flex items-start gap-4">
                <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                  <BookText className="text-emerald-600 dark:text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">Phần Đọc (Reading)</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Bao gồm Part 5 đến Part 7. Thời gian làm bài 75 phút. 100 câu hỏi đánh giá vốn từ vựng, ngữ pháp và khả năng đọc hiểu văn bản tiếng Anh.
                  </p>
                </div>
              </div>
            </div>

            {/* Choosing parts section */}
            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-8 mb-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Luyện tập theo phần</h2>
              
              <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl max-w-sm mb-6">
                <button
                  type="button"
                  onClick={() => { setPracticeMode("full"); setSelectedParts([1, 2, 3, 4, 5, 6, 7]); }}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                    practiceMode === "full"
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  Toàn bộ đề thi
                </button>
                <button
                  type="button"
                  onClick={() => setPracticeMode("parts")}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all ${
                    practiceMode === "parts"
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  Tự chọn phần thi
                </button>
              </div>

              {practiceMode === "parts" && (
                <div className="flex gap-4 mb-4 text-sm font-medium">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    Chọn tất cả
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PARTS_METADATA.map((part) => (
                  <label 
                    key={part.id}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedParts.includes(part.id)
                        ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-500/5'
                        : 'border-neutral-150 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                    } ${practiceMode === "full" ? "opacity-75 cursor-default" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedParts.includes(part.id)}
                      disabled={practiceMode === "full"}
                      onChange={() => handleTogglePart(part.id)}
                      className="mt-1 w-4 h-4 text-brand-500 border-neutral-300 rounded focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{part.name}</span>
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 shrink-0">
                          {part.questions} câu
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2 font-medium">{part.fullName}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {part.tags.map((tag, idx) => {
                          let tagClass = "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400";
                          if (tag === "Listening") {
                            tagClass = "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
                          } else if (tag === "Reading") {
                            tagClass = "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
                          }
                          return (
                            <span key={idx} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${tagClass}`}>
                              #{tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 border border-brand-100 dark:border-brand-900/30 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl flex items-start gap-3">
              <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-brand-600 dark:text-brand-400">Lưu ý:</strong> Bài thi sẽ được chấm điểm ngay sau khi bạn nộp bài. Đảm bảo kết nối mạng ổn định trong suốt quá trình làm bài. Bạn có thể tự do chuyển đổi giữa các phần.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-auto mt-6 md:mt-0 flex flex-col gap-4 sticky top-24">
            <div className="w-full md:w-64 bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-neutral-900 dark:text-white mb-4 pb-2 border-b border-neutral-100 dark:border-neutral-800">Thông tin bài làm</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Chế độ:</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {practiceMode === "full" ? "Thi toàn bộ" : "Tự chọn phần"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Tổng số câu:</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {practiceMode === "full" ? 200 : totalQuestions} câu
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">Thời gian làm:</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {practiceMode === "full" ? 120 : totalEstimatedTime} phút
                  </span>
                </div>
              </div>

              {practiceMode === "parts" && selectedParts.length === 0 ? (
                <button
                  type="button"
                  onClick={() => toast.error("Vui lòng chọn ít nhất một phần thi!")}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 rounded-2xl font-bold cursor-not-allowed shadow-sm"
                >
                  <Play size={18} className="fill-neutral-400 text-neutral-400" />
                  <span>Bắt đầu thi</span>
                </button>
              ) : (
                <Link
                  to={`/client/toeic/${testId}/take?parts=${practiceMode === "full" ? "1,2,3,4,5,6,7" : selectedParts.join(",")}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold shadow-[0_8px_24px_rgba(37,99,235,0.15)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.25)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Play size={18} className="fill-white" />
                  <span>Bắt đầu thi</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicTestOverview;
