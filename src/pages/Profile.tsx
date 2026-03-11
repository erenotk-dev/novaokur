import { useEffect, useState } from 'react';
import { User, CreditCard, LogOut, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('nova_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      window.location.href = '/auth/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_token');
    window.location.href = '/';
  };

  if (!user) return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <div style={{ minHeight: '100vh', padding: '80px 24px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button 
            onClick={() => window.history.back()} 
            className="btn-icon" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '12px', border: '1px solid var(--glass-border)', cursor: 'pointer', transition: 'all 0.3s ease' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateX(-4px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateX(0)'; }}
          >
            <ArrowLeft size={24} color="var(--text-primary)" />
          </button>
          
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', margin: 0 }}>
            Hesabım
          </h1>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          
          {/* Kullanici Bilgileri */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{user.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                <span className="badge-sm" style={{ marginTop: '8px', display: 'inline-block' }}>{user.role === 'ADMIN' ? 'Yönetici' : 'Müşteri'}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}>
              <LogOut size={18} /> Çıkış Yap
            </button>
          </div>

          {/* Abonelik Durumu */}
          <div className="glass-panel" style={{ padding: '32px' }}>
             <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.25rem', marginBottom: '16px' }}>
               <CreditCard /> Abonelik Durumu
             </h3>
             <div style={{ padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Şu an aktif bir ücretli aboneliğiniz bulunmuyor. Binlerce yazarın eserlerine anında erişmek için NovaOkur planlarını inceleyebilirsiniz.
                </p>
                <a href="/subscriptions" className="btn btn-primary">Abonelikleri İncele</a>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
