import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import '../styles/Blog.css';

interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    name: string;
  } | null;
}

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const userStr = localStorage.getItem('nova_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        setIsAdmin(true);
      }
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get('https://novaokur.onrender.com/api/posts');
        setBlogPosts(res.data);
      } catch (error) {
        console.error("Blog yazilari cekilemedi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="blog-layout">
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
        <div className="blog-hero">
          <h1 className="blog-title">NovaOkur <span className="text-gradient">Blog</span></h1>
          <p className="blog-subtitle">Edebiyat haberleri, kitap inlemeleri, yazar röportajları ve kültür dünyasından son gelişmeler.</p>
        </div>

        <div className="blog-grid">
          {loading ? (
             <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1' }}>Yazılar yükleniyor...</p>
          ) : blogPosts.length === 0 ? (
             <p style={{ color: 'var(--text-secondary)', textAlign: 'center', gridColumn: '1 / -1' }}>Henüz yayınlanan bir blog yazısı bulunmuyor.</p>
          ) : (
            blogPosts.map((post, index) => (
              <article key={post.id} className={`blog-card glass-panel delay-${(index % 3) + 1}`}>
                <div className="blog-image">
                  {post.imageUrl ? (
                     <img src={post.imageUrl} alt={post.title} />
                  ) : (
                     <div style={{width:'100%', height:'100%', background:'linear-gradient(45deg, var(--bg-primary), var(--bg-secondary))', display:'flex', alignItems:'center', justifyContent:'center', color: 'var(--text-secondary)'}}>Görsel Yok</div>
                  )}
                  <span className="blog-category">İnceleme</span>
                </div>
                
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="meta-item"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.content.substring(0, 120)}...</p>
                  
                  <div className="blog-footer">
                    <span className="blog-author"><BookOpen size={16} style={{marginRight: '6px'}}/> {post.author?.name || 'Anonim'}</span>
                    <Link to={`/blog/${post.slug || post.id}`} className="read-more-btn" style={{textDecoration: 'none'}}>
                       Devamını Oku <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        
        {/* Daha Fazla Yukle Alani */}
        <div style={{ textAlign: 'center', marginTop: '60px' }} className="delay-3">
           <button className="btn btn-outline" style={{ padding: '12px 32px' }}>Daha Fazla Yazı Yükle</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
