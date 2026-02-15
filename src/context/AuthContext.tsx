import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: any | null;
    signIn: () => void;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Mock User for Simulation
const MOCK_USER = {
    id: 'user_123',
    email: 'driver@elitetransport.com',
    name: 'Yoel Reynaldo'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate checking for existing session
        const stored = localStorage.getItem('sb-session-mock');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const signIn = () => {
        // Mock sign in
        setUser(MOCK_USER);
        localStorage.setItem('sb-session-mock', JSON.stringify(MOCK_USER));
    };

    const signOut = () => {
        setUser(null);
        localStorage.removeItem('sb-session-mock');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
