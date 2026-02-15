import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Calendar, Save, Calculator } from 'lucide-react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface DayEntry {
    name: string;
    date: string; // YYYY-MM-DD for input
    amount: string;
}

const AddIncome = () => {
    const navigate = useNavigate();

    // Default to current week's Monday
    const [weekStart, setWeekStart] = useState(() => {
        const today = new Date();
        const monday = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
        return format(monday, 'yyyy-MM-dd');
    });

    const [days, setDays] = useState<DayEntry[]>([]);
    const [total, setTotal] = useState(0);

    // Initialize/Update days when weekStart changes
    useEffect(() => {
        if (!weekStart) return;

        const start = parseISO(weekStart);
        const newDays: DayEntry[] = [];
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

        // Preserve existing amounts if just changing week? 
        // For simplicity in this "restore" request, we reset or map. 
        // Let's generate fresh dates.

        for (let i = 0; i < 5; i++) {
            const date = addDays(start, i);
            newDays.push({
                name: dayNames[i],
                date: format(date, 'yyyy-MM-dd'),
                amount: ''
            });
        }
        setDays(newDays);
    }, [weekStart]);

    // Recalculate total whenever days change
    useEffect(() => {
        const sum = days.reduce((acc, day) => {
            const val = parseFloat(day.amount) || 0;
            return acc + val;
        }, 0);
        setTotal(sum);
    }, [days]);

    const handleAmountChange = (index: number, value: string) => {
        // Validation: numbers and one decimal point
        if (!/^\d*\.?\d{0,2}$/.test(value)) return;

        const newDays = [...days];
        newDays[index].amount = value;
        setDays(newDays);
    };

    const handleDateChange = (index: number, value: string) => {
        const newDays = [...days];
        newDays[index].date = value;
        setDays(newDays);
    };

    const handleSubmit = () => {
        // Mock save functionality
        console.log("Saving Weekly Income:", { weekStart, total, days });
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="px-4 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <X size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Registro Semanal</h1>
                <div className="w-10" />
            </header>

            <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-6">

                {/* Week Selector Card */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Semana del (Lunes)</label>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                            <Calendar size={20} />
                        </div>
                        <input
                            type="date"
                            value={weekStart}
                            onChange={(e) => setWeekStart(e.target.value)}
                            className="flex-1 bg-transparent text-lg font-semibold text-gray-900 dark:text-white focus:outline-none"
                        />
                    </div>
                </div>

                {/* Days Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 dark:bg-slate-900/50 p-3 border-b border-gray-100 dark:border-slate-700">
                        <div className="col-span-4 text-xs font-bold text-gray-400 uppercase">Día</div>
                        <div className="col-span-4 text-xs font-bold text-gray-400 uppercase">Fecha</div>
                        <div className="col-span-4 text-right text-xs font-bold text-gray-400 uppercase">Monto</div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                        {days.map((day, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="grid grid-cols-12 items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                                <div className="col-span-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-bold">
                                        {day.name.charAt(0)}
                                    </span>
                                    {day.name}
                                </div>
                                <div className="col-span-4">
                                    <input
                                        type="date"
                                        value={day.date}
                                        onChange={(e) => handleDateChange(index, e.target.value)}
                                        className="w-full bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none font-medium"
                                    />
                                </div>
                                <div className="col-span-4 relative">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={day.amount}
                                        onChange={(e) => handleAmountChange(index, e.target.value)}
                                        className="w-full bg-transparent text-right text-gray-900 dark:text-white font-bold focus:outline-none"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Total Footer */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 flex justify-between items-center border-t border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                            <Calculator size={20} />
                            <span className="font-bold">Total Semanal</span>
                        </div>
                        <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex-1" />

                {/* Save Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 font-bold text-lg"
                >
                    <Save size={20} />
                    Guardar Semana
                </motion.button>

            </main>
        </div>
    );
};

export default AddIncome;
