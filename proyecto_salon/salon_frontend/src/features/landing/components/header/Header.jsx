import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const goToHome = () => {
        if (location.pathname !== '/') {
            navigate('/');
            return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            return;
        }

        const target = document.getElementById(sectionId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header className="landing-header">
            <div className="header-container">
                <div className="header-logo" onClick={() => navigate('/')} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && navigate('/')}>
                    <div className="logo-icon">
                        <span>✨</span>
                    </div>
                    <span className="logo-text">SHIR SALÓN</span>
                </div>
                <div className="header-nav">
                    <button className="header-nav-btn" onClick={goToHome}>
                        Inicio
                    </button>
                    <button className="header-nav-btn" onClick={() => goToSection('galeria')}>
                        Galeria 
                    </button>
                    <button className="header-nav-btn" onClick={() => goToSection('servicios')}>
                        Servicios
                    </button>
                    <button className="header-nav-btn" onClick={() => goToSection('equipo')}>
                        Nuestro equipo
                    </button>
                    <button className="header-nav-btn" onClick={() => goToSection('ubicacion')}>
                        Ubicacion 
                    </button>
                    <button className="header-nav-btn" onClick={() => goToSection('contacto')}>
                        Contacto
                    </button>
                    <button className="header-nav-btn header-nav-btn-cta" onClick={() => navigate('/reservar')}>
                        Reservar
                    </button>
                </div>
                
            </div>
        </header>
    );
}










