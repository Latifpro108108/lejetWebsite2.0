import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

function MonthlyReport() {
    const [month, setMonth] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const navigate = useNavigate();

    // Static chart data
    const staticChartData = {
        monthlyRevenue: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Revenue (GH₵)',
                data: [15000, 22000, 18000, 25000, 30000, 28000, 35000, 32000, 40000, 38000, 42000, 45000],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                tension: 0.4
            }]
        },
        classDistribution: {
            labels: ['Economy', 'First Class'],
            datasets: [{
                label: 'Bookings by Class',
                data: [150, 50],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        revenueByClass: {
            labels: ['Economy', 'First Class'],
            datasets: [{
                label: 'Revenue by Class (GH₵)',
                data: [250000, 180000],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        }
    };

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
            console.log(reportData)
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
                    <h1 className="text-3xl font-bold text-gray-900">Monthly Revenue Analytics</h1>
                    <button
                        onClick={() => navigate('/admin')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Charts Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Monthly Revenue Trend */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4">Monthly Revenue Trend</h3>
                            <div className="h-[400px]">
                                <Line
                                    data={staticChartData.monthlyRevenue}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: '2024 Revenue Distribution'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: value => `GH₵${value.toLocaleString()}`
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Booking Class Distribution */}
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-medium mb-4">Booking Class Distribution</h3>
                            <div className="h-[400px]">
                                <Bar
                                    data={staticChartData.classDistribution}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Number of Bookings by Class'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Revenue by Class */}
                        <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
                            <h3 className="text-lg font-medium mb-4">Revenue by Class</h3>
                            <div className="h-[400px]">
                                <Bar
                                    data={staticChartData.revenueByClass}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Total Revenue by Class'
                                            }
                                        },
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                ticks: {
                                                    callback: value => `GH₵${value.toLocaleString()}`
                                                }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-blue-600">Total Revenue</h3>
                        <p className="text-2xl font-bold text-blue-900">GH₵430,000</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-green-600">Total Bookings</h3>
                        <p className="text-2xl font-bold text-green-900">200</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-purple-600">Average Booking Value</h3>
                        <p className="text-2xl font-bold text-purple-900">GH₵2,150</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg shadow">
                        <h3 className="text-sm font-medium text-yellow-600">Growth Rate</h3>
                        <p className="text-2xl font-bold text-yellow-900">+15.8%</p>
                    </div>
                </div>

                {/* Date Selection Form */}
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
                            {loading ? 'Updating Charts...' : 'Update Charts'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MonthlyReport;