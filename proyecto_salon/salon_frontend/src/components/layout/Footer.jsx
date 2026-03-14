import './Footer.css';
import { Instagram, Facebook, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="landing-footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <div className="footer-logo-icon">
                        <Sparkles size={20} />
                    </div>
                    <span className="footer-logo-text">SHIR SALON</span>
                </div>
                
                <p className="footer-description">
                    Si­guenos para mas inspiracion diaria sobre belleza y cuidado personal.
                </p>
                
                <div className="footer-social">
                    <a 
                        href="https://www.instagram.com/shirsalon" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-link"
                        title="Instagram"
                    >
                        <Instagram size={24} />
                    </a>
                    <a 
                        href="https://www.facebook.com/shirsalon" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="social-link"
                        title="Facebook"
                    >
                        <Facebook size={24} />
                    </a>
                    <a 
                        href="mailto:info@shirsalon.com" 
                        className="social-link"
                        title="Email"
                    >
                        <Mail size={24} />
                    </a>
                </div>
                
                <div className="footer-copyright">
                    <p>&copy; 2026 Shir Salon. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
