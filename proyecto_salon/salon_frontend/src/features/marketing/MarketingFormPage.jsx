import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketing } from './hooks';
import MarketingForm from './components/MarketingForm';
import Card from '../../components/common/Card';
import { showToast } from '../../providers/ToastProvider';
import { ArrowLeft } from 'lucide-react';

function MarketingFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, createCampaign, updateCampaign } = useMarketing();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id && campaigns.length > 0) {
      const campaign = campaigns.find((c) => String(c.id ?? c.md) === String(id));
      setSelectedCampaign(campaign || null);
    }
  }, [id, campaigns]);

  const handleSubmit = async (formData) => {
    const result = isEditing
      ? await updateCampaign(id, formData)
      : await createCampaign(formData);

    if (result.success) {
      showToast.success(
        isEditing
          ? 'Campaña actualizada exitosamente'
          : 'Campaña creada exitosamente'
      );
      navigate('/dashboard/marketing');
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/marketing');
  };

  return (
    <div>
      <button onClick={handleCancel} style={styles.backButton}>
        <ArrowLeft size={20} />
        Volver a Campañas
      </button>

      <Card style={styles.card}>
        <MarketingForm
          marketing={selectedCampaign}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  );
}

const styles = {
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    transition: 'all 0.2s',
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
  },
};

export default MarketingFormPage;





