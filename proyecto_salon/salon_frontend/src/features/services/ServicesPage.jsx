import { useState } from 'react';
import { useServices } from './hooks';
import ServiceList from './components/ServiceList';
import ServiceForm from './components/ServiceForm';
import { useConfirm } from '../../providers/ConfirmProvider';
import { showToast } from '../../providers/ToastProvider';

function ServicesPage() {
  const {
    services,
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

  const handleCreate = () => {
    setSelectedService(null);
    setView('form');
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setView('form');
  };

  const handleCategoryCreated = () => {
    fetchCategories(); 
  };

  const handleDelete = async (service) => {
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
        showToast.success('Servicio eliminado exitosamente');
      } else {
        showToast.error(result.error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    const selectedId = selectedService?.id ?? selectedService?.md;
    const result = selectedService
      ? await updateService(selectedId, formData)
      : await createService(formData);

    if (result.success) {
      setView('list');
      showToast.success(
        selectedService
          ? 'Servicio actualizado exitosamente'
          : 'Servicio creado exitosamente'
      );
    } else {
      showToast.error(result.error);
    }
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
      loading={loading}
      error={error}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

export default ServicesPage;





