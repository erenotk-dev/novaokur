import { useState } from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://novaokur.onrender.com/api/auth/login', formData);
      localStorage.setItem('nova_token', res.data.token);
      localStorage.setItem('nova_user', JSON.stringify(res.data.user));
      
      // Giris yaptiktan sonra role'a gore (VIP / Musteri) yonlendir
      if (res.data.user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper glass-panel">
      <div className="auth-container animate-fade-in">
        <h2 className="auth-title">Giriş Yap</h2>
        <p className="auth-subtitle">Tekrar hoş geldiniz, maceraya devam edelim.</p>
        
        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form delay-1">
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              required 
              type="email" 
              placeholder="E-Posta Adresiniz" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              required 
              type="password" 
              placeholder="Şifreniz" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button disabled={loading} type="submit" className="btn btn-primary w-full">
            {loading ? 'Giriş Yapılıyor...' : 'Oturum Aç'}
          </button>
        </form>

        <p className="auth-link delay-2">
          Henüz hesabınız yok mu? <a href="/auth/register">Kayıt Ol</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
