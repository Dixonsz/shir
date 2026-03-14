import { useEffect, useState } from 'react';
import { marketingApi } from '../../../marketing/api';
import './MarketingSection.css';

function formatDate(dateValue) {
  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getCampaignPeriod(campaign) {
  const start = formatDate(campaign.start_date);
  const end = formatDate(campaign.end_date);

  if (start && end) {
    return `${start} - ${end}`;
  }

  if (start && !end) {
    return `Desde ${start}`;
  }

  if (!start && end) {
    return `Hasta ${end}`;
  }

  return 'Vigencia sujeta a disponibilidad';
}

export default function MarketingSection() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCampaigns = async () => {
      try {
        const data = await marketingApi.getActive();
        if (isMounted) {
          setCampaigns(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error al cargar campanas activas:', error);
        if (isMounted) {
          setCampaigns([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCampaigns();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="marketing-section">
        <div className="marketing-shell">
          <p className="marketing-feedback">Cargando campanas de marketing...</p>
        </div>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return null;
  }

  return (
    <section className="marketing-section" id="campanas">
      <div className="marketing-shell">
        <header className="marketing-header">
          <p className="marketing-kicker">PROMOCIONES ACTIVAS</p>
          <h2>Campanas de Marketing</h2>
          <p>Descubre oportunidades especiales que estan disponibles ahora.</p>
        </header>

        <div className="marketing-grid">
          {campaigns.map((campaign) => (
            <article
              key={campaign.id ?? campaign.md ?? campaign.name}
              className="marketing-card"
            >
              {campaign.media_url ? (
                <img
                  src={campaign.media_url}
                  alt={campaign.name || 'Campana de marketing'}
                  className="marketing-media"
                  loading="lazy"
                />
              ) : (
                <div className="marketing-media marketing-media-placeholder">
                  Campana activa
                </div>
              )}

              <div className="marketing-content">
                <h3>{campaign.name || 'Campana sin titulo'}</h3>
                <p>{campaign.description || 'Consulta esta campana para conocer todos sus beneficios.'}</p>
                <span className="marketing-period">{getCampaignPeriod(campaign)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
