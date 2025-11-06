import { useRef } from "react";

const OTPInput = ({ code, setCode, length = 6 }) => {
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const onlyDigits = value.replace(/\D/g, "");
    const newCode = [...code];
    newCode[index] = onlyDigits.slice(0, 1);
    setCode(newCode);
    if (onlyDigits && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const text =
      (e.clipboardData || window.clipboardData).getData("text") || "";
    const digits = text
      .replace(/\D/g, "")
      .slice(0, length - index)
      .split("");
    if (!digits.length) return;
    const newCode = [...code];
    for (let i = 0; i < digits.length; i++) {
      newCode[index + i] = digits[i];
    }
    setCode(newCode);
    const nextIndex = Math.min(index + digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0)
      inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1)
      inputRefs.current[index + 1]?.focus();
  };

  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold 
                     bg-gray-700/60 border border-gray-600 text-white rounded-md 
                     focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                     transition-all duration-150 placeholder-gray-400"
        />
      ))}
    </div>
  );
};

export default OTPInput;
