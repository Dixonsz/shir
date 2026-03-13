import { useState, useEffect } from 'react';
import { membersApi } from '../../../members/members.api';
import MemberCard from './MemberCard';
import './TeamSection.css';

const ITEMS_PER_PAGE = 6;

export default function TeamSection() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const data = await membersApi.getAll();
                const activeMembers = data.filter(member => member.is_active);
                setMembers(activeMembers);
            } catch (err) {
                console.error('Error fetching members:', err);
                setError('No se pudieron cargar los miembros del equipo');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const totalPages = Math.ceil(members.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentMembers = members.slice(startIndex, endIndex);

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        window.scrollTo({ top: document.querySelector('.team-section').offsetTop - 100, behavior: 'smooth' });
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        window.scrollTo({ top: document.querySelector('.team-section').offsetTop - 100, behavior: 'smooth' });
    };

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: document.querySelector('.team-section').offsetTop - 100, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="team-section"><p>Cargando equipo de trabajo...</p></div>;
    }

    if (error) {
        return <div className="team-section"><p>{error}</p></div>;
    }

    if (members.length === 0) {
        return (
            <div className="team-section">
                <h2>Nuestro Equipo</h2>
                <p>No hay miembros disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <section className="team-section">
            <h2>Nuestro Equipo</h2>
            <p className="team-subtitle">Conoce a nuestros profesionales especializados</p>
            <div className="team-info">
                <p>Mostrando {startIndex + 1} - {Math.min(endIndex, members.length)} de {members.length} miembros</p>
            </div>
            <div className="team-grid">
                {currentMembers.map((member) => (
                    <MemberCard key={member.id} member={member} />
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
