import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateOrder.css';

function CreateOrder() {
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [items, setItems] = useState([{ productName: '', quantity: 1, price: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const addItem = () => {
    setItems([...items, { productName: '', quantity: 1, price: '' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const orderData = {
      customerName,
      deliveryAddress,
      items: items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price)
      }))
    };

    try {
      await api.post('/orders', orderData);
      navigate('/orders');
    } catch (error) {
      setError(error.response?.data || 'Erro ao criar pedido');
    }
  };

  return (
    <div className="create-order-container">
      <div className="create-order-card">
        <h1>Criar Pedido</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Destinatário:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Endereço de Entrega:</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
            />
          </div>
          
          <div className="items-section">
            <h3>Itens do Pedido</h3>
            {items.map((item, index) => (
              <div key={index} className="item-row">
                <input
                  type="text"
                  placeholder="Nome do produto"
                  value={item.productName}
                  onChange={(e) => updateItem(index, 'productName', e.target.value)}
                  required
                  className="item-name"
                />
                <input
                  type="number"
                  placeholder="Qtd"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  required
                  min="1"
                  className="item-quantity"
                />
                <input
                  type="number"
                  placeholder="Preço"
                  value={item.price}
                  onChange={(e) => updateItem(index, 'price', e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  className="item-price"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} className="btn-add-item">
              + Adicionar Item
            </button>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/orders')} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Confirmar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrder;
