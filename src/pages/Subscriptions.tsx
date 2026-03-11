import { Check, Star, Zap } from 'lucide-react';
import '../styles/Subscriptions.css';

const Subscriptions = () => {

  // Sahte Abonelik Planlari (Normalde Veritabanindan gelir, ancak hizli gosterim icin frontend'de tanimliyoruz)
  const plans = [
    {
      id: 'plan_1',
      name: 'Dijital Okur',
      price: '49.99 ₺',
      period: '/ ay',
      icon: <Zap className="plan-icon" color="#3b82f6" />,
      popular: false,
      features: [
        'Tüm E-Kitaplara Sınırsız Erişim',
        'Dijital Dergi Arşivi',
        'Çevrimdışı Okuma',
        'Reklam Yok'
      ]
    },
    {
      id: 'plan_2',
      name: 'Premium Nova',
      price: '149.99 ₺',
      period: '/ ay',
      icon: <Star className="plan-icon" color="#f59e0b" />,
      popular: true,
      features: [
        'Dijital Okur\'un Tüm Özellikleri',
        'Her Ay 1 Adet Fiziksel Dergi Gönderimi',
        'Öncelikli Kargo İmkanı',
        'Yazarlarla Özel Soru-Cevap'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    // Odeme sistemi mockup'i
    const userStr = localStorage.getItem('nova_user');
    if (!userStr) {
      alert("Abonelik satın almak için önce giriş yapmalısınız!");
      window.location.href = '/auth/login';
      return;
    }
    
    // Profesyonel Checkout sayfasina URL Parametreleri ile yonlendiriliyor
    window.location.href = `/checkout?type=subscription&plan=${planId}`;
  };

  return (
    <div className="subs-layout">
      {/* Navbar (Ortak Bilesenler Olarak Ayrilacak) */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
      </nav>

      <div className="container subs-container animate-fade-in">
        <div className="subs-header">
          <h1 className="subs-title">Okuma Alışkanlığınızı <span className="text-gradient">Sınırsızlaştırın</span></h1>
          <p className="subs-subtitle">Size en uygun planı seçin, binlerce kitaba ve özel gönderimli dergilere anında ulaşın.</p>
        </div>

        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div key={plan.id} className={`plan-card glass-panel delay-${index + 1} ${plan.popular ? 'popular-plan' : ''}`}>
              {plan.popular && <div className="popular-badge">En Çok Tercih Edilen</div>}
              
              <div className="plan-header">
                {plan.icon}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price-box">
                  <span className="plan-price">{plan.price}</span>
                  <span className="plan-period">{plan.period}</span>
                </div>
              </div>

              <div className="plan-features">
                {plan.features.map((feature, i) => (
                  <div key={i} className="feature-item">
                    <Check size={18} className="check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan.id)}
                className={`btn w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
              >
                Planı Seç
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
