import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './bg3.jpg';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';
import API_BASE_URL from '../config/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/loginuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.errors || 'Enter valid credentials.');
      }

      localStorage.setItem('authToken', json.authToken);
      const { name, latitude, longitude, profileImage } = json;
      login(json.userId, credentials.email, name, profileImage || imag, latitude, longitude);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="auth-page__overlay">
        <div className="auth-layout">
          <section className="auth-intro">
            <p className="eyebrow">Neighborhood sharing</p>
            <h1>Borrow the tools you need, right when you need them.</h1>
            <p>
              Sign in to browse nearby tools, manage rentals, and keep your own tool shelf available to trusted neighbors.
            </p>
          </section>

          <form className="form-panel" onSubmit={handleLogin}>
            <h2>Welcome back</h2>
            <p>Use your ToolNet account to continue.</p>

            {error && <div className="status-banner status-banner--error mb-3">{error}</div>}

            <div className="mb-3">
              <label htmlFor="login-email" className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Your password"
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <p className="mt-3 mb-0 text-center">
              New to ToolNet? <Link to="/createuser" className="muted-link">Create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
