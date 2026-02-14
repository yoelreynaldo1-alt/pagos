import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Dashboard from '@/components/Dashboard';

import AddIncome from '@/components/AddIncome';

import History from '@/components/History';

// Placeholder components - In a real setup these would be imported from generated files
const Expenses = () => <div className="p-4"><h1>Expenses</h1></div>;
const Settings = () => <div className="p-4"><h1>Settings</h1></div>;

const InstallGuide = ({ onClose }: { onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-slate-900/90 w-full max-w-md rounded-2xl p-6 shadow-2xl backdrop-blur-md border border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Install WeekPay</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">1. Tap the Share button</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Usually at the bottom of your screen.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">2. Select 'Add to Home Screen'</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Scroll down or swipe to find it using the plus icon.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="font-bold text-lg">Add</span>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">3. Tap 'Add' to confirm</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Top right corner of the screen.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl flex justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-2 flex items-center justify-center text-white font-bold text-2xl">W</div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">WeekPay</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    const [showInstallGuide, setShowInstallGuide] = useState(false);


    useEffect(() => {
        // Basic detection for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;


        // Check if running in standalone mode (PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // Show guide if on iOS and NOT standalone
        if (isIosDevice && !isStandalone) {
            // Only show once per session or use localstorage to track dismiss
            const hasSeenGuide = sessionStorage.getItem('hasSeenInstallGuide');
            if (!hasSeenGuide) {
                setShowInstallGuide(true);
            }
        }
    }, []);

    const handleCloseGuide = () => {
        setShowInstallGuide(false);
        sessionStorage.setItem('hasSeenInstallGuide', 'true');
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white font-inter">
                {showInstallGuide && <InstallGuide onClose={handleCloseGuide} />}

                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/add" element={<AddIncome />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
