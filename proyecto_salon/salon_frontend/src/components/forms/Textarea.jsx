import './Textarea.css';

function Textarea({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  ...props
}) {
  const textareaClasses = [
    'textarea',
    error && 'textarea-error',
    disabled && 'textarea-disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className="textarea-group">
      {label && (
        <label htmlFor={name} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && <span className="textarea-error-text">{error}</span>}
    </div>
  );
}

export default Textarea;
