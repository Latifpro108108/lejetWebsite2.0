import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function MonthlyReport() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const navigate = useNavigate();

    const generateReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('Generating report for:', { month, year });

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                toast.error('Please login again');
                navigate('/login');
                return;
            }

            console.log('Making API request to:', `${process.env.REACT_APP_API_URL}/api/reports/monthly-revenue`);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reports/monthly-revenue`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { month, year }
                }
            );

            console.log('Report data received:', response.data);

            // Transform the data if needed
            const transformedData = {
                ...response.data,
                averageRevenuePerBooking: response.data.totalBookings > 0 
                    ? response.data.totalRevenue / response.data.totalBookings 
                    : 0,
                bookings: response.data.bookings.map(booking => ({
                    ...booking,
                    amount: booking.amount || booking.totalAmount,
                    flightDetails: {
                        from: booking.flightDetails?.from || 'N/A',
                        to: booking.flightDetails?.to || 'N/A'
                    }
                }))
            };

            console.log('Transformed report data:', transformedData);
            setReportData(transformedData);
            toast.success('Report generated successfully');
        } catch (error) {
            console.error('Report generation error:', error);
            console.error('Error response:', error.response);
            
            if (error.response?.status === 403) {
                toast.error('Access denied. Admin privileges required.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Error generating report');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Monthly Booking Report</h1>
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Dashboard
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
                                    onChange={(e) => {
                                        console.log('Month selected:', e.target.value);
                                        setMonth(e.target.value);
                                    }}
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
                                    onChange={(e) => {
                                        console.log('Year changed:', e.target.value);
                                        setYear(e.target.value);
                                    }}
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
                                        GH₵{reportData.totalRevenue?.toLocaleString() || '0'}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-600">Total Bookings</h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {reportData.totalBookings || '0'}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-purple-600">Total Passengers</h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {reportData.totalPassengers || '0'}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-yellow-600">Avg. Revenue/Booking</h3>
                                    <p className="text-2xl font-bold text-yellow-900">
                                        GH₵{(reportData.averageRevenuePerBooking || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Class Distribution */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">Class Distribution</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-indigo-600">Economy Class</h4>
                                        <p className="text-xl font-bold text-indigo-900">
                                            Bookings: {reportData.economyClassBookings || '0'}
                                        </p>
                                        <p className="text-md text-indigo-800">
                                            Revenue: GH₵{reportData.economyClassRevenue?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div className="bg-pink-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-pink-600">First Class</h4>
                                        <p className="text-xl font-bold text-pink-900">
                                            Bookings: {reportData.firstClassBookings || '0'}
                                        </p>
                                        <p className="text-md text-pink-800">
                                            Revenue: GH₵{reportData.firstClassRevenue?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bookings Table */}
                            {reportData.bookings && reportData.bookings.length > 0 && (
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
                                                        Flight
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Class
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Passengers
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
                                                            {`${booking.flightDetails.from} → ${booking.flightDetails.to}`}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                                            {booking.seatClass}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {booking.passengers}
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
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MonthlyReport;