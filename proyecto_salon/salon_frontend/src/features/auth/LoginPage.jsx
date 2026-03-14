import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks';
import './LoginPage.css';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!result.success) {
      setError(result.error);
    }

    setIsSubmitting(false);
  };

  return (
    <main className="login-page">
      <div className="login-backdrop" aria-hidden="true" />
      <section className="login-card" aria-label="Formulario de inicio de sesion">
        <div className="login-brand">
          <p className="login-kicker">Accede al panel administrativo del salon.</p>
          <h1 className="login-title">Iniciar sesion</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
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
            autoComplete="email"
          />

          <label className="login-label" htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
            autoComplete="current-password"
          />

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





