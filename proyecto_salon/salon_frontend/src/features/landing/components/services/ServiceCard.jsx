import './ServiceCard.css';

export default function ServiceCard({ service }) {
    return (
        <div className="service-card">
            <div className="service-card-header">
                <h3>{service.name}</h3>
                <span className="service-price">desde: ₡{service.price}</span>
            </div>
            <p className="service-description">{service.description}</p>
            <div className="service-footer">
                <span className="service-duration">
                    <i className="icon-clock"></i> {service.duration_minutes} minutos
                </span>
                {service.promotions && service.promotions.length > 0 && (
                    <span className="service-promotion"> Promoción</span>
                )}
            </div>
        </div>
    );
}










