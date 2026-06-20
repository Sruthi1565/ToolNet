import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';

const Header = () => {
  const { isAuthenticated, logout, currentUserName, currentUserProfileImage } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Home', to: '/home' },
    { label: 'Add Tool', to: '/addtool' },
    { label: 'My Tools', to: '/mytools' },
    { label: 'Requests', to: '/requests' },
    { label: 'Cart', to: '/cart' },
    { label: 'Orders', to: '/orders' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to={isAuthenticated ? '/home' : '/'} className="brand-mark">
          <span className="brand-mark__badge">TN</span>
          <span>ToolNet</span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="site-nav">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-user">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="profile-link">
                <img
                  src={currentUserProfileImage || imag}
                  alt=""
                  className="avatar"
                />
                <span>{currentUserName || 'User'}</span>
              </Link>
              <button type="button" className="btn btn-soft" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="header-action">Login</Link>
              <Link to="/createuser" className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
