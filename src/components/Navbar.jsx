import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BarChart2, Star, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import s from './Navbar.module.css';

export default function Navbar({ compareCount }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [modal, setModal] = useState(null); // 'login' | 'register' | null
  const [userMenu, setUserMenu] = useState(false);

  return (
    <>
      <nav className={s.nav}>
        <Link to="/" className={s.logo}>
          <div className={s.logoIcon}>❄</div>
          FridgeRater
        </Link>

        <div className={s.links}>
          <Link to="/" className={`${s.link} ${pathname === '/' ? s.active : ''}`}>
            <Search size={14} /> Browse
          </Link>
          <Link to="/compare" className={`${s.link} ${pathname === '/compare' ? s.active : ''}`}>
            <BarChart2 size={14} />
            Compare
            {compareCount > 0 && <span className={s.count}>{compareCount}</span>}
          </Link>
          <Link to="/submit" className={`${s.link} ${pathname === '/submit' ? s.active : ''}`}>
            <Star size={14} /> Submit a fridge
          </Link>
        </div>

        <div className={s.actions}>
          {user ? (
            <div className={s.userWrap}>
              <button className={s.userBtn} onClick={() => setUserMenu(v => !v)}>
                <div className={s.avatar}>{user.username.slice(0, 2).toUpperCase()}</div>
                <span className={s.username}>{user.username}</span>
                <ChevronDown size={14} />
              </button>
              {userMenu && (
                <div className={s.dropdown}>
                  <div className={s.dropEmail}>{user.email}</div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className={s.dropItem} onClick={() => setUserMenu(false)}>Admin panel</Link>
                  )}
                  <button className={s.dropItem} onClick={() => { logout(); setUserMenu(false); }}>
                    <LogOut size={13} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className={s.btnGhost} onClick={() => setModal('login')}>Log in</button>
              <button className={s.btnPrimary} onClick={() => setModal('register')}>Sign up free</button>
            </>
          )}
        </div>
      </nav>

      {modal && <AuthModal defaultTab={modal} onClose={() => setModal(null)} />}
    </>
  );
}
