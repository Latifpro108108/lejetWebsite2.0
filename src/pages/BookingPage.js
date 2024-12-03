import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookingType = queryParams.get('type') || 'one-way';

  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    seatClass: 'economy'
  });

  const [searchResults, setSearchResults] = useState(null);
  const [returnFlights, setReturnFlights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState(null);

  const airports = [
    'Accra (Kotoka Airport)',
    'Kumasi Airport',
    'Tamale Airport',
    'Takoradi Airport'
  ];

  // useEffect(() => {
  //   if (bookingType === 'round-trip' && selectedOutboundFlight) {
  //     fetchReturnFlights();
  //   }
  // }, [selectedOutboundFlight]);

  useEffect(() => {
    if (bookingType === 'round-trip' && selectedOutboundFlight) {
      fetchReturnFlights();
    }
  }, [bookingType, selectedOutboundFlight, fetchReturnFlights]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const fetchReturnFlights = async () => {
    try {
      setLoading(true);
      const returnDate = new Date(searchParams.returnDate);
      returnDate.setUTCHours(0, 0, 0, 0);

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/flights/search`,
        {
          params: {
            from: searchParams.to,
            to: searchParams.from,
            date: returnDate.toISOString()
          }
        }
      );

      const flights = Array.isArray(response.data) ? response.data : response.data.flights;
      setReturnFlights({ flights: flights || [] });
      
      if (!flights || flights.length === 0) {
        toast.info('No return flights available for the selected date');
      }
    } catch (error) {
      console.error('Error fetching return flights:', error);
      toast.error('Error fetching return flights');
      setReturnFlights({ flights: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const searchDate = new Date(searchParams.departureDate);
      searchDate.setUTCHours(0, 0, 0, 0);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/flights/search`,
        { 
          params: {
            from: searchParams.from,
            to: searchParams.to,
            date: searchDate.toISOString()
          }
        }
      );

      const flights = Array.isArray(response.data) ? response.data : response.data.flights;
      setSearchResults({ flights: flights || [] });
      
      if (!flights || flights.length === 0) {
        toast.info('No flights available for the selected date');
      }

      // Reset return flights and selected outbound flight
      setReturnFlights(null);
      setSelectedOutboundFlight(null);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.message || 'Error searching flights');
      setSearchResults({ flights: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (flight, returnFlight = null) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to book a flight');
      navigate('/login');
      return;
    }

    const outboundPrice = searchParams.seatClass === 'economy' 
      ? flight.economyPrice 
      : flight.firstClassPrice;
    
    let totalAmount = outboundPrice * parseInt(searchParams.passengers);
    let returnPrice = 0;

    if (returnFlight) {
      returnPrice = searchParams.seatClass === 'economy'
        ? returnFlight.economyPrice
        : returnFlight.firstClassPrice;
      totalAmount += returnPrice * parseInt(searchParams.passengers);
    }

    const bookingDetails = {
      isRoundTrip: bookingType === 'round-trip' && returnFlight !== null,
      passengers: parseInt(searchParams.passengers),
      seatClass: searchParams.seatClass,
      totalAmount,
      status: 'confirmed',
      outboundAmount: outboundPrice * parseInt(searchParams.passengers),
      returnAmount: returnFlight ? returnPrice * parseInt(searchParams.passengers) : 0,
    };

    if (returnFlight) {
      bookingDetails.outboundFlight = {
        ...flight,
        ticketNumber: `LJ${Date.now()}OUT`
      };
      bookingDetails.returnFlight = {
        ...returnFlight,
        ticketNumber: `LJ${Date.now()}RTN`
      };
    } else {
      bookingDetails.flight = {
        ...flight,
        ticketNumber: `LJ${Date.now()}`
      };
    }

    navigate(`/booking/confirm/${flight._id}`, {
      state: {
        bookingDetails
      }
    });
  };
  const FlightCard = ({ flight, isReturn = false }) => {
    const pricePerPerson = searchParams.seatClass === 'economy' 
      ? flight.economyPrice 
      : flight.firstClassPrice;
    const totalAmount = pricePerPerson * parseInt(searchParams.passengers);

    const handleFlightSelection = () => {
      if (isReturn) {
        handleBooking(selectedOutboundFlight, flight);
      } else {
        if (bookingType === 'round-trip') {
          setSelectedOutboundFlight(flight);
          if (searchParams.returnDate) {
            fetchReturnFlights();
          }
        } else {
          handleBooking(flight);
        }
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">
            {flight.airplane?.name || 'Aircraft Not Assigned'}
          </h3>
          <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {bookingType === 'round-trip' ? 
              (isReturn ? 'Return Flight' : 'Outbound Flight') : 
              'One Way Flight'}
          </span>
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{flight.from}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{flight.to}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600">Departure:</span>
            <span className="font-medium">
              {new Date(flight.departureTime).toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600">Arrival:</span>
            <span className="font-medium">
              {new Date(flight.arrivalTime).toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600">Price per person:</span>
            <span className="font-medium text-blue-600">
              GH₵{pricePerPerson.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600">
              Total for {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}:
            </span>
            <span className="font-bold text-blue-600">
              GH₵{totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2">
            <span className="text-gray-600">Available Seats:</span>
            <span className={`font-medium ${
              flight.availableSeats[searchParams.seatClass] < 5 
                ? 'text-orange-600' 
                : 'text-green-600'
            }`}>
              {flight.availableSeats[searchParams.seatClass]}
            </span>
          </div>

          <button
            onClick={handleFlightSelection}
            className="w-full py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            {isReturn ? 'Select Return Flight' : 'Select Flight'}
          </button>

          {bookingType === 'round-trip' && !isReturn && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Select this flight to view return options
            </p>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Book a {bookingType === 'round-trip' ? 'Round Trip' : 'One-Way'} Flight
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">From</label>
            <select
              name="from"
              value={searchParams.from}
              onChange={handleInputChange}
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
              value={searchParams.to}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Arrival Airport</option>
              {airports.filter(airport => airport !== searchParams.from).map((airport) => (
                <option key={airport} value={airport}>{airport}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Departure Date</label>
            <input
              type="date"
              name="departureDate"
              value={searchParams.departureDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded"
            />
          </div>

          {bookingType === 'round-trip' && (
            <div>
              <label className="block mb-1">Return Date</label>
              <input
                type="date"
                name="returnDate"
                value={searchParams.returnDate}
                onChange={handleInputChange}
                required
                min={searchParams.departureDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div>
            <label className="block mb-1">Passengers</label>
            <input
              type="number"
              name="passengers"
              value={searchParams.passengers}
              onChange={handleInputChange}
              required
              min="1"
              max="9"
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-1">Class</label>
            <select
              name="seatClass"
              value={searchParams.seatClass}
              onChange={handleInputChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="economy">Economy</option>
              <option value="firstClass">First Class</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {/* Outbound Flights */}
      {searchResults && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            {bookingType === 'round-trip' ? 'Select Outbound Flight' : 'Available Flights'}
          </h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : searchResults.flights?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.flights.map((flight) => (
                <FlightCard key={flight._id} flight={flight} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              No flights available for the selected criteria
            </div>
          )}
        </div>
      )}

      {/* Return Flights */}
      {bookingType === 'round-trip' && returnFlights && (
        <div className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold mb-4">Select Return Flight</h2>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : returnFlights.flights?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {returnFlights.flights.map((flight) => (
                <FlightCard key={flight._id} flight={flight} isReturn={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              No return flights available for the selected criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingPage;