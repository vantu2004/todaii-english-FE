import React from "react";
import Select from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    height: "40px",
    border: "none",
    boxShadow: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0 28px", // adjust arrow distance
  }),
};

const CustomSelect = ({ label, value, onChange, options, noBorder = false }) => {
  return (
    <div className={`ml-2 w-48 h-full ${noBorder ? "" : "border-r border-gray-300"}`}>
      <span className="block mt-3 ml-2.5 text-sm text-gray-500 font-bold">
        {label}
      </span>
      <Select
        value={value}
        onChange={onChange}
        options={options}
        styles={customStyles}
        components={{ IndicatorSeparator: () => null }}
      />
    </div>
  );
};

export default CustomSelect;
