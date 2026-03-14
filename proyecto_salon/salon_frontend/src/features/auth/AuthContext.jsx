import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../../core/api/errors';
import { clearToken, getToken, setToken } from '../../core/auth/tokenStorage';
import { decodeToken, isTokenExpired } from '../../utils/jwt';
import { authApi } from './api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getToken();
      if (token && !isTokenExpired(token)) {
        const userData = decodeToken(token);
        setUser(userData);
      } else {
        clearToken();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      setToken(data.token);
      const userData = decodeToken(data.token);
      setUser(userData);
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || getApiErrorMessage(error, 'Error al iniciar sesion'),
      };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}





