import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../components/UserContext'; // Adjust the path as necessary
import { format } from 'date-fns'; // Optional: For better date formatting
import API_BASE_URL from '../config/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUserId } = useContext(UserContext); 
    // Get the current user's ID
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('Fetching orders for user ID:', currentUserId);
                const response = await fetch(`${API_BASE_URL}/api/orders/${currentUserId}`);
                console.log('Response:', response); // Log the response object
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log the fetched data
                setOrders(data);
            } catch (err) {
                console.log('Error fetching orders:', err); // Log the error
                setError(' Failed to fetch orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        console.log('Current User ID:', currentUserId); // Log the current user ID
        if (currentUserId) { // Fetch only if user ID is valid
            fetchOrders(); // Fetch orders when the component mounts
        }
    }, [currentUserId]);

    if (!currentUserId) {
        return <p className="text-center mt-5">Please log in to view your orders.</p>;
    }
    if (loading) return <div className="alert alert-info">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    console.log('Orders:', orders); // Log the orders after state is set

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4 text-primary">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-center text-warning">No orders found.</p>
            ) : (
                <div className="row">
                    {orders.map(order => (
                        <div key={order._id} className="col-md-6 mb-4">
                            <div className="card shadow-sm border-primary">
                                <div className="card-body">
                                    <h5 className="card-title text-success">Order ID: {order._id}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Status: {order.status}</h6>
                                    <p className="card-text">Total Cost: <strong>₹{order.totalCost}</strong></p>
                                    <p className="card-text">Rented At: {format(new Date(order.createdAt), 'MMMM dd, yyyy h:mm a')}</p>
                                    
                                    {/* Check if rentalEndDate is valid before formatting */}
                                    <p className="card-text">
                                        Rental End Date: {order.rentalEndDate ? format(new Date(order.rentalEndDate), 'MMMM dd, yyyy') : 'N/A'}
                                    </p>

                                    <h6 className="text-secondary">Items:</h6>
                                    <ul className="list-group list-group-flush">
                                        {order.cartItems.map(item => (
                                            <li key={item.toolId} className="list-group-item">
                                                <strong>{item.toolName}</strong>
                                                <p className="mb-0">Rental Days: {item.rentalDays}</p>
                                                <p className="mb-0">Cost: <strong>₹{item.cost}</strong></p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
