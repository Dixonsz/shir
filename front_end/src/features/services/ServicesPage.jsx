import { useCallback, useState } from 'react';
import { useServices } from './hooks';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';
import { usePagination } from '../../hooks/usePagination';
import { useMutationLock } from '../../hooks/useMutationLock';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../../utils/constants';
import { servicesApi } from './api';

function ServicesPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createService,
    updateService,
    deleteService,
  } = useServices();
  const { confirm } = useConfirm();
  const [view, setView] = useState('list');
  const [selectedService, setSelectedService] = useState(null);
  const { isLocked: isMutating, runWithLock } = useMutationLock();

  const fetchServicesPage = useCallback(({ page, pageSize }) => {
    return servicesApi.getAll(true, { page, pageSize });
  }, []);

  const {
    data: services,
    page,
    pages,
    total,
    pageSize,
    loading: paginationLoading,
    setPage,
    setPageSize,
    refresh,
  } = usePagination(fetchServicesPage, { pageSize: DEFAULT_PAGE_SIZE });

  const handleCreate = () => {
    if (isMutating) return;
    setSelectedService(null);
    setView('form');
  };

  const handleEdit = (service) => {
    if (isMutating) return;
    setSelectedService(service);
    setView('form');
  };

  const handleCategoryCreated = () => {
    fetchCategories(); 
  };

  const handleDelete = async (service) => {
    await runWithLock(async () => {
      const confirmed = await confirm(
        `¿Está seguro de eliminar el servicio "${service.name}"?`,
        {
          title: 'Confirmar eliminación',
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
        }
      );

      if (confirmed) {
        const serviceId = service.id ?? service.md;
        const result = await deleteService(serviceId);
        if (result.success) {
          await refresh();
          showToast.success('Servicio eliminado exitosamente');
        } else {
          showToast.error(result.error);
        }
      }
    });
  };

  const handleSubmit = async (formData) => {
    const selectedId = selectedService?.id ?? selectedService?.md;
    await runWithLock(async () => {
      const result = selectedService
        ? await updateService(selectedId, formData)
        : await createService(formData);

      if (result.success) {
        await refresh();
        setView('list');
        showToast.success(
          selectedService
            ? 'Servicio actualizado exitosamente'
            : 'Servicio creado exitosamente'
        );
      } else {
        showToast.error(result.error);
      }
    });
  };

  const handleCancel = () => {
    setSelectedService(null);
    setView('list');
  };

  if (view === 'form') {
    return (
      <ServiceForm
        service={selectedService}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onCategoryCreated={handleCategoryCreated}
      />
    );
  }

  return (
    <ServiceList
      services={services}
      loading={loading || paginationLoading}
      error={error}
      isMutating={isMutating}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
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

export default ServicesPage;





