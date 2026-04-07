import { createContext, useContext, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

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
      title = 'Confirmacion',
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

  const closeConfirm = () => {
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, Confirm: confirm }}>
      {children}
      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        title={confirmState.title}
        maxWidth="420px"
      >
        <div style={styles.iconContainer}>
          <AlertTriangle size={44} style={styles.icon} />
        </div>
        <p style={styles.message}>{confirmState.message}</p>
        <div style={styles.buttons}>
          <Button variant="outline" onClick={confirmState.onCancel}>
            {confirmState.cancelText}
          </Button>
          <Button variant="danger" onClick={confirmState.onConfirm}>
            {confirmState.confirmText}
          </Button>
        </div>
      </Modal>
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
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '0.75rem',
  },
  icon: {
    color: '#f59e0b',
  },
  message: {
    fontSize: '1rem',
    color: '#cbd5e1',
    marginBottom: '1.5rem',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  buttons: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
  },
};

