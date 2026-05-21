import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToeicTestById } from "@/api/clients/toeicApi";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Play,
  Headphones,
  BookText,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const ToeicTestOverview = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

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
              {test.name}
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

            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 p-4 rounded-2xl flex items-start gap-4">
                <div className="mt-1 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                  <Headphones
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                    Phần Nghe (Listening)
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Bao gồm Part 1 đến Part 4. Thời gian làm bài 45 phút. 100
                    câu hỏi đánh giá kỹ năng nghe hiểu tiếng Anh thông qua các
                    đoạn hội thoại và bài nói ngắn.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-4 rounded-2xl flex items-start gap-4">
                <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                  <BookText
                    className="text-emerald-600 dark:text-emerald-400"
                    size={20}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white mb-1">
                    Phần Đọc (Reading)
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Bao gồm Part 5 đến Part 7. Thời gian làm bài 75 phút. 100
                    câu hỏi đánh giá vốn từ vựng, ngữ pháp và khả năng đọc hiểu
                    văn bản tiếng Anh.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 border border-brand-100 dark:border-brand-900/30 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl flex items-start gap-3">
              <AlertCircle
                className="text-brand-500 shrink-0 mt-0.5"
                size={18}
              />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-brand-600 dark:text-brand-400">
                  Lưu ý:
                </strong>{" "}
                Bài thi sẽ được chấm điểm ngay sau khi bạn nộp bài. Đảm bảo kết
                nối mạng ổn định trong suốt quá trình làm bài. Bạn có thể tự do
                chuyển đổi giữa các phần.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto mt-6 md:mt-0 flex flex-col gap-4 sticky top-24">
            <Link
              to={`/client/toeic/${testId}/take`}
              className="flex items-center justify-center gap-2 w-full md:w-64 py-4 px-6 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-[0_8px_24px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Play size={20} className="fill-white" />
              <span>Bắt đầu thi ngay</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToeicTestOverview;
