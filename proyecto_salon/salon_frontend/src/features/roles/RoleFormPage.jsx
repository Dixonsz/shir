import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoles } from './useRoles';
import Card from '../../components/common/Card';
import Input from '../../components/forms/Input';
import Textarea from '../../components/forms/Textarea';
import FormButtons from '../../components/forms/FormButtons';
import { showToast } from '../../providers/ToastProvider';
import { ArrowLeft } from 'lucide-react';

function RoleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roles, createRole, updateRole } = useRoles();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id && roles.length > 0) {
      const role = roles.find((r) => r.id === parseInt(id));
      if (role) {
        setFormData({
          name: role.name || '',
          description: role.description || '',
        });
      }
    }
  }, [id, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = isEditing
      ? await updateRole(id, formData)
      : await createRole(formData);

    setLoading(false);

    if (result.success) {
      showToast.success(
        isEditing ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente'
      );
      navigate('/dashboard/roles');
    } else {
      showToast.error(result.error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/roles');
  };

  return (
    <div>
      <button onClick={handleCancel} style={styles.backButton}>
        <ArrowLeft size={20} />
        Volver a Roles
      </button>

      <Card style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>
            {isEditing ? 'Editar Rol' : 'Nuevo Rol'}
          </h2>

          <Input
            id="name"
            name="name"
            label="Nombre del Rol"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej: Administrador"
          />

          <Textarea
            id="description"
            name="description"
            label="Descripción"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe las responsabilidades del rol..."
          />

          <FormButtons
            onCancel={handleCancel}
            submitText={isEditing ? 'Actualizar' : 'Crear Rol'}
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
    maxWidth: '600px',
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
};

export default RoleFormPage;
