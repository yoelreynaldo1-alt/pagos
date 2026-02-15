import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, MoreVertical, Download } from 'lucide-react'; // PlusSquare as a proxy for "Add to Home" icon, MoreVertical for Android menu
import { useLanguage } from '@/context/LanguageContext';
import { useInstallPrompt } from '@/context/InstallPromptContext';

const InstallPrompt = () => {
    const { t } = useLanguage();
    const { showInstallPrompt, setShowInstallPrompt } = useInstallPrompt();

    if (!showInstallPrompt) return null;

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    const handleClose = () => {
        setShowInstallPrompt(false);
        sessionStorage.setItem('hasSeenInstallGuide', 'true');
    };

    return (
        <AnimatePresence>
            {showInstallPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/90 dark:bg-slate-900/90 w-full max-w-md rounded-2xl p-6 shadow-2xl backdrop-blur-md border border-white/20 relative"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-3 flex items-center justify-center text-white font-bold text-2xl">
                                W
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                {t('install.title')}
                            </h2>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                                {t('install.appIcon')}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {isIos ? (
                                <>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                            <Share size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('install.iosInstructions.share')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('install.iosInstructions.shareHint')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                            <PlusSquare size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('install.iosInstructions.addToHome')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('install.iosInstructions.addToHomeHint')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                            <span className="font-bold text-lg px-1">Add</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('install.iosInstructions.confirm')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('install.iosInstructions.confirmHint')}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                            <MoreVertical size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('install.androidInstructions.menu')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('install.androidInstructions.menuHint')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                                            <Download size={24} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{t('install.androidInstructions.install')}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('install.androidInstructions.installHint')}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
