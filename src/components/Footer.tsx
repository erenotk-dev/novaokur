import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, ShieldCheck, CreditCard, Clock, Instagram, Twitter } from 'lucide-react';
import '../styles/Footer.css';

const formatSocialLink = (url: string, platform: 'instagram' | 'twitter') => {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('@') || !trimmed.includes('/')) {
    const cleanUsername = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
    return platform === 'instagram' 
      ? `https://instagram.com/${cleanUsername}` 
      : `https://twitter.com/${cleanUsername}`;
  }
  return `https://${trimmed}`;
};

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({ 
    instagram: 'https://instagram.com/novaokur', 
    twitter: 'https://twitter.com/novaokur' 
  });

  useEffect(() => {
    axios.get('https://novaokur.onrender.com/api/settings')
      .then(res => {
        if (res.data) {
          if (res.data.instagramUrl !== undefined) {
             setSocialLinks({
               instagram: res.data.instagramUrl || '',
               twitter: res.data.twitterUrl || ''
             });
          }
        }
      })
      .catch(err => console.error("Ayarlar alinamadi (Sunucu henuz guncellenmemis olabilir)", err));
  }, []);

  return (
    <footer className="glass-panel site-footer">
      <div className="container footer-grid">
        
        {/* Brand & About */}
        <div className="footer-col brand-col">
          <div className="nav-brand" style={{ marginBottom: '20px' }}>
            <img src="/logo.svg" alt="NovaOkur Logo" className="brand-logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <p className="footer-desc">
            Sınırsız bilgi ve hikaye evreni. Dijital arşivimize limitsiz erişim sağlayın veya her ay kapınıza fiziksel dergi/kitap getiren Premium aboneliklerimizle okuma alışkanlığınızı baştan yaratın.
          </p>
          <div className="social-links" style={{ display: 'flex', gap: '15px', marginTop: '15px', marginBottom: '20px' }}>
            {socialLinks.instagram && (
              <a href={formatSocialLink(socialLinks.instagram, 'instagram')} target="_blank" rel="noopener noreferrer" className="social-icon" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#E1306C'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Instagram size={24} />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={formatSocialLink(socialLinks.twitter, 'twitter')} target="_blank" rel="noopener noreferrer" className="social-icon" style={{ color: 'var(--text-secondary)', transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#1DA1F2'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Twitter size={24} />
              </a>
            )}
          </div>
          <div className="trust-badges">
            <div className="trust-badge-item"><ShieldCheck size={18}/> <span>256-Bit SSL Güvencesi</span></div>
            <div className="trust-badge-item"><CreditCard size={18}/> <span>Güvenli Ödeme Altyapısı</span></div>
          </div>
        </div>

        {/* Kurumsal */}
        <div className="footer-col">
          <h3>Kurumsal</h3>
          <ul>
            <li><a href="/about">Hakkımızda</a></li>
            <li><a href="/contact">İletişim & Destek</a></li>
            <li><a href="/blog">Blog & Haberler</a></li>
            <li><a href="/careers">Kariyer</a></li>
          </ul>
        </div>

        {/* Musteri Hizmetleri */}
        <div className="footer-col">
          <h3>Müşteri Hizmetleri</h3>
          <ul>
            <li><a href="/faq">Sıkça Sorulan Sorular</a></li>
            <li><a href="/returns">İade ve İptal Koşulları</a></li>
            <li><a href="/shipping">Kargo ve Teslimat</a></li>
            <li><a href="/privacy">Gizlilik Politikası</a></li>
          </ul>
        </div>

        {/* Iletisim Bilgileri */}
        <div className="footer-col contact-col">
          <h3>İletişim</h3>
          <ul className="contact-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Esentepe Mah. Büyükdere Cad. No: 123<br/>Şişli / İstanbul</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>0850 123 45 67<br/><small>(Hafta içi 09:00 - 18:00)</small></span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>destek@novaokur.com</span>
            </li>
            <li>
              <Clock size={18} className="contact-icon" />
              <span className="guarantee-text">14 Gün Şartsız İade Garantisi</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} NovaOkur Teknoloji A.Ş. Tüm hakları saklıdır.</p>
          <div className="bottom-links">
            <a href="/terms">Kullanım Şartları</a>
            <a href="/cookies">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
