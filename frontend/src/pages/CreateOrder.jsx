import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './CreateOrder.css';

function CreateOrder() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Recipient info (inicializado a partir da sessão do usuário)
  const [customerName, setCustomerName] = useState(() => user?.name || '');

  // ViaCEP address fields
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [cepSuccess, setCepSuccess] = useState(false);

  // Cart & Catalog state
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  // Identifica e disponibiliza dados da sessão para o primeiro pedido
  useEffect(() => {
    if (!customerName && user?.name) {
      setCustomerName(user.name);
    }
  }, [user, customerName]);

  // Se houver endereço salvo da sessão, disponibiliza como sugestão para agilizar
  useEffect(() => {
    const savedAddressStr = localStorage.getItem('lastDeliveryAddress');
    if (savedAddressStr) {
      try {
        const saved = JSON.parse(savedAddressStr);
        if (saved.cep && !cep) {
          setCep(saved.cep);
          setLogradouro(saved.logradouro || '');
          setBairro(saved.bairro || '');
          setCidade(saved.cidade || '');
          setEstado(saved.estado || '');
          setNumero(saved.numero || '');
          setComplemento(saved.complemento || '');
          setCepSuccess(true);
        }
      } catch (e) {
        console.error('Erro ao ler dados da sessão:', e);
      }
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Erro ao buscar catálogo de produtos:', err);
      setError('Falha ao carregar o cardápio de produtos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchAddressByCep = async (cepToFetch) => {
    const cleanCep = cepToFetch.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('O CEP deve conter 8 dígitos.');
      setCepSuccess(false);
      return;
    }

    setLoadingCep(true);
    setCepError('');
    setCepSuccess(false);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError('CEP não encontrado. Verifique o número digitado.');
        setLogradouro('');
        setBairro('');
        setCidade('');
        setEstado('');
        setCepSuccess(false);
      } else {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
        setCepError('');
        setCepSuccess(true);
      }
    } catch (err) {
      console.error('Erro ao consultar ViaCEP:', err);
      setCepError('Erro ao consultar o serviço ViaCEP.');
      setCepSuccess(false);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    let formatted = val;
    if (val.length > 5) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    }
    setCep(formatted);
    setCepError('');
    setCepSuccess(false);

    if (val.length === 8) {
      fetchAddressByCep(val);
    } else {
      setLogradouro('');
      setBairro('');
      setCidade('');
      setEstado('');
    }
  };

  const handleIncrement = (product) => {
    if (!product.stock || product.stock <= 0) return;
    const current = quantities[product.id] || 0;
    if (current < product.stock) {
      setQuantities(prev => ({ ...prev, [product.id]: current + 1 }));
    }
  };

  const handleDecrement = (product) => {
    const current = quantities[product.id] || 0;
    if (current > 0) {
      setQuantities(prev => ({ ...prev, [product.id]: current - 1 }));
    }
  };

  const handleRemove = (productId) => {
    setQuantities(prev => ({ ...prev, [productId]: 0 }));
  };

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedItems = products
    .filter(p => (quantities[p.id] || 0) > 0)
    .map(p => ({
      productId: p.id,
      productName: p.name,
      price: p.price,
      quantity: quantities[p.id],
      subtotal: p.price * quantities[p.id]
    }));

  const totalValue = selectedItems.reduce((acc, item) => acc + item.subtotal, 0);
  const totalUnits = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const isFormValid =
    selectedItems.length > 0 &&
    !submitting &&
    customerName.trim().length > 0 &&
    cep.replace(/\D/g, '').length === 8 &&
    logradouro.trim().length > 0 &&
    cidade.trim().length > 0 &&
    estado.trim().length > 0 &&
    numero.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedItems.length === 0) {
      setError('Selecione pelo menos um produto com quantidade maior que zero.');
      return;
    }

    if (!customerName.trim()) {
      setError('O Nome do Destinatário é obrigatório.');
      return;
    }

    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8 || !logradouro || !cidade || !estado) {
      setError('Informe um CEP válido para que os dados de logradouro, cidade e estado sejam carregados via ViaCEP.');
      return;
    }

    if (!numero.trim()) {
      setError('O campo Número é obrigatório.');
      return;
    }

    const formattedAddress = `${logradouro}, ${numero.trim()}${complemento.trim() ? ` - ${complemento.trim()}` : ''}${bairro ? ` - Bairro ${bairro}` : ''}, ${cidade} - ${estado}, CEP: ${cep}`;

    setSubmitting(true);
    try {
      const orderData = {
        customerName: customerName.trim(),
        deliveryAddress: formattedAddress,
        items: selectedItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await api.post('/orders', orderData);
      localStorage.setItem('lastDeliveryAddress', JSON.stringify({
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        numero: numero.trim(),
        complemento: complemento.trim()
      }));
      navigate('/orders');
    } catch (err) {
      const message = typeof err.response?.data === 'string'
        ? err.response.data
        : err.response?.data?.message || 'Erro ao criar pedido';
      setError(message);
      fetchProducts();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="catalog-order-page">
      <div className="page-header">
        <div className="header-titles">
          <h1>Criar Pedido</h1>
          <p className="subtitle">Selecione os produtos e confirme as informações de entrega</p>
        </div>
        <button type="button" onClick={() => navigate('/orders')} className="btn-back-nav">
          ← Voltar para Pedidos
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button type="button" className="close-banner" onClick={() => setError('')}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Carregando catálogo de produtos...</p>
        </div>
      ) : (
        <div className="order-layout">
          {/* Coluna da Esquerda: Catálogo de Produtos */}
          <section className="catalog-section">
            <div className="catalog-controls">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar produtos pelo nome ou ingrediente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button type="button" className="clear-search" onClick={() => setSearchTerm('')}>✕</button>
                )}
              </div>

              <div className="category-pills">
                {categories.map(cat => {
                  const count = cat === 'Todos'
                    ? products.length
                    : products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat} <span className="pill-count">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="products-counter-bar">
              <span>Mostrando {filteredProducts.length} de {products.length} produtos</span>
              <span className="stock-info-hint">Estoque monitorado em tempo real</span>
            </div>

            <div className="products-grid">
              {filteredProducts.map(product => {
                const qty = quantities[product.id] || 0;
                const isOutOfStock = !product.stock || product.stock <= 0;
                const isMaxReached = qty >= product.stock;

                return (
                  <div
                    key={product.id}
                    className={`product-card ${isOutOfStock ? 'out-of-stock' : ''} ${qty > 0 ? 'selected-card' : ''}`}
                  >
                    <div className="card-top">
                      <span className="category-tag">{product.category}</span>
                      {isOutOfStock ? (
                        <span className="stock-badge badge-empty">Esgotado</span>
                      ) : (
                        <span className="stock-badge badge-available">
                          {product.stock} un. disponíveis
                        </span>
                      )}
                    </div>

                    <h3 className="product-title">{product.name}</h3>
                    {product.description && (
                      <p className="product-desc" title={product.description}>
                        {product.description}
                      </p>
                    )}

                    <div className="card-bottom">
                      <div className="price-tag">
                        <span className="currency">R$</span>
                        <span className="amount">{product.price.toFixed(2).replace('.', ',')}</span>
                      </div>

                      {isOutOfStock ? (
                        <div className="unavailable-notice">
                          <span>Indisponível</span>
                        </div>
                      ) : (
                        <div className="quantity-control">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleDecrement(product)}
                            disabled={qty === 0}
                            title="Diminuir quantidade"
                          >
                            −
                          </button>
                          <span className={`qty-number ${qty > 0 ? 'has-qty' : ''}`}>
                            {qty}
                          </span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => handleIncrement(product)}
                            disabled={isMaxReached}
                            title={isMaxReached ? 'Estoque máximo atingido' : 'Aumentar quantidade'}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Coluna da Direita: Carrinho e Checkout com ViaCEP */}
          <aside className="checkout-sidebar">
            <div className="checkout-card">
              <div className="checkout-header">
                <h2>Resumo do Pedido</h2>
                {totalUnits > 0 && (
                  <span className="items-badge">{totalUnits} {totalUnits === 1 ? 'item' : 'itens'}</span>
                )}
              </div>

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="delivery-fields">
                  <div className="input-group">
                    <div className="label-with-session">
                      <label htmlFor="customerName">
                        Nome do Destinatário <span className="req">*</span>
                      </label>
                      {user?.name && customerName === user.name && (
                        <span className="session-badge" title="Identificado a partir do usuário autenticado nesta sessão">
                          👤 Usuário da sessão
                        </span>
                      )}
                    </div>
                    <input
                      id="customerName"
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Seção Endereço de Entrega ViaCEP */}
                  <div className="address-section-header">
                    <span className="section-title">Endereço de Entrega</span>
                    <span className="viacep-tag">ViaCEP</span>
                  </div>

                  <div className="input-group">
                    <label htmlFor="cep">
                      CEP <span className="req">*</span>
                    </label>
                    <div className="cep-input-wrapper">
                      <input
                        id="cep"
                        type="text"
                        placeholder="00000-000"
                        maxLength={9}
                        value={cep}
                        onChange={handleCepChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn-search-cep"
                        onClick={() => fetchAddressByCep(cep)}
                        disabled={loadingCep || cep.replace(/\D/g, '').length !== 8}
                      >
                        {loadingCep ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>
                    {cepError && <span className="field-error">{cepError}</span>}
                    {cepSuccess && <span className="field-success">✓ Endereço preenchido pelo ViaCEP</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="logradouro">
                      Logradouro <span className="locked-badge">🔒 ViaCEP</span>
                    </label>
                    <input
                      id="logradouro"
                      type="text"
                      placeholder="Preenchido automaticamente pelo CEP"
                      value={logradouro}
                      readOnly
                      className="input-readonly"
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="numero">
                      Número <span className="req">*</span>
                    </label>
                    <input
                      id="numero"
                      type="text"
                      placeholder="Ex: 123"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="complemento">
                      Complemento <span className="opt-tag">(Opcional)</span>
                    </label>
                    <input
                      id="complemento"
                      type="text"
                      placeholder="Ex: Apto 4, Bloco B"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label htmlFor="bairro">
                      Bairro <span className="locked-badge">🔒 ViaCEP</span>
                    </label>
                    <input
                      id="bairro"
                      type="text"
                      placeholder="Bairro"
                      value={bairro}
                      readOnly
                      className="input-readonly"
                    />
                  </div>

                  <div className="address-two-columns">
                    <div className="input-group flex-2">
                      <label htmlFor="cidade">
                        Cidade <span className="locked-badge">🔒 ViaCEP</span>
                      </label>
                      <input
                        id="cidade"
                        type="text"
                        placeholder="Cidade"
                        value={cidade}
                        readOnly
                        className="input-readonly"
                        required
                      />
                    </div>

                    <div className="input-group flex-1">
                      <label htmlFor="estado">
                        UF <span className="locked-badge">🔒</span>
                      </label>
                      <input
                        id="estado"
                        type="text"
                        placeholder="UF"
                        value={estado}
                        readOnly
                        className="input-readonly"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="cart-summary-section">
                  <h3>Itens Selecionados</h3>

                  {selectedItems.length === 0 ? (
                    <div className="empty-cart-state">
                      <span className="empty-cart-icon">🛒</span>
                      <p>Nenhum item selecionado</p>
                      <small>Navegue pelo cardápio ao lado e escolha a quantidade dos produtos.</small>
                    </div>
                  ) : (
                    <div className="selected-items-list">
                      {selectedItems.map(item => (
                        <div key={item.productId} className="cart-item-row">
                          <div className="cart-item-details">
                            <span className="cart-item-name">{item.productName}</span>
                            <span className="cart-item-calc">
                              {item.quantity}x R$ {item.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <div className="cart-item-right">
                            <span className="cart-item-subtotal">
                              R$ {item.subtotal.toFixed(2).replace('.', ',')}
                            </span>
                            <button
                              type="button"
                              className="btn-remove-cart"
                              onClick={() => handleRemove(item.productId)}
                              title="Remover do carrinho"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pricing-breakdown">
                  <div className="price-line">
                    <span>Subtotal</span>
                    <span>R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="price-line">
                    <span>Taxa de Entrega</span>
                    <span className="free-shipping">Grátis</span>
                  </div>
                  <div className="price-line total-line">
                    <strong>Total a Pagar</strong>
                    <strong className="total-value">
                      R$ {totalValue.toFixed(2).replace('.', ',')}
                    </strong>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button
                    type="submit"
                    className="btn-confirm-order"
                    disabled={!isFormValid}
                  >
                    {submitting ? 'Enviando Pedido...' : `Confirmar Pedido (R$ ${totalValue.toFixed(2).replace('.', ',')})`}
                  </button>

                  <button
                    type="button"
                    className="btn-cancel-order"
                    onClick={() => navigate('/orders')}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CreateOrder;
