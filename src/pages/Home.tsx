import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import '../styles/Home.css';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const userStr = localStorage.getItem('nova_user');
    if (userStr) {
      setIsLoggedIn(true);
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        setIsAdmin(true);
      }
    }
    const fetchData = async () => {
      try {
         const [prodRes, blogRes, settingsRes] = await Promise.all([
           axios.get('https://novaokur.onrender.com/api/products'),
           axios.get('https://novaokur.onrender.com/api/posts'),
           axios.get('https://novaokur.onrender.com/api/settings')
         ]);
         
         // Sadece ilk 4 urunu vitrine aliyoruz
         setProducts(prodRes.data.slice(0, 4));
         // Sadece son 3 blog yazisini vitrine aliyoruz
         setBlogPosts(blogRes.data.slice(0, 3));
         setSettings(settingsRes.data);
      } catch (error) {
         console.error("Anasayfa verileri cekilemedi:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="home-wrapper">
      {/* Navbar Ozet */}
      <nav className="glass-panel navbar">
        <div className="nav-brand">
          <BookOpen className="brand-icon" />
          <span>NovaOkur</span>
        </div>
        <div className="nav-links">
          <a href="/products">Ürünler</a>
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
          {isLoggedIn ? (
             <a href="/profile" className="btn btn-primary" style={{padding: '8px 16px'}}>Hesabım</a>
          ) : (
             <a href="/auth/login" className="btn btn-outline" style={{padding: '8px 16px'}}>Giriş Yap</a>
          )}
        </div>
      </nav>

      {/* Hero (Kahraman) Alani */}
      <header className="hero-section">
        <div className="hero-content animate-fade-in">
          <h1>
             {settings?.heroTitle ? (
               // Simple split if there are multiple words, but generally we just display it.
               // We will just wrap it directly if the user didn't use HTML, or maybe keep the gradient fallback if it evaluates.
               // For now let's just render the string.
               <>{settings.heroTitle}</>
             ) : (
               <>Sınırsız Bilgi ve <span className="text-gradient">Hikaye Evreni</span></>
             )}
          </h1>
          <p className="hero-subtitle">
            {settings?.heroSubtitle || 'Binlerce kitap ve dergi bir tık uzağında. İster dijital oku, ister fiziksel kütüpheneni büyüt. Aylık aboneliklerle sınırları kaldır.'}
          </p>
          <div className="hero-actions delay-1">
            <a href="/subscriptions" className="btn btn-primary">Abonelikleri İncele</a>
            <a href="/products" className="btn btn-outline delay-2">Koleksiyonu Keşfet</a>
          </div>
        </div>
        
        {/* Dekoratif cam elementleri (Estetik icin) */}
        <div className="hero-decoration">
          <div className="glass-card decor-1">
             <Star className="icon-gold" />
             <div>
                <h4>Günün Kitabı</h4>
                <p>Simyacı - Paulo Coelho</p>
             </div>
          </div>
          <div className="glass-card decor-2">
             <TrendingUp className="icon-blue" />
             <div>
                <h4>Popüler Dergi</h4>
                <p>Bilim ve Teknik</p>
             </div>
          </div>
        </div>
      </header>

      {/* 1. Bolum: Trendler / Vitrin */}
      <section className="home-section container">
         <div className="section-header">
            <h2>Haftanın Trendleri <TrendingUp className="text-secondary" size={24} /></h2>
            <a href="/products" className="view-all">Tümünü Gör <ArrowRight size={16} /></a>
         </div>
         <div className="grid-items home-products">
             {products.map(product => (
              <div key={product.id} className="product-card glass-panel" style={{ position: 'relative' }}>
                <Link to={`/product/${product.id}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></Link>
                <div className="image-wrapper">
                   {product.imageUrl ? <img src={product.imageUrl} alt={product.title} /> : <div style={{width:'100%', height:'100%', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center'}}>Görsel Yok</div>}
                   <span className="badge">{product.format === 'PHYSICAL' ? 'Basılı' : 'E-Kitap'}</span>
                </div>
                <div className="product-info">
                   <span className="product-type">{product.type === 'BOOK' ? 'Kitap' : 'Dergi'}</span>
                   <h3 style={{ pointerEvents: 'none' }}>{product.title}</h3>
                   <div className="price-row" style={{ position: 'relative', zIndex: 2 }}>
                      <span className="price">{product.price} ₺</span>
                      <button 
                         onClick={(e) => {
                            e.preventDefault();
                            addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl, type: product.type, format: product.format });
                         }} 
                         className="btn btn-primary btn-sm btn-icon-only"
                      >
                        <ShoppingCart size={18} /> Ekle
                      </button>
                   </div>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* 2. Bolum: Abonelik Crossover Banner */}
      <section className="home-section container">
         <div className="glass-panel crossover-banner">
            <div className="crossover-content">
               <h2><Star className="icon-gold" size={28} style={{marginRight: '8px', verticalAlign: 'middle'}}/> {settings?.bannerTitle || 'NovaOkur Premium'}</h2>
               <p>{settings?.bannerDesc || 'Dijital kitap arşivine limitsiz erişim ve her ay kapına gelen ücretsiz fiziksel dergiler... Okuma deneyimini baştan yaratmaya hazır mısın?'}</p>
               <a href="/subscriptions" className="btn btn-primary crossover-btn">Planları İncele - Ayda 49.99 ₺'dan Başlayan Fiyatlarla</a>
            </div>
            <div className="crossover-image">
               <div className="mock-card"></div>
               <div className="mock-card card-overlay"></div>
            </div>
         </div>
      </section>

      {/* 3. Bolum: Edebiyat & Blog Vitrini */}
      <section className="home-section container" style={{ marginBottom: '80px' }}>
         <div className="section-header">
            <h2>Edebiyat Dünyasından... <BookOpen className="text-secondary" size={24} /></h2>
            <a href="/blog" className="view-all">Daha Fazla Oku <ArrowRight size={16} /></a>
         </div>
         <div className="blog-grid home-blogs">
            {blogPosts.map(post => (
              <a href={`/blog/${post.id}`} key={post.id} className="blog-card glass-panel" style={{ textDecoration: 'none', color: 'inherit' }}>
                 <div className="blog-image">
                    {post.imageUrl ? <img src={post.imageUrl} alt={post.title} /> : <div className="no-image">Yükleniyor...</div>}
                    <span className="blog-category">{post.author}</span>
                 </div>
                 <div className="blog-content">
                    <span className="blog-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <h3>{post.title}</h3>
                 </div>
              </a>
            ))}
         </div>
      </section>

    </div>
  );
};

export default Home;
