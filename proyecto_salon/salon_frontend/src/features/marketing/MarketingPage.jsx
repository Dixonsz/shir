import { useNavigate } from 'react-router-dom';
import { useMarketing } from './useMarketing';
import MarketingList from './MarketingList';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function MarketingPage() {
  const { campaigns, loading, deleteCampaign } = useMarketing();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/dashboard/marketing/new');
  };

  const handleEdit = (campaign) => {
    navigate(`/dashboard/marketing/edit/${campaign.id}`);
  };

  const handleDelete = async (campaign) => {
    const confirmed = await confirm(
      `¿Está seguro de eliminar la campaña "${campaign.name}"?`,
      'Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      const result = await deleteCampaign(campaign.id);
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
