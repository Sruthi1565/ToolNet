import React, { useState, useEffect, useContext } from "react";
import Card from "../components/Card"; 
import toolImage1 from '../components/img1.jpg';
import toolImage2 from '../components/bg2.jpg';
import toolImage3 from '../components/img1.jpg';
import { UserContext } from "../components/UserContext";

export default function Home() {
    const [search, setSearch] = useState('');
    const [tools, setTools] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const { currentUserId, userLatitude, userLongitude } = useContext(UserContext);

    // Loading state to handle fetching tools
    const [loading, setLoading] = useState(true); // Add loading state

    // Fetch the tools when the component loads
    useEffect(() => {
        const fetchTools = async () => {
            if (!userLatitude || !userLongitude) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/browsetools?latitude=${userLatitude}&longitude=${userLongitude}`);
                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();

                // Filter out tools belonging to the current user
                const filteredTools = data.filter(tool => tool.owner_id !== currentUserId);
                setTools(filteredTools);

                if (filteredTools.length === 0) {
                    setMessage("No tools in your neighborhood.");
                } else {
                    setMessage("Tools in your neighborhood!");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTools();
    }, [userLatitude, userLongitude, currentUserId]);

    if (loading) return <div>Loading tools...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleRent = async (tool, rentalDays) => {
        if (!currentUserId) {
            alert("User ID is missing. Please log in.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/rent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    toolId: tool._id,
                    userId: currentUserId,
                    rentalDays: rentalDays,
                    cost: tool.rental_price * rentalDays
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Detailed error info:", errorData);
                throw new Error("Failed to rent tool");
            } else {
                alert("Tool added to cart");
            }

            const result = await response.json();
            setMessage(result.message);
        } catch (err) {
            setError(`Error: ${err.message}`);
        }
    };

    const groupedTools = tools.reduce((acc, tool) => {
        if (!acc[tool.category]) {
            acc[tool.category] = [];
        }
        acc[tool.category].push(tool);
        return acc;
    }, {});

    return (
        <div>
            <div>
                {/* Carousel with search input */}
                <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" style={{ objectFit: "contain !important" }}>
                    <div className="carousel-inner" id="carousel">
                        <div className='carousel-caption' style={{ zIndex: "10" }}>
                            <div className="d-flex justify-content-center">
                                <input 
                                    className="form-control me-2" 
                                    type="search" 
                                    placeholder="Search" 
                                    aria-label="Search" 
                                    value={search} 
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setMessage('');
                                    }} 
                                />
                            </div>
                        </div>
                        <div className="carousel-item active">
                            <img src={toolImage1} style={{ height: "500px", width: "100%", filter: "brightness(50%)" }} className="d-block w-100" alt="Tool 1" />
                        </div>
                        <div className="carousel-item">
                            <img src={toolImage2} style={{ height: "500px", width: "100%", filter: "brightness(50%)" }} className="d-block w-100" alt="Tool 2" />
                        </div>
                        <div className="carousel-item">
                            <img src={toolImage3} style={{ height: "500px", width: "100%", filter: "brightness(50%)" }} className="d-block w-100" alt="Tool 3" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* Display categories and their tools */}
            <div className="mt-4">
                {message && <div className="alert alert-info">{message}</div>}
                
                {Object.keys(groupedTools).length > 0 ? (
                    Object.keys(groupedTools).map(category => (
                        <div key={category} className="category-section mb-5">
                            <h2>{category}</h2>
                            <div className="d-flex flex-wrap justify-content-center">
                                {groupedTools[category].filter(tool => 
                                    tool.name.toLowerCase().includes(search.toLowerCase()) || 
                                    tool.category.toLowerCase().includes(search.toLowerCase())
                                ).map(tool => (
                                    <div className="m-4" key={tool._id}>
                                        <Card tool={tool} onRent={handleRent} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-warning">No tools available in your neighborhood.</div>
                )}
            </div>
        </div>
    );
}
