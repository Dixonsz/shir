import { useState, useEffect } from 'react';
import { galleryApi } from '../../../gallery/gallery.api';
import './Gallery.css';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await galleryApi.getAll();
                setImages(data);
            } catch (error) {
                console.error('Error al cargar galería:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    if (loading) {
        return <div className="gallery-loading">Cargando galería...</div>;
    }

    if (images.length === 0) {
        return null;
    }

    return (
        <section className="gallery-section">
            <div className="gallery-header">
                <div className="gallery-header-content">
                    <h2 className="gallery-title">Nuestra Galería</h2>
                    <p className="gallery-subtitle">Resultados que hablan por sí solos</p>
                </div>
            </div>
            <div className="gallery">
                {images.map((img) => (
                    <img 
                        key={img.id}
                        src={img.image_url} 
                        alt={img.title} 
                        className="gallery-img"
                        title={img.description || img.title}
                    />
                ))}
            </div>
        </section>
    );
}