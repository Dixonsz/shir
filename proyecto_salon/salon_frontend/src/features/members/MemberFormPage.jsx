import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMembers } from './useMembers';
import Card from '../../components/common/Card';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import Select from '../../components/forms/Select';
import FormButtons from '../../components/forms/FormButtons';
import { showToast } from '../../providers/ToastProvider';
import { ArrowLeft } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id && members.length > 0) {
      const member = members.find((m) => m.id === parseInt(id));
      if (member) {
        setFormData({
          first_name: member.first_name || '',
          last_name: member.last_name || '',
          email: member.email || '',
          phone_number: member.phone_number || '',
          membership_start_date: member.membership_start_date ? member.membership_start_date.split('T')[0] : '',
          membership_end_date: member.membership_end_date ? member.membership_end_date.split('T')[0] : '',
          specialty: member.specialty || '',
          is_active: member.is_active ?? true,
          rol_id: member.rol_id || '',
        });
      }
    }
  }, [id, members]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      ...formData,
      membership_start_date: formData.membership_start_date || new Date().toISOString().split('T')[0]
    };

    const result = isEditing
      ? await updateMember(id, dataToSend)
      : await createMember(dataToSend);

    setLoading(false);

    if (result.success) {
      showToast.success(
        isEditing ? 'Miembro actualizado exitosamente' : 'Miembro creado exitosamente'
      );
      navigate('/dashboard/members');
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/members');
  };

  return (
    <div>
      <button onClick={handleCancel} style={styles.backButton}>
        <ArrowLeft size={20} />
        Volver a Miembros
      </button>

      <Card style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>
            {isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
          </h2>

          <div style={styles.formRow}>
            <Input
              id="first_name"
              name="first_name"
              label="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="Nombre"
            />

            <Input
              id="last_name"
              name="last_name"
              label="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="Apellido"
            />
          </div>

          <Input
            id="email"
            name="email"
            label="Correo Electrónico"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="correo@ejemplo.com"
          />

          <Input
            id="phone_number"
            name="phone_number"
            label="Teléfono"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+506 1234-5678"
          />

          <Select
            id="rol_id"
            name="rol_id"
            label="Rol"
            value={formData.rol_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar rol</option>
            {roles && roles.length > 0 ? (
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            ) : (
              <option disabled>No hay roles disponibles</option>
            )}
          </Select>

          <Textarea
            id="specialty"
            name="specialty"
            label="Especialidad"
            value={formData.specialty}
            onChange={handleChange}
            rows={3}
            placeholder="Describe la especialidad..."
          />

          <div style={styles.formRow}>
            <Input
              id="membership_start_date"
              name="membership_start_date"
              label="Fecha de Inicio"
              type="date"
              value={formData.membership_start_date}
              onChange={handleChange}
            />

            <Input
              id="membership_end_date"
              name="membership_end_date"
              label="Fecha de Fin"
              type="date"
              value={formData.membership_end_date}
              onChange={handleChange}
            />
          </div>

          <FormButtons
            onCancel={handleCancel}
            submitText={isEditing ? 'Actualizar' : 'Crear Miembro'}
            loading={loading}
          />
        </form>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: '0.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
};

export default MemberFormPage;
