import { Volume2 } from "lucide-react";
import Modal from "@/components/servers/Modal";
import { loadVoices, handleSpeak } from "@/utils/ReactSpeechKit";
import { useEffect } from "react";

const DictionaryViewModal = ({ isOpen, onClose, dictionary }) => {
  useEffect(() => {
    loadVoices();

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  if (!dictionary) return null;

  let parsedData = null;
  let result = null;

  // Lấy data an toàn bất chấp chuẩn naming
  const jsonString = dictionary.json_data || dictionary.jsonData;

  if (jsonString) {
    try {
      parsedData = JSON.parse(jsonString);
      result = parsedData?.result?.[0];
    } catch (e) {
      console.error("Failed to parse JSON data", e);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <h2 className="text-lg font-semibold text-gray-900">Word Details</h2>
      }
      width="max-w-3xl"
    >
      <div className="space-y-6">
        {/* HEADER: Nếu ko có Json, vẫn hiện word */}
        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 capitalize">
                {dictionary.word}
              </h3>
              {result?.pronounce?.base && (
                <p className="text-lg text-gray-600 mt-1 font-mono tracking-wide">
                  /{result.pronounce.base}/
                </p>
              )}
            </div>
            {/* Play âm thanh nếu có url us hoặc gb */}
            <div className="flex gap-2">
              {result?.pronounce?.us && (
                <button
                  onClick={() => handleSpeak(dictionary.word, null)}
                  className="p-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />{" "}
                  <span className="text-xs font-medium">US</span>
                </button>
              )}
              {result?.pronounce?.gb && (
                <button
                  onClick={() => handleSpeak(dictionary.word, null)}
                  className="p-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />{" "}
                  <span className="text-xs font-medium">UK</span>
                </button>
              )}
              {result?.pronounce?.base && (
                <button
                  onClick={() => handleSpeak(dictionary.word, null)}
                  className="p-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-100 flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />{" "}
                  <span className="text-xs font-medium">Base</span>
                </button>
              )}
            </div>
          </div>

          {/* Level Info (Sử dụng snake_case key) */}
          {result?.level_word && (
            <div className="mt-4 flex gap-3 text-sm">
              {result.level_word.toeic && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium border border-gray-200 flex items-center gap-1">
                  TOEIC:{" "}
                  {result.level_word.toeic}
                </span>
              )}
              {result.level_word.vietnam && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md font-medium border border-gray-200">
                  VN Level: {result.level_word.vietnam}
                </span>
              )}
            </div>
          )}
        </div>

        {/* NẾU KHÔNG CÓ JSON DATA */}
        {!result && (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Chưa có dữ liệu JSON chi tiết cho từ vựng này.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Dữ liệu sẽ được tự động fetch khi có truy vấn từ người dùng.
            </p>
          </div>
        )}

        {/* NẾU CÓ DATA -> RENDER CÁC NGHĨA (CONTENT) */}
        {result?.content?.map((contentBlock, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500">
                {contentBlock.kind || "Nghĩa"}
              </span>
            </div>

            <div className="p-4 space-y-5">
              {contentBlock.means?.map((mean, idx) => (
                <div
                  key={idx}
                  className="relative pl-4 border-l-2 border-gray-300"
                >
                  <p className="font-medium text-gray-900 text-base mb-2">
                    {mean.mean}
                  </p>

                  {/* Examples */}
                  {mean.examples?.length > 0 && (
                    <div className="space-y-3 mt-3">
                      {mean.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                        >
                          <p className="text-gray-800 italic font-medium">
                            "{ex.e}"
                          </p>
                          <p className="text-gray-500 text-sm mt-1">{ex.m}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* WORD FAMILY (Họ từ vựng - Snake case: word_family) */}
        {result?.word_family?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
              Word Family
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.word_family.map((wf, wfIdx) => (
                <div
                  key={wfIdx}
                  className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm"
                >
                  <span className="text-gray-500 italic mr-2">{wf.field}:</span>
                  <span className="font-semibold text-gray-800">
                    {wf.content?.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DictionaryViewModal;
