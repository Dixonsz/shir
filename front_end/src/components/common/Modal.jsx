import { X } from 'lucide-react';
import './Modal.css';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '520px',
  closeOnOverlay = true,
}) {
  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = () => {
    if (closeOnOverlay && onClose) {
      onClose();
    }
  };

  return (
    <div className="app-modal-overlay" onClick={handleOverlayClick} role="presentation">
      <div
        className="app-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ maxWidth }}
      >
        <div className="app-modal-header">
          <h2 className="app-modal-title">{title}</h2>
          <button
            type="button"
            className="app-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="app-modal-body">{children}</div>

        {footer ? <div className="app-modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}

export default Modal;
