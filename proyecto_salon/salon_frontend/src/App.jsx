import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './providers/ToastProvider';
import { ConfirmProvider } from './providers/ConfirmProvider';
import { AuthProvider } from './features/auth/AuthContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <AppRouter />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

