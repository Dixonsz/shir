import './Button.css';

function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  size = 'medium',
  ...props 
}) {
  const classNames = [
    'button',
    `button-${size}`,
    `button-${variant}`,
    fullWidth && 'button-full-width'
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
