import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Card = ({ tool, onRent }) => {
    const [rentalDays, setRentalDays] = useState(1); // Default to 1 day

    const handleRent = () => {
        if (onRent) {
            onRent(tool, rentalDays); // Pass the selected days to the onRent function
        }
    };

    // Base URL for backend
    const BASE_URL = 'http://localhost:5000'; // Replace with your server URL

    return (
        <div
            className="card shadow-lg mb-4"
            style={{
                width: '18rem',
                borderRadius: '15px',
                overflow: 'hidden',
                border: 'none'
            }}
        >
            <img
                src={
                    tool.image 
                        ? `${BASE_URL}${tool.image}` // Prepend server URL to the image path
                        : 'https://via.placeholder.com/300x200'
                }
                className="card-img-top"
                alt={tool.name}
                style={{
                    height: '180px',
                    width: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#f8f9fa'
                }}
            />
            
            <div className="card-body d-flex flex-column justify-content-between">
                <h5
                    className="card-title text-primary"
                    style={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}
                >
                    {tool.name}
                </h5>

                <p
                    className="card-text text-muted"
                    style={{ fontSize: '14px', textAlign: 'justify', margin: '0 0 10px 0' }}
                >
                    {tool.description}
                </p>

                <div className="d-flex justify-content-between" style={{ fontSize: '14px', color: '#6c757d' }}>
                    <strong>Condition:</strong> <span>{tool.condition}</span>
                </div>

                <div className="d-flex justify-content-between mt-1" style={{ fontSize: '14px', color: '#6c757d' }}>
                    <strong>Location:</strong> <span>{tool.location}</span>
                </div>

                <div
                    className="d-flex justify-content-between mt-1 mb-2"
                    style={{ fontSize: '16px', fontWeight: 'bold', color: '#495057' }}
                >
                    <span>Price per day:</span> <span>₹{tool.rental_price}</span>
                </div>

                {/* Days to Rent Input */}
                <div className="mb-3">
                    <label htmlFor="rentalDays" className="form-label">Days:</label>
                    <select
                        id="rentalDays"
                        className="form-select"
                        value={rentalDays}
                        onChange={(e) => setRentalDays(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(day => (
                            <option key={day} value={day}>
                                {day} day{day > 1 ? 's' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn btn-primary w-100"
                    style={{
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        backgroundColor: '#007bff',
                        border: 'none'
                    }}
                    onClick={handleRent} // Handle rent action
                >
                    Rent Now
                </button>
            </div>
        </div>
    );
};

export default Card;
