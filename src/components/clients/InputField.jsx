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
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1 cursor-pointer transition-colors"
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
          w-full px-4 py-2.5
          bg-white dark:bg-neutral-800/50 
          border border-neutral-200 dark:border-neutral-700 
          rounded-xl
          text-sm text-neutral-900 dark:text-neutral-100 
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          transition-all duration-200 ease-in-out
          
          focus:outline-none 
          focus:border-brand-500 dark:focus:border-brand-500
          focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-500/20
          
          disabled:bg-neutral-50 dark:disabled:bg-neutral-800 
          disabled:text-neutral-400 dark:disabled:text-neutral-600 
          disabled:cursor-not-allowed
          
          ${
            error
              ? "border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500/20"
              : "hover:border-neutral-300 dark:hover:border-neutral-600"
          }
        `}
      />

      {error && (
        <span className="text-xs text-red-500 dark:text-red-400 font-medium ml-1 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputField;
