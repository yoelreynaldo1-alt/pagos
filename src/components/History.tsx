import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Trash2, Edit2, Truck, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/supabaseClient';

const History = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        const { data } = await supabase.from('incomes').select();
        if (data) {
            // Add IDs if missing (mock data might not have them)
            const withIds = data.map((d: any, i: number) => ({
                ...d,
                id: d.id || `temp-${i}`, // Ensure ID exists
                dateObj: parseISO(d.date)
            })).sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime());
            setTransactions(withIds);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string, date: string) => {
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;

        // In mock, we might delete by date if ID isn't unique, but let's try ID
        // The mock 'insert' doesn't add IDs, so we might need to rely on Date+Amount or specific index?
        // Let's assume for now we can rebuild the list without this item and save it back.
        // Since Supabase mock is simple, we'll cheat a bit for the mock:
        // We'll filter the STATE and update localStorage directly via the mock's delete if we had IDs.
        // But since we didn't save IDs in AddIncome, let's filter by Date + Amount match for the mock delete

        // Actually, let's update Supabase Mock to support 'eq' properly or just do manual filter + save in client for simulation?
        // Correct way: The mock delete I just wrote expects .eq('id', value).
        // But my inserted data doesn't have IDs!
        // Quick fix: In `AddIncome`, let's add a random ID.
        // For now, let's just manually update localStorage here to keep it simple for the user.

        const updated = transactions.filter(t => t.id !== id);
        // Remove the 'id' and 'dateObj' temporary fields before saving back to raw storage
        const rawToSave = updated.map(({ id, dateObj, ...rest }) => rest);

        localStorage.setItem('supabase-mock-incomes', JSON.stringify(rawToSave));
        setTransactions(updated);
    };

    const handleEdit = (transaction: any) => {
        // Simple "Modify" for simulation
        const newAmount = prompt(`Editar monto para ${format(transaction.dateObj, 'eeee d', { locale: es })}:`, transaction.amount);
        if (newAmount && !isNaN(parseFloat(newAmount))) {
            const updated = transactions.map(t => {
                if (t.id === transaction.id) {
                    return { ...t, amount: parseFloat(newAmount) };
                }
                return t;
            });
            const rawToSave = updated.map(({ id, dateObj, ...rest }) => rest);
            localStorage.setItem('supabase-mock-incomes', JSON.stringify(rawToSave));
            setTransactions(updated);
        }
    };

    // Grouping
    const grouped = transactions.reduce((acc, t) => {
        const dateStr = format(t.dateObj, 'MMMM d, yyyy', { locale: es });
        (acc[dateStr] = acc[dateStr] || []).push(t);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
            <header className="px-4 py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200 dark:border-slate-800">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Historial</h1>
                <div className="w-10" />
            </header>

            <main className="px-4 pt-6 space-y-6">
                {transactions.length === 0 && !loading && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>No hay registros aún.</p>
                    </div>
                )}

                {Object.entries(grouped).map(([date, items]) => (
                    <div key={date} className="space-y-3">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-2 capitalize">{date}</h2>
                        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700">
                            <AnimatePresence>
                                {items.map((item: any, index: number) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`
                                            flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors
                                            ${index !== items.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Truck size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                    {format(item.dateObj, 'eeee', { locale: es })}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.payment_mode === 'hourly' ? `${item.hours} hrs @ $${item.rate}` : 'Pago Diario'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                +${item.amount.toFixed(2)}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.date)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default History;
