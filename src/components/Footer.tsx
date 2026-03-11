import { BookOpen, MapPin, Phone, Mail, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="glass-panel site-footer">
      <div className="container footer-grid">
        
        {/* Brand & About */}
        <div className="footer-col brand-col">
          <div className="nav-brand">
            <BookOpen className="brand-icon" />
            <span>NovaOkur</span>
          </div>
          <p className="footer-desc">
            Sınırsız bilgi ve hikaye evreni. Dijital arşivimize limitsiz erişim sağlayın veya her ay kapınıza fiziksel dergi/kitap getiren Premium aboneliklerimizle okuma alışkanlığınızı baştan yaratın.
          </p>
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
