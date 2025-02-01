import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyTools = () => {
    const { currentUserId } = useContext(UserContext); // get the user ID from UserContext
    const [tools, setTools] = useState([]);
    console.log(currentUserId);

    useEffect(() => {
        const fetchMyTools = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tools?owner_id=${currentUserId}`);
                const data = await response.json();
                setTools(data);
            } catch (error) {
                console.error('Error fetching tools:', error);
            }
        };

        if (currentUserId) fetchMyTools();
    }, [currentUserId]);

    console.log(tools);

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4 text-primary">My Tools</h1>
            {tools.length > 0 ? (
                <div className="row">
                    {tools.map((tool) => (
                        <div key={tool._id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-primary">
                                <div className="card-body">
                                    <h4 className="card-title text-primary">{tool.name}</h4>
                                    <p className="card-text">{tool.description}</p>
                                    <p className="text-muted">
                                        <strong>Condition:</strong> {tool.condition}
                                    </p>
                                    <p className="text-success">
                                        <strong>Rental Price:</strong> ₹{tool.rental_price}
                                    </p>
                                    <p>
                                        <strong>Availability:</strong> {tool.availability ? (
                                            <span className="badge bg-success">Available</span>
                                        ) : (
                                            <span className="badge bg-danger">Not Available</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-muted">No tools found.</p>
                </div>
            )}
        </div>
    );
};

export default MyTools;
