import React, { useState, useRef, useEffect } from "react";
import { Volume2, ChevronDown } from "lucide-react";

const VoiceSelector = ({ voices, selectedVoice, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all text-xs sm:text-sm shadow-sm"
      >
        <Volume2
          size={14}
          className="text-neutral-500 dark:text-neutral-400 flex-shrink-0"
        />

        <span className="text-left max-w-[80px] sm:max-w-[150px] truncate text-neutral-700 dark:text-neutral-300">
          {selectedVoice?.name || "Voice"}
        </span>

        <ChevronDown
          size={12}
          className={`transition-transform duration-200 flex-shrink-0 text-neutral-500 dark:text-neutral-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-96 max-h-72 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl z-[999] scrollbar-thin">
          <div className="px-4 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-850">
            Select Voice
          </div>

          {voices.length === 0 ? (
            <div className="p-4 text-sm text-neutral-400 dark:text-neutral-500">
              Loading voices...
            </div>
          ) : (
            voices.map((voice, i) => {
              const isActive = selectedVoice?.name === voice.name;

              return (
                <button
                  key={i}
                  onClick={() => {
                    onChange(voice);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex flex-col transition-all
                    hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300
                    ${isActive ? "bg-neutral-50 dark:bg-neutral-800 font-medium text-neutral-900 dark:text-white" : ""}
                  `}
                >
                  <span className="break-words whitespace-normal text-left leading-tight">
                    {voice.name}
                  </span>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    {voice.lang}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
