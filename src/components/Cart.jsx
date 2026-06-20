import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from './CartContext';
import { UserContext } from '../components/UserContext';
import API_BASE_URL from '../config/api';

const Cart = () => {
  const { cart, dispatch } = useContext(CartContext);
  const { currentUserId, currentUserEmail } = useContext(UserContext);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const handleCheckout = async () => {
    setError('');
    setCheckoutMessage('');

    if (!address.trim()) {
      setError('Please enter a delivery address.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          cartItems: cart,
          address,
          userEmail: currentUserEmail,
        }),
      });

      if (!response.ok) throw new Error('Checkout failed.');
      const result = await response.json();
      setCheckoutMessage(result.message || 'Checkout completed.');

      await Promise.all(cart.map((item) => (
        fetch(`${API_BASE_URL}/api/remove/${item._id}`, { method: 'DELETE' })
      )));

      dispatch({ type: 'CLEAR_CART' });
    } catch (checkoutError) {
      setError(checkoutError.message);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    const fetchRentals = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/cart/${currentUserId}`);
        if (!response.ok) throw new Error('Failed to load cart.');
        const data = await response.json();
        dispatch({ type: 'SET_RENTALS', payload: data });
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [currentUserId, dispatch]);

  const handleRemove = async (id) => {
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/remove/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove item.');
      dispatch({ type: 'REMOVE_RENTAL', payload: id });
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  const handleRentalDaysChange = async (id, rentalDays) => {
    setError('');

    if (!Number.isInteger(rentalDays) || rentalDays <= 0) {
      setError('Rental days must be a positive integer.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rentalDays }),
      });

      if (!response.ok) throw new Error('Failed to update rental.');
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
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const totalCost = cart.reduce((total, item) => total + Number(item.cost || 0), 0);

  if (!currentUserId) {
    return (
      <main className="page page--narrow">
        <div className="empty-state">
          <h2>Login required</h2>
          <p>Please login to view your rental cart.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Checkout</p>
        <h1 className="page-title">Rental cart</h1>
        <p className="page-copy">Review rental days, remove items, and confirm the delivery address.</p>
      </div>

      {loading && <div className="status-banner mb-3">Loading rentals...</div>}
      {error && <div className="status-banner status-banner--error mb-3">Error: {error}</div>}
      {checkoutMessage && <div className="status-banner status-banner--success mb-3">{checkoutMessage}</div>}

      {cart.length === 0 ? (
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add nearby tools to start a rental order.</p>
        </div>
      ) : (
        <>
          <section className="cart-list">
            {cart.map((item) => (
              <article key={item._id} className="cart-item">
                <div>
                  <h3>{item.toolName}</h3>
                  <p className="mb-0 text-muted">Cost: ₹{item.cost}</p>
                </div>

                <div>
                  <label htmlFor={`days-${item._id}`} className="form-label">Days</label>
                  <input
                    id={`days-${item._id}`}
                    type="number"
                    min="1"
                    className="form-control"
                    value={item.rentalDays}
                    onChange={(event) => handleRentalDaysChange(item._id, parseInt(event.target.value, 10))}
                  />
                </div>

                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </section>

          <section className="cart-summary">
            <div className="total-line">
              <span>Total</span>
              <span>₹{totalCost.toFixed(2)}</span>
            </div>

            <div>
              <label htmlFor="delivery-address" className="form-label">Delivery address</label>
              <input
                id="delivery-address"
                type="text"
                className="form-control"
                placeholder="Enter delivery address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="button" onClick={handleCheckout}>
              Checkout
            </button>
          </section>
        </>
      )}
    </main>
  );
};

export default Cart;
