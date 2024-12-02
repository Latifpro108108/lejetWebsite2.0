import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function BookingConfirmation() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue with booking');
      navigate('/login');
      return;
    }

    if (!bookingDetails) {
      toast.error('Booking details not found');
      navigate('/booking');
      return;
    }

    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/flights/${flightId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setFlight(response.data);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        setError(error.response?.data?.message || 'Error fetching flight details');
        toast.error('Error fetching flight details');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId, user, navigate, bookingDetails]);

  const handleConfirmBooking = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            toast.error('Please login to continue');
            navigate('/login');
            return;
        }

        const bookingData = {
            flightId,
            seatClass: bookingDetails.seatClass,
            passengers: bookingDetails.passengers,
            totalAmount: bookingDetails.totalAmount
        };

        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/bookings`,
            bookingData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.booking) {
            toast.success('Booking created! Proceeding to payment...');
            navigate(`/payment/${response.data.booking._id}`, {
                state: {
                    bookingDetails: response.data.booking
                }
            });
        }
    } catch (error) {
        console.error('Booking error:', error.response?.data || error);
        toast.error(error.response?.data?.message || 'Error creating booking');
        
        if (error.response?.status === 401) {
            navigate('/login');
        }
    }
};
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Confirm Your Booking</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">From</p>
            <p className="font-medium">{flight.from}</p>
          </div>
          <div>
            <p className="text-gray-600">To</p>
            <p className="font-medium">{flight.to}</p>
          </div>
          <div>
            <p className="text-gray-600">Departure</p>
            <p className="font-medium">
              {new Date(flight.departureTime).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Arrival</p>
            <p className="font-medium">
              {new Date(flight.arrivalTime).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Passengers</p>
            <p className="font-medium">{bookingDetails.passengers}</p>
          </div>
          <div>
            <p className="text-gray-600">Class</p>
            <p className="font-medium">
              {bookingDetails.seatClass === 'firstClass' ? 'First Class' : 'Economy'}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Price per Passenger</p>
            <p className="font-medium">
              GH₵{bookingDetails.pricePerPerson}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Total Price</p>
            <p className="font-medium text-lg text-blue-600">
              GH₵{bookingDetails.totalAmount}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/booking')}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmBooking}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;