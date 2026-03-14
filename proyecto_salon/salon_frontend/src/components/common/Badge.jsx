import './Badge.css';

function Badge({ children, variant = 'default', ...props }) {
  return (
    <span className={`badge badge-${variant}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;

