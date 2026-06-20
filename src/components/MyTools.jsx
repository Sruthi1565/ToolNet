import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import API_BASE_URL from '../config/api';

const MyTools = () => {
  const { currentUserId } = useContext(UserContext);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTools = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/tools?owner_id=${currentUserId}`);
        if (!response.ok) throw new Error('Unable to load your tools.');
        const data = await response.json();
        setTools(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTools();
  }, [currentUserId]);

  if (!currentUserId) {
    return (
      <main className="page page--narrow">
        <div className="empty-state">
          <h2>Login required</h2>
          <p>Please login to view your listed tools.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Inventory</p>
        <h1 className="page-title">My tools</h1>
        <p className="page-copy">Track what you have listed and whether each item is available to rent.</p>
      </div>

      {loading && <div className="status-banner">Loading your tools...</div>}
      {error && <div className="status-banner status-banner--error">{error}</div>}

      {!loading && !error && tools.length > 0 ? (
        <div className="tool-grid">
          {tools.map((tool) => (
            <article key={tool._id} className="panel-card">
              <div className="panel-card__body">
                <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                  <h2 className="section-title mb-0">{tool.name}</h2>
                  <span className={`badge ${tool.availability ? 'text-bg-success' : 'text-bg-danger'}`}>
                    {tool.availability ? 'Available' : 'Not available'}
                  </span>
                </div>
                <p className="text-muted">{tool.description || 'No description provided.'}</p>
                <div className="meta-list">
                  <div className="meta-row">
                    <span>Condition</span>
                    <strong>{tool.condition}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Price</span>
                    <strong>₹{tool.rental_price}</strong>
                  </div>
                  <div className="meta-row">
                    <span>Category</span>
                    <strong>{tool.category}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : !loading && !error ? (
        <div className="empty-state">
          <h2>No tools listed</h2>
          <p>Add your first tool to make it available nearby.</p>
        </div>
      ) : null}
    </main>
  );
};

export default MyTools;
