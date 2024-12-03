import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AdminReport() {
    const navigate = useNavigate();
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is admin on component mount
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/users/me`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                
                if (response.data.role !== 'admin') {
                    toast.error('Access denied. Admin privileges required.');
                    navigate('/');
                } else {
                    setIsAdmin(true);
                }
            } catch (error) {
                toast.error('Authentication failed');
                navigate('/login');
            }
        };

        checkAdminStatus();
    }, [navigate]);

    const generateReport = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reports/monthly-revenue`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { month, year }
                }
            );

            setReportData(response.data);
            toast.success('Report generated successfully');
        } catch (error) {
            console.error('Report generation error:', error);
            if (error.response?.status === 403) {
                toast.error('Access denied. Admin privileges required.');
                navigate('/');
            } else {
                toast.error(error.response?.data?.message || 'Error generating report');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = () => {
        // Implement PDF export functionality
        toast.info('PDF export functionality coming soon');
    };

    if (!isAdmin) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Monthly Report</h1>
                    <button
                        onClick={handleExportPDF}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                        Export PDF
                    </button>
                </div>

                {/* Report Form */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <form onSubmit={generateReport} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Month</label>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Month</option>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <input
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    min="2000"
                                    max={new Date().getFullYear()}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Generating Report...' : 'Generate Report'}
                        </button>
                    </form>
                </div>

                {/* Report Results */}
                {reportData && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                Report for {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-600">Total Revenue</h3>
                                    <p className="text-2xl font-bold text-blue-900">
                                        GH₵{reportData.totalRevenue.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-600">Total Bookings</h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {reportData.totalBookings}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-purple-600">Economy Class Revenue</h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        GH₵{reportData.economyClassRevenue.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-yellow-600">First Class Revenue</h3>
                                    <p className="text-2xl font-bold text-yellow-900">
                                        GH₵{reportData.firstClassRevenue.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Bookings Table */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Detailed Bookings</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Ticket Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Flight Route
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Class
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Method
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reportData.bookings.map((booking, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {booking.ticketNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {booking.userDetails.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {`${booking.flightDetails.from} → ${booking.flightDetails.to}`}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                        {booking.seatClass}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                        {booking.paymentMethod}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        GH₵{booking.amount.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminReport;