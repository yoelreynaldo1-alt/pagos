import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name) return;

        // Save and Sign In
        signIn(formData);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <Truck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Bienvenido</h1>
                    <p className="text-blue-200 text-sm mt-1 text-center">
                        Configura tu perfil una sola vez para comenzar.<br />
                        Tus datos se usarán para las facturas.
                    </p>
                </div>

                <form onSubmit={handleStart} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Nombre Completo</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Yoel Reynaldo"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Dirección</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Ej: 1234 Main St"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Ciudad, Estado</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Ej: Cape Coral, FL"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Correo (Opcional)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="nombre@ejemplo.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all mt-1"
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-6"
                    >
                        Comenzar <ArrowRight size={20} />
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-xs text-white/40">
                    <p>Elite Transport App v1.0</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
