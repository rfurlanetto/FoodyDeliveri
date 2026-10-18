import './StatusBadge.css';

function StatusBadge({ status }) {
  const statusMap = {
    'RECEBIDO': 'Recebido',
    'EM_PREPARO': 'Em Preparo',
    'SAIU_PARA_ENTREGA': 'Saiu para Entrega',
    'ENTREGUE': 'Entregue',
    'CANCELADO': 'Cancelado'
  };

  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {statusMap[status] || status}
    </span>
  );
}

export default StatusBadge;
