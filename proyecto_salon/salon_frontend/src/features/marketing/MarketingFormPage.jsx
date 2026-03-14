import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarketing } from './hooks';
import MarketingForm from './components/MarketingForm';
import EntityFormView from '../../components/layout/EntityFormView';
import { showToast } from '../../providers/ToastProvider';

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
    <EntityFormView
      title={isEditing ? 'Editar Campaña' : 'Nueva Campaña de Marketing'}
      onBack={handleCancel}
    >
        <MarketingForm
          marketing={selectedCampaign}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
    </EntityFormView>
  );
}

export default MarketingFormPage;





