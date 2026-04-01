import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useMarketing } from './hooks';
import MarketingList from './components/MarketingList';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { marketingApi } from './api';

function MarketingPage() {
  const { loading, deleteCampaign } = useMarketing();
  const { confirm } = useConfirm();
  const navigate = useNavigate();
  const getCampaignId = (campaign) => campaign.id ?? campaign.md;

  const fetchCampaignsPage = useCallback(({ page, pageSize }) => {
    return marketingApi.getAll({ page, pageSize });
  }, []);

  const {
    data: campaigns,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchCampaignsPage, { pageSize: DEFAULT_PAGE_SIZE });

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
        await refresh();
        showToast.success('Campaña eliminada exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  return (
    <MarketingList
      campaigns={campaigns}
      loading={loading || paginationLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCreate={handleCreate}
      pagination={{
        page,
        pages,
        total,
        pageSize,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
      }}
    />
  );
}

export default MarketingPage;





