import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Fuel, Wrench, Utensils, Construction, Plus } from 'lucide-react';

const Expenses = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Diesel/Gas');
    const [note, setNote] = useState('');

    const categories = [
        { id: 'diesel', name: 'Diesel/Gas', icon: Fuel, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
        { id: 'tolls', name: 'Peajes (Tolls)', icon: Construction, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
        { id: 'maintenance', name: 'Mantenimiento', icon: Wrench, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
        { id: 'food', name: 'Comidas en Ruta', icon: Utensils, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
    ];

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) return;
        }
        setAmount(value);
    };

    const handleSubmit = () => {
        if (!amount) return;
        console.log({ amount, category, note, type: 'expense' });
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col pb-6">
            <header className="px-4 py-4 flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Registrar Gasto</h1>
            </header>

            <main className="flex-1 px-6 pt-6 flex flex-col gap-8">
                {/* Amount Input */}
                <div className="flex flex-col items-center gap-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Monto</label>
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

                {/* Categories Grid */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Categoría</label>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setCategory(cat.name)}
                                className={`
                                    p-4 rounded-2xl border text-left transition-all flex flex-col gap-3
                                    ${category === cat.name
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                                        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'}
                                `}
                            >
                                <div className={`p-2 rounded-full w-fit ${cat.color}`}>
                                    <cat.icon size={20} />
                                </div>
                                <span className={`font-medium ${category === cat.name ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {cat.name}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nota (Opcional)</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ej. Cambio de Aceite..."
                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                <div className="flex-1" />

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!amount}
                    className={`
                        w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2
                        transition-all shadow-xl mb-4
                        ${amount
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-gray-500/25'
                            : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'}
                    `}
                >
                    <Plus size={20} />
                    Guardar Gasto
                </motion.button>
            </main>
        </div>
    );
};

export default Expenses;
