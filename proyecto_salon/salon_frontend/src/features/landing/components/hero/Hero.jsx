import './Hero.css';
import fondoImage from '../../../../assets/images/fondo.svg';

export default function Hero() {
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
                        <h1 className="hero-title">
                            Bienvenidos a <br />
                            <span className="hero-brand">Shir Salón</span>
                        </h1>
                        <p className="hero-subtitle">
                        Creamos experiencias que conectan con tu estilo.</p>
                        <button className="hero-btn">
                            Reservar Ahora
                            <span className="hero-btn-icon">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
