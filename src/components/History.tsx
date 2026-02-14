import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Filter, Calendar, MapPin, Truck, Fuel, Wrench, Utensils, Construction } from 'lucide-react';

// Mock Data
const transactions = [
    { id: 1, type: 'income', source: 'Elite Transport - Carga #1024', amount: 850.00, time: '2:30 PM', date: 'Hoy', icon: Truck },
    { id: 2, type: 'expense', source: 'Diesel - Pilot Travel Ctr', amount: -320.50, time: '1:15 PM', date: 'Hoy', icon: Fuel },
    { id: 3, type: 'expense', source: 'Peaje (Toll) - I-95', amount: -45.00, time: '11:00 AM', date: 'Hoy', icon: Construction },
    { id: 4, type: 'income', source: 'Ruta Extra - Miami', amount: 240.00, time: '8:45 PM', date: 'Ayer', icon: MapPin },
    { id: 5, type: 'income', source: 'Elite Transport - Carga #1023', amount: 920.00, time: '6:20 PM', date: 'Ayer', icon: Truck },
    { id: 6, type: 'expense', source: 'Mantenimiento - Cambio Aceite', amount: -150.00, time: '4:00 PM', date: 'Ayer', icon: Wrench },
    { id: 7, type: 'expense', source: 'Comida en Ruta', amount: -25.80, time: '9:15 PM', date: 'Feb 12', icon: Utensils },
];

const History = () => {
    const navigate = useNavigate();

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        (acc[transaction.date] = acc[transaction.date] || []).push(transaction);
        return acc;
    }, {} as Record<string, typeof transactions>);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
            {/* Header */}
            <header className="px-4 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 dark:border-slate-800">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Historial de Transacciones</h1>
                <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-blue-600 dark:text-blue-400"
                >
                    <Filter size={24} />
                </button>
            </header>

            <main className="px-4 pt-6 space-y-6">
                {Object.entries(groupedTransactions).map(([date, items]) => (
                    <div key={date} className="space-y-3">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2">{date}</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`
                                        flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors
                                        ${index !== items.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center
                                            ${item.type === 'income' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30'}
                                        `}>
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{item.source}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold ${item.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                        {item.type === 'income' ? '+' : ''}{item.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </main>

            {/* Sticky Summary Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 p-4">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total Ingresos</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">$2,010.00</span>
                    </div>
                    <div className="h-8 w-px bg-gray-200 dark:bg-slate-700" />
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Total Gastos</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">$541.30</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History;
