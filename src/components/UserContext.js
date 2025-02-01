import React, { createContext, useState, useEffect } from 'react';
export const UserContext = createContext();

// UserProvider component to provide user data to other components
export const UserProvider = ({ children }) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentUserProfileImage, setCurrentUserProfileImage] = useState(null); // Added profile image state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);
    console.log("from user context"+userLatitude);
    console.log(userLongitude);

    // Login function
    const login = (userId, email, name, profileImage, latitude, longitude) => {
        setCurrentUserId(userId);
        setCurrentUserEmail(email);
        setCurrentUserName(name);
        setCurrentUserProfileImage(profileImage); // Store profile image
        setUserLatitude(latitude);
        setUserLongitude(longitude);
        setIsAuthenticated(true);
        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentUserEmail', email);
        localStorage.setItem('currentUserName', name);
        localStorage.setItem('currentUserProfileImage', profileImage); // Store profile image in localStorage
        localStorage.setItem('userLatitude', latitude);
        localStorage.setItem('userLongitude', longitude);
    };

    // Logout function
    const logout = () => {
        setCurrentUserId(null);
        setCurrentUserEmail(null);
        setCurrentUserName(null);
        setCurrentUserProfileImage(null); // Clear profile image
        setUserLatitude(null);
        setUserLongitude(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('currentUserName');
        localStorage.removeItem('currentUserProfileImage'); // Remove profile image from localStorage
        localStorage.removeItem('userLatitude');
        localStorage.removeItem('userLongitude');
    };

    // Load user data on mount and reset if not found
    useEffect(() => {
        const storedUserId = localStorage.getItem('currentUserId');
        const storedUserEmail = localStorage.getItem('currentUserEmail');
        const storedUserName = localStorage.getItem('currentUserName');
        const storedUserProfileImage = localStorage.getItem('currentUserProfileImage'); // Get profile image from localStorage
        const storedUserLatitude = parseFloat(localStorage.getItem('userLatitude')); // Parse as float
        const storedUserLongitude = parseFloat(localStorage.getItem('userLongitude')); // Parse as float
        if (storedUserId) {
            setCurrentUserId(storedUserId);
            setCurrentUserEmail(storedUserEmail);
            setCurrentUserName(storedUserName);
            setCurrentUserProfileImage(storedUserProfileImage); // Set profile image from localStorage
            setUserLatitude(storedUserLatitude);
            setUserLongitude(storedUserLongitude);
            setIsAuthenticated(true);
            console.log("Profile image loaded from storage:", storedUserProfileImage);
        } else {
            setCurrentUserId(null);
            setCurrentUserEmail(null);
            setCurrentUserName(null);
            setCurrentUserProfileImage(null); // Reset profile image
            setUserLatitude(null);
            setUserLongitude(null);
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ 
            currentUserId, 
            currentUserEmail, 
            currentUserName,
            currentUserProfileImage, // Provide profile image
            isAuthenticated, 
            userLatitude, 
            userLongitude, 
            login, 
            logout 
        }}>
            {children}
        </UserContext.Provider>
    );
};
