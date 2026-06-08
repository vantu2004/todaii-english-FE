import React, { useState, useMemo } from "react";
import TagAnalysisTable from "./TagAnalysisTable";

const TagAnalysisSection = ({
  tags,
  tagQuestions,
  answersMap,
  flatQuestions,
  session,
  onQuestionClick,
}) => {
  const [activePartTab, setActivePartTab] = useState("overview");

  // Read parts done from session
  const partsDone = useMemo(() => {
    if (!session?.parts_done) return [];
    return session.parts_done
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map(Number)
      .sort((a, b) => a - b);
  }, [session]);

  // Filter tags based on the active tab
  const filteredTags = useMemo(() => {
    if (activePartTab === "overview") {
      // Tags belonging to any of the parts done
      return tags.filter((tag) => {
        const tagParts = tag.part_numbers
          ? tag.part_numbers.split(",").map(Number).filter(Boolean)
          : [];
        return tagParts.some((p) => partsDone.includes(p));
      });
    } else {
      // Tags belonging to the specific part
      const partNum = Number(activePartTab);
      return tags.filter((tag) => {
        const tagParts = tag.part_numbers
          ? tag.part_numbers.split(",").map(Number).filter(Boolean)
          : [];
        return tagParts.includes(partNum);
      });
    }
  }, [tags, activePartTab, partsDone]);

  if (partsDone.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2.5">
        <h2 className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
          Phân tích chi tiết theo tag
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg max-w-2xl overflow-x-auto border border-neutral-200 dark:border-neutral-700">
        <button
          type="button"
          onClick={() => setActivePartTab("overview")}
          className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap cursor-pointer ${
            activePartTab === "overview"
              ? "bg-brand-500 text-white shadow-none"
              : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          Tổng quát
        </button>

        {partsDone.map((part) => (
          <button
            key={part}
            type="button"
            onClick={() => setActivePartTab(String(part))}
            className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all whitespace-nowrap cursor-pointer ${
              activePartTab === String(part)
                ? "bg-brand-500 text-white shadow-none"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            Part {part}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-1">
        <TagAnalysisTable
          tags={filteredTags}
          tagQuestions={tagQuestions}
          answersMap={answersMap}
          flatQuestions={flatQuestions}
          onQuestionClick={onQuestionClick}
        />
      </div>
    </div>
  );
};

export default TagAnalysisSection;
