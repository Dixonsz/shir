import { User } from 'lucide-react';
import './Avatar.css';

function Avatar({ src, alt = 'Avatar', size = 'medium', onClick }) {
  const sizes = {
    small: 1,
    medium: 2,
    large: 3,
  };

  const iconSize = [16, 32, 48];
  const sizeIndex = sizes[size] || sizes.medium;

  const containerClasses = [
    'avatar',
    `avatar-${size}`,
    onClick && 'avatar-clickable'
  ].filter(Boolean).join(' ');

  const placeholderClasses = [
    'avatar-placeholder',
    `avatar-placeholder-${size}`
  ].join(' ');

  return (
    <div className={containerClasses} onClick={onClick}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <div className={placeholderClasses}>
          <User size={iconSize[sizeIndex - 1] || 32} />
        </div>
      )}
    </div>
  );
}

export default Avatar;

