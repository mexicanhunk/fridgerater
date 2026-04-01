import { useState } from 'react';
import { X, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import s from './AuthModal.module.css';

export default function AuthModal({ onClose, defaultTab = 'login' }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  function set(field) {
    return e => { setForm(f => ({ ...f, [field]: e.target.value })); setError(''); };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.username, form.email, form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <button className={s.close} onClick={onClose}><X size={18} /></button>

        <div className={s.brand}>
          <div className={s.brandIcon}>❄</div>
          <span className={s.brandName}>FridgeRater</span>
        </div>

        <div className={s.tabs}>
          <button className={`${s.tab} ${tab === 'login' ? s.tabActive : ''}`} onClick={() => { setTab('login'); setError(''); }}>Log in</button>
          <button className={`${s.tab} ${tab === 'register' ? s.tabActive : ''}`} onClick={() => { setTab('register'); setError(''); }}>Sign up</button>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className={s.field}>
              <label>Username</label>
              <input
                type="text"
                placeholder="e.g. jamesm"
                value={form.username}
                onChange={set('username')}
                required
                minLength={2}
                maxLength={30}
                pattern="[a-zA-Z0-9_]+"
                autoComplete="username"
              />
            </div>
          )}

          <div className={s.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              required
              autoComplete="email"
            />
          </div>

          <div className={s.field}>
            <label>Password</label>
            <div className={s.pwWrap}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder={tab === 'register' ? 'At least 8 characters' : '••••••••'}
                value={form.password}
                onChange={set('password')}
                required
                minLength={tab === 'register' ? 8 : 1}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <div className={s.error}>{error}</div>}

          <button type="submit" className={s.submitBtn} disabled={loading}>
            {loading ? <Loader size={16} className={s.spin} /> : null}
            {loading ? 'Please wait…' : tab === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className={s.switch}>
          {tab === 'login' ? (
            <>Don't have an account? <button onClick={() => { setTab('register'); setError(''); }}>Sign up free</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setTab('login'); setError(''); }}>Log in</button></>
          )}
        </p>

        {tab === 'login' && (
          <p className={s.demo}>
            Demo: <code>james@example.com</code> / <code>demo123</code>
          </p>
        )}
      </div>
    </div>
  );
}
