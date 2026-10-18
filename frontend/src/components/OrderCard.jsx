import StatusBadge from './StatusBadge';
import './OrderCard.css';

function OrderCard({ order, onClick }) {
  const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-card-header">
        <span className="order-id">Pedido #{order.id}</span>
        <StatusBadge status={order.status} />
      </div>
      <div className="order-card-body">
        <div className="order-info">
          <strong>Destinatário:</strong>
          <span>{order.customerName}</span>
        </div>
        <div className="order-info">
          <strong>Endereço:</strong>
          <span>{order.deliveryAddress}</span>
        </div>
        <div className="order-info">
          <strong>Itens:</strong>
          <span>{order.items.length} item(s)</span>
        </div>
      </div>
      <div className="order-card-footer">
        <span className="order-date">
          {new Date(order.createdAt).toLocaleDateString('pt-BR')}
        </span>
        <span className="order-total">R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderCard;
