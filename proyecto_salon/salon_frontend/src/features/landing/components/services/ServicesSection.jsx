import { useState, useEffect } from 'react';
import { servicesApi } from '../../../services/services.api';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

const ITEMS_PER_PAGE = 9;

export default function ServicesSection() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    const totalPages = Math.ceil(services.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentServices = services.slice(startIndex, endIndex);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="services-section"><p>Cargando servicios...</p></div>;
    }

    if (error) {
        return <div className="services-section"><p>{error}</p></div>;
    }

    if (services.length === 0) {
        return (
            <div className="services-section">
                <h2>Servicios</h2>
                <p>No hay servicios disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <section className="services-section">
            <h2>Servicios</h2>
            <div className="services-info">
                <p>Mostrando {startIndex + 1} - {Math.min(endIndex, services.length)} de {services.length} servicios</p>
            </div>
            <div className="services-grid">
                {currentServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="pagination-btn" 
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        aria-label="Página anterior"
                    >
                        ❮ Anterior
                    </button>
                    
                    <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                onClick={() => goToPage(page)}
                                aria-label={`Ir a página ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="pagination-btn" 
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        aria-label="Página siguiente"
                    >
                        Siguiente ❯
                    </button>
                </div>
            )}
        </section>
    );
}
