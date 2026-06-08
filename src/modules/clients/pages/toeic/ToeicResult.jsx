import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { getTestById } from "@/api/clients/toeicTestApi";
import { getSessionDetails } from "@/api/clients/toeicSessionApi";
import {
  findAllTagsByTestId,
  findQuestionsByTag,
} from "@/api/clients/toeicTagApi";
import { getQuestionByPartNumber } from "@/api/clients/toeicQuestionApi";
import { getPassageByPartNumber } from "@/api/clients/toeicPassageApi";

// Subcomponents
import ResultHeader from "@/components/clients/toeic_page/result_summary/ResultHeader";
import ScoreSummaryCards from "@/components/clients/toeic_page/result_summary/ScoreSummaryCards";
import TagAnalysisSection from "@/components/clients/toeic_page/result_summary/TagAnalysisSection";
import QuickAnswerList from "@/components/clients/toeic_page/result_summary/QuickAnswerList";
import QuestionDetailsModal from "@/components/clients/toeic_page/result_summary/QuestionDetailsModal";

const ToeicResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState(1);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSessionResult = async () => {
      if (!sessionId) {
        navigate("/client/toeic");
        return;
      }

      try {
        setLoading(true);
        const sessionData = await getSessionDetails(sessionId);

        // Read testId
        const currentTestId = sessionData.test_id;

        // Fetch test info and tags in parallel
        const [testInfo, testTags] = await Promise.all([
          getTestById(currentTestId),
          findAllTagsByTestId(currentTestId).catch(() => []),
        ]);

        // Fetch question-to-tag mapping for each tag in parallel
        const tagQuestionsData = {};
        if (testTags && testTags.length > 0) {
          await Promise.all(
            testTags.map(async (tag) => {
              try {
                const questions = await findQuestionsByTag(
                  currentTestId,
                  tag.id,
                );
                tagQuestionsData[tag.id] = (questions || []).map((q) => q.id);
              } catch (err) {
                console.error(
                  `Failed to load questions for tag ${tag.id}:`,
                  err,
                );
                tagQuestionsData[tag.id] = [];
              }
            }),
          );
        }

        // Parse parts_done from session
        const partsDoneStr = sessionData.parts_done || "";
        const partsDone = partsDoneStr
          ? partsDoneStr
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
              .map(Number)
          : [];

        // Fetch questions and passages for each completed part in parallel to build QuickAnswerList and Passage details
        const partQuestionsData = {};
        const partPassagesData = {};
        await Promise.all(
          partsDone.map(async (partId) => {
            try {
              const [questions, passages] = await Promise.all([
                getQuestionByPartNumber(currentTestId, partId).catch(() => []),
                getPassageByPartNumber(currentTestId, partId).catch(() => []),
              ]);
              partQuestionsData[partId] = questions || [];
              partPassagesData[partId] = passages || [];
            } catch (err) {
              console.error(
                `Failed to load questions/passages for part ${partId}:`,
                err,
              );
              partQuestionsData[partId] = [];
              partPassagesData[partId] = [];
            }
          }),
        );

        // Flatten all questions across completed parts, maintaining global numbering
        const flatList = [];
        const rawQuestionsList = [];
        let qIndex = 0;
        partsDone
          .sort((a, b) => a - b)
          .forEach((partId) => {
            const questionsOfPart = partQuestionsData[partId] || [];
            // Sort questions inside the part by id for stable sequential rendering
            const sorted = [...questionsOfPart].sort((a, b) => a.id - b.id);
            sorted.forEach((q) => {
              qIndex++;
              flatList.push({
                id: q.id,
                partNumber: partId,
                questionNumber: qIndex,
                correctAnswer: q.correct_ans || q.correctAns,
              });
              rawQuestionsList.push(q);
            });
          });

        // Collect all passages in a single list
        const rawPassagesList = [];
        partsDone.forEach((partId) => {
          const passagesOfPart = partPassagesData[partId] || [];
          rawPassagesList.push(...passagesOfPart);
        });

        // Build a mapping of answers by question_id for quick lookups
        const answersMapping = {};
        if (sessionData.user_answers) {
          sessionData.user_answers.forEach((ans) => {
            const qId = ans.question_id || ans.id;
            answersMapping[qId] = {
              status: ans.status ?? 2, // 1: correct, 0: incorrect, 2: skipped
              user_choice: ans.user_choice || null,
            };
          });
        }

        // Scores and basic metrics
        const scoreL = sessionData.score_l ?? 0;
        const scoreR = sessionData.score_r ?? 0;
        const totalScore = sessionData.total_score ?? 0;
        const correctCount = sessionData.correct_count ?? 0;
        const incorrectCount = sessionData.incorrect_count ?? 0;
        const skippedCount = sessionData.skipped_count ?? 0;
        const timeSpentMinutes = sessionData.time_spent ?? 0;

        // Compute elapsed time from started_at → completed_at (or stopped_at) for display
        const startedAt = sessionData.started_at;
        const completedAt = sessionData.completed_at || sessionData.stopped_at;
        let elapsedSeconds = timeSpentMinutes * 60; // fallback
        if (startedAt && completedAt) {
          elapsedSeconds = Math.max(
            0,
            Math.floor(
              (new Date(completedAt).getTime() -
                new Date(startedAt).getTime()) /
                1000,
            ),
          );
        }

        const totalAnswered = correctCount + incorrectCount;
        const totalQuestions = totalAnswered + skippedCount;
        const mode = sessionData.mode;
        const isFullTest = mode === "FULL_TEST";

        setResultData({
          testId: currentTestId,
          scoreL,
          scoreR,
          totalScore,
          correctCount,
          incorrectCount,
          skippedCount,
          totalQuestions,
          elapsedSeconds,
          isFullTest,
          session: sessionData,
          test: testInfo,
          tags: testTags || [],
          tagQuestions: tagQuestionsData,
          flatQuestions: flatList,
          rawQuestions: rawQuestionsList,
          rawPassages: rawPassagesList,
          answersMap: answersMapping,
        });
      } catch (err) {
        console.error("Failed to load session result:", err);
        navigate("/client/toeic");
      } finally {
        setLoading(false);
      }
    };

    fetchSessionResult();
  }, [sessionId, navigate]);

  const handleQuestionClick = (questionId) => {
    if (!resultData) return;
    const questionObj = resultData.rawQuestions.find(
      (q) => q.id === questionId,
    );
    if (!questionObj) return;

    // Find relative question number
    const flatQ = resultData.flatQuestions.find((q) => q.id === questionId);
    const qNum = flatQ ? flatQ.questionNumber : 1;

    let passageObj = null;
    if (questionObj.passage_id) {
      passageObj = resultData.rawPassages.find(
        (p) => p.id === questionObj.passage_id,
      );
    }

    setSelectedQuestion(questionObj);
    setSelectedQuestionNumber(qNum);
    setSelectedPassage(passageObj);
    setIsModalOpen(true);
  };

  if (loading || !resultData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] mt-[68px] bg-surface-primary dark:bg-neutral-950">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-surface-primary dark:bg-neutral-950 pt-[68px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-3">
        {/* Header */}
        <ResultHeader
          test={resultData.test}
          session={resultData.session}
          incorrectCount={resultData.incorrectCount}
        />

        {/* Thống kê tổng & Scores */}
        <ScoreSummaryCards
          correctCount={resultData.correctCount}
          incorrectCount={resultData.incorrectCount}
          skippedCount={resultData.skippedCount}
          totalQuestions={resultData.totalQuestions}
          elapsedSeconds={resultData.elapsedSeconds}
          isFullTest={resultData.isFullTest}
          scoreL={resultData.scoreL}
          scoreR={resultData.scoreR}
          totalScore={resultData.totalScore}
        />

        {/* Warning / Notes */}
        <div className="p-2.5 border border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 rounded-lg flex items-start gap-2">
          <AlertCircle className="text-brand-500 shrink-0 mt-0.5" size={14} />
          <p className="text-[10px] text-neutral-800 dark:text-neutral-350 leading-normal font-medium">
            Đây là kết quả mang tính chất tham khảo. Kết quả thi thật có thể dao
            động tùy thuộc vào thang điểm chuẩn của ETS tại từng thời điểm.
          </p>
        </div>

        {/* Phân tích theo tag */}
        <TagAnalysisSection
          tags={resultData.tags}
          tagQuestions={resultData.tagQuestions}
          answersMap={resultData.answersMap}
          flatQuestions={resultData.flatQuestions}
          session={resultData.session}
          onQuestionClick={handleQuestionClick}
        />

        {/* Đáp án nhanh */}
        <QuickAnswerList
          flatQuestions={resultData.flatQuestions}
          answersMap={resultData.answersMap}
          onQuestionClick={handleQuestionClick}
        />
      </div>

      {/* Details Popup Modal */}
      <QuestionDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        question={selectedQuestion}
        passage={selectedPassage}
        questionNumber={selectedQuestionNumber}
        userAnswer={
          selectedQuestion ? resultData.answersMap[selectedQuestion.id] : null
        }
      />
    </div>
  );
};

export default ToeicResult;
