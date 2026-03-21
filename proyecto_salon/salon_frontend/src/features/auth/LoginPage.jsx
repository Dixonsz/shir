import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import { showToast } from '../../providers/ToastProvider';
import './LoginPage.css';

const REMEMBER_EMAIL_KEY = 'salon_remembered_email';

function canUsePasswordCredentials() {
  return typeof window !== 'undefined'
    && typeof navigator !== 'undefined'
    && 'credentials' in navigator
    && 'PasswordCredential' in window;
}

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (!rememberedEmail) {
      return;
    }

    setFormData((prev) => ({ ...prev, email: rememberedEmail }));
    setRememberMe(true);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSavedCredentials = async () => {
      if (!canUsePasswordCredentials()) {
        return;
      }

      try {
        const credential = await navigator.credentials.get({
          password: true,
          mediation: 'optional',
        });

        if (!isMounted || !credential) {
          return;
        }

        const savedId = credential.id || '';
        const savedPassword = credential.password || '';
        if (!savedId || !savedPassword) {
          return;
        }

        setFormData((prev) => ({
          ...prev,
          email: savedId,
          password: savedPassword,
        }));
        setRememberMe(true);
      } catch {
        // Ignoramos errores silenciosamente para no romper login en navegadores sin soporte completo.
      }
    };

    loadSavedCredentials();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(formData);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, formData.email.trim());

        if (canUsePasswordCredentials()) {
          try {
            const credential = new window.PasswordCredential({
              id: formData.email.trim(),
              password: formData.password,
              name: formData.email.trim(),
            });
            await navigator.credentials.store(credential);
          } catch {
            // Si falla, mantenemos el login exitoso sin bloquear al usuario.
          }
        }
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <main className="login-page">
      <div className="login-backdrop" aria-hidden="true" />
      <section className="login-card" aria-label="Formulario de inicio de sesion">
        <div className="login-brand">
          <p className="login-kicker">Accede al panel administrativo del salon</p>
          <h1 className="login-title">Iniciar sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field-group">
            <label className="login-label" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
              autoComplete="username"
            />
          </div>

          <div className="login-field-group">
            <label className="login-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="login-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'} contraseña
            </button>
          </div>

          <div className="login-options-row">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Recordarme</span>
            </label>

            <button
              type="button"
              className="login-forgot-link"
              onClick={() => showToast.info('Solicita el restablecimiento de contraseña con un administrador.')}
            >
              Olvide mi contraseña
            </button>
          </div>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;





