import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ShoppingCart, Eye, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import '../styles/Products.css';

interface Product {
  id: string;
  title: string;
  price: number;
  type: string;
  format: string;
  imageUrl: string;
}

const Products = () => {
  const [filter, setFilter] = useState('Hepsi');
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [previewItem, setPreviewItem] = useState<Product | null>(null);
  
  // Modal acikken scroll'u engelle (Mobil Fix)
  useEffect(() => {
    if (previewItem) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [previewItem]);

  useEffect(() => {
    // Admin Rol Kontrolu
    const userStr = localStorage.getItem('nova_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        setIsAdmin(true);
      }
    }
    // Veritabanindan urunleri cek
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://novaokur.onrender.com/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error("Ürünler getirilemedi:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    if (filter === 'Hepsi') return true;
    if (filter === 'Kitap' && p.type === 'BOOK') return true;
    if (filter === 'Dergi' && p.type === 'MAGAZINE') return true;
    if (filter === 'Aksesuar' && p.type === 'ACCESSORY') return true;
    return false;
  });

  return (
    <div className="products-layout">
      {/* Navbar (Ortak Bilesenler Olarak Ayrilacak) */}
      <nav className="glass-panel navbar">
        <div className="nav-brand">
          <a href="/">
            <BookOpen className="brand-icon" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} />
            <span>NovaOkur</span>
          </a>
        </div>
        <div className="nav-links">
          <a href="/products" className="active-link">Ürünler</a>
          <a href="/blog">Blog</a>
          {isAdmin && (
             <a href="/admin" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Panel</a>
          )}
          <a href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ShoppingCart size={20}/>
            {cartCount > 0 && (
              <span className="cart-badge" style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--accent-color)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </nav>

      <div className="container products-container animate-fade-in">
        <aside className="sidebar glass-panel">
          <h3><Filter size={18} /> Filtreler</h3>
          <div className="filter-group">
             <h4>Kategori</h4>
             <button className={`filter-btn ${filter === 'Hepsi' ? 'active' : ''}`} onClick={() => setFilter('Hepsi')}>Tümü</button>
             <button className={`filter-btn ${filter === 'Kitap' ? 'active' : ''}`} onClick={() => setFilter('Kitap')}>Kitaplar</button>
             <button className={`filter-btn ${filter === 'Dergi' ? 'active' : ''}`} onClick={() => setFilter('Dergi')}>Dergiler</button>
             <button className={`filter-btn ${filter === 'Aksesuar' ? 'active' : ''}`} onClick={() => setFilter('Aksesuar')}>Aksesuarlar</button>
          </div>
        </aside>

        <main className="product-grid">
          <div className="search-bar glass-panel">
            <Search size={20} className="text-secondary" />
            <input type="text" placeholder="Kitap veya dergi ara..." />
          </div>

          <div className="grid-items">
            {filteredProducts.length === 0 ? <p className="text-secondary" style={{padding: '20px'}}>Bu kategoride henüz ürün bulunmuyor...</p> : null}
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card glass-panel delay-1" style={{ position: 'relative' }}>
                <Link to={`/product/${product.id}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></Link>
                <div className="image-wrapper">
                   {product.imageUrl ? <img src={product.imageUrl} alt={product.title} /> : <div style={{width:'100%', height:'100%', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center'}}>Görsel Yok</div>}
                   <span className="badge">{product.format === 'PHYSICAL' ? 'Basılı' : 'E-Kitap'}</span>
                   <div className="preview-overlay" style={{ zIndex: 2 }}>
                      <button className="preview-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewItem(product); }}>
                         <Eye size={20} /> İçeriğe Göz At
                      </button>
                   </div>
                </div>
                <div className="product-info">
                   <span className="product-type">{product.type === 'BOOK' ? 'Kitap' : product.type === 'MAGAZINE' ? 'Dergi' : 'Aksesuar / Hediye'}</span>
                   <h3 style={{ pointerEvents: 'none' }}>{product.title}</h3>
                   <div className="price-row" style={{ position: 'relative', zIndex: 2 }}>
                      <span className="price">{product.price} ₺</span>
                      <button 
                         onClick={(e) => {
                            e.preventDefault();
                            addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl, type: product.type, format: product.format });
                         }}
                         className="btn btn-primary btn-sm"
                      >
                        Sepete Ekle
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {previewItem && (
        <div className="modal-overlay animate-fade-in" onClick={() => setPreviewItem(null)}>
           <div className="preview-modal glass-panel" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setPreviewItem(null)}><X size={24} /></button>
              <div className="preview-content-layout">
                 <div className="preview-image">
                    {previewItem.imageUrl ? <img src={previewItem.imageUrl} alt={previewItem.title} /> : <div className="no-img">Görsel Yok</div>}
                 </div>
                 <div className="preview-text">
                    <h2>{previewItem.title} - Örnek Sayfalar</h2>
                    <p className="sim-text" style={{ fontStyle: 'italic', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                      "Bir zamanlar, teknolojinin sadece bir araç değil, yaşamın ta kendisi olduğu o günlerde..." <br/><br/>
                      Bu bölüm, kitabı veya dergiyi satın almadan önce içeriğine, kapak kalitesine ve yazım diline göz atabilmeniz için özel olarak hazırlanmış bir önizleme (preview) kesitidir. Tamamını okumak için hemen sipariş verebilirsiniz.
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                       <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{previewItem.price} ₺</span>
                       <button 
                          onClick={() => {
                             addItem({ id: previewItem.id, title: previewItem.title, price: previewItem.price, imageUrl: previewItem.imageUrl, type: previewItem.type, format: previewItem.format });
                             setPreviewItem(null);
                          }}
                          className="btn btn-primary w-full mt-4"
                       >
                         <ShoppingCart size={18} /> Hemen Sepete Ekle
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Products;
