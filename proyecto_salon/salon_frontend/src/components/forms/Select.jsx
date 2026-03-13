import './Select.css';

function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  placeholder = 'Seleccione una opción',
  required = false,
  disabled = false,
  children,
  ...props
}) {
  const selectClasses = [
    'select',
    error && 'select-error',
    disabled && 'select-disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className="select-group">
      {label && (
        <label htmlFor={name} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {children ? (
          children
        ) : (
          <>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </>
        )}
      </select>
      {error && <span className="select-error-text">{error}</span>}
    </div>
  );
}

export default Select;
