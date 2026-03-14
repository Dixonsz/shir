import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../../core/api/errors';
import { clearToken, getToken, setToken } from '../../core/auth/tokenStorage';
import { decodeToken, isTokenExpired } from '../../utils/jwt';
import { authApi } from './api';
import { membersApi } from '../members/api';

export const AuthContext = createContext(null);

function buildAuthUser(token, profile = null) {
  const decoded = decodeToken(token) || {};
  const tokenUser = {
    id: decoded?.sub ? Number(decoded.sub) : null,
    email: decoded?.email || null,
    role: decoded?.role || null,
  };

  return {
    ...tokenUser,
    ...(profile || {}),
  };
}

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
        let profile = null;
        const decoded = decodeToken(token);
        const memberId = decoded?.sub ? Number(decoded.sub) : null;

        if (memberId) {
          try {
            profile = await membersApi.getById(memberId);
          } catch (error) {
            console.error('No se pudo cargar el perfil del miembro logueado:', error);
          }
        }

        const userData = buildAuthUser(token, profile);
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
      const token = data?.token;
      if (!token) {
        return {
          success: false,
          error: 'No se recibio token en la respuesta del login',
        };
      }

      setToken(token);
      const userData = buildAuthUser(token, data?.user);
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





