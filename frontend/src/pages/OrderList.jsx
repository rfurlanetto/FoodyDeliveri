import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import OrderCard from '../components/OrderCard';
import './OrderList.css';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1>Meus Pedidos</h1>
        <button className="btn-primary" onClick={() => navigate('/orders/new')}>
          Novo Pedido
        </button>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum pedido encontrado.</p>
          <button className="btn-primary" onClick={() => navigate('/orders/new')}>
            Criar Primeiro Pedido
          </button>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onClick={() => navigate(`/orders/${order.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;
