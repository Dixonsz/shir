import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './providers/ToastProvider';
import { ConfirmProvider } from './providers/ConfirmProvider';
import { TableFiltersProvider } from './providers/TableFiltersProvider';
import { AuthProvider } from './features/auth/AuthContext';
import AppRouter from './AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <TableFiltersProvider>
            <ConfirmProvider>
              <AppRouter />
            </ConfirmProvider>
          </TableFiltersProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

