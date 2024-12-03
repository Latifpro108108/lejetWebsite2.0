import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import CancelModal from '../components/CancelModal';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  // const { user } = useContext(AuthContext);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bookings/user/bookings`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const canCancelBooking = (departureTime) => {
    if (!departureTime) return false;
    const now = new Date();
    const departure = new Date(departureTime);
    const hoursDifference = (departure - now) / (1000 * 60 * 60);
    return hoursDifference > 1;
  };

  const handleCancelClick = (booking) => {
    if (!booking.flight?.departureTime || !canCancelBooking(booking.flight.departureTime)) {
      toast.error('Bookings can only be cancelled at least 1 hour before departure');
      return;
    }
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/bookings/${selectedBooking._id}/cancel`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>
      
      {bookings.length > 0 ? (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            booking && booking.flight ? (
              <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      {booking.flight.from} → {booking.flight.to}
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Flight:</span> {booking.flight.airplane?.name || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Departure:</span>{' '}
                      {booking.flight.departureTime ? new Date(booking.flight.departureTime).toLocaleString() : 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Arrival:</span>{' '}
                      {booking.flight.arrivalTime ? new Date(booking.flight.arrivalTime).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">Booking ID:</span> {booking._id}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Class:</span>{' '}
                      {booking.seatClass === 'firstClass' ? 'First Class' : 'Economy'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`font-medium ${
                        booking.status === 'confirmed' ? 'text-green-600' :
                        booking.status === 'cancelled' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </p>
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        disabled={!canCancelBooking(booking.flight.departureTime)}
                        className={`mt-4 px-4 py-2 rounded-md ${
                          canCancelBooking(booking.flight.departureTime)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p>You haven't made any bookings yet.</p>
        </div>
      )}

      {showCancelModal && selectedBooking && (
        <CancelModal
          booking={selectedBooking}
          onCancel={() => {
            setShowCancelModal(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleCancelBooking}
          loading={loading}
        />
      )}
    </div>
  );
}

export default UserDashboard;