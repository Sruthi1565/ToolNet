import React, { useState, useContext } from 'react';
import backgroundImage from './bg3.jpg';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import imag from '../components/profile.jpg';
import API_BASE_URL from '../config/api';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { login } = useContext(UserContext);
    let navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/api/loginuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);

        if (!json.success) {
            alert("Enter valid credentials");
            return; // Exit if login fails
        }

        if (json.success) {
            localStorage.setItem("authToken", json.authToken);
            console.log(localStorage.getItem("authToken"));
            console.log("userid:" + json.userId);
            console.log("Name:", json.name);
            // Set default profile image if not available in response
            const { name, latitude, longitude, profileImage } = json;
            console.log("PROFILE"+profileImage);
            const defaultProfileImage = profileImage || imag; // Set your default image path here

            login(json.userId, credentials.email, name, defaultProfileImage, latitude, longitude); // Pass profile image here
            navigate("/home");
        }
    }

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
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
                <form onSubmit={handleLogin}>
                    <h3>Please Login</h3>
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

                    <button className="btn btn-primary w-100 py-2" type="submit">Login</button>
                    <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
                </form>
            </div>
        </div>
    );
}

export default Login;
