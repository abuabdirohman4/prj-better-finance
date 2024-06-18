export default function InputWithLabel({
  type,
  label,
  name,
  onChange,
  placeholder,
  value,
  disabled = false,
  validation,
  widthContainer = false,
  autoComplete = "on",
  maxLength,
}) {
  return (
    <div className={`${widthContainer ? `w-[48%]` : ""}`}>
      <div className="relative">
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          {label}
        </label>
        <input
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
            validation && "border-red-3"
          }`}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          maxLength={maxLength}
          type={type}
          value={value}
          disabled={disabled}
        />
      </div>
      {validation && (
        <p id="outlined_error_help" className="mt-2 text-xs text-red-3">
          <span className="font-medium">{validation}</span>
        </p>
      )}
    </div>
  );
}
