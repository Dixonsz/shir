import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoles } from './hooks';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import EntityFormView from '../../components/layout/EntityFormView';
import { showToast } from '../../providers/ToastProvider';

function RoleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roles, createRole, updateRole } = useRoles();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id || roles.length === 0) {
      return;
    }

    const roleId = Number(id);
    const role = roles.find((item) => item.id === roleId || item.md === roleId);

    if (role) {
      setFormData({
        name: role.name || '',
        description: role.description || '',
        is_active: role.is_active ?? true,
      });
    }
  }, [id, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const roleId = Number(id);
    const result = isEditing
      ? await updateRole(roleId, formData)
      : await createRole(formData);

    setIsSubmitting(false);

    if (result.success) {
      showToast.success(isEditing ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente');
      navigate('/dashboard/roles');
      return;
    }

    showToast.error(result.error);
  };

  const handleCancel = () => {
    navigate('/dashboard/roles');
  };

  return (
    <EntityFormView title={isEditing ? 'Editar Rol' : 'Nuevo Rol'} onBack={handleCancel}>
      <form onSubmit={handleSubmit}>
        <Input
          name="name"
          label="Nombre del Rol"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ej: Administrador"
        />

        <Textarea
          name="description"
          label="Descripción"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe las responsabilidades del rol..."
        />

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0' }}>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <span>Activo</span>
          </label>
        </div>

        <FormButtons
          onCancel={handleCancel}
          submitLabel={isEditing ? 'Actualizar' : 'Crear Rol'}
          isSubmitting={isSubmitting}
        />
      </form>
    </EntityFormView>
  );
}

export default RoleFormPage;
