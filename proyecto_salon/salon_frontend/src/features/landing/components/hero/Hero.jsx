import './Hero.css';
import fondoImage from '../../../../assets/images/fondo.svg';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero-section">
            <div className="hero-container">
                <div className="hero-image-wrapper">
                    <img 
                        className="hero-image" 
                        src={fondoImage} 
                        alt="Salón de belleza moderno y lujoso"
                    />
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <span className="hero-kicker">Imagen, estilo y precision</span>
                        <h1 className="hero-title">
                            Diseña tu mejor versión en
                            <span className="hero-brand"> Shir Salón</span>
                        </h1>
                        <p className="hero-subtitle">
                            Creamos experiencias premium que conectan con tu estilo, tu tiempo y tu forma de verte.
                        </p>
                        <div className="hero-highlights" aria-label="Beneficios principales">
                            <span>Atencion personalizada</span>
                            <span>Equipo profesional</span>
                            <span>Reservas en linea</span>
                        </div>
                        <button className="hero-btn" onClick={() => navigate('/reservar')}>
                            Reservar ahora
                            <span className="hero-btn-icon">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}











