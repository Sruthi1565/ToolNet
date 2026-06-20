import React, { useState } from 'react';
import toolPlaceholder from './toolshare.png';
import API_BASE_URL from '../config/api';

const getImageUrl = (image) => {
  if (!image) return toolPlaceholder;
  if (image.startsWith('http')) return image;
  return `${API_BASE_URL}${image}`;
};

const Card = ({ tool, onRent, isRenting = false, rentStatus = null }) => {
  const [rentalDays, setRentalDays] = useState(1);

  const handleRent = () => {
    if (onRent) {
      onRent(tool, rentalDays);
    }
  };

  return (
    <article className="tool-card">
      <div className="tool-card__media">
        <img
          src={getImageUrl(tool.image)}
          className="tool-card__image"
          alt={tool.name}
        />
      </div>

      <div className="tool-card__body">
        <h3 className="tool-card__title">{tool.name}</h3>
        <p className="tool-card__description">{tool.description || 'No description provided.'}</p>

        <div className="meta-list">
          <div className="meta-row">
            <span>Condition</span>
            <strong>{tool.condition}</strong>
          </div>
          <div className="meta-row">
            <span>Location</span>
            <strong>{tool.location}</strong>
          </div>
        </div>

        <div className="price-line">
          <span>Per day</span>
          <span>₹{tool.rental_price}</span>
        </div>

        <div className="mb-3">
          <label htmlFor={`rental-days-${tool._id}`} className="form-label">Rental days</label>
          <select
            id={`rental-days-${tool._id}`}
            className="form-select"
            value={rentalDays}
            onChange={(event) => setRentalDays(Number(event.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 14, 30].map((day) => (
              <option key={day} value={day}>
                {day} day{day > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary w-100" type="button" onClick={handleRent} disabled={isRenting}>
          {isRenting ? 'Adding...' : 'Rent now'}
        </button>

        {rentStatus && (
          <p className={`tool-card__feedback tool-card__feedback--${rentStatus.type}`}>
            {rentStatus.message}
          </p>
        )}
      </div>
    </article>
  );
};

export default Card;
