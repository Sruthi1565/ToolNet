import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Header from './components/Header';
import Signup from './components/Signup';
import AddTool from './components/AddTool';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Orders from './components/Orders';
import About from './components/About';
import MyTools from './components/MyTools';
import Requests from './components/Requests';
import { UserProvider } from './components/UserContext';
import { CartProvider } from './components/CartContext';

const App = () => {
  return (
    <UserProvider>
      <CartProvider>
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <div className="app-shell">
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/createuser" element={<Signup />} />
              <Route path="/addtool" element={<AddTool />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/about" element={<About />} />
              <Route path="/mytools" element={<MyTools />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
