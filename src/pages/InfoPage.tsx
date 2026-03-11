import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, HelpCircle, FileText, Anchor } from 'lucide-react';
import '../styles/InfoPage.css';

const INFO_PAGES: Record<string, any> = {
  '/about': {
    title: 'Hakkımızda',
    icon: <Anchor size={32} className="text-secondary" />,
    content: `
      <h2>Biz Kimiz?</h2>
      <p>NovaOkur, 2026 yılında edebiyat ve dijital yayıncılık dünyasına yeni bir soluk getirmek amacıyla kurulmuş vizyoner bir platformdur.</p>
      <p>Amacımız sadece bir "e-ticaret sitesi" olmak değil; okumayı sevenlerin bir araya geldiği, keşfettiği ve paylaştığı devasa bir <strong>bilgi ve hikaye evreni</strong> yaratmaktır.</p>
      
      <h2>Neler Yapıyoruz?</h2>
      <p>Platformumuz üzerinden hem geleneksel basılı kitaplara ve dergilere ulaşabilir, hem de çevre dostu e-kitap ve dijital dergi arşivimizden dilediğiniz gibi faydalanabilirsiniz.</p>
      <p>Premium abonelik modellerimiz sayesinde her ay kapınıza fiziksel sürprizler gönderirken, tabletlerinizden sınırsız bir kütüphaneye erişim hakkı tanıyoruz.</p>
    `
  },
  '/faq': {
    title: 'Sıkça Sorulan Sorular',
    icon: <HelpCircle size={32} className="text-secondary" />,
    content: `
      <div class="faq-item">
        <h3>Aboneliği İstediğim Zaman İptal Edebilir Miyim?</h3>
        <p>Kesinlikle evet. Abonelik menüsü altından hiçbir taahhüt ödemeden dilediğiniz ay aboneliğinizi dondurabilir veya tamamen sonlandırabilirsiniz.</p>
      </div>
      <div class="faq-item">
        <h3>Basılı Ürünler Ne Zaman Kargoya Verilir?</h3>
        <p>Siparişleriniz ortalama 24 saat içinde işleme alınır ve 1-3 iş günü içerisinde size teslim edilir.</p>
      </div>
      <div class="faq-item">
        <h3>Fiziksel Mağazanız Var Mı?</h3>
        <p>Şu an için tüm operasyonlarımız yalnızca dijital ortamda (e-ticaret) yürütülmektedir. Merkez ofisimizde elden satış/teslimat yapılmamaktadır.</p>
      </div>
    `
  },
  '/returns': {
    title: 'İade ve İptal Koşulları',
    icon: <ShieldCheck size={32} className="text-secondary" />,
    content: `
      <h2>14 Gün Koşulsuz İade Garantisi (Sıfır Risk)</h2>
      <p>Platformumuzdan satın aldığınız tüm fiziksel (basılı) kitap ve dergiler <strong>"Dönem Projesi Görev B"</strong> güvencesi altındadır.</p>
      <p>Ürünü teslim aldığınız tarihten itibaren <strong>14 gün içinde</strong> hiçbir sebep göstermeksizin iade edebilir ve paranızı eksiksiz geri alabilirsiniz.</p>
      
      <h2>İade Süreci Nasıl İşler?</h2>
      <ul>
         <li>İletişim formundan "İade Talebi" konusuyla bize sipariş numaranızı iletin.</li>
         <li>Size vereceğimiz anlaşmalı kargo koduyla kitabı ücretsiz olarak bize gönderin.</li>
         <li>Geniş ekibimiz tarafından kitabın okunmamış ve zarar görmemiş olduğu teyit edildikten sonra 3 iş günü içinde paranız iade edilecektir.</li>
      </ul>
      <p style="color: var(--accent-light); margin-top: 20px;"><em>Not: Dijital (E-Kitap) satışlarında doğası gereği iptal ve iade yapılamamaktadır.</em></p>
    `
  },
  '/privacy': {
    title: 'Gizlilik ve Çerez Politikası',
    icon: <FileText size={32} className="text-secondary" />,
    content: `
      <h2>Verileriniz Güvende</h2>
      <p>NovaOkur platformunda SSL şifreleme yöntemleri (256-bit) kullanılmaktadır. Kredi kartı bilgileriniz sunucularımızda saklanmaz, doğrudan güvenli ödeme altyapısı (Mock) ile bankanıza iletilir.</p>
      <h2>Çerezler (Cookies) Neden Kullanılır?</h2>
      <p>Kullanıcı deneyimini artırmak (örneğin sepetinizi kaydetmek), site trafiklerini analiz etmek ve size uygun edebiyat önerileri sunabilmek için cihazınızda ufak çerez dosyaları barındırıyoruz.</p>
    `
  }
};

const InfoPage = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    // URL path bilgisini alip veriyi cek
    const path = location.pathname;
    const data = INFO_PAGES[path] || { 
      title: 'Sayfa Bulunamadı', 
      content: '<p>Aradığınız bilgilendirme sayfası mevcut değil veya taşınmış.</p>' 
    };
    setPageData(data);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!pageData) return null;

  return (
    <div className="info-layout">
      {/* Navbar Ozet */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
        <div className="nav-links">
           <a href="/products">Ürünler</a>
        </div>
      </nav>

      <div className="container animate-fade-in">
         <div className="info-header">
            {pageData.icon && <div className="info-icon delay-1">{pageData.icon}</div>}
            <h1 className="delay-2">{pageData.title}</h1>
         </div>

         <div className="info-content-box glass-panel delay-3">
            <div 
              className="info-html-content"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
         </div>

         <div className="info-actions delay-4">
            <a href="/contact" className="btn btn-outline">Başka Sorunuz Mu Var? Bizimle İletişime Geçin <ArrowRight size={16} /></a>
         </div>
      </div>
    </div>
  );
};

export default InfoPage;
