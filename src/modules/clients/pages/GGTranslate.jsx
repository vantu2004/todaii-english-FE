import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { translateText } from "@/api/clients/ggTranslate";
import { LANGUAGES } from "@/constant/LanguageCode";
import { ArrowRightLeft, ChevronDown, Copy, X } from "lucide-react";

// Component con để tái sử dụng cho Select ngôn ngữ
const LanguageSelect = ({ value, onChange, options }) => (
  <div className="group relative inline-flex items-center">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        appearance-none bg-transparent 
        font-semibold text-gray-600 
        hover:text-[#1a73e8] hover:bg-blue-50/50
        focus:text-[#1a73e8] focus:bg-blue-50
        outline-none cursor-pointer 
        pl-3 pr-8 py-2 
        rounded-md transition-all duration-200
        text-sm md:text-[15px] tracking-wide
      `}
    >
      {options.map((lang) => (
        <option
          key={lang.code}
          value={lang.code}
          className="text-gray-800 bg-white"
        >
          {lang.name}
        </option>
      ))}
    </select>

    {/* Icon được bọc trong container để căn chỉnh pixel hoàn hảo */}
    <div className="absolute right-2 flex items-center pointer-events-none transition-transform duration-200 group-hover:translate-y-[1px]">
      <ChevronDown
        size={16}
        className="text-gray-400 group-hover:text-[#1a73e8] group-focus:text-[#1a73e8]"
        strokeWidth={2.5}
      />
    </div>
  </div>
);

const GGTranslate = () => {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("vi");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const result = await translateText({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        texts: [text],
      });
      setTranslatedText(Array.isArray(result) ? result[0] : result || "");
    } finally {
      setLoading(false);
    }
  };

  const swap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translatedText) {
      setText(translatedText);
      setTranslatedText("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F9] pt-24 pb-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden relative">
          {/* Nút Hoán đổi (Desktop) */}
          <button
            onClick={swap}
            className="hidden md:flex absolute left-1/2 top-4 -translate-x-1/2 z-10 p-2 bg-white rounded-full hover:bg-gray-100 active:scale-90 transition shadow-xl"
          >
            <ArrowRightLeft size={18} className="text-gray-500" />
          </button>

          {/* Cột Nguồn */}
          <div className="flex-1 flex flex-col border-r border-gray-100">
            <div className="flex items-center px-5 py-3 border-b border-gray-50 justify-between">
              <LanguageSelect
                value={sourceLang}
                onChange={setSourceLang}
                options={LANGUAGES}
              />
              <button onClick={swap} className="md:hidden p-2">
                <ArrowRightLeft size={16} />
              </button>
            </div>

            <div className="relative p-5">
              <TextareaAutosize
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 1024))}
                placeholder="Nhập văn bản"
                minRows={7}
                className="w-full resize-none text-xl md:text-2xl outline-none placeholder-gray-300 bg-transparent overflow-hidden"
              />
              {text && (
                <X
                  size={20}
                  className="absolute top-6 right-5 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setText("");
                    setTranslatedText("");
                  }}
                />
              )}
            </div>

            <div className="flex items-center justify-between p-4 mt-auto">
              <span className="text-xs text-gray-400">{text.length}/1024</span>
              <button
                onClick={handleTranslate}
                disabled={loading || !text.trim()}
                className="bg-[#1a73e8] text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition"
              >
                {loading ? "..." : "Dịch"}
              </button>
            </div>
          </div>

          {/* Cột Đích */}
          <div className="flex-1 flex flex-col bg-[#F8F9FA]">
            <div className="px-5 py-3 border-b border-gray-100 md:pl-12">
              <LanguageSelect
                value={targetLang}
                onChange={setTargetLang}
                options={LANGUAGES}
              />
            </div>
            <div className="p-5 flex-1">
              {translatedText ? (
                <p className="text-xl md:text-2xl text-gray-800 break-words whitespace-pre-wrap">
                  {translatedText}
                </p>
              ) : (
                <p className="text-xl md:text-2xl text-gray-300 select-none">
                  Bản dịch
                </p>
              )}
            </div>
            <div className="p-4 mt-auto lg:pl-10">
              <button
                onClick={() => navigator.clipboard.writeText(translatedText)}
                disabled={!translatedText}
                className="p-2 text-gray-500 hover:bg-gray-200 rounded-full disabled:opacity-0 transition"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GGTranslate;
