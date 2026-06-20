import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { UserContext } from '../components/UserContext';
import API_BASE_URL from '../config/api';

const getReadableOrderNumber = (orderId) => {
  if (!orderId) return 'Order';
  return `#${orderId.slice(-6).toUpperCase()}`;
};

const formatOrderDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

const getOrderDisplayStatus = (order) => {
  const rawStatus = order.status?.trim();
  const normalizedStatus = rawStatus?.toLowerCase();
  const rentalEndDate = order.rentalEndDate ? new Date(order.rentalEndDate) : null;
  const rentalHasEnded = rentalEndDate && !Number.isNaN(rentalEndDate.getTime()) && rentalEndDate < new Date();
  const statusLabels = {
    requested: 'Waiting for owner response',
    active: 'Accepted - coordinate delivery',
    declined: 'Declined',
    completed: 'Completed',
  };

  if (normalizedStatus === 'active' && rentalHasEnded) return 'Rental period ended';
  if (normalizedStatus && statusLabels[normalizedStatus]) return statusLabels[normalizedStatus];
  if (rentalHasEnded) return 'Rental period ended';
  if (rawStatus && normalizedStatus !== 'pending') return rawStatus;
  return 'Waiting for owner response';
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUserId } = useContext(UserContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${currentUserId}`);
        if (!response.ok) {
          throw new Error(`Unable to load orders. Status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (fetchError) {
        setError(fetchError.message || 'Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUserId]);

  if (!currentUserId) {
    return (
      <main className="page page--narrow">
        <div className="empty-state">
          <h2>Login required</h2>
          <p>Please login to view your orders.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Rental history</p>
        <h1 className="page-title">Orders</h1>
        <p className="page-copy">Review active rentals, costs, dates, and the tools included in each order.</p>
      </div>

      {loading && <div className="status-banner">Loading orders...</div>}
      {error && <div className="status-banner status-banner--error">Error: {error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <h2>No orders found</h2>
          <p>Your completed rentals will appear here.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="order-grid">
          {orders.map((order) => (
            <article key={order._id} className="panel-card">
              <div className="panel-card__body">
                <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                  <div>
                    <p className="eyebrow mb-1">Order</p>
                    <h2 className="section-title mb-0">Order {getReadableOrderNumber(order._id)}</h2>
                    <p className="order-reference">Reference ID: {order._id}</p>
                  </div>
                  <span className="badge-soft">{getOrderDisplayStatus(order)}</span>
                </div>

                <div className="meta-list">
                  <div className="meta-row">
                    <span>Total cost</span>
                    <strong>₹{order.totalCost}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Rented at</span>
                    <strong>{formatOrderDate(order.createdAt)}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Rental ends</span>
                    <strong>{formatOrderDate(order.rentalEndDate)}</strong>
                  </div>
                </div>

                <h3 className="section-title">Items</h3>
                <ul className="order-items">
                  {order.cartItems.map((item) => (
                    <li key={item.toolId}>
                      <strong>{item.toolName}</strong>
                      <div className="meta-row mt-2">
                        <span>{item.rentalDays} day{item.rentalDays > 1 ? 's' : ''}</span>
                        <strong>₹{item.cost}</strong>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Orders;
