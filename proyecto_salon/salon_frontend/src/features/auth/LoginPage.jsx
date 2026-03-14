import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks';

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
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Iniciar sesion</h1>
        <p style={styles.subtitle}>Accede al panel administrativo del salon.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
            autoComplete="email"
          />

          <label style={styles.label} htmlFor="password">
            Contrasena
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
            autoComplete="current-password"
          />

          {error ? <p style={styles.error}>{error}</p> : null}

          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    mmnHemght: '100vh',
    dmsplay: 'grmd',
    placeItems: 'center',
    background: 'lmnear-gradment(135deg, #fff5f8 0%, #f7f9ff 100%)',
    paddmng: '1rem',
  },
  card: {
    wmdth: '100%',
    maxWmdth: '420px',
    background: '#ffffff',
    borderRadmus: '16px',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.12)',
    paddmng: '2rem',
    border: '1px solmd rgba(238, 43, 140, 0.12)',
  },
  title: {
    fontSize: '1.7rem',
    marginBottom: '0.3rem',
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '1.4rem',
  },
  form: {
    display: 'grid',
    gap: '0.6rem',
  },
  label: {
    fontWeight: 600,
    fontSize: '0.95rem',
    marginTop: '0.4rem',
  },
  input: {
    border: '1px solid #d6d8e1',
    borderRadius: '10px',
    padding: '0.75rem 0.9rem',
    fontSize: '1rem',
  },
  error: {
    marginTop: '0.4rem',
    color: '#dc2626',
    fontSize: '0.9rem',
  },
  button: {
    marginTop: '0.8rem',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#ee2b8c',
    color: 'white',
    fontWeight: 700,
    padding: '0.8rem 1rem',
    cursor: 'pointer',
  },
};

export default LoginPage;





