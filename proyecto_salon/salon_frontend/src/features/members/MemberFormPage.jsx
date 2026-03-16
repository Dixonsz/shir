import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from './hooks';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
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
    rol_ids: [],
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
        rol_ids: Array.isArray(member.role_ids)
          ? member.role_ids.map((value) => String(value))
          : (member.rol_id || member.rol_md)
            ? [String(member.rol_id || member.rol_md)]
            : [],
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

  const handleToggleRole = (roleId) => {
    const roleIdStr = String(roleId);

    setFormData((prev) => {
      const alreadySelected = prev.rol_ids.includes(roleIdStr);
      const nextRoleIds = alreadySelected
        ? prev.rol_ids.filter((idValue) => idValue !== roleIdStr)
        : [...prev.rol_ids, roleIdStr];

      return {
        ...prev,
        rol_ids: nextRoleIds,
        rol_id: nextRoleIds[0] || '',
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Array.isArray(formData.rol_ids) || formData.rol_ids.length === 0) {
      showToast.error('Debes seleccionar al menos un rol.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      membership_start_date: formData.membership_start_date || new Date().toISOString().split('T')[0],
      rol_id: formData.rol_id ? Number(formData.rol_id) : null,
      rol_ids: Array.isArray(formData.rol_ids)
        ? formData.rol_ids.map((value) => Number(value)).filter((value) => !Number.isNaN(value))
        : [],
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

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#e2e8f0', fontSize: '0.875rem' }}>
            Roles <span style={{ color: '#ee2b8c' }}>*</span>
          </label>

          <div style={styles.roleGrid}>
            {(roles || []).map((role) => {
              const roleValue = String(role.id ?? role.md);
              const isSelected = formData.rol_ids.includes(roleValue);

              return (
                <button
                  key={roleValue}
                  type="button"
                  onClick={() => handleToggleRole(roleValue)}
                  style={{
                    ...styles.roleChip,
                    ...(isSelected ? styles.roleChipActive : null),
                  }}
                >
                  {role.name}
                </button>
              );
            })}
          </div>

          <p style={styles.roleHelpText}>
            Selecciona uno o varios roles para el miembro.
          </p>
        </div>

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

const styles = {
  roleGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  roleChip: {
    border: '1px solid rgba(71, 85, 105, 0.6)',
    background: 'rgba(15, 23, 42, 0.45)',
    color: '#cbd5e1',
    borderRadius: '9999px',
    padding: '0.45rem 0.85rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  roleChipActive: {
    background: 'rgba(238, 43, 140, 0.16)',
    color: '#fbcfe8',
    border: '1px solid rgba(238, 43, 140, 0.5)',
  },
  roleHelpText: {
    marginTop: '0.55rem',
    marginBottom: 0,
    color: '#94a3b8',
    fontSize: '0.82rem',
  },
};

export default MemberFormPage;
