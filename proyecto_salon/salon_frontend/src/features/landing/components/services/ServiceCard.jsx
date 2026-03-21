import { Clock3, Sparkles } from 'lucide-react';
import './ServiceCard.css';

export default function ServiceCard({ service }) {
    const promotionsCount = Array.isArray(service.promotions) ? service.promotions.length : 0;

    return (
        <article className="service-card" role="listitem">
            <div className="service-card-header">
                <h3>{service.name}</h3>
                <span className="service-price">desde: ₡{service.price}</span>
            </div>

            <p className="service-description">
                {service.description || 'Un servicio pensado para resaltar tu estilo con resultados profesionales.'}
            </p>

            <div className="service-footer">
                <span className="service-duration">
                    <Clock3 size={16} /> {service.duration_minutes} minutos
                </span>
                {promotionsCount > 0 && (
                    <span className="service-promotion">
                        <Sparkles size={14} /> {promotionsCount} promoción{promotionsCount > 1 ? 'es' : ''}
                    </span>
                )}
            </div>
        </article>
    );
}










