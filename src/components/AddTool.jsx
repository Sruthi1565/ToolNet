import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import backgroundImage from './background.jpg';
import { UserContext } from './UserContext';

function AddTool() {
    const { currentUserId } = useContext(UserContext);
    console.log("current userid :" + currentUserId);

    const [formData, setFormData] = useState({
        owner_id: currentUserId,
        name: '',
        description: '',
        condition: 'new',
        location: '', // Text location input
        rental_price: '',
        category: 'gardening', // Default category
        image: null, // New field for the image file
        latitude: '', // New field for latitude
        longitude: '', // New field for longitude
    });

    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        setFormData(prevData => ({ ...prevData, owner_id: currentUserId }));
    }, [currentUserId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            image: e.target.files[0], // Store the file object
        }));
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            setResponseMessage("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prevData) => ({
                    ...prevData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }));
                setResponseMessage("Location retrieved successfully!");
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setResponseMessage("User denied the request for Geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setResponseMessage("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        setResponseMessage("The request to get user location timed out.");
                        break;
                    default:
                        setResponseMessage("Unable to retrieve your location. Please enter it manually.");
                        break;
                }
                console.error("Error getting location: ", error);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch('http://localhost:5000/api/addtool', {
                method: 'POST',
                body: data, // Send FormData object
            });

            const result = await response.json();

            if (response.ok) {
                setResponseMessage("Tool added successfully!");
                setFormData({
                    owner_id: currentUserId,
                    name: '',
                    description: '',
                    condition: 'new',
                    location: '',
                    rental_price: '',
                    category: 'gardening', // Reset to default category
                    image: null, // Reset file
                    latitude: '',
                    longitude: '',
                });
            } else {
                setResponseMessage("Error: " + result.error);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setResponseMessage("An error occurred while submitting the form.");
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                paddingTop: '80px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                className="card p-4 shadow-sm"
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '100%',
                    borderRadius: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
            >
                <h2
                    className="text-center mb-3"
                    style={{
                        color: '#2c3e50',
                        fontWeight: 'bold',
                        fontSize: '22px',
                        fontFamily: '"Poppins", sans-serif',
                    }}
                >
                    Add a New Tool
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Tool Name */}
                    <div className="form-group mb-3">
                        <label htmlFor="name">Tool Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter tool name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group mb-3">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Describe the tool"
                            rows="2"
                            required
                        ></textarea>
                    </div>

                    {/* Condition */}
                    <div className="form-group mb-3">
                        <label htmlFor="condition">Condition:</label>
                        <select
                            name="condition"
                            value={formData.condition}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="new">New</option>
                            <option value="used">Used</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div className="form-group mb-3">
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter location"
                            required
                        />
                        <button type="button" className="btn btn-secondary mt-2" onClick={handleGeolocation}>
                            Use Current Location
                        </button>
                    </div>

                    {/* Latitude */}
                    <div className="form-group mb-3">
                        <label htmlFor="latitude">Latitude:</label>
                        <input
                            type="text"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter latitude"
                            required
                        />
                    </div>

                    {/* Longitude */}
                    <div className="form-group mb-3">
                        <label htmlFor="longitude">Longitude:</label>
                        <input
                            type="text"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter longitude"
                            required
                        />
                    </div>

                    {/* Rental Price */}
                    <div className="form-group mb-3">
                        <label htmlFor="rental_price">Rental Price:</label>
                        <input
                            type="number"
                            name="rental_price"
                            value={formData.rental_price}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Enter rental price"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="form-group mb-3">
                        <label htmlFor="category">Category:</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="gardening">Gardening</option>
                            <option value="construction">Construction</option>
                            <option value="stationary">Stationary</option>
                            <option value="home_improvement">Home Improvement</option>
                        </select>
                    </div>

                    {/* Image Upload */}
                    <div className="form-group mb-3">
                        <label htmlFor="image">Upload Image:</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="form-control"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-100">
                        Add Tool
                    </button>

                    {/* Response Message */}
                    {responseMessage && (
                        <div className="alert alert-info mt-3" role="alert">
                            {responseMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddTool;
