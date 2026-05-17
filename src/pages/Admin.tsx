import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Package, Users, FileText, Settings, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import '../styles/Admin.css';

const parseProductDescription = (rawDesc: string) => {
  const defaultValues = {
    description: rawDesc || '',
    criticalStock: 45,
    criticalStockText: 'Kritik Stok Uyarısı!'
  };
  
  if (!rawDesc) return defaultValues;
  
  const stockMatch = rawDesc.match(/\[CRITICAL_STOCK:(\d+)\]/);
  const textMatch = rawDesc.match(/\[CRITICAL_STOCK_TEXT:([^\]]+)\]/);
  
  let cleanDesc = rawDesc;
  if (stockMatch) cleanDesc = cleanDesc.replace(stockMatch[0], '');
  if (textMatch) cleanDesc = cleanDesc.replace(textMatch[0], '');
  
  return {
    description: cleanDesc.trim(),
    criticalStock: stockMatch ? parseInt(stockMatch[1]) : 45,
    criticalStockText: textMatch ? textMatch[1] : 'Kritik Stok Uyarısı!'
  };
};

const buildRawDescription = (desc: string, criticalStock: number, criticalStockText: string) => {
  return `${desc.trim()} [CRITICAL_STOCK:${criticalStock}] [CRITICAL_STOCK_TEXT:${criticalStockText}]`;
};

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  costPrice: number;
  type: string;
  format: string;
  stock: number;
  imageUrl: string;
  criticalStock?: number;
  criticalStockText?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    price: '', 
    costPrice: '', 
    type: 'BOOK', 
    format: 'PHYSICAL', 
    stock: '', 
    imageUrl: '',
    criticalStock: 45,
    criticalStockText: 'Kritik Stok Uyarısı!'
  });

  const [blogData, setBlogData] = useState({
    title: '', content: '', imageUrl: ''
  });

  const [settingsData, setSettingsData] = useState({
    heroTitle: '', heroSubtitle: '', bannerTitle: '', bannerDesc: '', instagramUrl: '', twitterUrl: ''
  });

  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [editBlogData, setEditBlogData] = useState<BlogPost & { content?: string; imageUrl?: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'blogs' | 'settings'>('dashboard');

  // Urunleri ve Bloglari Getir
  const fetchData = async () => {
    try {
      const [resProducts, resPosts, resSettings] = await Promise.all([
        axios.get('https://novaokur.onrender.com/api/products'),
        axios.get('https://novaokur.onrender.com/api/posts'),
        axios.get('https://novaokur.onrender.com/api/settings')
      ]);
      setProducts(resProducts.data);
      setPosts(resPosts.data);
      if (resSettings.data) {
        setSettingsData({
          heroTitle: resSettings.data.heroTitle || '',
          heroSubtitle: resSettings.data.heroSubtitle || '',
          bannerTitle: resSettings.data.bannerTitle || '',
          bannerDesc: resSettings.data.bannerDesc || '',
          instagramUrl: resSettings.data.instagramUrl || '',
          twitterUrl: resSettings.data.twitterUrl || ''
        });
      }
    } catch (error) {
      console.error("Veriler getirilemedi:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Yeni Urun Ekle
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rawDesc = buildRawDescription(formData.description, formData.criticalStock, formData.criticalStockText);
      await axios.post('https://novaokur.onrender.com/api/products', {
        ...formData,
        description: rawDesc
      });
      toast.success('Ürün başarıyla eklendi!');
      setFormData({ 
        title: '', 
        description: '', 
        price: '', 
        costPrice: '', 
        type: 'BOOK', 
        format: 'PHYSICAL', 
        stock: '', 
        imageUrl: '',
        criticalStock: 45,
        criticalStockText: 'Kritik Stok Uyarısı!'
      });
      fetchData(); // Listeyi guncelle
    } catch (error) {
       toast.error('Ürün eklenirken hata oluştu.');
    }
  };

  // Yeni Blog Yazisi Ekle
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://novaokur.onrender.com/api/posts', blogData);
      toast.success('Blog yazısı başarıyla eklendi!');
      setBlogData({ title: '', content: '', imageUrl: '' });
      fetchData();
    } catch (error) {
      toast.error('Blog eklenirken hata oluştu.');
    }
  };

  // Ayarlari Guncelle
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://novaokur.onrender.com/api/settings', settingsData);
      toast.success('Anasayfa ayarları başarıyla güncellendi!');
    } catch (error) {
       toast.error('Ayarlar güncellenirken hata oluştu.');
    }
  };

  // Urun Guncelle
  const handleUpdateProduct = async (id: string) => {
    if (!editFormData) return;
    try {
      const rawDesc = buildRawDescription(editFormData.description, editFormData.criticalStock, editFormData.criticalStockText);
      await axios.put(`https://novaokur.onrender.com/api/products/${id}`, {
        ...editFormData,
        description: rawDesc
      });
      toast.success('Ürün başarıyla güncellendi!');
      setEditingProductId(null);
      setEditFormData(null);
      fetchData();
    } catch (error) {
       toast.error('Ürün güncellenirken hata oluştu.');
    }
  };

  const startEditing = (product: Product) => {
    const parsed = parseProductDescription(product.description);
    setEditingProductId(product.id);
    setEditFormData({
      ...product,
      description: parsed.description,
      criticalStock: parsed.criticalStock,
      criticalStockText: parsed.criticalStockText
    });
  };

  const handleUpdateBlog = async (id: string) => {
    if (!editBlogData) return;
    try {
      await axios.put(`https://novaokur.onrender.com/api/posts/${id}`, editBlogData);
      toast.success('Blog başarıyla güncellendi!');
      setEditingBlogId(null);
      setEditBlogData(null);
      fetchData();
    } catch (error) {
       toast.error('Blog güncellenirken hata oluştu.');
    }
  };

  const startEditingBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setEditBlogData(blog as any);
  };

  // Urun Sil
  const handleDelete = async (id: string) => {
    if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`https://novaokur.onrender.com/api/products/${id}`);
        fetchData();
        setEditingProductId(null);
        toast.success('Ürün silindi.');
      } catch (error) {
        toast.error('Silinemedi.');
      }
    }
  };

  // Blog Sil
  const handleBlogDelete = async (id: string) => {
    if(window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`https://novaokur.onrender.com/api/posts/${id}`);
        fetchData();
        setEditingBlogId(null);
        toast.success('Blog yazısı silindi.');
      } catch (error) {
        toast.error('Silinemedi.');
      }
    }
  };

  return (
    <div className="admin-layout">
       <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand">
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/logo.svg" alt="NovaOkur Logo" className="brand-logo" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Yönetim Paneli</span>
          </a>
        </div>
       </nav>

       <div className="container">
         {/* SEKME MENUSU */}
         <div className="admin-tabs-nav" style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
           <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: '1', minWidth: '120px' }}>📊 Dashboard</button>
           <button onClick={() => setActiveTab('products')} className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: '1', minWidth: '120px' }}>📦 Ürünler</button>
           <button onClick={() => setActiveTab('blogs')} className={`btn ${activeTab === 'blogs' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: '1', minWidth: '120px' }}>📝 Blog</button>
           <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: '1', minWidth: '120px' }}>⚙️ Ayarlar</button>
         </div>

         {/* 1. DASHBOARD SEKMESI */}
         {activeTab === 'dashboard' && (
           <div className="animate-fade-in">
             <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="glass-panel stat-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '16px' }}><Package color="#818cf8" size={32} /></div>
                   <div>
                      <h3 style={{ fontSize: '2rem', margin: 0 }}>{products.length}</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Aktif Ürün Sergileniyor</p>
                   </div>
                </div>
                
                <div className="glass-panel stat-card delay-1" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '16px' }}><FileText color="#34d399" size={32} /></div>
                   <div>
                      <h3 style={{ fontSize: '2rem', margin: 0 }}>{posts.length}</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Yayınlanmış Makale</p>
                   </div>
                </div>

                <div className="glass-panel stat-card delay-2" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                   <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '16px' }}><Users color="#fbbf24" size={32} /></div>
                   <div>
                      <h3 style={{ fontSize: '2rem', margin: 0 }}>+12</h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Yeni Abone (Bu Ay)</p>
                   </div>
                </div>

                <div className="glass-panel stat-card delay-3" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                   <div style={{ background: 'rgba(52, 211, 153, 0.2)', padding: '16px', borderRadius: '16px' }}><Package color="#34d399" size={32} /></div>
                   <div>
                      <h3 style={{ fontSize: '2rem', margin: 0, color: '#34d399' }}>
                        {products.filter(p => p.format === 'PHYSICAL').reduce((acc, p) => acc + ((p.price - (p.costPrice || 0)) * (p.stock || 0)), 0).toLocaleString('tr-TR')} ₺
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Potansiyel Net Kâr (Fiziksel Stok)</p>
                   </div>
                </div>
             </div>

             <div className="glass-panel list-section">
                <h2 style={{ color: '#ef4444' }}><Package /> Kritik Stok Uyarıları (Yeniden Sipariş)</h2>
                <div className="admin-product-list" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '16px' }}>
                   {products.filter(p => { const parsed = parseProductDescription(p.description); return p.format === 'PHYSICAL' && p.stock <= parsed.criticalStock; }).length === 0 ? (
                     <p className="text-secondary" style={{margin: 0}}>Tüm fiziksel ürün stokları yeterli seviyede.</p>
                   ) : (
                     products.filter(p => { const parsed = parseProductDescription(p.description); return p.format === 'PHYSICAL' && p.stock <= parsed.criticalStock; }).map(p => (
                       <div key={`alert-${p.id}`} className="admin-product-item" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #ef4444', marginBottom: '8px' }}>
                          <div className="info">
                             <strong style={{ color: '#fca5a5' }}>{p.title}</strong>
                             <span className="badge-sm" style={{ background: '#ef4444', color: 'white' }}>Kalan: {p.stock} Adet</span>
                             <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: '500', display: 'block', marginTop: '4px' }}>⚠️ {parseProductDescription(p.description).criticalStockText} (Limit: {parseProductDescription(p.description).criticalStock})</span>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
           </div>
         )}

         {/* 2. URUNLER SEKMESI */}
         {activeTab === 'products' && (
           <div className="admin-grid animate-fade-in">
             <div className="glass-panel form-section">
                <h2><PlusCircle /> Yeni Ürün Ekle</h2>
                <form onSubmit={handleSubmit} className="admin-form">
                   <div className="form-group">
                     <label>Ürün Adı / Başlık</label>
                     <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                   </div>
                   
                   <div className="form-group">
                     <label>Açıklama</label>
                     <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'12px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--glass-border)', color:'white'}}></textarea>
                   </div>
                   
                   <div className="form-row">
                      <div className="form-group">
                        <label>Satış Fiyatı (₺)</label>
                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Maliyet Fiyatı (₺)</label>
                        <input required type="number" step="0.01" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} placeholder="Örn: 100" />
                      </div>
                   </div>

                   <div className="form-group">
                      <label>Stok Adedi</label>
                      <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Kritik Stok Sınırı (Sayı)</label>
                        <input required type="number" value={formData.criticalStock} onChange={e => setFormData({...formData, criticalStock: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="form-group">
                        <label>Kritik Stok Uyarı Metni</label>
                        <input required type="text" value={formData.criticalStockText} onChange={e => setFormData({...formData, criticalStockText: e.target.value})} placeholder="Örn: Kritik Stok Uyarısı!" />
                      </div>
                    </div>

                   <div className="form-row">
                     <div className="form-group">
                       <label>Tür</label>
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                           <option value="BOOK">Kitap</option>
                           <option value="MAGAZINE">Dergi</option>
                           <option value="ACCESSORY">Aksesuar / Promosyon</option>
                         </select>
                     </div>
                     <div className="form-group">
                       <label>Format</label>
                       <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})}>
                         <option value="PHYSICAL">Fiziksel (Basılı)</option>
                         <option value="DIGITAL">Dijital (E-Kitap/PDF)</option>
                       </select>
                     </div>
                   </div>

                   <div className="form-group">
                     <label>Görsel Yükle (Sürükle veya Seç)</label>
                     <ImageUpload value={formData.imageUrl} onChange={base64 => setFormData({...formData, imageUrl: base64})} />
                   </div>

                   <button type="submit" className="btn btn-primary w-full mt-4">Kataloğa Ekle</button>
                </form>
             </div>

             <div className="glass-panel list-section">
                <h2><Package /> Mevcut Ürünler ({products.length})</h2>
                <div className="admin-product-grid">
                   {products.length === 0 ? <p className="text-secondary">Henüz ürün eklenmemiş.</p> : null}
                   {products.map(p => (
                     <div key={p.id} className="admin-card" onClick={() => startEditing(p)}>
                        <img src={p.imageUrl || 'https://via.placeholder.com/300x200?text=Gorsel+Yok'} alt={p.title} className="admin-card-img" />
                        <div className="admin-card-content">
                           <div className="admin-card-title" title={p.title}>{p.title}</div>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <span className="admin-card-price">{p.price} ₺</span>
                             <span className="badge-sm" style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399' }}>Kâr: {(p.price - (p.costPrice || 0)).toFixed(2)} ₺</span>
                           </div>
                           <div style={{ marginTop: '8px' }}>
                             <span className="badge-sm">{p.type === 'BOOK' ? 'Kitap' : p.type === 'MAGAZINE' ? 'Dergi' : 'Aksesuar'}</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
         )}

         {/* 3. BLOG SEKMESI */}
         {activeTab === 'blogs' && (
           <div className="admin-grid animate-fade-in">
             <div className="glass-panel form-section">
                <h2><PlusCircle /> Yeni Blog Yazısı</h2>
                <form onSubmit={handleBlogSubmit} className="admin-form">
                   <div className="form-group">
                     <label>Yazı Başlığı</label>
                     <input required type="text" value={blogData.title} onChange={e => setBlogData({...blogData, title: e.target.value})} />
                   </div>
                   
                   <div className="form-group">
                     <label>İçerik (Metin)</label>
                     <textarea required rows={5} value={blogData.content} onChange={e => setBlogData({...blogData, content: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'12px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--glass-border)', color:'white'}}></textarea>
                   </div>

                   <div className="form-group">
                     <label>Blog Kapak Görseli</label>
                     <ImageUpload value={blogData.imageUrl} onChange={base64 => setBlogData({...blogData, imageUrl: base64})} />
                   </div>

                   <button type="submit" className="btn btn-outline w-full mt-4">Yazıyı Yayımla</button>
                </form>
             </div>
             
             <div className="glass-panel list-section">
                <h2><Package /> Yayınlanan Blog Yazıları ({posts.length})</h2>
                <div className="admin-product-grid">
                   {posts.length === 0 ? <p className="text-secondary">Henüz blog yazısı eklenmemiş.</p> : null}
                   {posts.map(post => (
                     <div key={post.id} className="admin-card" onClick={() => startEditingBlog(post)}>
                        <img src={post.imageUrl || 'https://via.placeholder.com/300x200?text=Gorsel+Yok'} alt={post.title} className="admin-card-img" />
                        <div className="admin-card-content">
                           <div className="admin-card-title" title={post.title}>{post.title}</div>
                           <span className="badge-sm" style={{ alignSelf: 'flex-start' }}>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>
         )}

         {/* 4. AYARLAR SEKMESI */}
         {activeTab === 'settings' && (
           <div className="admin-grid animate-fade-in" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
             <div className="glass-panel form-section">
                <h2><Settings /> Anasayfa Yönetimi</h2>
                <form onSubmit={handleSettingsSubmit} className="admin-form">
                   <div className="form-group">
                     <label>Hero Başlık</label>
                     <input required type="text" value={settingsData.heroTitle} onChange={e => setSettingsData({...settingsData, heroTitle: e.target.value})} />
                   </div>
                   <div className="form-group">
                     <label>Hero Alt Başlık</label>
                     <textarea required rows={2} value={settingsData.heroSubtitle} onChange={e => setSettingsData({...settingsData, heroSubtitle: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'12px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--glass-border)', color:'white'}}></textarea>
                   </div>
                   <div className="form-group">
                     <label>Banner Başlık</label>
                     <input required type="text" value={settingsData.bannerTitle} onChange={e => setSettingsData({...settingsData, bannerTitle: e.target.value})} />
                   </div>
                   <div className="form-group">
                     <label>Banner Açıklama</label>
                     <textarea required rows={2} value={settingsData.bannerDesc} onChange={e => setSettingsData({...settingsData, bannerDesc: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'12px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--glass-border)', color:'white'}}></textarea>
                   </div>
                   <div className="form-group">
                     <label>Instagram Linki</label>
                     <input type="url" value={settingsData.instagramUrl} onChange={e => setSettingsData({...settingsData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." />
                   </div>
                   <div className="form-group">
                     <label>Twitter (X) Linki</label>
                     <input type="url" value={settingsData.twitterUrl} onChange={e => setSettingsData({...settingsData, twitterUrl: e.target.value})} placeholder="https://twitter.com/..." />
                   </div>
                   <button type="submit" className="btn btn-outline w-full mt-4">Ayarları Kaydet</button>
                </form>
             </div>
           </div>
         )}

         {/* EDIT PRODUCT MODAL */}
         {editingProductId && editFormData && (
           <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditingProductId(null) }}>
             <div className="modal-content animate-fade-in">
               <div className="modal-header">
                 <h2 className="modal-title">Ürünü Düzenle</h2>
                 <button className="close-btn" type="button" onClick={() => setEditingProductId(null)}><X size={24} /></button>
               </div>
               <div className="admin-form">
                  <div className="form-group">
                    <label>Ürün Adı / Başlık</label>
                    <input type="text" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Açıklama</label>
                    <textarea rows={3} value={editFormData.description || ''} onChange={e => setEditFormData({...editFormData, description: e.target.value})} style={{width:'100%', padding:'12px', borderRadius:'12px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--glass-border)', color:'white'}}></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Satış Fiyatı (₺)</label>
                      <input type="number" step="0.01" value={editFormData.price} onChange={e => setEditFormData({...editFormData, price: e.target.value ? parseFloat(e.target.value) : 0})} />
                    </div>
                    <div className="form-group">
                      <label>Maliyet Fiyatı (₺)</label>
                      <input type="number" step="0.01" value={editFormData.costPrice} onChange={e => setEditFormData({...editFormData, costPrice: e.target.value ? parseFloat(e.target.value) : 0})} />
                    </div>
                  </div>
                  <div className="form-group">
                     <label>Stok Adedi</label>
                     <input type="number" value={editFormData.stock} onChange={e => setEditFormData({...editFormData, stock: e.target.value ? parseInt(e.target.value) : 0})} />
                   </div>

                   <div className="form-row">
                     <div className="form-group">
                       <label>Kritik Stok Sınırı (Sayı)</label>
                       <input type="number" value={editFormData.criticalStock} onChange={e => setEditFormData({...editFormData, criticalStock: e.target.value ? parseInt(e.target.value) : 0})} />
                     </div>
                     <div className="form-group">
                       <label>Kritik Stok Uyarı Metni</label>
                       <input type="text" value={editFormData.criticalStockText} onChange={e => setEditFormData({...editFormData, criticalStockText: e.target.value})} />
                     </div>
                   </div>
                  <div className="form-row">
                     <div className="form-group">
                       <label>Tür</label>
                         <select value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})}>
                           <option value="BOOK">Kitap</option>
                           <option value="MAGAZINE">Dergi</option>
                           <option value="ACCESSORY">Aksesuar / Promosyon</option>
                         </select>
                     </div>
                     <div className="form-group">
                       <label>Format</label>
                       <select value={editFormData.format} onChange={e => setEditFormData({...editFormData, format: e.target.value})}>
                         <option value="PHYSICAL">Fiziksel (Basılı)</option>
                         <option value="DIGITAL">Dijital (E-Kitap/PDF)</option>
                       </select>
                     </div>
                  </div>
                  <div className="form-group">
                    <label>Görsel Yükle</label>
                    <ImageUpload value={editFormData.imageUrl} onChange={base64 => setEditFormData({...editFormData, imageUrl: base64})} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <button onClick={() => handleUpdateProduct(editFormData.id)} className="btn btn-primary" style={{ flex: 1 }}>Kaydet</button>
                    <button onClick={() => handleDelete(editFormData.id)} className="btn btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>Sil</button>
                  </div>
               </div>
             </div>
           </div>
         )}

         {/* EDIT BLOG MODAL */}
         {editingBlogId && editBlogData && (
           <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditingBlogId(null) }}>
             <div className="modal-content animate-fade-in">
               <div className="modal-header">
                 <h2 className="modal-title">Blog Düzenle</h2>
                 <button className="close-btn" type="button" onClick={() => setEditingBlogId(null)}><X size={24} /></button>
               </div>
               <div className="admin-form">
                  <div className="form-group">
                    <label>Yazı Başlığı</label>
                    <input type="text" value={editBlogData.title} onChange={e => setEditBlogData({...editBlogData, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Görsel Yükle</label>
                    <ImageUpload value={editBlogData.imageUrl || ''} onChange={base64 => setEditBlogData({...editBlogData, imageUrl: base64})} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                    <button onClick={() => handleUpdateBlog(editBlogData.id)} className="btn btn-primary" style={{ flex: 1 }}>Kaydet</button>
                    <button onClick={() => handleBlogDelete(editBlogData.id)} className="btn btn-outline" style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444' }}>Sil</button>
                  </div>
               </div>
             </div>
           </div>
         )}

       </div>
    </div>
  );
};

export default Admin;
