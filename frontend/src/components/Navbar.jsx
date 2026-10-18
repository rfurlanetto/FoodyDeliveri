import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/orders')}>
          🚚 Rastreador de Pedidos
        </div>
        {isAuthenticated && (
          <div className="navbar-menu">
            <button onClick={() => navigate('/orders')} className="nav-link">
              Meus Pedidos
            </button>
            <button onClick={() => navigate('/orders/new')} className="nav-link">
              Novo Pedido
            </button>
            <button onClick={handleLogout} className="nav-link logout">
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
