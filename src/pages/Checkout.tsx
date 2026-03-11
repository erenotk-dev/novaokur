import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { CreditCard, CheckCircle, ShieldCheck, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';
import '../styles/Checkout.css';

const SUB_PLANS: Record<string, {name: string, price: number}> = {
  'plan_1': { name: 'Dijital Okur (Aylık Plan)', price: 49.99 },
  'plan_2': { name: 'Premium Nova (Aylık Plan)', price: 149.99 }
};

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [checkoutType, setCheckoutType] = useState<string>('cart');
  const [subPlanDetails, setSubPlanDetails] = useState<any>(null);
  
  const [isSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');
    const planId = searchParams.get('plan');
    
    if (type === 'subscription' && planId && SUB_PLANS[planId]) {
      setCheckoutType('subscription');
      setSubPlanDetails(SUB_PLANS[planId]);
    } else if (items.length === 0 && !isSuccess) {
      window.location.href = '/cart';
    }
  }, [items, isSuccess]);

  const calculateTotal = () => {
    if (checkoutType === 'subscription' && subPlanDetails) {
       return subPlanDetails.price;
    }
    return getTotalPrice() + (getTotalPrice() > 150 ? 0 : 29.9);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Sahte Odeme Simulasyonu (2.5 saniye)
    setTimeout(() => {
      setLoading(false); // Changed from setIsProcessing to setLoading
      clearCart();
      alert(`🎉 Ödemeniz başarıyla alındı! \n\nSipariş Numaranız: NVK-${Math.floor(Math.random() * 1000000)}\n\nMüşteri İlişkileri: Siparişinizin detayları ve "Canlı Kargo Takip" linki e-posta adresinize gönderilmiştir.`);
      
      // Iletisim ve Musteri Iliskileri sayfalarina yonlendirilebilir veya anasayfaya
      window.location.href = '/';
    }, 2000); // Changed timeout to 2000ms
  };

  if (isSuccess) {
    return (
      <div className="checkout-layout success-screen">
        <div className="glass-panel success-card animate-fade-in">
          <div className="success-icon-wrapper">
             <CheckCircle size={64} color="#34d399" />
          </div>
          <h1>Ödeme Başarılı!</h1>
          <p className="text-secondary mb-4">Siparişiniz (#NOVR-{Math.floor(1000 + Math.random() * 9000)}) başarıyla alınmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.</p>
          <a href={checkoutType === 'subscription' ? "/profile" : "/products"} className="btn btn-primary">
             {checkoutType === 'subscription' ? 'Aboneliğimi Gör' : 'Alışverişe Dön'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-layout">
      {/* Navbar Ozet */}
      <nav className="glass-panel navbar" style={{ position: 'relative', marginTop: '24px', marginBottom: '40px' }}>
        <div className="nav-brand"><a href="/">NovaOkur</a></div>
        <div className="nav-links">
           <a href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={18} /> Sepete Dön
           </a>
        </div>
      </nav>

      <div className="container checkout-grid animate-fade-in">
        
        {/* Sol Taraf: Odeme ve Adres Formu */}
        <div className="checkout-form-section">
          <h1 className="checkout-title" style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', marginBottom: '32px' }}>
            Güvenli Ödeme
          </h1>

          <form onSubmit={handlePayment} className="glass-panel payment-form">
            {checkoutType !== 'subscription' && (
              <>
                <h3 className="form-section-title"><MapPin size={20} /> Teslimat Bilgileri</h3>
                <div className="floating-group">
                   <input required={checkoutType !== 'subscription'} type="text" id="name" placeholder=" " value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                   <label htmlFor="name">Ad Soyad</label>
                </div>
                
                <div className="form-row">
                  <div className="floating-group" style={{ flex: 2 }}>
                     <input required={checkoutType !== 'subscription'} type="text" id="address" placeholder=" " value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                     <label htmlFor="address">Açık Adres (Mahalle, Sokak...)</label>
                  </div>
                  <div className="floating-group" style={{ flex: 1 }}>
                     <input required={checkoutType !== 'subscription'} type="text" id="city" placeholder=" " value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                     <label htmlFor="city">Şehir</label>
                  </div>
                </div>

                <hr className="form-divider" />
              </>
            )}

            <h3 className="form-section-title"><CreditCard size={20} /> Kart Bilgileri (Mock)</h3>
            <div className="floating-group">
               <input required type="text" id="card" placeholder=" " maxLength={19} value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
               <label htmlFor="card">Kart Numarası</label>
            </div>
            
            <div className="form-row">
              <div className="floating-group">
                 <input required type="text" id="expiry" placeholder=" " maxLength={5} value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                 <label htmlFor="expiry">Son Kullanma (AA/YY)</label>
              </div>
              <div className="floating-group">
                 <input required type="text" id="cvv" placeholder=" " maxLength={3} value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} />
                 <label htmlFor="cvv">CVV Güvenlik Kodu</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full pay-btn" disabled={loading}>
               {loading ? 'İşleminiz Gerçekleştiriliyor...' : `Ödemeyi Tamamla • ${calculateTotal().toFixed(2)} ₺`}
            </button>
            <div className="payment-trust-signals">
               <span className="card-brand visa">VISA</span>
               <span className="card-brand mc">mastercard</span>
               <span className="card-brand troy">TROY</span>
               <span className="card-brand amex">AMEX</span>
            </div>
            <p className="secure-badge"><ShieldCheck size={16} color="#34d399"/> 256-bit SSL Güvencesiyle Şifrelenmiştir</p>
          </form>
        </div>

        {/* Sag Taraf: Siparis Ozeti */}
        <div className="checkout-summary-section delay-1">
           <div className="cart-summary glass-panel sticky-summary">
              <h2>Sipariş Özeti ({checkoutType === 'subscription' ? '1 Abonelik' : `${items.length} Ürün`})</h2>
              
              <div className="checkout-items-mini">
                 {checkoutType === 'subscription' && subPlanDetails ? (
                   <div className="mini-item">
                      <div className="mini-image">
                         <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:'bold', background:'var(--accent-color)', color:'white'}}>NOVA</div>
                      </div>
                      <div className="mini-details">
                         <h4>{subPlanDetails.name}</h4>
                         <span>{subPlanDetails.price} ₺ / ay</span>
                      </div>
                   </div>
                 ) : (
                    items.map(item => (
                      <div key={item.id} className="mini-item">
                         <div className="mini-image">
                            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <div>Yok</div>}
                            <span className="mini-qty">{item.quantity}</span>
                         </div>
                         <div className="mini-details">
                            <h4>{item.title}</h4>
                            <span>{item.price} ₺</span>
                         </div>
                      </div>
                    ))
                 )}
              </div>

              <hr className="summary-divider" />
              <div className="summary-row">
                 <span>Ara Toplam</span>
                 <span>{checkoutType === 'subscription' ? subPlanDetails?.price.toFixed(2) : getTotalPrice().toFixed(2)} ₺</span>
              </div>
              <div className="summary-row">
                 <span>Kargo Ücreti</span>
                 <span>{checkoutType === 'subscription' ? 'Ücretsiz' : (getTotalPrice() > 150 ? 'Ücretsiz' : '29.90 ₺')}</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-row total">
                 <span>Ödenecek Tutar</span>
                 <span className="accent-text">{calculateTotal().toFixed(2)} ₺</span>
              </div>

              {/* GOREV B: 14 Gun Sartisiz Iade Garantisi (Guven ve Dokunma Dezavantaji) */}
              <div className="guarantee-box" style={{ marginTop: '24px', padding: '16px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                 <RefreshCw color="#34d399" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                 <div>
                    <h4 style={{ color: '#34d399', margin: '0 0 4px 0', fontSize: '1rem' }}>Sıfır Risk, %100 Güven</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      Dönem Projesi güvencesiyle; satın aldığınız ürünleri dokusunu veya içeriğini beğenmemeniz durumunda <strong>14 gün içinde koşulsuz şartsız</strong> iade edebilirsiniz.
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
