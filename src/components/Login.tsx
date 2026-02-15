import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ArrowRight, Mail, Lock, User, MapPin, Building } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegistering) {
                if (!formData.name || !formData.email || !formData.password) {
                    throw new Error("Por favor completa los campos requeridos.");
                }
                if (formData.password.length < 6) {
                    throw new Error("La contraseña debe tener al menos 6 caracteres.");
                }

                await signUp(formData.email, formData.password, {
                    name: formData.name,
                    address: formData.address,
                    city: formData.city
                });
            } else {
                if (!formData.email || !formData.password) {
                    throw new Error("Por favor ingresa correo y contraseña.");
                }
                await signIn(formData.email, formData.password);
            }
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este correo ya está registrado.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Correo o contraseña incorrectos.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña es muy débil.');
            } else {
                setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <Truck size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {isRegistering ? 'Bienvenido' : 'Iniciar Sesión'}
                    </h1>
                    <p className="text-blue-200 text-sm mt-1 text-center">
                        {isRegistering
                            ? 'Crea tu perfil para comenzar a facturar.'
                            : 'Ingresa a tu cuenta para ver tus datos.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <>
                            <div>
                                <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Nombre Completo</label>
                                <div className="relative mt-1">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej: Yoel Reynaldo"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Dirección</label>
                                <div className="relative mt-1">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Ej: 1234 Main St"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Ciudad, Estado</label>
                                <div className="relative mt-1">
                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Ej: Cape Coral, FL"
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Correo Electrónico</label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="nombre@ejemplo.com"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-blue-200 uppercase tracking-wider ml-1">Contraseña</label>
                        <div className="relative mt-1">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="******"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                        {!loading && <ArrowRight size={20} />}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-sm text-blue-200 hover:text-white underline decoration-blue-400/50 underline-offset-4 transition-colors"
                    >
                        {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                    </button>
                </div>

                <div className="mt-8 text-center text-xs text-white/40">
                    <p>Elite Transport App v2.0</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
