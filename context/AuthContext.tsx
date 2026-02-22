import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    firstName: string;
    email: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    user: User | null;
    login: (firstName: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Check for existing session on mount
        const loadSession = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('@auth_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to load user session', error);
            }
        };
        loadSession();
    }, []);

    const login = async (firstName: string, email: string) => {
        const newUser = { firstName, email };
        try {
            await AsyncStorage.setItem('@auth_user', JSON.stringify(newUser));
            setUser(newUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to save user session', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@auth_user');
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Failed to remove user session', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
