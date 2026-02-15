import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, DollarSign, Calendar, Trash2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/supabaseClient';
import { useLanguage } from '@/context/LanguageContext';

const Expenses = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [expenses, setExpenses] = useState<any[]>([]);
    const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const { data } = await supabase.from('expenses').select();
        if (data) {
            const sorted = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setExpenses(sorted);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!newExpense.description || !newExpense.amount) return;

        const expense = {
            ...newExpense,
            amount: parseFloat(newExpense.amount),
            type: 'expense'
        };

        const { error } = await supabase.from('expenses').insert(expense);

        if (!error) {
            setNewExpense({ description: '', amount: '', date: format(new Date(), 'yyyy-MM-dd') });
            loadData();
        } else {
            alert('Error saving expense');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('history.deleteConfirm'))) return;
        const { error } = await supabase.from('expenses').delete().eq('id', id);
        if (!error) {
            setExpenses(expenses.filter(e => e.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
            <header className="px-4 py-4 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800">
                <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t('expenses.title')}</h1>
            </header>

            <main className="px-4 py-6 space-y-6 max-w-lg mx-auto">

                {/* Add New Expense Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-4">
                    <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Plus size={18} className="text-blue-500" />
                        {t('expenses.newExpense')}
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">{t('expenses.date')}</label>
                            <input
                                type="date"
                                value={newExpense.date}
                                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-slate-900/50 rounded-xl p-3 border border-gray-100 dark:border-slate-700 focus:outline-blue-500 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">{t('expenses.description')}</label>
                            <input
                                type="text"
                                placeholder="Gas, Food, Maintenance..."
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-slate-900/50 rounded-xl p-3 border border-gray-100 dark:border-slate-700 focus:outline-blue-500 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">{t('expenses.amount')}</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-slate-900/50 rounded-xl p-3 pl-8 border border-gray-100 dark:border-slate-700 focus:outline-blue-500 dark:text-white font-bold"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 font-bold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/20"
                        >
                            <Save size={18} />
                            {t('expenses.save')}
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t('expenses.history')}</h3>

                    {expenses.length === 0 && !loading && (
                        <p className="text-center text-gray-400 py-8">{t('expenses.noExpenses')}</p>
                    )}

                    <AnimatePresence>
                        {expenses.map((expense) => (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{expense.description}</p>
                                    <p className="text-xs text-gray-500">{format(new Date(expense.date), 'MMM d, yyyy')}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-red-500">-${parseFloat(expense.amount).toFixed(2)}</span>
                                    <button onClick={() => handleDelete(expense.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </main>
        </div>
    );
};

export default Expenses;
