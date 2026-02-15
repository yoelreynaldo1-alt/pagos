import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const Invoice = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'MM/dd/yy');

    const [profile, setProfile] = useState({
        name: "Conductor (Sin Perfil)",
        address: "Actualizar en Perfil",
        city: "City, State",
        email: "billing@elitetransport.com"
    });

    useEffect(() => {
        const saved = localStorage.getItem('user-profile');
        if (saved) {
            setProfile(JSON.parse(saved));
        }
    }, []);

    // Mock Items for now (could connect to DB simulates later)
    const items = [
        { day: 'Monday', date: '01/13/26', amount: 145.00 },
        { day: 'Tuesday', date: '01/14/26', amount: 145.00 },
        { day: 'Wednesday', date: '01/15/26', amount: 145.00 },
        { day: 'Thursday', date: '01/16/26', amount: 145.00 },
        { day: 'Friday', date: '01/17/26', amount: 145.00 },
    ];

    const invoiceData = {
        number: Math.floor(Math.random() * 10000), // Random invoice number for sim
        date: formattedDate,
        company: {
            name: "Elite Transport Care",
            email: "billing@elitetransport.com"
        },
        driver: {
            name: profile.name,
            address: profile.address,
            city: profile.city
        },
        items: items
    };

    const total = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);

    const handlePrint = () => {
        window.print();
    };

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [sendMode, setSendMode] = useState<'gmail' | 'default'>('default');

    const handleOpenEmailModal = (mode: 'gmail' | 'default') => {
        setSendMode(mode);
        setShowEmailModal(true);
    };

    const handleSendEmail = () => {
        if (!recipientEmail) {
            alert("Please enter the company email.");
            return;
        }

        // 1. Format the items list
        const itemsList = invoiceData.items.map(item =>
            `${item.day} (${item.date}): $${item.amount.toFixed(2)}`
        ).join('\n');

        // 2. Construct the full email body in English
        const subject = `Invoice #${invoiceData.number} - ${profile.name}`;

        const bodyContent = `INVOICE #${invoiceData.number}
Date: ${invoiceData.date}

DRIVER DETAILS:
Name: ${profile.name}
Address: ${profile.address}
City: ${profile.city}

INVOICE ITEMS:
${itemsList}

TOTAL: $${total.toFixed(2)}

Thank you,
${profile.name}`;

        // 3. Encode for URL
        const encSubject = encodeURIComponent(subject);
        const encBody = encodeURIComponent(bodyContent);

        let url = '';

        if (sendMode === 'gmail') {
            // Gmail web interface
            url = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encSubject}&body=${encBody}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            // Default mailto
            url = `mailto:${recipientEmail}?subject=${encSubject}&body=${encBody}`;
            window.location.href = url;
        }

        setShowEmailModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            {/* Toolbar - Hidden when printing */}
            <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center px-4 md:px-0 print:hidden">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Dashboard</span>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-200 transition-colors"
                    >
                        <Printer size={20} />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                    <button
                        onClick={() => handleOpenEmailModal('gmail')}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-red-700 transition-colors"
                    >
                        <Share2 size={20} />
                        <span>Gmail</span>
                    </button>
                    <button
                        onClick={() => handleOpenEmailModal('default')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-green-700 transition-colors"
                    >
                        <Share2 size={20} />
                        <span>Otro Correo</span>
                    </button>
                </div>
            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:hidden">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Enviar Factura</h3>
                        <p className="text-sm text-gray-500 mb-4">Ingresa el correo de la compañía para enviar la factura.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Para:</label>
                                <input
                                    type="email"
                                    value={recipientEmail}
                                    onChange={(e) => setRecipientEmail(e.target.value)}
                                    placeholder="ej: billing@company.com"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Sheet */}
            <div className="bg-white w-full max-w-[210mm] p-10 md:p-12 shadow-xl print:shadow-none print:w-full text-gray-800 text-sm leading-normal">

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight uppercase">Invoice</h1>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Invoice No.</div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">{invoiceData.number}</div>
                    </div>
                </div>

                {/* Company & Driver Info */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">SOLD TO</h4>
                        <div className="text-lg font-bold text-gray-900">{invoiceData.company.name}</div>
                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-4">DATE</div>
                        <div className="text-gray-700 font-medium">{invoiceData.date}</div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">SHIP TO (DRIVER)</h4>
                        <div className="text-lg font-bold text-gray-900">{invoiceData.driver.name}</div>
                        <div className="text-gray-600">{invoiceData.driver.address}</div>
                        <div className="text-gray-600">{invoiceData.driver.city}</div>

                        <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-4">TERMS</div>
                        <div className="text-gray-700 font-medium">Weekly (Daily Rate)</div>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Description</th>
                            <th className="text-center py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Date</th>
                            <th className="text-right py-3 px-4 font-bold text-gray-700 bg-gray-50/50">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {invoiceData.items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="py-4 px-4">{item.day}</td>
                                <td className="py-4 px-4 text-center">{item.date}</td>
                                <td className="py-4 px-4 text-right">${item.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end pt-4">
                    <div className="w-1/2 md:w-1/3">
                        <div className="flex justify-between items-center py-4 border-t border-gray-200">
                            <span className="text-xl font-bold text-gray-500 uppercase tracking-wider">TOTAL</span>
                            <span className="text-3xl font-extrabold text-blue-600">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t-2 border-gray-100 text-center">
                    <p className="text-gray-500 text-xs font-medium">Thank you for your business.</p>
                </div>

            </div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    div.min-h-screen > div:last-child, div.min-h-screen > div:last-child * {
                        visibility: visible;
                    }
                    div.min-h-screen > div:last-child {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        box-shadow: none;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Invoice;
