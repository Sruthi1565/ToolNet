import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';
import {useNavigate} from 'react-router-dom'


const Header = () => {
  const { isAuthenticated, logout, currentUserName, currentUserProfileImage } = useContext(UserContext);
  console.log(currentUserProfileImage);

  const navigate = useNavigate(); // Import useNavigate hook

  const handleLogout = () => {
    logout();      // Call the logout function from UserContext
    navigate('/');  // Navigate to the home page after logout
  };

  return (
    <header 
      className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 border-bottom" 
      style={{ 
          background: 'linear-gradient(to right, #009688, #00796b)' // Teal gradient
      }}
    >
      {/* App name positioned at the left-most side */}
      <div className="col-md-3 mb-2 mb-md-0 d-flex align-items-center">
        <a href="/" className="text-decoration-none">
          <h1 style={{ 
            color: '#FFFFFF',
            fontWeight: '600',
            fontSize: '2.2em',
            margin: 0,
            fontFamily: "'Roboto', sans-serif",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            letterSpacing: '1px',
            paddingLeft: '20px'
          }}>
            ToolNet
          </h1>
        </a>
      </div>

      <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
        <li><a href="/home" className="nav-link px-2 text-light">Home</a></li>
        <li><a href="/addtool" className="nav-link px-2 text-light">Add Tool</a></li>
        <li><a href="/mytools" className="nav-link px-2 text-light">My Tools</a></li>
        <li><a href="/cart" className="nav-link px-2 text-light">Cart</a></li>
        <li><a href="/orders" className="nav-link px-2 text-light">Orders</a></li>
        <li><a href="/about" className="nav-link px-2 text-light">About</a></li>
      </ul>

      <div className="col-md-3 text-end d-flex align-items-center">
        {isAuthenticated ? (
          <>
            <a href="/profile" className="nav-link text-light d-flex align-items-center">
              {/* Check if profileImage exists, fallback to default image */}
              <img 
                src={currentUserProfileImage || imag}  // Use profileImage from context or fallback
                alt="Profile" 
                className="rounded-circle me-2" 
                width="40" 
                height="40" 
              />
              <span>{currentUserName || 'User'}</span> {/* Fallback to 'User' if name is not available */}
            </a>
            <button 
              type="button" 
              className="btn btn-outline-light ms-3" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-outline-light me-2">
              <a href="/" className="nav-link text-light">Login</a>
            </button>
            <button type="button" className="btn btn-outline-light me-2">
              <a href="/createuser" className="nav-link text-light">Sign-up</a>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
