import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { servicesApi } from '../../../services/api';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

function getCardsPerView(width) {
    if (width <= 768) {
        return 1;
    }

    if (width <= 1100) {
        return 2;
    }

    return 3;
}

export default function ServicesSection() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(() => getCardsPerView(window.innerWidth));

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const data = await servicesApi.getAll(true);
                setServices(data);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError('No se pudieron cargar los servicios');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setCardsPerView(getCardsPerView(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.ceil(services.length / cardsPerView);
    const startIndex = currentSlide * cardsPerView;
    const visibleServices = services.slice(startIndex, startIndex + cardsPerView);

    useEffect(() => {
        if (currentSlide > 0 && currentSlide >= totalSlides) {
            setCurrentSlide(Math.max(totalSlides - 1, 0));
        }
    }, [currentSlide, totalSlides]);

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const goToPreviousSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    if (loading) {
        return (
            <section className="services-section" id="servicios">
                <div className="services-shell">
                    <p className="services-feedback">Cargando servicios...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="services-section" id="servicios">
                <div className="services-shell">
                    <p className="services-feedback">{error}</p>
                </div>
            </section>
        );
    }

    if (services.length === 0) {
        return (
            <section className="services-section" id="servicios">
                <div className="services-shell">
                    <header className="services-header">
                        <p className="services-kicker">SERVICIOS DESTACADOS</p>
                        <h2>Servicios</h2>
                    </header>
                    <p className="services-feedback">No hay servicios disponibles en este momento.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="services-section" id="servicios">
            <div className="services-shell">
                <header className="services-header">
                    <p className="services-kicker">SERVICIOS DESTACADOS</p>
                    <h2>Promociones y Servicios</h2>
                    <p>Explora nuestros servicios en un vistazo rapido y descubre cuales tienen beneficios especiales hoy.</p>
                </header>

                <div className="services-carousel">
                    {totalSlides > 1 && (
                        <button
                            className="services-nav services-nav-prev"
                            onClick={goToPreviousSlide}
                            aria-label="Servicio anterior"
                        >
                            <ChevronLeft size={22} />
                        </button>
                    )}

                    <div className="services-grid" role="list" aria-label="Servicios del salon">
                        {visibleServices.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>

                    {totalSlides > 1 && (
                        <button
                            className="services-nav services-nav-next"
                            onClick={goToNextSlide}
                            aria-label="Servicio siguiente"
                        >
                            <ChevronRight size={22} />
                        </button>
                    )}
                </div>

                {totalSlides > 1 && (
                    <div className="services-dots" role="tablist" aria-label="Navegacion de servicios">
                        {Array.from({ length: totalSlides }, (_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`services-dot ${currentSlide === index ? 'is-active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Ver grupo ${index + 1}`}
                                aria-selected={currentSlide === index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}











