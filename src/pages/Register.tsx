import { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';
import '../styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('https://novaokur.onrender.com/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kayıt işlemi başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper glass-panel">
      <div className="auth-container animate-fade-in">
        <h2 className="auth-title">Kayıt Ol</h2>
        <p className="auth-subtitle">NovaOkur'un ayrıcalıklı dünyasına katılın.</p>
        
        {error && <div className="auth-alert error">{error}</div>}
        {success && <div className="auth-alert success">Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</div>}

        <form onSubmit={handleSubmit} className="auth-form delay-1">
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              required 
              type="text" 
              placeholder="Adınız Soyadınız" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
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
            {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <p className="auth-link delay-2">
          Zaten hesabınız var mı? <a href="/auth/login">Giriş Yap</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
