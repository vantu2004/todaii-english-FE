import Select from "react-select";

const ArticleFilter = ({
  query,
  updateQuery,
  sourceOptions,
  topicOptions,
  cefrLevels,
}) => {
  return (
    <div className="w-full md:w-1/4 bg-white p-5 rounded-2xl shadow-lg space-y-4 sticky top-24 h-fit">
      <h2 className="text-xl font-bold text-gray-800">Bộ lọc</h2>

      {/* Source */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Nguồn
        </label>
        <Select
          options={sourceOptions}
          value={sourceOptions.find((o) => o.value === query.sourceName)}
          onChange={(selected) =>
            updateQuery({ sourceName: selected?.value || "", page: 1 })
          }
          isClearable
        />
      </div>

      {/* Topic */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Chủ đề
        </label>
        <Select
          options={topicOptions}
          value={topicOptions.find((o) => o.value === query.topicId)}
          onChange={(selected) =>
            updateQuery({ topicId: selected?.value || "", page: 1 })
          }
          isClearable
        />
      </div>

      {/* CEFR */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          CEFR Level
        </label>

        <div className="space-y-1">
          {cefrLevels.map((level) => (
            <label
              key={level}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
            >
              <input
                type="radio"
                name="cefrLevel"
                checked={query.cefrLevel === level}
                onChange={() => updateQuery({ cefrLevel: level, page: 1 })}
              />
              <span>{level}</span>
            </label>
          ))}

          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
            <input
              type="radio"
              name="cefrLevel"
              checked={query.cefrLevel === ""}
              onChange={() => updateQuery({ cefrLevel: "", page: 1 })}
            />
            <span>Tất cả</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          className="flex-1 py-2 text-sm rounded-lg bg-red-500 text-white"
          onClick={() =>
            updateQuery({
              sourceName: "",
              topicId: "",
              cefrLevel: "",
              page: 1,
            })
          }
        >
          Reset
        </button>

        <button
          className="flex-1 py-2 text-sm rounded-lg bg-blue-600 text-white"
          onClick={() => updateQuery({ page: 1 })}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
};

export default ArticleFilter;
