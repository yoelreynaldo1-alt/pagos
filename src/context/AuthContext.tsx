import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: any | null;
    signIn: (data: any) => void;
    signOut: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Mock User for Simulation - REMOVED
// We now use the persistent profile from localStorage

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing profile (Onboarding complete)
        const storedProfile = localStorage.getItem('user-profile');
        if (storedProfile) {
            setUser(JSON.parse(storedProfile));
        }
        setLoading(false);
    }, []);

    const signIn = (profileData: any) => {
        // Save profile and set user state
        localStorage.setItem('user-profile', JSON.stringify(profileData));
        setUser(profileData);
    };

    const signOut = () => {
        // Optional: Clear profile to reset demo
        // For now, we might just want to 'reset' or edit profile. 
        // But to test the flow, we might keep a clear option hidden or just manually clear.
        // User asked for "never ask again", so signOut might not be exposed in UI often.
        setUser(null);
        localStorage.removeItem('user-profile');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
