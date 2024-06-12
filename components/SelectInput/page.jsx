import React from "react";
import Select from "react-select";

function SelectInput({
  name,
  label,
  className,
  placeholder,
  options,
  isClearable,
  isSearchable,
  menuIsOpen,
  onChange,
  defaultValue,
  value,
  styles,
}) {
  return (
    <div className={`${className}`}>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <Select
        name={name}
        isClearable={isClearable}
        isSearchable={isSearchable}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        defaultValue={defaultValue}
        value={value}
        styles={styles}
        menuIsOpen={menuIsOpen}
      />
    </div>
  );
}

export default SelectInput;
