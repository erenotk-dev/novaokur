import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Daha once gosterilmis mi kontrol et
    const shown = localStorage.getItem('exit_intent_shown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Fare pencerenin ustunden cikarsa (clientY <= 0) ve daha once gosterilmemisse
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    setHasShown(true);
    localStorage.setItem('exit_intent_shown', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={handleClose}>
      <div 
        className="modal-content animate-fade-in" 
        style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="close-btn" onClick={handleClose} style={{ top: '15px', right: '15px' }}>
          <X size={24} />
        </button>
        
        <div style={{ background: 'var(--accent-color)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Gift size={36} color="white" />
        </div>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '12px', fontFamily: '"Playfair Display", serif' }}>Bekle, Gitme! 📚</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
          Okuma saatlerini güzelleştirecek harika bir teklifimiz var. İlk alışverişine özel <strong>%10 indirim</strong> kazanmak ister misin?
        </p>
        
        <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '2px dashed var(--accent-color)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-color)', letterSpacing: '2px' }}>NOVA10</span>
        </div>
        
        <button onClick={handleClose} className="btn btn-primary w-full">
          Hemen İndirimi Kullan
        </button>
        
        <p style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          * Sadece yeni üyeler ve ilk alışveriş için geçerlidir.
        </p>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
