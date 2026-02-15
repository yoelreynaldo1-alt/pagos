import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { InstallPromptProvider } from '@/context/InstallPromptContext';

import Dashboard from '@/components/Dashboard';
import Invoice from '@/components/Invoice';
import Login from '@/components/Login';
import AddIncome from '@/components/AddIncome';
import History from '@/components/History';
import Profile from '@/components/Profile';
import Expenses from '@/components/Expenses';
import InstallPrompt from '@/components/InstallPrompt';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    if (loading) return null; // Or a spinner
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <LanguageProvider>
                <InstallPromptProvider>
                    <Router>
                        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-inter">
                            <InstallPrompt />
                            <Routes>
                                <Route path="/login" element={<Login />} />

                                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/add" element={<ProtectedRoute><AddIncome /></ProtectedRoute>} />
                                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                                <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                                <Route path="/invoice" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
                                <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            </Routes>
                        </div>
                    </Router>
                </InstallPromptProvider>
            </LanguageProvider>
        </AuthProvider>
    );
}

export default App;
