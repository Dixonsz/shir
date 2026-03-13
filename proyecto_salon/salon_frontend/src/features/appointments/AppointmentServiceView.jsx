import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ArrowLeft, User, Calendar, DollarSign, Plus, Trash2, Package, X, Check, Sparkles } from 'lucide-react';
import { appointmentsApi } from './appointments.api';
import { servicesApi } from '../services/services.api';
import { productsApi } from '../products/products.api';
import { showToast } from '../../providers/ToastProvider';

function AppointmentServiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedServicePrice, setSelectedServicePrice] = useState('');
  
  const [productSelectors, setProductSelectors] = useState({});
  
  const [additionalForm, setAdditionalForm] = useState([]);
  
  useEffect(() => {
    loadData();
  }, [id]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, services, products] = await Promise.all([
        appointmentsApi.getSummary(id),
        servicesApi.getAll(false),
        productsApi.getAll()
      ]);
      
      setSummary(summaryData);
      setAvailableServices(services);
      setAvailableProducts(products);
      
      if (summaryData.status === 'scheduled') {
        try {
          await appointmentsApi.update(id, { status: 'in_progress' });
          const updatedSummary = await appointmentsApi.getSummary(id);
          setSummary(updatedSummary);
        } catch (error) {
          console.error('Error actualizando estado de cita:', error);
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      showToast.error('Error al cargar la información de la cita');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddService = async () => {
    if (!selectedServiceId) {
      showToast.error('Selecciona un servicio');
      return;
    }
    
    try {
      const serviceData = {
        service_id: parseInt(selectedServiceId),
        price_applied: selectedServicePrice ? parseFloat(selectedServicePrice) : undefined
      };
      
      await appointmentsApi.addService(id, serviceData);
      showToast.success('Servicio agregado correctamente');
      
      setSelectedServiceId('');
      setSelectedServicePrice('');
      loadData();
    } catch (error) {
      console.error('Error agregando servicio:', error);
      showToast.error(error.response?.data?.message || 'Error al agregar servicio');
    }
  };
  
  const handleUpdateServicePrice = async (serviceId, newPrice) => {
    try {
      await appointmentsApi.updateService(id, serviceId, {
        price_applied: parseFloat(newPrice)
      });
      showToast.success('Precio actualizado');
      loadData();
    } catch (error) {
      console.error('Error actualizando precio:', error);
      showToast.error('Error al actualizar precio');
    }
  };
  
  const handleRemoveService = async (appointmentServiceId, serviceName) => {
    if (!confirm(`Eliminar el servicio "${serviceName}"?`)) return;
    
    try {
      await appointmentsApi.removeService(id, appointmentServiceId);
      showToast.success('Servicio eliminado correctamente');
      loadData();
    } catch (error) {
      console.error('Error eliminando servicio:', error);
      showToast.error('Error al eliminar servicio');
    }
  };
  
  const handleAddProduct = async (appointmentServiceId) => {
    const selector = productSelectors[appointmentServiceId];
    if (!selector || !selector.product_id) {
      showToast.error('Selecciona un producto');
      return;
    }
    
    const quantity = parseInt(selector.quantity);
    if (isNaN(quantity) || quantity < 1) {
      showToast.error('La cantidad debe ser un número válido mayor a 0');
      return;
    }
    
    try {
      await appointmentsApi.addProductToService(
        id,
        appointmentServiceId,
        {
          product_id: parseInt(selector.product_id),
          quantity_product: quantity
        }
      );
      showToast.success('Producto agregado correctamente');
      
      setProductSelectors(prev => ({
        ...prev,
        [appointmentServiceId]: { product_id: '', quantity: '1' }
      }));
      
      loadData();
    } catch (error) {
      console.error('Error agregando producto:', error);
      showToast.error(error.response?.data?.message || 'Error al agregar producto');
    }
  };
  
  const updateProductSelector = (serviceId, field, value) => {
    setProductSelectors(prev => ({
      ...prev,
      [serviceId]: {
        product_id: prev[serviceId]?.product_id || '',
        quantity: prev[serviceId]?.quantity || 1,
        [field]: value
      }
    }));
  };
  
  const handleRemoveProduct = async (appointmentServiceId, serviceProductId, productName) => {
    if (!confirm(`Eliminar el producto "${productName}"?`)) return;
    
    try {
      await appointmentsApi.removeProductFromService(id, appointmentServiceId, serviceProductId);
      showToast.success('Producto eliminado correctamente');
      loadData();
    } catch (error) {
      console.error('Error elimin ando producto:', error);
      showToast.error('Error al eliminar producto');
    }
  };
  
  const addAdditionalRow = () => {
    setAdditionalForm([...additionalForm, { tempId: Date.now(), concept: '', price: '' }]);
  };
  
  const updateAdditionalRow = (tempId, field, value) => {
    setAdditionalForm(prev => 
      prev.map(a => a.tempId === tempId ? { ...a, [field]: value } : a)
    );
  };
  
  const removeAdditionalRow = (tempId) => {
    setAdditionalForm(prev => prev.filter(a => a.tempId !== tempId));
  };
  
  const handleSaveAdditional = async (tempId) => {
    const additional = additionalForm.find(a => a.tempId === tempId);
    
    if (!additional || !additional.concept || !additional.price) {
      showToast.error('Completa todos los campos del adicional');
      return;
    }
    
    try {
      await appointmentsApi.addAdditional(id, {
        concept: additional.concept,
        price: parseFloat(additional.price)
      });
      showToast.success('Adicional agregado correctamente');
      
      removeAdditionalRow(tempId);
      loadData();
    } catch (error) {
      console.error('Error agregando adicional:', error);
      showToast.error('Error al agregar adicional');
    }
  };
  
  const handleRemoveAdditional = async (additionalId, concept) => {
    if (!confirm(`Eliminar el adicional "${concept}"?`)) return;
    
    try {
      await appointmentsApi.removeAdditional(id, additionalId);
      showToast.success('Adicional eliminado correctamente');
      loadData();
    } catch (error) {
      console.error('Error eliminando adicional:', error);
      showToast.error('Error al eliminar adicional');
    }
  };
  
  const handleCompleteAppointment = async () => {
    if (!confirm('Marcar esta cita como completada?')) return;
    
    try {
      await appointmentsApi.update(id, { status: 'completed' });
      showToast.success('Cita completada correctamente');
      navigate('/appointments');
    } catch (error) {
      console.error('Error completando cita:', error);
      showToast.error('Error al completar la cita');
    }
  };
  
  const formatCurrency = (amount) => {
    return `₡${parseFloat(amount || 0).toFixed(2)}`;
 };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getServicePrice = (serviceId) => {
    const service = availableServices.find(s => s.id === parseInt(serviceId));
    return service?.price || 0;
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando...</div>
      </div>
    );
  }
  
  if (!summary) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.errorText}>No se encontró la cita</div>
      </div>
    );
  }
  
  const isCompleted = summary.status === 'completed';
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Button variant="secondary" onClick={() => navigate('/appointments')}>
            <ArrowLeft size={20} />
            Volver
          </Button>
          <h1 style={styles.pageTitle}>Atención de Cita</h1>
        </div>
        {!isCompleted && (
          <Button onClick={handleCompleteAppointment} variant="success">
            <Check size={20} />
            Completar Cita
          </Button>
        )}
      </div>
      
      {/* Alerta cuando la cita está completada */}
      {isCompleted && (
        <div style={styles.completedAlert}>
          <Check size={20} />
          <div>
            <p style={styles.completedTitle}>Cita Completada</p>
            <p style={styles.completedText}>Esta cita ha sido completada. No se pueden agregar o modificar servicios ni adicionales.</p>
          </div>
        </div>
      )}
      
      {/* Información de la Cita */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}>
              <User size={24} />
            </div>
            <div>
              <p style={styles.infoLabel}>Cliente</p>
              <p style={styles.infoValue}>{summary.client?.name}</p>
              <p style={styles.infoSecondary}>Tel: {summary.client?.phone}</p>
            </div>
          </div>
          
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}>
              <Calendar size={24} />
            </div>
            <div>
              <p style={styles.infoLabel}>Fecha y Hora</p>
              <p style={styles.infoValue}>{formatDate(summary.scheduled_date)}</p>
            </div>
          </div>
          
          <div style={styles.infoItem}>
            <div style={styles.infoIcon}>
              <User size={24} />
            </div>
            <div>
              <p style={styles.infoLabel}>Estilista</p>
              <p style={styles.infoValue}>{summary.member?.name}</p>
            </div>
          </div>
        </div>
      </Card>
      
      <div style={styles.mainGrid}>
        {/* Servicios y Productos */}
        <div style={styles.mainContent}>
          {/* SERVICIOS */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <h2 style={styles.sectionTitle}>Servicios</h2>
            
            {/* Selector para agregar servicio */}
            {!isCompleted && (
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
                        {service.name} - {formatCurrency(service.price)}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={selectedServicePrice}
                    onChange={(e) => setSelectedServicePrice(e.target.value)}
                    placeholder={selectedServiceId ? `${formatCurrency(getServicePrice(selectedServiceId))}` : 'Precio'}
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
            )}
            
            {/* Lista de servicios agregados */}
            {summary.services && summary.services.length > 0 ? (
              <div style={styles.itemsList}>
                {summary.services.map((service, index) => {
                  const selector = productSelectors[service.id] || { product_id: '', quantity: '1' };
                  
                  return (
                    <div key={service.id} style={styles.serviceCard}>
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
                            onChange={(e) => handleUpdateServicePrice(service.id, e.target.value)}
                            style={styles.priceInput}
                            disabled={isCompleted}
                          />
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveService(service.id, service.service_name)}
                            disabled={isCompleted}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Productos del servicio */}
                      <div style={styles.productsSection}>
                        <div style={styles.productsHeader}>
                          <label style={styles.labelSmall}>
                            <Package size={14} />
                            Productos Utilizados
                          </label>
                        </div>

                        {/* Selector para agregar producto */}
                        {!isCompleted && (
                          <div style={styles.productAddRow}>
                            <select
                              value={selector.product_id}
                              onChange={(e) => updateProductSelector(service.id, 'product_id', e.target.value)}
                              style={styles.selectSmall}
                            >
                              <option value="">Seleccione un producto</option>
                              {availableProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>

                            <input
                              type="number"
                              min="1"
                              value={selector.quantity}
                              onChange={(e) => updateProductSelector(service.id, 'quantity', e.target.value)}
                              style={styles.inputSmall}
                              placeholder="Cant."
                            />

                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAddProduct(service.id)}
                              disabled={!selector.product_id}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        )}

                        {/* Lista de productos agregados */}
                        {service.products && service.products.length > 0 ? (
                          <div style={styles.productsList}>
                            {service.products.map((product) => (
                              <div key={product.id} style={styles.productItem}>
                                <span style={styles.productName}>
                                  {product.product_name} <span style={styles.productQuantity}>x{product.quantity_product}</span>
                                </span>
                                {!isCompleted && (
                                  <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveProduct(service.id, product.id, product.product_name)}
                                  >
                                    <X size={14} />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={styles.emptyText}>No hay productos agregados</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>No hay servicios agregados</p>
              </div>
            )}
          </Card>
          
          {/* ADICIONALES */}
          <Card>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <Sparkles size={20} style={{ marginRight: '8px' }} />
                Adicionales
              </h2>
              {!isCompleted && (
                <Button type="button" onClick={addAdditionalRow} size="sm" variant="secondary">
                  <Plus size={16} />
                  Agregar
                </Button>
              )}
            </div>
            
            {/* Lista de adicionales guardados */}
            {summary.additionals && summary.additionals.length > 0 && (
              <div style={{ ...styles.itemsList, marginBottom: additionalForm.length > 0 ? '1rem' : 0 }}>
                {summary.additionals.map((additional) => (
                  <div key={additional.id} style={styles.additionalCard}>
                    <div style={styles.additionalInfo}>
                      <span style={styles.additionalConcept}>{additional.concept}</span>
                      <span style={styles.additionalPrice}>{formatCurrency(additional.price)}</span>
                    </div>
                    {!isCompleted && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveAdditional(additional.id, additional.concept)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Formularios de adicionales en edición */}
            {additionalForm.length > 0 && (
              <div style={styles.itemsList}>
                {additionalForm.map((additional) => (
                  <div key={additional.tempId} style={styles.additionalForm}>
                    <input
                      type="text"
                      value={additional.concept}
                      onChange={(e) => updateAdditionalRow(additional.tempId, 'concept', e.target.value)}
                      placeholder="Concepto del adicional"
                      style={{ ...styles.input, flex: 2 }}
                    />

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={additional.price}
                      onChange={(e) => updateAdditionalRow(additional.tempId, 'price', e.target.value)}
                      placeholder="Precio"
                      style={{ ...styles.input, flex: 1 }}
                    />

                    <Button
                      type="button"
                      onClick={() => handleSaveAdditional(additional.tempId)}
                      size="sm"
                    >
                      <Check size={16} />
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeAdditionalRow(additional.tempId)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {summary.additionals?.length === 0 && additionalForm.length === 0 && (
              <div style={styles.emptyState}>
                <p>No hay adicionales agregados</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Resumen y Totales */}
        <div style={styles.sidebar}>
          <Card style={styles.summaryCard}>
            <h2 style={styles.summaryTitle}>Resumen de Cobro</h2>
            
            <div style={styles.summaryContent}>
              <div style={styles.summaryRow}>
                <span>Servicios:</span>
                <span style={styles.summaryAmount}>
                  {formatCurrency(summary.totals?.services_total || 0)}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span>Productos:</span>
                <span style={styles.summaryAmount}>
                  {formatCurrency(summary.totals?.products_total || 0)}
                </span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>Adicionales:</span>
                <span style={styles.summaryAmount}>
                  {formatCurrency(summary.totals?.additionals_total || 0)}
                </span>
              </div>
              
              <div style={styles.divider}></div>
              
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>
                  TOTAL:
                </span>
                <span style={styles.totalValue}>
                  {formatCurrency(summary.totals?.grand_total || 0)}
                </span>
              </div>
            </div>
            
            <div style={styles.statusSection}>
              <p style={styles.statusLabel}>Estado de la cita:</p>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: isCompleted ? '#10b981' : summary.status === 'in_progress' ? '#3b82f6' : '#f59e0b'
              }}>
                {isCompleted ? ' Completada' :
                 summary.status === 'in_progress' ? ' En Progreso' :
                 ' Programada'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  loadingText: {
    fontSize: '1.125rem',
    color: '#6b7280',
  },
  errorText: {
    fontSize: '1.125rem',
    color: '#ef4444',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  completedAlert: {
    backgroundColor: '#dbeafe',
    border: '1px solid #93c5fd',
    color: '#1e40af',
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  completedTitle: {
    fontWeight: '600',
    margin: 0,
  },
  completedText: {
    fontSize: '0.875rem',
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  infoIcon: {
    padding: '0.75rem',
    backgroundColor: '#e0e7ff',
    borderRadius: '0.5rem',
    color: '#4f46e5',
  },
  infoLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  infoValue: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '1rem',
    margin: '0.25rem 0 0 0',
  },
  infoSecondary: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    margin: '0.25rem 0 0 0',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '1.5rem',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebar: {
    position: 'sticky',
    top: '1rem',
    height: 'fit-content',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
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
  addSection: {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '2px dashed #dee2e6',
  },
  addRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  select: {
    padding: '0.6rem',
    fontSize: '0.95rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  selectSmall: {
    padding: '0.4rem',
    fontSize: '0.85rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    flex: 2,
  },
  input: {
    padding: '0.6rem',
    fontSize: '0.95rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
  },
  inputSmall: {
    padding: '0.4rem',
    fontSize: '0.85rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '70px',
    textAlign: 'center',
  },
  priceInput: {
    padding: '0.4rem 0.6rem',
    fontSize: '0.9rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100px',
    textAlign: 'right',
    fontWeight: '600',
    color: '#10b981',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#9ca3af',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  emptyText: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '0.5rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  serviceCard: {
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: 'white',
  },
  serviceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
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
    color: '#1f2937',
  },
  serviceActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  productsSection: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
  },
  productsHeader: {
    marginBottom: '0.75rem',
  },
  labelSmall: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
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
    borderTop: '1px solid #e5e7eb',
  },
  productItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e5e7eb',
  },
  productName: {
    fontSize: '0.9rem',
    color: '#374151',
    fontWeight: '500',
  },
  productQuantity: {
    color: '#9ca3af',
    fontWeight: 'normal',
  },
  additionalCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  additionalInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  additionalConcept: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  additionalPrice: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: '#10b981',
  },
  additionalForm: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#fff7ed',
    borderRadius: '6px',
    border: '2px dashed #fb923c',
  },
  summaryCard: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
    border: '2px solid #10b981',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: 'white',
    borderRadius: '6px',
    fontSize: '1rem',
    color: '#374151',
  },
  summaryAmount: {
    fontWeight: '700',
    color: '#1f2937',
  },
  divider: {
    height: '2px',
    backgroundColor: '#e5e7eb',
    margin: '0.5rem 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '8px',
  },
  totalLabel: {
    fontSize: '1.125rem',
    fontWeight: '700',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  totalValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'white',
  },
  statusSection: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '2px solid #e5e7eb',
  },
  statusLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  statusBadge: {
    textAlign: 'center',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    color: 'white',
  },
};

export default AppointmentServiceView;
