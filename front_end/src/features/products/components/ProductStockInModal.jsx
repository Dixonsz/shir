import { useEffect, useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

function ProductStockInModal({ isOpen, product, loading, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    quantity: '',
    purchase_price: '',
    notes: '',
    update_sale_price: false,
    new_sale_price: '',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        quantity: '',
        purchase_price: '',
        notes: '',
        update_sale_price: false,
        new_sale_price: '',
      });
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      quantity: Number(formData.quantity),
      purchase_price: formData.purchase_price === '' ? undefined : Number(formData.purchase_price),
      notes: formData.notes?.trim() || undefined,
      update_sale_price: Boolean(formData.update_sale_price),
      new_sale_price: formData.new_sale_price === '' ? undefined : Number(formData.new_sale_price),
    };

    await onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? `Ingresar stock: ${product.name}` : 'Ingresar stock'}
      maxWidth="640px"
    >
      <form onSubmit={handleSubmit} className="product-stock-in-form">
        <div className="product-stock-in-grid">
          <label className="product-stock-in-label" htmlFor="quantity">
            Cantidad a ingresar *
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={handleChange}
              className="product-stock-in-input"
              placeholder="Ej: 12"
            />
          </label>

          <label className="product-stock-in-label" htmlFor="purchase_price">
            Precio de compra
            <input
              id="purchase_price"
              name="purchase_price"
              type="number"
              min="0"
              step="0.01"
              value={formData.purchase_price}
              onChange={handleChange}
              className="product-stock-in-input"
              placeholder="Ej: 2500.00"
            />
          </label>
        </div>

        <label className="product-stock-in-label" htmlFor="notes">
          Nota
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="product-stock-in-textarea"
            placeholder="Proveedor, lote, factura, etc."
          />
        </label>

        <label className="product-stock-in-checkbox" htmlFor="update_sale_price">
          <input
            id="update_sale_price"
            name="update_sale_price"
            type="checkbox"
            checked={formData.update_sale_price}
            onChange={handleChange}
          />
          <span>Actualizar precio de venta en este ingreso</span>
        </label>

        {formData.update_sale_price ? (
          <label className="product-stock-in-label" htmlFor="new_sale_price">
            Nuevo precio de venta *
            <input
              id="new_sale_price"
              name="new_sale_price"
              type="number"
              min="0"
              step="0.01"
              required
              value={formData.new_sale_price}
              onChange={handleChange}
              className="product-stock-in-input"
              placeholder="Ej: 3990.00"
            />
          </label>
        ) : null}

        <div className="product-stock-in-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar ingreso'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProductStockInModal;