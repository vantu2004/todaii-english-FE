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
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur border border-neutral-200 hover:bg-neutral-50 transition-all text-sm shadow-sm"
      >
        <Volume2 size={16} className="text-neutral-500" />

        <span className="max-w-[120px] truncate">
          {selectedVoice?.name || "Voice"}
        </span>

        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-h-72 overflow-y-auto bg-white border border-neutral-200 rounded-2xl shadow-xl z-[999]">
          
          <div className="px-4 py-2 text-xs font-semibold text-neutral-400 border-b">
            Select Voice
          </div>

          {voices.length === 0 ? (
            <div className="p-4 text-sm text-neutral-400">
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
                    hover:bg-neutral-100
                    ${isActive ? "bg-neutral-100 font-medium" : ""}
                  `}
                >
                  <span className="truncate">{voice.name}</span>
                  <span className="text-xs text-neutral-400">
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