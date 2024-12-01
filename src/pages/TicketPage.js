import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import OneWayTicket from '../components/OneWayTicket';
import RoundTripTicket from '../components/RoundTripTicket';

function TicketPage({ ticketType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Check if we have booking details in location state
        if (location.state?.bookingDetails) {
          console.log('Using booking details from state:', location.state.bookingDetails);
          setBooking(location.state.bookingDetails);
          setLoading(false);
          return;
        }

        // If no state, fetch from API
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          toast.error('Please login to view ticket');
          navigate('/login');
          return;
        }

        console.log('Fetching booking details for ID:', bookingId);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data) {
          console.log('Fetched booking details:', response.data);
          setBooking(response.data);
        } else {
          throw new Error('No booking data received');
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        setError(error.response?.data?.message || 'Error fetching ticket details');
        toast.error(error.response?.data?.message || 'Error fetching ticket details');
        navigate('/booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, location.state, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return to Booking
          </button>
        </div>
      </div>
    );
  }

  // No booking data state
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            No ticket information found
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Make a New Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Booking Type Indicator */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {ticketType === 'round-trip' || booking.isRoundTrip ? 'Round Trip Ticket' : 'One Way Ticket'}
          </h1>
          <p className="text-gray-600 mt-2">
            Booking Reference: {booking.isRoundTrip ? booking.outboundTicketNumber : booking.ticketNumber}
          </p>
        </div>

        {/* Ticket Component */}
        {(ticketType === 'round-trip' || booking.isRoundTrip) ? (
          <RoundTripTicket booking={booking} />
        ) : (
          <OneWayTicket booking={booking} />
        )}

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <button
            onClick={() => navigate('/booking')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors mx-2"
          >
            Book Another Flight
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mx-2"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketPage;