import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Sahte Gonderim Simulasyonu
    setTimeout(() => {
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSent(false), 5000); // 5sn sonra basari mesajini kaldir
    }, 800);
  };

  return (
    <div className="contact-layout">
      {/* Navbar Ozet */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
        <div className="nav-links">
           <a href="/products">Ürünler</a>
        </div>
      </nav>

      <div className="container animate-fade-in">
        <div className="contact-header">
           <h1>Bizimle İletişime <span className="text-gradient">Geçin</span></h1>
           <p>Bir sorunuz mu var? Abonelik sistemimiz hakkında bilgi mi almak istiyorsunuz? Ya da sadece bir kitap önermek mi... Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyar.</p>
        </div>

        <div className="contact-grid">
           {/* Sol Taraf - Iletisim Bilgileri */}
           <div className="contact-info-section delay-1">
              <div className="glass-panel info-card">
                 <div className="icon-wrapper"><MapPin size={28} /></div>
                 <div>
                    <h3>Genel Merkez & Depo</h3>
                    <p>Esentepe Mah. Büyükdere Cad. No: 123<br/>Şişli / İstanbul, Türkiye</p>
                 </div>
              </div>

              <div className="glass-panel info-card">
                 <div className="icon-wrapper"><Phone size={28} /></div>
                 <div>
                    <h3>Müşteri Hizmetleri</h3>
                    <p>0850 123 45 67</p>
                    <small>Hafta içi her gün: 09:00 - 18:00</small>
                 </div>
              </div>

              <div className="glass-panel info-card">
                 <div className="icon-wrapper"><Mail size={28} /></div>
                 <div>
                    <h3>E-Posta Desteği</h3>
                    <p>destek@novaokur.com</p>
                    <p>kurumsal@novaokur.com</p>
                 </div>
              </div>
           </div>

           {/* Sag Taraf - Mesaj Formu */}
           <div className="glass-panel contact-form-section delay-2">
              <h2><MessageSquare className="title-icon" /> Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                 <div className="form-row">
                    <div className="floating-group">
                       <input required type="text" id="name" placeholder=" " value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       <label htmlFor="name">Adınız Soyadınız</label>
                    </div>
                    <div className="floating-group">
                       <input required type="email" id="email" placeholder=" " value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                       <label htmlFor="email">E-Posta Adresiniz</label>
                    </div>
                 </div>

                 <div className="floating-group">
                    <input required type="text" id="subject" placeholder=" " value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                    <label htmlFor="subject">Konu</label>
                 </div>

                 <div className="floating-group full-width">
                    <textarea required id="message" rows={5} placeholder=" " value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                    <label htmlFor="message">Mesajınız...</label>
                 </div>

                 <button type="submit" className="btn btn-primary w-full send-btn">
                    <Send size={18} /> Mesajı Gönder
                 </button>

                 {isSent && (
                    <div className="success-message animate-fade-in">
                       ✅ Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.
                    </div>
                 )}
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
