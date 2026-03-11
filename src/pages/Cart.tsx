import { useCartStore } from '../store/cartStore';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import '../styles/Cart.css';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const handleCheckout = () => {
    const userStr = localStorage.getItem('nova_user');
    if (!userStr) {
      alert("Siparişi tamamlamak için lütfen giriş yapın veya kayıt olun.");
      window.location.href = '/auth/login';
      return;
    }

    if (items.length === 0) return;

    // Profesyonel Checkout sayfasina yonlendir
    window.location.href = '/checkout';
  };

  return (
    <div className="cart-layout">
      {/* Navbar Ozet */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
        <div className="nav-links">
          <a href="/products">Alışverişe Devam Et</a>
        </div>
      </nav>

      <div className="container cart-container animate-fade-in">
        <h1 className="cart-title"><ShoppingCart className="title-icon" /> Sepetim</h1>

        {items.length === 0 ? (
           <div className="empty-cart glass-panel delay-1">
             <p>Alışveriş sepetiniz şu an boş.</p>
             <a href="/products" className="btn btn-primary mt-4" style={{ display: 'inline-block', marginTop: '16px' }}>Kitapları Keşfet</a>
           </div>
        ) : (
          <div className="cart-content">
             <div className="cart-items delay-1">
               {items.map(item => (
                 <div key={item.id} className="cart-item glass-panel">
                    <div className="item-image">
                       {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <div className="no-image">Görsel Yok</div>}
                    </div>
                    
                    <div className="item-details">
                       <div>
                          <span className="item-type">{item.type === 'BOOK' ? 'Kitap' : 'Dergi'} • {item.format === 'PHYSICAL' ? 'Basılı' : 'E-Kitap'}</span>
                          <h3 className="item-name">{item.title}</h3>
                       </div>
                       
                       <div className="item-actions">
                          <div className="quantity-control">
                             <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                             <span>{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <span className="item-price">{(item.price * item.quantity).toFixed(2)} ₺</span>
                          <button onClick={() => removeItem(item.id)} className="btn-remove">
                             <Trash2 size={20} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
             </div>

             <div className="cart-summary glass-panel delay-2">
                <h2>Sipariş Özeti</h2>
                <div className="summary-row">
                   <span>Ara Toplam</span>
                   <span>{getTotalPrice().toFixed(2)} ₺</span>
                </div>
                <div className="summary-row">
                   <span>Kargo</span>
                   <span>{getTotalPrice() > 150 ? 'Ücretsiz' : '29.90 ₺'}</span>
                </div>
                <hr className="summary-divider" />
                <div className="summary-row total">
                   <span>Toplam</span>
                   <span>{(getTotalPrice() + (getTotalPrice() > 150 ? 0 : 29.9)).toFixed(2)} ₺</span>
                </div>
                
                <button onClick={handleCheckout} className="btn btn-primary w-full checkout-btn">
                   Alışverişi Tamamla <ArrowRight size={18} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
