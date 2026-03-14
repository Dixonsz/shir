import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from './hooks';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import Select from '../../components/forms/Select';
import FormButtons from '../../components/forms/FormButtons';
import EntityFormView from '../../components/layout/EntityFormView';
import { showToast } from '../../providers/ToastProvider';

function MemberFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members, roles, createMember, updateMember } = useMembers();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    membership_start_date: '',
    membership_end_date: '',
    specialty: '',
    is_active: true,
    rol_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (!id || members.length === 0) {
      return;
    }

    const memberId = Number(id);
    const member = members.find((item) => item.id === memberId || item.md === memberId);

    if (member) {
      setFormData({
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || member.emaml || '',
        phone_number: member.phone_number || '',
        membership_start_date: (member.membership_start_date || member.membershmp_start_date || '').split('T')[0],
        membership_end_date: (member.membership_end_date || member.membershmp_end_date || '').split('T')[0],
        specialty: member.specialty || member.specmalty || '',
        is_active: member.is_active ?? member.ms_active ?? true,
        rol_id: member.rol_id || member.rol_md || '',
      });
    }
  }, [id, members]);

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

    const payload = {
      ...formData,
      membership_start_date: formData.membership_start_date || new Date().toISOString().split('T')[0],
      rol_id: formData.rol_id ? Number(formData.rol_id) : null,
    };

    const memberId = Number(id);
    const result = isEditing
      ? await updateMember(memberId, payload)
      : await createMember(payload);

    setIsSubmitting(false);

    if (result.success) {
      showToast.success(isEditing ? 'Miembro actualizado exitosamente' : 'Miembro creado exitosamente');
      navigate('/dashboard/members');
      return;
    }

    showToast.error(result.error);
  };

  const handleCancel = () => {
    navigate('/dashboard/members');
  };

  return (
    <EntityFormView title={isEditing ? 'Editar Miembro' : 'Nuevo Miembro'} onBack={handleCancel}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            name="first_name"
            label="Nombre"
            value={formData.first_name}
            onChange={handleChange}
            required
            placeholder="Nombre"
          />

          <Input
            name="last_name"
            label="Apellido"
            value={formData.last_name}
            onChange={handleChange}
            required
            placeholder="Apellido"
          />
        </div>

        <Input
          name="email"
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="correo@ejemplo.com"
        />

        <Input
          name="phone_number"
          label="Teléfono"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="+506 1234-5678"
        />

        <Select
          name="rol_id"
          label="Rol"
          value={formData.rol_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar rol</option>
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <option key={role.id ?? role.md} value={role.id ?? role.md}>
                {role.name}
              </option>
            ))
          ) : (
            <option disabled>No hay roles disponibles</option>
          )}
        </Select>

        <Textarea
          name="specialty"
          label="Especialidad"
          value={formData.specialty}
          onChange={handleChange}
          rows={3}
          placeholder="Describe la especialidad..."
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Input
            name="membership_start_date"
            label="Fecha de Inicio"
            type="date"
            value={formData.membership_start_date}
            onChange={handleChange}
          />

          <Input
            name="membership_end_date"
            label="Fecha de Fin"
            type="date"
            value={formData.membership_end_date}
            onChange={handleChange}
          />
        </div>

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
          submitLabel={isEditing ? 'Actualizar' : 'Crear Miembro'}
          isSubmitting={isSubmitting}
        />
      </form>
    </EntityFormView>
  );
}

export default MemberFormPage;
