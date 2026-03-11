import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, MessageSquare, ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import '../styles/ProductDetail.css';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  format: string;
  imageUrl: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  
  // Yorum State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mobil aciklama gizleme (Görev B)
  const [isExpanded, setIsExpanded] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);
  const userStr = localStorage.getItem('nova_user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    // Sayfa degistikce yukari kaydir
    window.scrollTo(0, 0);
    
    // Urun, Yorumlar ve AI Onerileri Cek
    const fetchData = async () => {
      try {
        // Tum urunleri cek, icinden id si esleseni bul (Gecici cozum)
        const prodRes = await axios.get('https://novaokur.onrender.com/api/products');
        const currentProd = prodRes.data.find((p: any) => p.id === id);
        setProduct(currentProd);

        if (currentProd) {
           const revRes = await axios.get(`https://novaokur.onrender.com/api/products/${id}/reviews`);
           setReviews(revRes.data);

           const recRes = await axios.get(`https://novaokur.onrender.com/api/recommendations/${id}`);
           setRecommendations(recRes.data);
        }
      } catch (error) {
        console.error("Veri Cekme Hatasi:", error);
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Yorum yapabilmek için lütfen giriş yapınız.");
      navigate('/auth/login');
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(`https://novaokur.onrender.com/api/products/${id}/reviews`, {
        rating: newRating,
        comment: newComment,
        userId: user.id || 'usr_temp' // Normalde backend'e token gonderilir.
      });
      // Yeni yorumu arayuze ekle
      setReviews([res.data, ...reviews]);
      setNewComment("");
      setNewRating(5);
    } catch (error) {
      console.error(error);
      alert("Yorum eklenirken hata olustu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="product-detail-layout">
      {/* Basit Navbar */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
        <div className="nav-links">
           <a href="/products">Geri Dön</a>
        </div>
      </nav>

      <div className="container animate-fade-in">
        <button className="btn-outline back-btn" onClick={() => navigate('/products')}>
           <ArrowLeft size={18} /> Ürünler Sayfasına Dön
        </button>

        <div className="detail-hero glass-panel delay-1">
          <div className="detail-image">
             {product.imageUrl ? <img src={product.imageUrl} alt={product.title} /> : <div className="no-img">Görsel Yok</div>}
          </div>
          <div className="detail-info">
             <span className="badge-type">{product.type === 'BOOK' ? 'Kitap' : 'Dergi'}</span>
             <h1>{product.title}</h1>
             <div className="price-tag">{product.price} ₺</div>
             <div className="description">
                <div className={!isExpanded ? 'clamped-text' : ''}>
                  {product.description ? 
                    product.description.split('\n').map((line, i) => (
                      <p key={i} style={{ minHeight: line.trim() === '' ? '14px' : 'auto', margin: '0 0 8px 0' }}>
                        {line}
                      </p>
                    )) : 
                    <p>Bu ürün için detaylı bir açıklama henüz girilmemiş.</p>
                  }
                </div>
                <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? 'Daha Az Göster' : 'Daha Fazla Oku'}
                </button>
             </div>
             
             <button 
                className="btn btn-primary add-to-cart-lg"
                onClick={() => {
                  addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl, type: product.type, format: product.format });
                  alert("Sepete eklendi!");
                }}
             >
                <ShoppingCart size={20} /> Sepete Ekle
             </button>
             <p className="guarantee-note">✓ 14 Gün Koşulsuz Şartsız İade Garantisi ile Altında</p>
          </div>
        </div>

        {/* Görev A & B: Müşteri İlişkileri (Topluluk ve Yorum Sistemi) */}
        <div className="community-section delay-2">
          <div className="glass-panel review-form-box">
             <h2><MessageSquare size={24} className="text-secondary" /> Topluluk Değerlendirmeleri</h2>
             <p>NovaOkur topluluğuna katılın, okuduğunuz eserler hakkındaki fikirlerinizi paylaşın.</p>
             
             <form onSubmit={handleReviewSubmit} className="review-form">
               <div className="rating-select">
                 <span>Puanınız:</span>
                 {[1,2,3,4,5].map(star => (
                   <Star 
                     key={star} 
                     size={24} 
                     className={star <= newRating ? 'star-filled' : 'star-empty'} 
                     onClick={() => setNewRating(star)}
                     style={{cursor: 'pointer'}}
                   />
                 ))}
               </div>
               <textarea 
                 placeholder={user ? "Bu kitap/dergi hakkında ne düşünüyorsunuz?" : "Yorum yapabilmek için lütfen giriş yapın..."}
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 disabled={!user || isSubmitting}
                 required
               />
               <button type="submit" className="btn btn-secondary" disabled={!user || isSubmitting}>
                 {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
               </button>
             </form>
          </div>

          <div className="reviews-list">
             {reviews.length === 0 ? (
               <div className="glass-panel no-reviews">
                  <p>Bu ürün için henüz yorum yapılmamış. İlk yorumu siz yazın!</p>
               </div>
             ) : (
               reviews.map(review => (
                 <div key={review.id} className="glass-panel review-card">
                   <div className="review-header">
                     <span className="reviewer-name">{review.user?.name || 'Anonim Okur'}</span>
                     <div className="stars">
                       {[1,2,3,4,5].map(star => (
                         <Star key={star} size={14} className={star <= review.rating ? 'star-filled' : 'star-empty'} />
                       ))}
                     </div>
                   </div>
                   <p className="review-comment">{review.comment}</p>
                   <span className="review-date">{new Date(review.createdAt).toLocaleDateString('tr-TR')}</span>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Görev A & B: AI Kişiselleştirme (Öneri Motoru V1) */}
        {recommendations.length > 0 && (
          <div className="recommendations-section delay-3">
             <div className="recommendations-header">
                <h2><TrendingUp size={24} className="text-secondary" /> Bunu Alan Okurlar Şunları da İnceledi</h2>
                <p>Yapay zeka destekli akıllı okuma önerileri</p>
             </div>
             <div className="recommendations-grid">
               {recommendations.map(rec => (
                 <div key={rec.id} className="glass-panel rec-card" onClick={() => navigate(`/product/${rec.id}`)}>
                   <div className="rec-image">
                      {rec.imageUrl ? <img src={rec.imageUrl} alt={rec.title} /> : <div>Görsel Yok</div>}
                   </div>
                   <div className="rec-info">
                      <h4>{rec.title}</h4>
                      <span>{rec.price} ₺</span>
                      <div className="go-btn"><ArrowRight size={16} /></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
