import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();

    return (
        <header className="landing-header">
            <div className="header-container">
                <div className="header-logo">
                    <div className="logo-icon">
                        <span>✨</span>
                    </div>
                    <span className="logo-text">SHIR SALÓN</span>
                </div>
                <button className="header-login-btn" onClick={() => navigate('/login')}>
                    Iniciar sesión
                </button>
            </div>
        </header>
    );
}