import React, { useContext, useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import toolImage1 from '../components/img1.jpg';
import toolImage2 from '../components/bg2.jpg';
import toolImage3 from '../components/img1.jpg';
import { UserContext } from '../components/UserContext';
import API_BASE_URL from '../config/api';

const heroImages = [toolImage1, toolImage2, toolImage3];

export default function Home() {
  const [search, setSearch] = useState('');
  const [tools, setTools] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [rentingToolId, setRentingToolId] = useState('');
  const [rentStatus, setRentStatus] = useState(null);
  const { currentUserId, userLatitude, userLongitude } = useContext(UserContext);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTools = async () => {
      if (!userLatitude || !userLongitude) {
        setLoading(false);
        setMessage('Add your location to see tools nearby.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE_URL}/api/browsetools?latitude=${userLatitude}&longitude=${userLongitude}`);

        if (response.status === 404) {
          setTools([]);
          setMessage('No tools are currently listed near you.');
          return;
        }

        if (!response.ok) {
          throw new Error('Unable to load tools right now.');
        }

        const data = await response.json();
        const filteredTools = data.filter((tool) => tool.owner_id !== currentUserId);
        setTools(filteredTools);
        setMessage(filteredTools.length ? 'Tools available in your neighborhood.' : 'No tools are currently listed near you.');
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [userLatitude, userLongitude, currentUserId]);

  const handleRent = async (tool, rentalDays) => {
    if (!currentUserId) {
      const loginMessage = 'Please login before renting a tool.';
      setError(loginMessage);
      setRentStatus({ toolId: tool._id, type: 'error', message: loginMessage });
      return;
    }

    setRentingToolId(tool._id);
    setRentStatus({ toolId: tool._id, type: 'info', message: 'Adding this tool to your cart...' });
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/rent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId: tool._id,
          userId: currentUserId,
          rentalDays,
          cost: Number(tool.rental_price) * rentalDays,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add this tool to your cart.');
      }

      const successMessage = response.status === 200
        ? `${tool.name} updated in your cart.`
        : `${tool.name} added to your cart.`;
      setMessage(successMessage);
      setRentStatus({ toolId: tool._id, type: 'success', message: successMessage });
    } catch (rentError) {
      const errorMessage = rentError.message || 'Failed to add this tool to your cart.';
      setError(errorMessage);
      setRentStatus({ toolId: tool._id, type: 'error', message: errorMessage });
    } finally {
      setRentingToolId('');
    }
  };

  const filteredTools = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tools;

    return tools.filter((tool) => (
      tool.name?.toLowerCase().includes(term)
      || tool.category?.toLowerCase().includes(term)
      || tool.location?.toLowerCase().includes(term)
    ));
  }, [tools, search]);

  const groupedTools = filteredTools.reduce((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {});

  return (
    <>
      <section className="hero">
        {heroImages.map((image, index) => (
          <div className={`hero__slide ${index === heroIndex ? 'active' : ''}`} key={image}>
            <img src={image} alt="" />
          </div>
        ))}

        <div className="hero__content">
          <p className="eyebrow">ToolNet marketplace</p>
          <h1 className="hero__title">Find practical tools from people nearby.</h1>
          <p className="hero__copy">
            Browse community listings, rent what you need for a few days, and keep your own tools working for neighbors.
          </p>
          <div className="hero-search">
            <input
              type="search"
              placeholder="Search by tool, category, or location"
              aria-label="Search tools"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="page">
        <div className="page-header">
          <p className="eyebrow">Browse</p>
          <h2 className="section-title">Available tools</h2>
          {message && <div className="status-banner status-banner--success">{message}</div>}
          {error && <div className="status-banner status-banner--error mt-3">{error}</div>}
        </div>

        {loading ? (
          <div className="empty-state">
            <h2>Loading tools...</h2>
            <p>Checking nearby listings.</p>
          </div>
        ) : Object.keys(groupedTools).length > 0 ? (
          Object.keys(groupedTools).map((category) => (
            <section key={category} className="category-block">
              <div className="category-block__header">
                <h2 className="section-title mb-0">{category.replace('_', ' ')}</h2>
                <span className="badge-soft">{groupedTools[category].length} listed</span>
              </div>
              <div className="tool-grid">
                {groupedTools[category].map((tool) => (
                  <Card
                    key={tool._id}
                    tool={tool}
                    onRent={handleRent}
                    isRenting={rentingToolId === tool._id}
                    rentStatus={rentStatus?.toolId === tool._id ? rentStatus : null}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="empty-state">
            <h2>No matching tools</h2>
            <p>Try another search term or check back later.</p>
          </div>
        )}
      </main>
    </>
  );
}
