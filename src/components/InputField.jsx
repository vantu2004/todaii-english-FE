const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}) => {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="text-gray-700 dark:text-gray-400">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required
        className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 text-sm leading-6 block w-full mt-1 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-white/50 dark:text-gray-300"
      />
    </label>
  );
};

export default InputField;
