import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import API_BASE_URL from '../config/api';

const initialFormData = (ownerId) => ({
  owner_id: ownerId,
  name: '',
  description: '',
  condition: 'new',
  location: '',
  rental_price: '',
  category: 'gardening',
  image: null,
  latitude: '',
  longitude: '',
});

function AddTool() {
  const { currentUserId } = useContext(UserContext);
  const [formData, setFormData] = useState(initialFormData(currentUserId));
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, owner_id: currentUserId }));
  }, [currentUserId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      image: event.target.files[0],
    }));
  };

  const handleGeolocation = () => {
    setResponseMessage('');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prevData) => ({
          ...prevData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setResponseMessage('Location added.');
      },
      (geoError) => {
        const messages = {
          1: 'Location permission was denied.',
          2: 'Location information is unavailable.',
          3: 'The location request timed out.',
        };
        setError(messages[geoError.code] || 'Unable to retrieve your location.');
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResponseMessage('');
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/addtool`, {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to add this tool.');
      }

      setResponseMessage('Tool added successfully.');
      setFormData(initialFormData(currentUserId));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUserId) {
    return (
      <main className="page page--narrow">
        <div className="empty-state">
          <h2>Login required</h2>
          <p>Please login before listing a tool.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page page--narrow">
      <div className="page-header">
        <p className="eyebrow">List a tool</p>
        <h1 className="page-title">Add a tool</h1>
        <p className="page-copy">
          Share tool details, pricing, and location so nearby renters can find it quickly.
        </p>
      </div>

      <form className="panel-card" onSubmit={handleSubmit}>
        <div className="panel-card__body">
          {responseMessage && <div className="status-banner status-banner--success mb-3">{responseMessage}</div>}
          {error && <div className="status-banner status-banner--error mb-3">{error}</div>}

          <div className="form-grid">
            <div className="full">
              <label htmlFor="tool-name" className="form-label">Tool name</label>
              <input
                id="tool-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Cordless drill"
                required
              />
            </div>

            <div className="full">
              <label htmlFor="tool-description" className="form-label">Description</label>
              <textarea
                id="tool-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                placeholder="Include condition, accessories, and pickup notes"
                rows="4"
                required
              />
            </div>

            <div>
              <label htmlFor="tool-condition" className="form-label">Condition</label>
              <select
                id="tool-condition"
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

            <div>
              <label htmlFor="tool-category" className="form-label">Category</label>
              <select
                id="tool-category"
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

            <div className="full">
              <label htmlFor="tool-location" className="form-label">Location</label>
              <input
                id="tool-location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-control"
                placeholder="Neighborhood or address"
                required
              />
            </div>

            <div>
              <label htmlFor="tool-latitude" className="form-label">Latitude</label>
              <input
                id="tool-latitude"
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="form-control"
                placeholder="Latitude"
                required
              />
            </div>

            <div>
              <label htmlFor="tool-longitude" className="form-label">Longitude</label>
              <input
                id="tool-longitude"
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="form-control"
                placeholder="Longitude"
                required
              />
            </div>

            <div className="full">
              <button type="button" className="btn btn-soft w-100" onClick={handleGeolocation}>
                Use current location
              </button>
            </div>

            <div>
              <label htmlFor="tool-price" className="form-label">Rental price per day</label>
              <input
                id="tool-price"
                type="number"
                name="rental_price"
                value={formData.rental_price}
                onChange={handleChange}
                className="form-control"
                placeholder="100"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="tool-image" className="form-label">Tool image</label>
              <input
                id="tool-image"
                type="file"
                name="image"
                onChange={handleFileChange}
                className="form-control"
                accept="image/*"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-4" disabled={submitting}>
            {submitting ? 'Adding tool...' : 'Add tool'}
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddTool;
