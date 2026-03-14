import { useNavigate } from 'react-router-dom';
import { useMarketing } from './hooks';
import MarketingList from './components/MarketingList';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function MarketingPage() {
  const { campaigns, loading, deleteCampaign } = useMarketing();
  const { confirm } = useConfirm();
  const navigate = useNavigate();
  const getCampaignId = (campaign) => campaign.id ?? campaign.md;

  const handleCreate = () => {
    navigate('/dashboard/marketing/new');
  };

  const handleEdit = (campaign) => {
    navigate(`/dashboard/marketing/edit/${getCampaignId(campaign)}`);
  };

  const handleDelete = async (campaign) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar la campaña "${campaign.name}"?`,
      {
        title: 'Confirmar eliminacion',
        confirmText: 'Eliminar',
      }
    );

    if (confirmed) {
      const result = await deleteCampaign(getCampaignId(campaign));
      if (result.success) {
        showToast.success('Campaña eliminada exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  return (
    <MarketingList
      campaigns={campaigns}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
    />
  );
}

export default MarketingPage;





