import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Plus, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Bell, Menu, Truck, MapPin, Package, Send } from 'lucide-react';
import { format } from 'date-fns';

const data = [
    { name: 'Mon', income: 4000, expenses: 2400 },
    { name: 'Tue', income: 3000, expenses: 1398 },
    { name: 'Wed', income: 2000, expenses: 9800 },
    { name: 'Thu', income: 2780, expenses: 3908 },
    { name: 'Fri', income: 1890, expenses: 4800 },
    { name: 'Sat', income: 2390, expenses: 3800 },
    { name: 'Sun', income: 3490, expenses: 4300 },
];

const Dashboard = () => {
    const navigate = useNavigate();

    const handleSendInvoice = () => {
        const currentDate = format(new Date(), 'MMMM d, yyyy');
        const subject = `Factura Elite Transport - ${currentDate}`;
        const body = `
Hola Elite Transport,

Aquí está el desglose de mi semana de trabajo:

--- RESUMEN SEMANAL ---
Fecha: ${currentDate}

Total Ingresos: $1,245.00
Total Gastos: $325.50
-----------------------
GANANCIA NETA: $919.50

Detalles adjuntos en la aplicación.

Gracias,
Chofer
        `.trim();

        window.location.href = `mailto:billing@elitetransport.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">WeekPay Pro</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <Bell size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                        <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="Profile" />
                    </div>
                </div>
            </header>

            <main className="pt-20 px-4 space-y-6">
                {/* Weekly Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, Driver</p>
                </div>

                {/* Chart Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
                >
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Earnings</p>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">$1,830.00</h2>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium">
                            <ArrowUpRight size={14} />
                            <span>+12.5%</span>
                        </div>
                    </div>

                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/add')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-shadow"
                    >
                        <div className="bg-white/20 p-2 rounded-full">
                            <Plus size={24} />
                        </div>
                        <span className="font-semibold">Nueva Carga</span>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/expenses')}
                        className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border border-gray-100 dark:border-slate-700 shadow-sm"
                    >
                        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 p-2 rounded-full">
                            <Wallet size={24} />
                        </div>
                        <span className="font-semibold">Gastos</span>
                    </motion.button>
                </div>

                {/* Send Invoice Action */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/invoice')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                >
                    <div className="bg-white/20 p-2 rounded-full">
                        <Send size={20} />
                    </div>
                    <span className="font-bold text-lg">Ver / Enviar Factura</span>
                </motion.button>

                {/* Recent Activity */}
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                        <button onClick={() => navigate('/history')} className="text-sm text-blue-600 dark:text-blue-400 font-medium">See All</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Uber Trip</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Today, 2:30 PM</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">+$45.20</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-slate-800 p-4 pb-6">
                <div className="flex justify-around items-center">
                    <button className="flex flex-col items-center gap-1 text-blue-600 dark:text-blue-400">
                        <div className="p-1 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <Menu size={24} />
                        </div>
                        <span className="text-xs font-medium">Home</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <Wallet size={24} />
                        <span className="text-xs font-medium">Income</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <ArrowDownRight size={24} />
                        <span className="text-xs font-medium">Expenses</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Dashboard;
