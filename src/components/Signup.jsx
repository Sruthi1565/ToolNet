import React, { useState, useContext } from 'react';
import backgroundImage from './background.jpg';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';
import API_BASE_URL from '../config/api';

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", location: "", geolocation: "" });
  const { login } = useContext(UserContext);
  let navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    let lat, long;
    if (credentials.geolocation) {
      const { latitude, longitude } = JSON.parse(credentials.geolocation);
      lat = latitude;
      long = longitude;
    } else {
      alert("Please provide your geolocation.");
      return; // Prevent submission if geolocation is not set
    }

    const response = await fetch(`${API_BASE_URL}/api/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        location: credentials.location, // Use text location
        latitude: lat, // Use latitude
        longitude: long // Use longitude
      })
    });

    const json = await response.json();
    console.log(json);
    if (!json.success) {
      alert("Enter valid credentials");
    }
    if (json.success) {
      login(json.userId,credentials.email,credentials.name,imag,lat,long);
      navigate("/home");
    }
  }

  const onChange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  }

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCredentials({
            ...credentials,
            geolocation: JSON.stringify({ latitude, longitude }) // Store as a JSON string
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Unable to retrieve your location. Please provide it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      width: '100%',
    }}>
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <form onSubmit={handleSignup}>
          <h3>Create account</h3>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="name"
              value={credentials.name}
              onChange={onChange}
              placeholder="name"
            />
            <label htmlFor="location">Name</label>
          </div>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              name="email"
              value={credentials.email}
              onChange={onChange}
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>

          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              name="password"
              value={credentials.password}
              onChange={onChange}
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="location"
              value={credentials.location}
              onChange={onChange}
              placeholder="Your Address"
            />
            <label htmlFor="floatingLocation">Address</label>
          </div>

          <div className="form-floating">
            <button type="button" className="btn btn-secondary" onClick={getGeolocation}>
              Get My Location
            </button>
            <small className="form-text">Click the button to retrieve your location.</small>
          </div>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              name="geolocation"
              value={credentials.geolocation}
              readOnly // Set readOnly as the value is set automatically
            />
            <label htmlFor="floatingGeolocation">Geolocation (Latitude, Longitude)</label>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>

          <button className="btn btn-primary w-100 py-2" type="submit">Sign-up</button>
          <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
