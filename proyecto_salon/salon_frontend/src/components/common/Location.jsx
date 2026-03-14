import './Location.css';

export default function Location() {
    return (
        <div className="location-section">
            <h2>Nuestra UbicaciÃ³n</h2>  
            <p>EncuÃ©ntranos en Shirsalon. Â¡VisÃ­tanos y disfruta de nuestros servicios!</p>
            <div className="map-container">
                <iframe
                    title="UbicaciÃ³n del SalÃ³n - Shirsalon"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.745251365904!2d-83.73873882521183!3d10.362242666697378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0b100334bef61%3A0x5b109c5bdf20bed9!2sShirsalon!5e0!3m2!1ses!2scr!4v1770778880338!5m2!1ses!2scr"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
}
