import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface InstallPromptContextType {
    showInstallPrompt: boolean;
    setShowInstallPrompt: (show: boolean) => void;
    triggerInstallPrompt: () => void;
}

const InstallPromptContext = createContext<InstallPromptContextType | undefined>(undefined);

export const InstallPromptProvider = ({ children }: { children: ReactNode }) => {
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    const triggerInstallPrompt = () => {
        setShowInstallPrompt(true);
    };

    useEffect(() => {
        // Basic detection for iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        // Check if running in standalone mode (PWA)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // Auto-show only if not standalone and hasn't been seen yet
        if (!isStandalone) {
            const hasSeenGuide = sessionStorage.getItem('hasSeenInstallGuide');
            if (!hasSeenGuide && isIosDevice) { // Default to iOS auto-show as per original logic, or maybe all?
                // Let's keep original logic: auto-show for iOS mobile web
                setShowInstallPrompt(true);
            }
        }
    }, []);

    return (
        <InstallPromptContext.Provider value={{ showInstallPrompt, setShowInstallPrompt, triggerInstallPrompt }}>
            {children}
        </InstallPromptContext.Provider>
    );
};

export const useInstallPrompt = () => {
    const context = useContext(InstallPromptContext);
    if (!context) {
        throw new Error('useInstallPrompt must be used within a InstallPromptProvider');
    }
    return context;
};
