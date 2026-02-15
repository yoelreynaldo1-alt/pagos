import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Calendar, Save, Calculator, Clock, Sun } from 'lucide-react';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { doc, collection, addDoc } from 'firebase/firestore'; // Firebase imports
import { db } from '@/firebase';

interface DayEntry {
    name: string;
    date: string; // YYYY-MM-DD
    amount: string;
    hours?: string;
    rate?: string;
    overtimeHours?: string;
    overtimeRate?: string;
}

type PaymentMode = 'daily' | 'hourly';

const AddIncome = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Default to current week's Monday
    const [weekStart, setWeekStart] = useState(() => {
        const today = new Date();
        const monday = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
        return format(monday, 'yyyy-MM-dd');
    });

    const [paymentMode, setPaymentMode] = useState<PaymentMode>('daily');
    const [days, setDays] = useState<DayEntry[]>([]);
    const [total, setTotal] = useState(0);

    // Initialize/Update days when weekStart changes
    useEffect(() => {
        if (!weekStart) return;

        const start = parseISO(weekStart);
        const newDays: DayEntry[] = [];
        const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

        for (let i = 0; i < 7; i++) {
            const date = addDays(start, i);
            newDays.push({
                name: dayNames[i],
                date: format(date, 'yyyy-MM-dd'),
                amount: '',
                hours: '',
                rate: '',
                overtimeHours: '',
                overtimeRate: ''
            });
        }
        setDays(newDays);
    }, [weekStart]);

    // Recalculate total
    useEffect(() => {
        const sum = days.reduce((acc, day) => {
            const val = parseFloat(day.amount) || 0;
            return acc + val;
        }, 0);
        setTotal(sum);
    }, [days]);

    const handleAmountChange = (index: number, value: string) => {
        if (!/^\d*\.?\d{0,2}$/.test(value)) return;
        const newDays = [...days];
        newDays[index].amount = value;
        setDays(newDays);
    };

    const handleHourlyChange = (index: number, field: keyof DayEntry, value: string) => {
        if (!/^\d*\.?\d{0,2}$/.test(value)) return;

        const newDays = [...days];
        newDays[index] = { ...newDays[index], [field]: value };

        // Auto-calc amount
        const hrs = parseFloat(newDays[index].hours || '0');
        const rate = parseFloat(newDays[index].rate || '0');
        const ovtHrs = parseFloat(newDays[index].overtimeHours || '0');
        const ovtRate = parseFloat(newDays[index].overtimeRate || '0');

        const regularPay = hrs * rate;
        const overtimePay = ovtHrs * ovtRate;
        const totalPay = regularPay + overtimePay;

        if (totalPay > 0) {
            newDays[index].amount = totalPay.toFixed(2);
        } else {
            newDays[index].amount = '';
        }

        setDays(newDays);
    };

    const handleDateChange = (index: number, value: string) => {
        const newDays = [...days];
        newDays[index].date = value;
        setDays(newDays);
    };

    const handleSubmit = async () => {
        if (!user) {
            alert("Debes iniciar sesión para guardar.");
            return;
        }

        // Filter out days with no amount
        const entriesToSave = days
            .filter(d => parseFloat(d.amount) > 0)
            .map(d => ({
                userId: user.uid, // Start linking to user
                date: d.date,
                amount: parseFloat(d.amount),
                type: 'income',
                payment_mode: paymentMode,
                hours: d.hours ? parseFloat(d.hours) : null,
                rate: d.rate ? parseFloat(d.rate) : null,
                overtimeHours: d.overtimeHours ? parseFloat(d.overtimeHours) : null,
                overtimeRate: d.overtimeRate ? parseFloat(d.overtimeRate) : null,
                created_at: new Date().toISOString()
            }));

        if (entriesToSave.length === 0) {
            alert(t('addIncome.error') || "No hay datos para guardar");
            return;
        }

        try {
            // Save to Firebase Firestore 'incomes' collection
            const incomesRef = collection(db, 'incomes');
            // Batch write or simple loop for now (loop is safer for small batches without atomic requirement)
            for (const entry of entriesToSave) {
                await addDoc(incomesRef, entry);
            }
            console.log("Saved to Firestore:", entriesToSave);
            navigate('/');
        } catch (error) {
            console.error("Error saving to Firestore:", error);
            alert("Error al guardar en la base de datos.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="px-4 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800">
                <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <X size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('addIncome.title')}</h1>
                <div className="w-10" />
            </header>

            <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full space-y-6">

                {/* Controls Card */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                    {/* Week Selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t('addIncome.weekOf')}</label>
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

                    {/* Mode Toggle */}
                    <div className="bg-gray-100 dark:bg-slate-700 p-1 rounded-xl flex">
                        <button
                            onClick={() => setPaymentMode('daily')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                        >
                            <Sun size={16} /> {t('addIncome.daily')}
                        </button>
                        <button
                            onClick={() => setPaymentMode('hourly')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${paymentMode === 'hourly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                        >
                            <Clock size={16} /> {t('addIncome.hourly')}
                        </button>
                    </div>
                </div>

                {/* Days Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className={`grid ${paymentMode === 'hourly' ? 'grid-cols-12' : 'grid-cols-12'} bg-gray-50 dark:bg-slate-900/50 p-3 border-b border-gray-100 dark:border-slate-700 gap-2`}>
                        <div className="col-span-2 text-xs font-bold text-gray-400 uppercase">{t('addIncome.day')}</div>
                        {paymentMode === 'hourly' && (
                            <>
                                <div className="col-span-2 text-center text-xs font-bold text-gray-400 uppercase leading-none">Hrs<br />Reg</div>
                                <div className="col-span-2 text-center text-xs font-bold text-gray-400 uppercase leading-none">Tarifa<br />Reg</div>
                                <div className="col-span-2 text-center text-xs font-bold text-blue-400 uppercase leading-none">Hrs<br />Extra</div>
                                <div className="col-span-2 text-center text-xs font-bold text-blue-400 uppercase leading-none">Tarifa<br />Extra</div>
                            </>
                        )}
                        <div className={`${paymentMode === 'hourly' ? 'col-span-2' : 'col-span-10'} text-right text-xs font-bold text-gray-400 uppercase`}>{t('addIncome.total')}</div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-slate-700">
                        {days.map((day, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`grid ${paymentMode === 'hourly' ? 'grid-cols-12' : 'grid-cols-12'} items-center p-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors gap-2`}
                            >
                                {/* Name */}
                                <div className="col-span-2 font-medium text-gray-900 dark:text-white flex flex-col">
                                    <span className="truncate">{day.name.substring(0, 3)}</span>
                                    <span className="text-[10px] text-gray-400">{format(parseISO(day.date), 'dd/MM')}</span>
                                </div>

                                {paymentMode === 'hourly' ? (
                                    <>
                                        <div className="col-span-2">
                                            <input
                                                type="text" inputMode="decimal" placeholder="0"
                                                value={day.hours} onChange={(e) => handleHourlyChange(index, 'hours', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-slate-900/50 rounded p-1 text-center text-sm focus:outline-blue-500 border border-transparent focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text" inputMode="decimal" placeholder="$"
                                                value={day.rate} onChange={(e) => handleHourlyChange(index, 'rate', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-slate-900/50 rounded p-1 text-center text-sm focus:outline-blue-500 border border-transparent focus:border-blue-500"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text" inputMode="decimal" placeholder="0"
                                                value={day.overtimeHours} onChange={(e) => handleHourlyChange(index, 'overtimeHours', e.target.value)}
                                                className="w-full bg-blue-50 dark:bg-blue-900/20 rounded p-1 text-center text-sm text-blue-600 focus:outline-blue-500 border border-blue-100 dark:border-blue-800"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="text" inputMode="decimal" placeholder="$"
                                                value={day.overtimeRate} onChange={(e) => handleHourlyChange(index, 'overtimeRate', e.target.value)}
                                                className="w-full bg-blue-50 dark:bg-blue-900/20 rounded p-1 text-center text-sm text-blue-600 focus:outline-blue-500 border border-blue-100 dark:border-blue-800"
                                            />
                                        </div>
                                        <div className="col-span-2 text-right font-bold text-gray-900 dark:text-white text-sm">
                                            ${day.amount || '0'}
                                        </div>
                                    </>
                                ) : (
                                    /* Daily Mode Input */
                                    <div className="col-span-10 relative">
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="text" inputMode="decimal" placeholder="0.00"
                                            value={day.amount} onChange={(e) => handleAmountChange(index, e.target.value)}
                                            className="w-full bg-transparent text-right text-gray-900 dark:text-white font-bold focus:outline-none text-lg"
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Total Footer */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 flex justify-between items-center border-t border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                            <Calculator size={20} />
                            <span className="font-bold">{t('addIncome.weeklyTotal')}</span>
                        </div>
                        <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="flex-1" />

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 font-bold text-lg"
                >
                    <Save size={20} />
                    {t('addIncome.save')}
                </motion.button>

            </main>
        </div>
    );
};

export default AddIncome;
