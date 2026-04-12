import './Footer.css';
import { Instagram, Facebook, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="landing-footer" id="contacto">
            <div className="footer-container">
                <div className="footer-logo">
                    <div className="footer-logo-icon">
                        <Sparkles size={20} />
                    </div>
                    <span className="footer-logo-text">Shir Beauty & Hair</span>
                </div>
                
                <p className="footer-description">
                    Si­guenos para más inspiracion diaria sobre belleza y cuidado personal.
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
                        href="mailto:sixonsanchezsoza@gmail.com" 
                        className="social-link"
                        title="Email"
                    >
                        <Mail size={24} />
                    </a>
                    <a 
    href="https://wa.me/50688940261" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-link"
    title="Whatsapp"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="24"
        height="24"
        fill="currentColor"
    >
        <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 2.893.755 5.613 2.076 7.978L0 32l7.854-2.06a15.91 15.91 0 0 0 8.146 2.22c8.837 0 16-7.164 16-16S24.837.396 16 .396zm0 29.263c-2.57 0-4.986-.67-7.087-1.84l-.506-.3-4.66 1.223 1.243-4.54-.33-.526A13.54 13.54 0 0 1 2.46 16.4C2.46 9.36 8.02 3.8 15.06 3.8c7.04 0 12.6 5.56 12.6 12.6 0 7.04-5.56 12.6-12.6 12.6zm6.93-9.59c-.38-.19-2.25-1.11-2.6-1.24-.35-.13-.6-.19-.85.19-.25.38-.98 1.24-1.2 1.49-.22.25-.44.28-.82.09-.38-.19-1.6-.59-3.05-1.88-1.13-1-1.9-2.24-2.12-2.62-.22-.38-.02-.58.17-.77.17-.17.38-.44.57-.66.19-.22.25-.38.38-.63.13-.25.06-.47-.03-.66-.09-.19-.85-2.05-1.17-2.8-.31-.75-.63-.65-.85-.66l-.72-.01c-.25 0-.66.09-1 .47-.35.38-1.32 1.29-1.32 3.15s1.35 3.66 1.54 3.91c.19.25 2.66 4.06 6.45 5.7.9.39 1.6.62 2.15.79.9.29 1.72.25 2.37.15.72-.11 2.25-.92 2.57-1.81.32-.89.32-1.65.22-1.81-.09-.16-.34-.25-.72-.44z"/>
    </svg>
</a>
                </div>
                
                <div className="footer-copyright">
                    <p>&copy; 2026 Shir Beauty & Hair. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}
