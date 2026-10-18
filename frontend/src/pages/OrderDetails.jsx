import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import './OrderDetails.css';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!order) {
    return <div className="error">Pedido não encontrado</div>;
  }

  const statusSteps = ['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE'];
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'CANCELADO';

  return (
    <div className="order-details-container">
      <button className="btn-back" onClick={() => navigate('/orders')}>
        ← Voltar
      </button>
      
      <div className="order-details-card">
        <div className="order-header">
          <h1>Pedido #{order.id}</h1>
          <StatusBadge status={order.status} />
        </div>

        <div className="order-details-info">
          <div className="order-info-row">
            <strong>Destinatário:</strong>
            <span>{order.customerName}</span>
          </div>
          <div className="order-info-row">
            <strong>Endereço:</strong>
            <span>{order.deliveryAddress}</span>
          </div>
          <div className="order-info-row">
            <strong>Criado em:</strong>
            <span>{new Date(order.createdAt).toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {!isCancelled && (
          <div className="status-timeline">
            <h3>Status do Pedido</h3>
            <div className="timeline">
              {statusSteps.map((step, index) => (
                <div
                  key={step}
                  className={`timeline-step ${index <= currentStepIndex ? 'active' : ''}`}
                >
                  <div className="step-dot"></div>
                  <div className="step-label">{formatStatus(step)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-items">
          <h3>Itens</h3>
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <span className="item-name">{item.productName}</span>
              <span className="item-quantity">x{item.quantity}</span>
              <span className="item-price">R$ {item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <strong>Total:</strong>
            <span>R$ {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatStatus(status) {
  const statusMap = {
    'RECEBIDO': 'Recebido',
    'EM_PREPARO': 'Em Preparo',
    'SAIU_PARA_ENTREGA': 'Saiu para Entrega',
    'ENTREGUE': 'Entregue',
    'CANCELADO': 'Cancelado'
  };
  return statusMap[status] || status;
}

export default OrderDetails;
