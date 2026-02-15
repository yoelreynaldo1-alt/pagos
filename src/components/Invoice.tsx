import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import { format } from 'date-fns';

const Invoice = () => {
    const navigate = useNavigate();
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'MM/dd/yy');

    // Mock Data based on the image and specialized for Elite Transport
    const invoiceData = {
        number: 6575,
        date: formattedDate,
        company: {
            name: "Elite Transport Care",
            email: "billing@elitetransport.com"
        },
        driver: {
            name: "Yoel Reynaldo", // Using the name from the image as placeholder or generic
            address: "1750 Southeast 29th Lane",
            city: "Cape Coral, FL"
        },
        items: [
            { day: 'Monday', date: '01/13/26', amount: 145.00 },
            { day: 'Tuesday', date: '01/14/26', amount: 145.00 },
            { day: 'Wednesday', date: '01/15/26', amount: 145.00 },
            { day: 'Thursday', date: '01/16/26', amount: 145.00 },
            { day: 'Friday', date: '01/17/26', amount: 145.00 },
        ]
    };

    const total = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);

    const handlePrint = () => {
        window.print();
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
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        <Printer size={20} />
                        <span>Print / PDF</span>
                    </button>
                </div>
            </div>

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
