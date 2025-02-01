
import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import { UserContext } from '../components/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const { cart, dispatch } = useContext(CartContext);
  const { currentUserId } = useContext(UserContext);
  const { currentUserEmail } = useContext(UserContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  
  const handleCheckout = async () => {
    if (!address) {
      setError('Please enter a delivery address.');
      return;
    }
    
    try {
      // First, checkout the cart
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          cartItems: cart,
          address,
          userEmail: currentUserEmail, // Include the user's email here
        }),
      });
      console.log(response);
  
      if (!response.ok) throw new Error('Checkout failed');
      const result = await response.json();
      setCheckoutMessage(result.message);
  
      // Then, delete each item from the database
      await Promise.all(cart.map(item => 
        fetch(`http://localhost:5000/api/remove/${item._id}`, { method: 'DELETE' })
      ));
  
      // Clear the cart in context after deletion
      dispatch({ type: 'CLEAR_CART' });
  
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    const fetchRentals = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/cart/${currentUserId}`);
        if (!response.ok) throw new Error('Failed to load cart');
        const data = await response.json();
        console.log(data);
        dispatch({ type: 'SET_RENTALS', payload: data });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [currentUserId, dispatch]);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/remove/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove item');
      dispatch({ type: 'REMOVE_RENTAL', payload: id });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRentalDaysChange = async (id, rentalDays) => {
    if (!Number.isInteger(rentalDays) || rentalDays <= 0) {
      setError('Rental days must be a positive integer');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalDays }),
      });
      if (!response.ok) throw new Error('Failed to update rental');
      const updatedRental = await response.json();
      dispatch({
        type: 'UPDATE_RENTAL',
        payload: {
          _id: updatedRental.rental._id,
          rentalDays: updatedRental.rental.rentalDays,
          toolName: updatedRental.rental.toolId.name,
          cost: updatedRental.rental.cost,
        },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const totalCost = cart.reduce((total, item) => total + item.cost, 0);

  // Conditional rendering based on `currentUserId`
  if (!currentUserId) {
    return <p className="text-center mt-5">Please log in to view your cart.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Your Rental Cart</h2>
      {loading && <p className="text-info">Loading rentals...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="card">
          <div className="card-body">
            {cart.map(item => (
              <div key={item._id} className="row mb-3 align-items-center">
                <div className="col">
                  <h5>{item.toolName}</h5>
                  <p>Cost: ₹{item.cost}</p>
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={item.rentalDays}
                    onChange={(e) => handleRentalDaysChange(item._id, parseInt(e.target.value))}
                  />
                </div>
                <div className="col-auto">
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-3">
        <strong>Total Cost: ₹{totalCost.toFixed(2)}</strong>
      </div>
      <div className="mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      {checkoutMessage && <p className="text-success mt-3">{checkoutMessage}</p>}
    </div>
  );
};

export default Cart;
