import React from "react";

const InputField = ({
  label,
  name,
  value,
  onChange,
  onFocus,
  type = "text",
  placeholder,
  className = "",
  required = false, // Mặc định false để linh hoạt hơn, hoặc true tùy logic của bạn
  error, // Thêm prop hiển thị lỗi
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-neutral-700 ml-1 cursor-pointer"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`
          w-full px-4 py-3
          bg-white border border-neutral-200 rounded-xl
          text-sm text-neutral-900 placeholder:text-neutral-400
          transition-all duration-200 ease-in-out
          
          focus:outline-none 
          focus:border-neutral-500 
          focus:ring-4 focus:ring-neutral-100
          
          disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
          
          ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-50"
              : "hover:border-neutral-300"
          }
        `}
      />

      {error && (
        <span className="text-xs text-red-500 font-medium ml-1 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
