import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { UserContext } from './UserContext';
import API_BASE_URL from '../config/api';
import toolPlaceholder from './toolshare.png';

const getImageUrl = (image) => {
  if (!image) return toolPlaceholder;
  if (image.startsWith('http')) return image;
  return `${API_BASE_URL}${image}`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM dd, yyyy');
};

const statusLabels = {
  requested: 'New request',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
};

const Requests = () => {
  const { currentUserId } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/requests/${currentUserId}`);
        if (!response.ok) {
          throw new Error('Unable to load rental requests.');
        }

        const data = await response.json();
        setRequests(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  const updateRequestStatus = async (request, status) => {
    setUpdatingId(request.requestId);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/requests/${request.orderId}/items/${request.requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: currentUserId,
          status,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || 'Unable to update this request.');
      }

      setRequests((currentRequests) => (
        currentRequests.map((currentRequest) => (
          currentRequest.requestId === request.requestId
            ? {
              ...currentRequest,
              status,
              ownerResponseAt: result.request?.ownerResponseAt || new Date().toISOString(),
            }
            : currentRequest
        ))
      ));
      setMessage(result.message || 'Request updated.');
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingId('');
    }
  };

  if (!currentUserId) {
    return (
      <main className="page page--narrow">
        <div className="empty-state">
          <h2>Login required</h2>
          <p>Please login to view rental requests for your tools.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-header">
        <p className="eyebrow">Owner requests</p>
        <h1 className="page-title">Requests</h1>
        <p className="page-copy">Review rental requests for your listed tools and update the handoff status.</p>
      </div>

      {loading && <div className="status-banner mb-3">Loading requests...</div>}
      {message && <div className="status-banner status-banner--success mb-3">{message}</div>}
      {error && <div className="status-banner status-banner--error mb-3">Error: {error}</div>}

      {!loading && !error && requests.length === 0 && (
        <div className="empty-state">
          <h2>No requests yet</h2>
          <p>When someone checks out one of your tools, the request will appear here.</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="request-grid">
          {requests.map((request) => {
            const isUpdating = updatingId === request.requestId;

            return (
              <article key={request.requestId} className="panel-card request-card">
                <div className="request-card__media">
                  <img src={getImageUrl(request.toolImage)} alt={request.toolName} />
                </div>

                <div className="panel-card__body">
                  <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <div>
                      <p className="eyebrow mb-1">Rental request</p>
                      <h2 className="section-title mb-0">{request.toolName}</h2>
                    </div>
                    <span className={`status-pill status-pill--${request.status}`}>
                      {statusLabels[request.status] || request.status}
                    </span>
                  </div>

                  <div className="meta-list">
                    <div className="meta-row">
                      <span>Renter</span>
                      <strong>{request.renterName}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Email</span>
                      <strong>{request.renterEmail}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Rental days</span>
                      <strong>{request.rentalDays}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Cost</span>
                      <strong>₹{request.cost}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Requested</span>
                      <strong>{formatDate(request.orderCreatedAt)}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Rental ends</span>
                      <strong>{formatDate(request.rentalEndDate)}</strong>
                    </div>
                  </div>

                  <div className="request-address">
                    <span>Delivery address</span>
                    <strong>{request.address}</strong>
                  </div>

                  <div className="request-actions">
                    {request.status === 'requested' && (
                      <>
                        <button
                          className="btn btn-primary"
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateRequestStatus(request, 'accepted')}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-soft"
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateRequestStatus(request, 'declined')}
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {request.status === 'accepted' && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={isUpdating}
                        onClick={() => updateRequestStatus(request, 'completed')}
                      >
                        Mark completed
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Requests;
