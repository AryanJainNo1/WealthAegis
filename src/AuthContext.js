import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { apiService } from '@/lib/api';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = async (email, password) => {
        try {
            const response = await apiService.login(email, password);
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return true;
        }
        catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };
    const signup = async (name, email, password) => {
        try {
            const response = await apiService.signup(name, email, password);
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return true;
        }
        catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    };
    const loginAsGuest = () => {
        const guestUser = {
            id: 'guest',
            name: 'Guest User',
            email: 'guest@example.com',
            guest: true
        };
        setUser(guestUser);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    const getToken = () => localStorage.getItem('token');
    return (_jsx(AuthContext.Provider, { value: {
            user,
            login,
            signup,
            loginAsGuest,
            logout,
            getToken
        }, children: children }));
};
