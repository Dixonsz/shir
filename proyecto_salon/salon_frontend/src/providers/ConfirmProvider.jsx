import { createContext, useContext, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: '',
    title: '',
    confirmText: '',
    cancelText: '',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = async (message, options = {}) => {
    const {
      title = 'Confirmación',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
    } = options;

    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        message,
        title,
        confirmText,
        cancelText,
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState.isOpen && (
        <div style={styles.overlay} onClick={confirmState.onCancel}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.iconContainer}>
              <AlertTriangle size={48} style={styles.icon} />
            </div>
            <h2 style={styles.title}>{confirmState.title}</h2>
            <p style={styles.message}>{confirmState.message}</p>
            <div style={styles.buttons}>
              <button
                onClick={confirmState.onCancel}
                style={styles.cancelBtn}
              >
                {confirmState.cancelText}
              </button>
              <button
                onClick={confirmState.onConfirm}
                style={styles.confirmBtn}
              >
                {confirmState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  icon: {
    color: '#ff9800',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    textAlign: 'center',
    color: '#333',
  },
  message: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1.5rem',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    color: '#666',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  confirmBtn: {
    padding: '0.6rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#d32f2f',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
