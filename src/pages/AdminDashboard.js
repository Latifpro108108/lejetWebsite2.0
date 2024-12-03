import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminDashboard() {
  console.log('AdminDashboard component rendered');

  const [airplanes, setAirplanes] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [newAirplane, setNewAirplane] = useState({
    name: '',
    capacity: '',
    currentLocation: '',
  });

  const [newFlight, setNewFlight] = useState({
    airplaneId: '',
    from: '',
    to: '',
    departureDate: '',
    departureTime: '',
    arrivalDate: '',
    arrivalTime: '',
    economyPrice: '',
    firstClassPrice: '',
    isRecurring: false,
    recurringDays: [],
    startDate: '',
    endDate: ''
  });

  const { user } = useContext(AuthContext);
  console.log('Current user:', user);

  const navigate = useNavigate();
  
  const airports = [
    'Accra (Kotoka Airport)',
    'Kumasi Airport',
    'Tamale Airport',
    'Takoradi Airport'
  ];

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  const fetchAirplanes = useCallback(async () => {
    console.log('Fetching airplanes...');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in fetchAirplanes');
        throw new Error('No token found');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/airplanes`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Airplanes fetched successfully:', response.data);
      setAirplanes(response.data);
    } catch (error) {
      console.error('Error fetching airplanes:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/login');
      } else {
        toast.error('Error fetching airplanes');
      }
    }
  }, [navigate]);

  const fetchFlights = useCallback(async () => {
    console.log('Fetching flights...');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in fetchFlights');
        throw new Error('No token found');
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/admin/flights`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        console.log('Flights fetched successfully:', response.data);
        const validFlights = response.data.map(flight => ({
          ...flight,
          airplane: flight.airplane || { name: 'Aircraft Not Assigned' }
        }));
        setFlights(validFlights);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/login');
      } else {
        setError('Error fetching flights');
        toast.error('Error fetching flights');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    console.log('useEffect triggered with refreshKey:', refreshKey);
    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('Please login to access admin dashboard');
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      console.log('Non-admin user detected, redirecting to home');
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in useEffect');
      toast.error('Please login again');
      navigate('/login');
      return;
    }

    fetchAirplanes();
    fetchFlights();
  }, [user, navigate, refreshKey, fetchAirplanes, fetchFlights]);

  const handleInputChange = (e, setter) => {
    const { name, value, type, checked } = e.target;
    console.log('Input changed:', { name, value, type, checked });
    setter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRecurringDayToggle = (day) => {
    console.log('Toggling recurring day:', day);
    setNewFlight(prev => {
      const newDays = prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day];
      console.log('Updated recurring days:', newDays);
      return {
        ...prev,
        recurringDays: newDays
      };
    });
  };

  const handleAddAirplane = async (e) => {
    console.log('Add Airplane form submitted');
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in handleAddAirplane');
        toast.error('Please login again');
        navigate('/login');
        return;
      }

      console.log('Sending airplane data:', newAirplane);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/airplanes`,
        newAirplane,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Airplane added successfully');
      setNewAirplane({ name: '', capacity: '', currentLocation: '' });
      toast.success('Airplane added successfully');
      setRefreshKey(oldKey => oldKey + 1);
    } catch (error) {
      console.error('Error adding airplane:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/login');
      } else {
        toast.error('Error adding airplane');
      }
    }
  };
  const handleAddFlight = async (e) => {
    e.preventDefault();
    console.log('Add Flight form submitted');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        navigate('/login');
        return;
      }
  
      // Basic validation
      if (!newFlight.airplaneId || !newFlight.from || !newFlight.to || 
          !newFlight.departureTime || !newFlight.arrivalTime || 
          !newFlight.economyPrice || !newFlight.firstClassPrice || 
          (!newFlight.isRecurring && !newFlight.departureDate)) {
        toast.error('Please fill in all required fields');
        return;
      }
  
      let flightData;
      
      if (newFlight.isRecurring) {
        // Handle recurring flight
        if (!newFlight.startDate || !newFlight.endDate || newFlight.recurringDays.length === 0) {
          toast.error('Please fill in all recurring flight details');
          return;
        }
  
        flightData = {
          airplaneId: newFlight.airplaneId,
          from: newFlight.from,
          to: newFlight.to,
          departureTime: newFlight.departureTime,
          arrivalTime: newFlight.arrivalTime,
          economyPrice: parseFloat(newFlight.economyPrice),
          firstClassPrice: parseFloat(newFlight.firstClassPrice),
          isRecurring: true,
          recurringDays: newFlight.recurringDays,
          startDate: newFlight.startDate,
          endDate: newFlight.endDate
        };
      } else {
        // Handle single flight
        const departureDateTime = new Date(`${newFlight.departureDate}T${newFlight.departureTime}:00`);
        let arrivalDateTime = new Date(`${newFlight.departureDate}T${newFlight.arrivalTime}:00`);
  
        // If arrival time is before departure time, it's the next day
        if (arrivalDateTime < departureDateTime) {
          arrivalDateTime.setDate(arrivalDateTime.getDate() + 1);
        }
  
        // Validate times
        const now = new Date();
        if (departureDateTime <= now) {
          toast.error('Departure time must be in the future');
          return;
        }
  
        if (arrivalDateTime <= departureDateTime) {
          toast.error('Arrival time must be after departure time');
          return;
        }
  
        flightData = {
          airplaneId: newFlight.airplaneId,
          from: newFlight.from,
          to: newFlight.to,
          departureTime: departureDateTime.toISOString(),
          arrivalTime: arrivalDateTime.toISOString(),
          economyPrice: parseFloat(newFlight.economyPrice),
          firstClassPrice: parseFloat(newFlight.firstClassPrice),
          isRecurring: false
        };
      }
  
      console.log('Sending flight data to server:', flightData);
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/flights`,
        flightData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log('Server response:', response.data);
      toast.success(newFlight.isRecurring ? 
        'Recurring flights scheduled successfully' : 
        'Flight scheduled successfully'
      );
      
      // Reset form
      setNewFlight({
        airplaneId: '',
        from: '',
        to: '',
        departureDate: '',
        departureTime: '',
        arrivalTime: '',
        economyPrice: '',
        firstClassPrice: '',
        isRecurring: false,
        recurringDays: [],
        startDate: '',
        endDate: ''
      });
  
      // Refresh flights list
      await fetchFlights();
  
    } catch (error) {
      console.error('Error adding flight:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error scheduling flight';
      toast.error(errorMessage);
    }
  };

  // If user is not authenticated or not admin, show loading
  if (!user || user.role !== 'admin') {
    console.log('Showing loading state - user not authenticated or not admin');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log('Rendering admin dashboard UI');
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Added Monthly Report Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link 
          to="/admin/monthly-report"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Monthly Report
        </Link>
      </div>
            {/* Add Airplane Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Airplane</h2>
        <form onSubmit={(e) => {
          console.log('Airplane form submission initiated');
          handleAddAirplane(e);
        }} className="space-y-4">
          <div>
            <label className="block mb-1">Airplane Name</label>
            <input
              type="text"
              name="name"
              value={newAirplane.name}
              onChange={(e) => {
                console.log('Airplane name changed:', e.target.value);
                handleInputChange(e, setNewAirplane);
              }}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={newAirplane.capacity}
              onChange={(e) => {
                console.log('Airplane capacity changed:', e.target.value);
                handleInputChange(e, setNewAirplane);
              }}
              required
              min="1"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Current Location</label>
            <select
              name="currentLocation"
              value={newAirplane.currentLocation}
              onChange={(e) => {
                console.log('Airplane location changed:', e.target.value);
                handleInputChange(e, setNewAirplane);
              }}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Airport</option>
              {airports.map((airport) => (
                <option key={airport} value={airport}>{airport}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Airplane
          </button>
        </form>
      </div>

      {/* Add Flight Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Schedule New Flight</h2>
        <form onSubmit={(e) => {
          console.log('Flight form submission initiated');
          handleAddFlight(e);
        }} className="space-y-4">
          <div>
            <label className="block mb-1">Select Airplane</label>
            <select
              name="airplaneId"
              value={newFlight.airplaneId}
              onChange={(e) => {
                console.log('Selected airplane:', e.target.value);
                handleInputChange(e, setNewFlight);
              }}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Airplane</option>
              {airplanes.map((airplane) => (
                <option key={airplane._id} value={airplane._id}>
                  {airplane.name} (Capacity: {airplane.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">From</label>
              <select
                name="from"
                value={newFlight.from}
                onChange={(e) => {
                  console.log('Departure airport changed:', e.target.value);
                  handleInputChange(e, setNewFlight);
                }}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Departure Airport</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">To</label>
              <select
                name="to"
                value={newFlight.to}
                onChange={(e) => {
                  console.log('Arrival airport changed:', e.target.value);
                  handleInputChange(e, setNewFlight);
                }}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Arrival Airport</option>
                {airports.filter(airport => airport !== newFlight.from).map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isRecurring"
                checked={newFlight.isRecurring}
                onChange={(e) => {
                  console.log('Recurring flight toggle:', e.target.checked);
                  handleInputChange(e, setNewFlight);
                }}
                className="mr-2"
              />
              Recurring Flight
            </label>
          </div>

          {newFlight.isRecurring ? (
            <>
              <div className="mb-4">
                <label className="block mb-1">Select Days</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newFlight.recurringDays.includes(day)}
                        onChange={() => handleRecurringDayToggle(day)}
                        className="mr-2"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newFlight.startDate}
                    onChange={(e) => handleInputChange(e, setNewFlight)}
                    required={newFlight.isRecurring}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newFlight.endDate}
                    onChange={(e) => handleInputChange(e, setNewFlight)}
                    required={newFlight.isRecurring}
                    min={newFlight.startDate}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block mb-1">Flight Date</label>
              <input
                type="date"
                name="departureDate"
                value={newFlight.departureDate}
                onChange={(e) => handleInputChange(e, setNewFlight)}
                required={!newFlight.isRecurring}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Departure Time</label>
              <input
                type="time"
                name="departureTime"
                value={newFlight.departureTime}
                onChange={(e) => handleInputChange(e, setNewFlight)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={newFlight.arrivalTime}
                onChange={(e) => handleInputChange(e, setNewFlight)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Economy Price (GH₵)</label>
              <input
                type="number"
                name="economyPrice"
                value={newFlight.economyPrice}
                onChange={(e) => handleInputChange(e, setNewFlight)}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">First Class Price (GH₵)</label>
              <input
                type="number"
                name="firstClassPrice"
                value={newFlight.firstClassPrice}
                onChange={(e) => handleInputChange(e, setNewFlight)}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {newFlight.isRecurring ? 'Schedule Recurring Flights' : 'Schedule Flight'}
          </button>
        </form>
      </div>

      {/* Display Existing Flights */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scheduled Flights</h2>
          <button
            onClick={() => {
              console.log('Refresh flights button clicked');
              setRefreshKey(oldKey => oldKey + 1);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Flights
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading flights...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            <p>{error}</p>
            <button 
              onClick={() => {
                console.log('Try again button clicked');
                setRefreshKey(oldKey => oldKey + 1);
              }}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Try again
            </button>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center py-4 text-gray-600">
            No flights scheduled
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map((flight) => (
              <div key={flight._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg">
                  {flight.airplane?.name || 'Aircraft Not Assigned'}
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="flex justify-between">
                    <span className="text-gray-600">From:</span>
                    <span>{flight.from}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span>{flight.to}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span>{new Date(flight.departureTime).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Arrival:</span>
                    <span>{new Date(flight.arrivalTime).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Economy:</span>
                    <span>GH₵{flight.economyPrice.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">First Class:</span>
                    <span>GH₵{flight.firstClassPrice.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      flight.status === 'scheduled' ? 'text-green-600' :
                      flight.status === 'cancelled' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                    </span>
                  </p>
                </div>
                {flight.isRecurring && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Recurring Flight</p>
                    <p className="text-sm">Days: {flight.recurringDays.join(', ')}</p>
                    {flight.recurringEndDate && (
                      <p className="text-sm">
                        Until: {new Date(flight.recurringEndDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;