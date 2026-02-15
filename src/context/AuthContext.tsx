import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; // Added updateDoc
import { auth, db } from '../firebase';

interface AuthContextType {
    user: any | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, userData: any) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (data: any) => Promise<void>; // Added for profile updates
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                // Fetch user profile from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUser({ uid: currentUser.uid, email: currentUser.email, ...userDoc.data() });
                } else {
                    // Fallback to basic auth info if firestore doc missing (shouldn't happen in normal flow)
                    setUser({ uid: currentUser.uid, email: currentUser.email });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, userData: any) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { uid } = userCredential.user;

        // Save extra data to Firestore
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            email,
            createdAt: new Date().toISOString()
        });

        // Update local state immediately to avoid lag
        setUser({ uid, email, ...userData });
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        // State update handled by onAuthStateChanged
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    // New function to update profile
    const updateUserProfile = async (data: any) => {
        if (!auth.currentUser) return;
        const uid = auth.currentUser.uid;

        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, data);

        // Update local state
        setUser((prev: any) => ({ ...prev, ...data }));
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateUserProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
