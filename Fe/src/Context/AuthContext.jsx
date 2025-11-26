import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUserId = localStorage.getItem('userId');

        if (storedToken && storedUserId) {
            setToken(storedToken);
            setUser({ id: storedUserId });
        }
        setLoading(false);
    }, []);

    // Save token to localStorage when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    // Save user ID to localStorage when it changes
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem('userId', user.id);
        } else {
            localStorage.removeItem('userId');
        }
    }, [user]);

    const login = (authToken, userData) => {
        setToken(authToken);
        setUser(userData);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    };

    const value = {
        user,
        token,
        loading,
        setUser,
        setToken,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
};

export default AuthContext;
