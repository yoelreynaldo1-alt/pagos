import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, MapPin, Building, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        address: '',
        city: '',
        email: '',
        company: 'Elite Transport Care' // Default
    });

    useEffect(() => {
        const saved = localStorage.getItem('user-profile');
        if (saved) {
            setProfile(JSON.parse(saved));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        localStorage.setItem('user-profile', JSON.stringify(profile));
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <header className="px-4 py-4 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 dark:border-slate-800">
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Perfil del Conductor</h1>
            </header>

            <main className="px-4 py-6 max-w-lg mx-auto space-y-6">

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                            <User size={40} />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Completa tus datos para que aparezcan automáticamente en tus facturas.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Dirección</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="address"
                                    value={profile.address}
                                    onChange={handleChange}
                                    placeholder="Ej: 123 Main St"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Ciudad, Estado, Zip</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="city"
                                    value={profile.city}
                                    onChange={handleChange}
                                    placeholder="Ej: Miami, FL 33100"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    placeholder="Ej: juan@email.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 font-bold text-lg"
                >
                    <Save size={20} />
                    Guardar Perfil
                </motion.button>

            </main>
        </div>
    );
};

export default Profile;
