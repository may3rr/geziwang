import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">📅</span>
          <span className="logo-text">Event Planner</span>
        </Link>

        <button 
          className={`mobile-menu-button ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          {isLoggedIn ? (
            <>
              <Link 
                to="/events" 
                className={`nav-link ${isActive('/events') ? 'active' : ''}`}
              >
                <i className="fas fa-calendar-alt"></i>
                活动列表
              </Link>
              <Link 
                to="/events/create" 
                className={`nav-link ${isActive('/events/create') ? 'active' : ''}`}
              >
                <i className="fas fa-plus-circle"></i>
                发起活动
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <i className="fas fa-user"></i>
                个人中心
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i>
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                登录
              </Link>
              <Link 
                to="/register" 
                className={`nav-link register-link ${isActive('/register') ? 'active' : ''}`}
              >
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
