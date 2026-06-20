import React, { createContext, useState, useEffect } from 'react';
export const UserContext = createContext();

// UserProvider component to provide user data to other components
export const UserProvider = ({ children }) => {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserName, setCurrentUserName] = useState(null);
    const [currentUserProfileImage, setCurrentUserProfileImage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userLatitude, setUserLatitude] = useState(null);
    const [userLongitude, setUserLongitude] = useState(null);

    const login = (userId, email, name, profileImage, latitude, longitude) => {
        setCurrentUserId(userId);
        setCurrentUserEmail(email);
        setCurrentUserName(name);
        setCurrentUserProfileImage(profileImage);
        setUserLatitude(latitude);
        setUserLongitude(longitude);
        setIsAuthenticated(true);
        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentUserEmail', email);
        localStorage.setItem('currentUserName', name);
        localStorage.setItem('currentUserProfileImage', profileImage || '');
        localStorage.setItem('userLatitude', latitude);
        localStorage.setItem('userLongitude', longitude);
    };

    const logout = () => {
        setCurrentUserId(null);
        setCurrentUserEmail(null);
        setCurrentUserName(null);
        setCurrentUserProfileImage(null);
        setUserLatitude(null);
        setUserLongitude(null);
        setIsAuthenticated(false);
        localStorage.removeItem('currentUserId');
        localStorage.removeItem('currentUserEmail');
        localStorage.removeItem('currentUserName');
        localStorage.removeItem('currentUserProfileImage');
        localStorage.removeItem('userLatitude');
        localStorage.removeItem('userLongitude');
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('currentUserId');
        const storedUserEmail = localStorage.getItem('currentUserEmail');
        const storedUserName = localStorage.getItem('currentUserName');
        const storedUserProfileImage = localStorage.getItem('currentUserProfileImage');
        const storedUserLatitude = parseFloat(localStorage.getItem('userLatitude'));
        const storedUserLongitude = parseFloat(localStorage.getItem('userLongitude'));
        if (storedUserId) {
            setCurrentUserId(storedUserId);
            setCurrentUserEmail(storedUserEmail);
            setCurrentUserName(storedUserName);
            setCurrentUserProfileImage(storedUserProfileImage);
            setUserLatitude(storedUserLatitude);
            setUserLongitude(storedUserLongitude);
            setIsAuthenticated(true);
        } else {
            setCurrentUserId(null);
            setCurrentUserEmail(null);
            setCurrentUserName(null);
            setCurrentUserProfileImage(null);
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
            currentUserProfileImage,
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
