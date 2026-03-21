import { useState, useEffect } from 'react';
import { galleryApi } from '../../../gallery/api';
import './Gallery.css';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await galleryApi.getAll();
                const normalized = Array.isArray(data) ? data : [];
                setImages(normalized);
                setCurrentIndex(0);
            } catch (error) {
                console.error('Error al cargar galería:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    useEffect(() => {
        if (images.length <= 1) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 4500);

        return () => window.clearInterval(intervalId);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return <div className="gallery-loading">Cargando galeria...</div>;
    }

    if (images.length === 0) {
        return null;
    }

    const activeImage = images[currentIndex];

    return (
        <section className="gallery-section">
            <div className="gallery-header">
                <div className="gallery-header-content">
                    <h2 className="gallery-title">Nuestra Galeria</h2>
                    <p className="gallery-subtitle">Resultados que hablan por si solos</p>
                </div>
            </div>

            <div className="gallery-carousel">
                <div className="gallery-slide">
                    <img
                        key={activeImage.id}
                        src={activeImage.image_url}
                        alt={activeImage.title || 'Imagen de galeria'}
                        className="gallery-slide-image"
                        title={activeImage.description || activeImage.title}
                        loading="lazy"
                    />

                    <div className="gallery-slide-overlay" />
                    <div className="gallery-slide-content">
                        <p className="gallery-slide-count">
                            {currentIndex + 1} / {images.length}
                        </p>
                        <h3>{activeImage.title || 'Resultado destacado'}</h3>
                        <p>{activeImage.description || 'Conoce nuestros resultados y el estilo de nuestro trabajo.'}</p>
                    </div>
                </div>

                {images.length > 1 ? (
                    <>
                        <button
                            type="button"
                            className="gallery-nav-btn gallery-nav-prev"
                            onClick={goToPrevious}
                            aria-label="Imagen anterior"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            className="gallery-nav-btn gallery-nav-next"
                            onClick={goToNext}
                            aria-label="Imagen siguiente"
                        >
                            →
                        </button>

                        <div className="gallery-dots" aria-label="Navegacion de galeria">
                            {images.map((img, index) => (
                                <button
                                    key={img.id || index}
                                    type="button"
                                    className={`gallery-dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Ir a imagen ${index + 1}`}
                                    aria-current={index === currentIndex ? 'true' : undefined}
                                />
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
        </section>
    );
}










