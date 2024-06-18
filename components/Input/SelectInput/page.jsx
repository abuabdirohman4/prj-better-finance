import SkeletonText from "@/components/Skeleton/Text";
import dynamic from "next/dynamic";
// import Select from "react-select";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => <SkeletonText row={2}/>,
});

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
      <label
        htmlFor={name}
        className="mb-2 block text-sm text-black font-semibold"
      >
        {label}
      </label>
      <Select
        name={name}
        id={name}
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
