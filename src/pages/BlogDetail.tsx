import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, ArrowLeft, BookOpen, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import '../styles/BlogDetail.css';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    name: string;
  } | null;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const userStr = localStorage.getItem('nova_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        setIsAdmin(true);
      }
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get('https://novaokur.onrender.com/api/posts');
        const foundPost = res.data.find((p: any) => p.id === id || p.slug === id);
        setPost(foundPost || null);
      } catch (error) {
        console.error("Yazı cekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (!post) return <div className="loading">Yazı bulunamadı.</div>;

  // Paragraf ayiklama (Satır sonlarını paragrafa çevir)
  const paragraphs = post.content.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="blog-detail-layout">
      {/* Navbar Ozet */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
        <div className="nav-links">
          <a href="/products">Mağaza</a>
          <a href="/blog" className="active-link">Blog</a>
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

      <div className="container animate-fade-in">
        <button className="btn-outline back-btn" onClick={() => navigate('/blog')}>
           <ArrowLeft size={18} /> Blog Sayfasına Dön
        </button>

        <article className="glass-panel blog-read-container delay-1">
           <header className="blog-read-header">
              <h1>{post.title}</h1>
              <div className="blog-read-meta">
                 <span><User size={16} /> {post.author?.name || 'Nova Editör'}</span>
                 <span><Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                 <span className="badge-read-time">Okuma Süresi: {Math.max(1, Math.ceil(post.content.length / 800))} dk</span>
              </div>
           </header>

           <div className="blog-read-hero-image">
              {post.imageUrl ? (
                 <img src={post.imageUrl} alt={post.title} />
              ) : (
                 <div className="no-image-banner">Görsel Yok</div>
              )}
           </div>

           <div className="blog-read-content">
              {paragraphs.map((paragraph, index) => (
                 <p key={index}>{paragraph}</p>
              ))}
           </div>

           <div className="blog-read-footer">
              <div className="share-section">
                <span>Bu yazıyı beğendin mi?</span>
                <button className="btn btn-outline btn-sm">Paylaş</button>
              </div>
              <div className="navigation-section">
                 <Link to="/products" className="btn btn-primary">
                    <BookOpen size={18} /> Kütüphaneyi Keşfet
                 </Link>
              </div>
           </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
