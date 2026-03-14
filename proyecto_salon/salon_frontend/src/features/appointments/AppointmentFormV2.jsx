import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/forms/Input';
import FormButtons from '../../components/forms/FormButtons';
import { ArrowLeft, Plus, Trash2, X, DollarSign, Package, Sparkles } from 'lucide-react';
import { clientsApi } from '../clients/api';
import { servicesApi } from '../services/api';
import { productsApi } from '../products/api';
import { showToast } from '../../providers/ToastProvider';

function AppointmentFormV2({ appointment, clients, members, appointments, onSubmit, onCancel, onClientCreated, initialDate }) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatCurrency = (amount) => {
    return `₡${parseFloat(amount || 0).toFixed(2)}`;
  };

  const [formData, setFormData] = useState({
    client_id: '',
    member_id: '',
    scheduled_date: initialDate ? formatDateForInput(initialDate) : '',
    status: 'scheduled',
    is_active: true,
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  
  const [appointmentServices, setAppointmentServices] = useState([]);
  
  const [appointmentProducts, setAppointmentProducts] = useState([]);
  
  const [appointmentAdditionals, setAppointmentAdditionals] = useState([]);

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedServicePrice, setSelectedServicePrice] = useState('');
  
  const [productSelectors, setProductSelectors] = useState({});

  const [showClientModal, setShowClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    number_id: '',
    name: '',
    email: '',
    phone_number: '',
  });

  useEffect(() => {
    loadAvailableData();
  }, []);

  useEffect(() => {
    if (appointment) {
      setFormData({
        client_id: appointment.client_id || '',
        member_id: appointment.member_id || '',
        scheduled_date: formatDateForInput(appointment.scheduled_date),
        status: appointment.status || 'scheduled',
        is_active: appointment.is_active ?? true,
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        scheduled_date: formatDateForInput(initialDate)
      }));
    }
  }, [appointment, initialDate]);

  const loadAvailableData = async () => {
    try {
      const [services, products] = await Promise.all([
        servicesApi.getAll(false),
        productsApi.getAll()
      ]);
      setAvailableServices(services);
      setAvailableProducts(products);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast.error('Error al cargar servicios y productos');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const checkMemberAvailability = (memberId, scheduledDate, currentAppointmentId = null) => {
    if (!memberId || !scheduledDate || !appointments) return true;
    
    const newStart = new Date(scheduledDate);
    const newEnd = new Date(newStart.getTime() + 60 * 60 * 1000);
    
    const conflicts = appointments.filter(apt => {
      if (currentAppointmentId && apt.id === currentAppointmentId) return false;
      if (apt.member_id !== parseInt(memberId)) return false;
      if (apt.status === 'cancelled' || !apt.is_active) return false;
      
      const aptStart = new Date(apt.scheduled_date);
      const aptEnd = new Date(aptStart.getTime() + 60 * 60 * 1000);
      
      return (newStart < aptEnd && newEnd > aptStart);
    });
    
    return conflicts.length === 0 ? true : conflicts[0];
  };

  
  const handleAddService = () => {
    if (!selectedServiceId) {
      showToast.error('Selecciona un servicio');
      return;
    }

    const exists = appointmentServices.find(s => s.service_id === parseInt(selectedServiceId));
    if (exists) {
      showToast.error('Este servicio ya fue agregado');
      return;
    }

    const service = availableServices.find(s => s.id === parseInt(selectedServiceId));
    const price = selectedServicePrice || service?.price || 0;

    const newService = {
      tempId: Date.now(),
      service_id: parseInt(selectedServiceId),
      service_name: service?.name || '',
      price_applied: price,
    };

    setAppointmentServices([...appointmentServices, newService]);
    setSelectedServiceId('');
    setSelectedServicePrice('');
    showToast.success('Servicio agregado');
  };

  const updateServicePrice = (tempId, price) => {
    setAppointmentServices(prev => 
      prev.map(s => s.tempId === tempId ? { ...s, price_applied: price } : s)
    );
  };

  const removeService = (tempId) => {
    setAppointmentServices(prev => prev.filter(s => s.tempId !== tempId));
    setAppointmentProducts(prev => prev.filter(p => p.serviceTempId !== tempId));
    setProductSelectors(prev => {
      const newSelectors = { ...prev };
      delete newSelectors[tempId];
      return newSelectors;
    });
  };

  const getServicePrice = (serviceId) => {
    const service = availableServices.find(s => s.id === parseInt(serviceId));
    return service?.price || 0;
  };

  
  const handleAddProduct = (serviceTempId) => {
    const selector = productSelectors[serviceTempId];
    if (!selector || !selector.product_id) {
      showToast.error('Selecciona un producto');
      return;
    }

    const exists = appointmentProducts.find(
      p => p.serviceTempId === serviceTempId && p.product_id === parseInt(selector.product_id)
    );
    if (exists) {
      showToast.error('Este producto ya fue agregado a este servicio');
      return;
    }

    const product = availableProducts.find(p => p.id === parseInt(selector.product_id));

    const newProduct = {
      tempId: Date.now(),
      serviceTempId,
      product_id: parseInt(selector.product_id),
      product_name: product?.name || '',
      product_price: product?.price || 0,
      quantity_product: parseInt(selector.quantity) || 1,
    };

    setAppointmentProducts([...appointmentProducts, newProduct]);
    
    setProductSelectors(prev => ({
      ...prev,
      [serviceTempId]: { product_id: '', quantity: 1 }
    }));

    showToast.success('Producto agregado');
  };

  const updateProductQuantity = (tempId, quantity) => {
    setAppointmentProducts(prev => 
      prev.map(p => p.tempId === tempId ? { ...p, quantity_product: parseInt(quantity) || 1 } : p)
    );
  };

  const removeProduct = (tempId) => {
    setAppointmentProducts(prev => prev.filter(p => p.tempId !== tempId));
  };

  const getProductsByService = (serviceTempId) => {
    return appointmentProducts.filter(p => p.serviceTempId === serviceTempId);
  };

  const updateProductSelector = (serviceTempId, field, value) => {
    setProductSelectors(prev => ({
      ...prev,
      [serviceTempId]: {
        ...prev[serviceTempId],
        [field]: value
      }
    }));
  };

  
  const addAdditional = () => {
    const newAdditional = {
      tempId: Date.now(),
      concept: '',
      price: '',
    };
    setAppointmentAdditionals([...appointmentAdditionals, newAdditional]);
  };

  const updateAdditional = (tempId, field, value) => {
    setAppointmentAdditionals(prev => 
      prev.map(a => a.tempId === tempId ? { ...a, [field]: value } : a)
    );
  };

  const removeAdditional = (tempId) => {
    setAppointmentAdditionals(prev => prev.filter(a => a.tempId !== tempId));
  };

  
  const calculateTotal = () => {
    let total = 0;
    
    appointmentServices.forEach(service => {
      total += parseFloat(service.price_applied) || 0;
    });
    
    appointmentProducts.forEach(product => {
      const price = product.product_price || 0;
      const quantity = parseInt(product.quantity_product) || 0;
      total += price * quantity;
    });
    
    appointmentAdditionals.forEach(additional => {
      total += parseFloat(additional.price) || 0;
    });
    
    return total;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.scheduled_date) {
      const selectedDate = new Date(formData.scheduled_date);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      
      const minTime = 9 * 60;
      const maxTime = 18 * 60 + 30;
      
      if (timeInMinutes < minTime || timeInMinutes > maxTime) {
        showToast.error('La hora de la cita debe estar entre las 9:00 AM y las 6:30 PM');
        return;
      }
      
      const availability = checkMemberAvailability(
        formData.member_id,
        formData.scheduled_date,
        appointment?.id
      );
      
      if (availability !== true) {
        const conflictDate = new Date(availability.scheduled_date);
        const timeStr = conflictDate.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        });
        const dateStr = conflictDate.toLocaleDateString('es-ES');
        
        const member = members.find(m => m.id === parseInt(formData.member_id));
        const memberName = member ? `${member.first_name} ${member.last_name}` : 'Este miembro';
        
        showToast.error(
          `${memberName} ya tiene una cita programada el ${dateStr} a las ${timeStr}. Por favor seleccione otro horario.`
        );
        return;
      }
    }

    if (appointmentServices.length === 0) {
      showToast.error('Debes agregar al menos un servicio');
      return;
    }

    const validAdditionals = appointmentAdditionals.filter(a => a.concept && a.price);
    for (const additional of validAdditionals) {
      if (parseFloat(additional.price) <= 0) {
        showToast.error('Los precios de adicionales deben ser mayores a 0');
        return;
      }
    }

    const submitData = {
      ...formData,
      scheduled_date: formData.scheduled_date ? new Date(formData.scheduled_date).toISOString() : null,
      services: appointmentServices.map(s => ({
        service_id: s.service_id,
        price_applied: parseFloat(s.price_applied),
      })),
      products: appointmentProducts.map(p => ({
        product_id: p.product_id,
        quantity_product: p.quantity_product,
        service_index: appointmentServices.findIndex(s => s.tempId === p.serviceTempId),
      })),
      additionals: validAdditionals.map(a => ({
        concept: a.concept,
        price: parseFloat(a.price),
      })),
    };
    
    onSubmit(submitData);
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const newClientData = await clientsApi.create(newClient);
      showToast.success('Cliente creado exitosamente');
      setShowClientModal(false);
      setNewClient({ number_id: '', name: '', email: '', phone_number: '' });
      if (onClientCreated) {
        onClientCreated();
      }
      setFormData(prev => ({
        ...prev,
        client_id: newClientData.id
      }));
    } catch (error) {
      showToast.error('Error al crear cliente');
      console.error('Error creating client:', error);
    }
  };

  const total = calculateTotal();

  return (
    <div>
      <div style={styles.header}>
        <Button onClick={onCancel} variant="secondary">
          <ArrowLeft size={20} />
          Volver
        </Button>
        <h1 style={styles.title}>
          {appointment ? 'Editar Cita' : 'Nueva Cita'}
        </h1>
        <div style={{ width: '100px' }}></div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card style={{ marginBottom: '1.5rem' }}>
          <h2 style={styles.sectionTitle}>Información de la Cita</h2>
          
          <div style={styles.row}>
            <div style={styles.selectContainer}>
              <label style={styles.label}>Cliente *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  required
                  style={{ ...styles.select, flex: 1 }}
                >
                  <option value="">Seleccione un cliente</option>
                  {clients && clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowClientModal(true)}
                  title="Crear nuevo cliente"
                  style={{ padding: '8px 12px' }}
                >
                  <Plus size={20} />
                </Button>
              </div>
            </div>

            <div style={styles.selectContainer}>
              <label style={styles.label}>Miembro *</label>
              <select
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="">Seleccione un miembro</option>
                {members && members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <Input
              label="Fecha y Hora de la Cita"
              name="scheduled_date"
              type="datetime-local"
              value={formData.scheduled_date}
              onChange={handleChange}
              required
            />

            <div style={styles.selectContainer}>
              <label style={styles.label}>Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                style={styles.select}
              >
                <option value="scheduled">Programada</option>
                <option value="confirmed">Confirmada</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
                <option value="no-show">No asistió</option>
              </select>
            </div>
          </div>

          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>Activa</span>
            </label>
          </div>
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <h2 style={styles.sectionTitle}>Servicios *</h2>

          <div style={styles.addSection}>
            <div style={styles.addRow}>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                style={{ ...styles.select, flex: 2 }}
              >
                <option value="">Seleccione un servicio</option>
                {availableServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                value={selectedServicePrice}
                onChange={(e) => setSelectedServicePrice(e.target.value)}
                placeholder={selectedServiceId ? `$${getServicePrice(selectedServiceId)}` : 'Precio'}
                style={{ ...styles.input, flex: 1 }}
              />

              <Button
                type="button"
                onClick={handleAddService}
                disabled={!selectedServiceId}
              >
                <Plus size={16} />
                Agregar
              </Button>
            </div>
          </div>

          {appointmentServices.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No hay servicios agregados. Agrega al menos uno para continuar.</p>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {appointmentServices.map((service, index) => {
                const serviceProducts = getProductsByService(service.tempId);
                const selector = productSelectors[service.tempId] || { product_id: '', quantity: 1 };

                return (
                  <div key={service.tempId} style={styles.serviceCard}>
                    <div style={styles.serviceHeader}>
                      <div style={styles.serviceInfo}>
                        <span style={styles.serviceNumber}>#{index + 1}</span>
                        <span style={styles.serviceName}>{service.service_name}</span>
                      </div>
                      <div style={styles.serviceActions}>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={service.price_applied}
                          onChange={(e) => updateServicePrice(service.tempId, e.target.value)}
                          style={styles.priceInput}
                          title="Precio del servicio"
                        />
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeService(service.tempId)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div style={styles.productsSection}>
                      <div style={styles.productsHeader}>
                        <label style={styles.labelSmall}>
                          <Package size={14} />
                          Productos (Opcional)
                        </label>
                      </div>

                      <div style={styles.productAddRow}>
                        <select
                          value={selector.product_id}
                          onChange={(e) => updateProductSelector(service.tempId, 'product_id', e.target.value)}
                          style={styles.selectSmall}
                        >
                          <option value="">Seleccione un producto</option>
                          {availableProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - ${product.price}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={selector.quantity}
                          onChange={(e) => updateProductSelector(service.tempId, 'quantity', e.target.value)}
                          style={styles.inputSmall}
                          placeholder="Cant."
                        />

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddProduct(service.tempId)}
                          disabled={!selector.product_id}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      {serviceProducts.length > 0 && (
                        <div style={styles.productsList}>
                          {serviceProducts.map((product) => (
                            <div key={product.tempId} style={styles.productItem}>
                              <span style={styles.productName}>{product.product_name}</span>
                              <div style={styles.productDetails}>
                                <input
                                  type="number"
                                  min="1"
                                  value={product.quantity_product}
                                  onChange={(e) => updateProductQuantity(product.tempId, e.target.value)}
                                  style={styles.quantityInput}
                                />
                                <span style={styles.productTotal}>
                                  ${(product.product_price * product.quantity_product).toFixed(2)}
                                </span>
                                <Button
                                  type="button"
                                  variant="danger"
                                  size="sm"
                                  onClick={() => removeProduct(product.tempId)}
                                >
                                  <X size={14} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <Sparkles size={20} style={{ marginRight: '8px' }} />
              Adicionales (Opcional)
            </h2>
            <Button type="button" onClick={addAdditional} size="sm" variant="secondary">
              <Plus size={16} />
              Agregar
            </Button>
          </div>

          {appointmentAdditionals.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No hay adicionales agregados.</p>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {appointmentAdditionals.map((additional, index) => (
                <div key={additional.tempId} style={styles.additionalRow}>
                  <span style={styles.additionalNumber}>#{index + 1}</span>
                  
                  <input
                    type="text"
                    value={additional.concept}
                    onChange={(e) => updateAdditional(additional.tempId, 'concept', e.target.value)}
                    placeholder="Concepto del adicional"
                    style={{ ...styles.input, flex: 2 }}
                    required
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={additional.price}
                    onChange={(e) => updateAdditional(additional.tempId, 'price', e.target.value)}
                    placeholder="Precio"
                    style={{ ...styles.input, flex: 1 }}
                    required
                  />

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeAdditional(additional.tempId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card style={{ marginBottom: '1.5rem' }}>
          <h2 style={styles.sectionTitle}>Resumen</h2>
          
          <div style={styles.summaryRow}>
            <span>Servicios:</span>
            <span style={styles.summaryValue}>
              {formatCurrency(appointmentServices.reduce((sum, s) => sum + (parseFloat(s.price_applied) || 0), 0))}
            </span>
          </div>
          
          <div style={styles.summaryRow}>
            <span>Productos:</span>
            <span style={styles.summaryValue}>
              {formatCurrency(appointmentProducts.reduce((sum, p) => sum + (parseFloat(p.price) * parseInt(p.quantity_product)), 0))}
            </span>
          </div>
          
          <div style={styles.summaryRow}>
            <span>Adicionales:</span>
            <span style={styles.summaryValue}>
              {formatCurrency(appointmentAdditionals.filter(a => a.concept && a.price).reduce((sum, a) => sum + parseFloat(a.price), 0))}
            </span>
          </div>
          
          <div style={styles.divider}></div>
          
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>
              TOTAL:
            </span>
            <span style={styles.totalValue}>
              {formatCurrency(total)}
            </span>
          </div>
        </Card>

        <FormButtons
          onCancel={onCancel}
          submitLabel={appointment ? 'Actualizar Cita' : 'Crear Cita'}
        />
      </form>

      <Modal
        isOpen={showClientModal}
        onClose={() => {
          setShowClientModal(false);
          setNewClient({ number_id: '', name: '', email: '', phone_number: '' });
        }}
        title="Nuevo Cliente"
      >
        <form onSubmit={handleCreateClient} style={styles.modalForm}>
          <Input
            label="Numero de Identificacion"
            name="number_id"
            value={newClient.number_id}
            onChange={(e) => setNewClient((prev) => ({ ...prev, number_id: e.target.value }))}
            required
            placeholder="Ej: 1-2345-6789"
          />
          <Input
            label="Nombre Completo"
            name="name"
            value={newClient.name}
            onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Nombre del cliente"
          />
          <Input
            label="Correo Electronico"
            name="email"
            type="email"
            value={newClient.email}
            onChange={(e) => setNewClient((prev) => ({ ...prev, email: e.target.value }))}
            required
            placeholder="correo@ejemplo.com"
          />
          <Input
            label="Telefono"
            name="phone_number"
            value={newClient.phone_number}
            onChange={(e) => setNewClient((prev) => ({ ...prev, phone_number: e.target.value }))}
            placeholder="Ej: 8888-8888"
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowClientModal(false);
                setNewClient({ number_id: '', name: '', email: '', phone_number: '' });
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Cliente</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#e2e8f0',
    margin: 0,
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#cbd5e1',
  },
  labelSmall: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  select: {
    padding: '0.6rem',
    fontSize: '0.95rem',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '6px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
    cursor: 'pointer',
  },
  selectSmall: {
    padding: '0.4rem',
    fontSize: '0.85rem',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '4px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
    cursor: 'pointer',
    flex: 2,
  },
  input: {
    padding: '0.6rem',
    fontSize: '0.95rem',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '6px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
  },
  inputSmall: {
    padding: '0.4rem',
    fontSize: '0.85rem',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '4px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
    width: '70px',
    textAlign: 'center',
  },
  priceInput: {
    padding: '0.4rem 0.6rem',
    fontSize: '0.9rem',
    border: '1px solid rgba(16, 185, 129, 0.55)',
    borderRadius: '4px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    width: '100px',
    textAlign: 'right',
    fontWeight: '600',
    color: '#10b981',
  },
  quantityInput: {
    padding: '0.3rem',
    fontSize: '0.85rem',
    border: '1px solid rgba(71, 85, 105, 0.6)',
    borderRadius: '4px',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    color: '#e2e8f0',
    width: '50px',
    textAlign: 'center',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#e2e8f0',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  addSection: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: '8px',
    border: '2px dashed rgba(71, 85, 105, 0.6)',
  },
  addRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#94a3b8',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: '8px',
    border: '1px solid rgba(71, 85, 105, 0.35)',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  serviceCard: {
    border: '1px solid rgba(71, 85, 105, 0.45)',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(71, 85, 105, 0.4)',
  },
  serviceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  serviceNumber: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#6b7280',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  serviceName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  serviceActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  productsSection: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '6px',
  },
  productsHeader: {
    marginBottom: '0.75rem',
  },
  productAddRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(71, 85, 105, 0.4)',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '4px',
    border: '1px solid rgba(71, 85, 105, 0.45)',
  },
  productName: {
    fontSize: '0.9rem',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  productDetails: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  productTotal: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#10b981',
    minWidth: '70px',
    textAlign: 'right',
  },
  additionalRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '6px',
    border: '1px solid rgba(71, 85, 105, 0.4)',
  },
  additionalNumber: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#475569',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    minWidth: '35px',
    textAlign: 'center',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    fontSize: '1rem',
    color: '#cbd5e1',
  },
  summaryValue: {
    fontWeight: '700',
    color: '#e2e8f0',
  },
  divider: {
    height: '2px',
    backgroundColor: 'rgba(71, 85, 105, 0.5)',
    margin: '1rem 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #ee2b8c 0%, #be185d 100%)',
    borderRadius: '8px',
  },
  totalLabel: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  totalValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
};

export default AppointmentFormV2;





