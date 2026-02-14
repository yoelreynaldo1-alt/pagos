import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Calendar, DollarSign, Check } from 'lucide-react';
import { format } from 'date-fns';

const AddIncome = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [source, setSource] = useState('Elite Transport');
    const [date, setDate] = useState(new Date());

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and decimal point
        const value = e.target.value.replace(/[^0-9.]/g, '');
        // Check for max 2 decimal places
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) return;
        }
        setAmount(value);
    };

    const handleSubmit = () => {
        if (!amount) return;

        // In a real app, we would save to localStorage or backend here
        console.log({ amount, source, date });

        // Go back to dashboard
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="px-4 py-4 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Add Income</h1>
                <div className="w-10" /> {/* Spacer for centering */}
            </header>

            <main className="flex-1 px-6 pt-10 pb-6 flex flex-col gap-10">

                {/* Amount Input */}
                <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Amount</label>
                    <div className="relative w-full max-w-xs">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-light text-gray-400 dark:text-slate-500">$</span>
                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full bg-transparent text-center text-5xl font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-300 dark:placeholder-slate-700"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Source Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Service</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {['Uber', 'Lyft', 'DoorDash', 'Other'].map((s) => (
                            <motion.button
                                key={s}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSource(s)}
                                className={`
                                    px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all
                                    ${source === s
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-700'}
                                `}
                            >
                                {s}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</label>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                            <Calendar size={20} className="text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{format(date, 'MMMM d, yyyy')}</span>
                        </div>
                        <span className="text-sm text-gray-400 dark:text-slate-500">Today</span>
                    </div>
                </div>

                <div className="flex-1" /> {/* Spacer */}

                {/* Submit Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!amount}
                    className={`
                        w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2
                        transition-all shadow-xl
                        ${amount
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/25'
                            : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'}
                    `}
                >
                    <Check size={20} />
                    Save Income
                </motion.button>

            </main>
        </div>
    );
};

export default AddIncome;
