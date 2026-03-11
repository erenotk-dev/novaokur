import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Trash2, Package, Users, FileText, Settings } from 'lucide-react';
import '../styles/Admin.css';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: string;
  format: string;
  stock: number;
  imageUrl: string;
}

interface BlogPost {
  id: string;
  title: string;
  createdAt: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', type: 'BOOK', format: 'PHYSICAL', stock: '', imageUrl: ''
  });

  const [blogData, setBlogData] = useState({
    title: '', content: '', imageUrl: ''
  });

  const [settingsData, setSettingsData] = useState({
    heroTitle: '', heroSubtitle: '', bannerTitle: '', bannerDesc: ''
  });

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
        setSettingsData(resSettings.data);
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
      await axios.post('https://novaokur.onrender.com/api/products', formData);
      alert('Ürün başarıyla eklendi!');
      setFormData({ title: '', description: '', price: '', type: 'BOOK', format: 'PHYSICAL', stock: '', imageUrl: '' });
      fetchData(); // Listeyi guncelle
    } catch (error) {
       alert('Ürün eklenirken hata oluştu.');
    }
  };

  // Yeni Blog Yazisi Ekle
  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://novaokur.onrender.com/api/posts', blogData);
      alert('Blog yazısı başarıyla eklendi!');
      setBlogData({ title: '', content: '', imageUrl: '' });
      fetchData();
    } catch (error) {
      alert('Blog eklenirken hata oluştu.');
    }
  };

  // Ayarlari Guncelle
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://novaokur.onrender.com/api/settings', settingsData);
      alert('Anasayfa ayarları başarıyla güncellendi!');
    } catch (error) {
       alert('Ayarlar güncellenirken hata oluştu.');
    }
  };

  // Urun Sil
  const handleDelete = async (id: string) => {
    if(window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`https://novaokur.onrender.com/api/products/${id}`);
        fetchData();
      } catch (error) {
        alert('Silinemedi.');
      }
    }
  };

  // Blog Sil
  const handleBlogDelete = async (id: string) => {
    if(window.confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`https://novaokur.onrender.com/api/posts/${id}`);
        fetchData();
      } catch (error) {
        alert('Silinemedi.');
      }
    }
  };

  return (
    <div className="admin-layout">
       <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur (Yönetim Paneli)</a></div>
       </nav>

       <div className="container">
         {/* DASHBOARD ISTATISTIKLERI */}
         <div className="admin-stats-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
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
         </div>

         <div className="admin-grid">
         {/* Sol Taraf: Urun Ekleme Formu */}
         <div className="glass-panel form-section animate-fade-in">
            <h2><PlusCircle /> Yeni Ürün Ekle</h2>
            <form onSubmit={handleSubmit} className="admin-form">
               <div className="form-group">
                 <label>Ürün Adı / Başlık</label>
                 <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               
               <div className="form-row">
                 <div className="form-group">
                   <label>Fiyat (₺)</label>
                   <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                 </div>
                 <div className="form-group">
                   <label>Stok Adedi</label>
                   <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
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
                 <label>Görsel URL (Link)</label>
                 <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
               </div>

               <button type="submit" className="btn btn-primary w-full mt-4">Kataloğa Ekle</button>
            </form>

            <h2 style={{marginTop: '40px'}}><PlusCircle /> Yeni Blog Yazısı</h2>
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
                 <label>Görsel URL (Link)</label>
                 <input type="text" value={blogData.imageUrl} onChange={e => setBlogData({...blogData, imageUrl: e.target.value})} placeholder="https://..." />
               </div>

               <button type="submit" className="btn btn-outline w-full mt-4">Yazıyı Yayımla</button>
            </form>

            <h2 style={{marginTop: '40px'}}><Settings /> Anasayfa Yönetimi</h2>
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
               <button type="submit" className="btn btn-outline w-full mt-4">Ayarları Kaydet</button>
            </form>
         </div>

         {/* Sag Taraf: Tablolar Listesi */}
         <div className="glass-panel list-section animate-fade-in delay-1">
            
            {/* Stok Uyarisi (Gorev C) */}
            <h2 style={{ color: '#ef4444' }}><Package /> Kritik Stok Uyarıları (Yeniden Sipariş)</h2>
            <div className="admin-product-list" style={{marginBottom: '40px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '16px' }}>
               {products.filter(p => p.format === 'PHYSICAL' && p.stock <= 45).length === 0 ? (
                 <p className="text-secondary" style={{margin: 0}}>Tüm fiziksel ürün stokları yeterli seviyede.</p>
               ) : (
                 products.filter(p => p.format === 'PHYSICAL' && p.stock <= 45).map(p => (
                   <div key={`alert-${p.id}`} className="admin-product-item" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: '4px solid #ef4444', marginBottom: '8px' }}>
                      <div className="info">
                         <strong style={{ color: '#fca5a5' }}>{p.title}</strong>
                         <span className="badge-sm" style={{ background: '#ef4444', color: 'white' }}>Kalan: {p.stock} Adet</span>
                         <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tedarikçiyi Ara!</span>
                      </div>
                   </div>
                 ))
               )}
            </div>

            <h2><Package /> Mevcut Ürünler ({products.length})</h2>
            <div className="admin-product-list" style={{marginBottom: '40px'}}>
               {products.length === 0 ? <p className="text-secondary">Henüz ürün eklenmemiş.</p> : null}
               {products.map(p => (
                 <div key={p.id} className="admin-product-item glass-panel">
                    <div className="info">
                       <strong>{p.title}</strong>
                       <span className="badge-sm">{p.type === 'BOOK' ? 'Kitap' : p.type === 'MAGAZINE' ? 'Dergi' : 'Aksesuar'}</span>
                       <span>{p.price} ₺</span>
                    </div>
                    <button onClick={() => handleDelete(p.id)} className="btn-icon delete-btn"><Trash2 size={18} /></button>
                 </div>
               ))}
            </div>

            <h2 style={{marginTop: '20px'}}><Package /> Yayınlanan Blog Yazıları ({posts.length})</h2>
            <div className="admin-product-list">
               {posts.length === 0 ? <p className="text-secondary">Henüz blog yazısı eklenmemiş.</p> : null}
               {posts.map(post => (
                 <div key={post.id} className="admin-product-item glass-panel">
                    <div className="info">
                       <strong>{post.title}</strong>
                       <span className="badge-sm">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <button onClick={() => handleBlogDelete(post.id)} className="btn-icon delete-btn"><Trash2 size={18} /></button>
                 </div>
               ))}
            </div>
         </div>
       </div>
     </div>
    </div>
  );
};

export default Admin;
