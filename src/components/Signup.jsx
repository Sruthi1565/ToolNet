import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from './background.jpg';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';
import API_BASE_URL from '../config/api';

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    geolocation: '',
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!credentials.geolocation) {
        throw new Error('Add your location before creating an account.');
      }

      const { latitude, longitude } = JSON.parse(credentials.geolocation);

      const response = await fetch(`${API_BASE_URL}/api/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          location: credentials.location,
          latitude,
          longitude,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Unable to create account.');
      }

      login(json.userId, credentials.email, credentials.name, imag, latitude, longitude);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  const getGeolocation = () => {
    setStatus('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCredentials({
          ...credentials,
          geolocation: JSON.stringify({ latitude, longitude }),
        });
        setStatus('Location added.');
      },
      () => {
        setError('Unable to retrieve your location. Please enter it manually later.');
      }
    );
  };

  return (
    <main className="auth-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="auth-page__overlay">
        <div className="auth-layout">
          <section className="auth-intro">
            <p className="eyebrow">Start sharing</p>
            <h1>Create your local tool-sharing profile.</h1>
            <p>
              Add your location so ToolNet can surface nearby tools and keep your rentals focused around your neighborhood.
            </p>
          </section>

          <form className="form-panel" onSubmit={handleSignup}>
            <h2>Create account</h2>
            <p>Join ToolNet and start browsing tools near you.</p>

            {status && <div className="status-banner status-banner--success mb-3">{status}</div>}
            {error && <div className="status-banner status-banner--error mb-3">{error}</div>}

            <div className="mb-3">
              <label htmlFor="signup-name" className="form-label">Name</label>
              <input
                id="signup-name"
                type="text"
                className="form-control"
                name="name"
                value={credentials.name}
                onChange={onChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="signup-email" className="form-label">Email address</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="form-label">Password</label>
              <input
                id="signup-password"
                type="password"
                className="form-control"
                name="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="signup-location" className="form-label">Address</label>
              <input
                id="signup-location"
                type="text"
                className="form-control"
                name="location"
                value={credentials.location}
                onChange={onChange}
                placeholder="Your neighborhood or address"
                required
              />
            </div>

            <div className="d-grid gap-2 mb-3">
              <button type="button" className="btn btn-soft" onClick={getGeolocation}>
                Use current location
              </button>
              {credentials.geolocation && (
                <input
                  className="form-control"
                  name="geolocation"
                  value={credentials.geolocation}
                  readOnly
                  aria-label="Captured geolocation"
                />
              )}
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>

            <p className="mt-3 mb-0 text-center">
              Already have an account? <Link to="/" className="muted-link">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
