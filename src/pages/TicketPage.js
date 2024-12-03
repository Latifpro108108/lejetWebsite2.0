import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function TicketPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(null);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        if (location.state?.bookingDetails) {
          console.log('Booking details from state:', location.state.bookingDetails);
          setSearchCriteria({
            from: location.state.bookingDetails.flight?.from || location.state.bookingDetails.outboundFlight?.from,
            to: location.state.bookingDetails.flight?.to || location.state.bookingDetails.outboundFlight?.to,
            departureDate: location.state.bookingDetails.flight?.departureTime || location.state.bookingDetails.outboundFlight?.departureTime,
            returnDate: location.state.bookingDetails.returnFlight?.departureTime,
            passengers: location.state.bookingDetails.passengers,
            seatClass: location.state.bookingDetails.seatClass,
            bookingType: location.state.bookingType || 'one-way'
          });

          const modifiedBooking = {
            ...location.state.bookingDetails,
            isRoundTrip: location.state.bookingType === 'round-trip'
          };

          setBooking(modifiedBooking);
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          toast.error('Please login to view ticket');
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/bookings/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data) {
          setBooking(response.data);
        } else {
          throw new Error('No booking data received');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.response?.data?.message || 'Error fetching ticket details');
        toast.error('Error fetching ticket details');
        navigate('/booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, location.state, navigate]);

  const renderFlightSection = (flight, isReturn = false) => {
    if (!flight) return null;

    return (
      <div className="mb-8 border-b border-dashed border-gray-300 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-blue-600">
              {isReturn ? 'Return Flight' : 'Outbound Flight'}
            </h3>
            <p className="text-sm text-gray-500">
              Ticket: {flight.ticketNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Flight</p>
            <p className="font-bold">{flight.airplane?.name || 'TBA'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">From</p>
              <p className="font-bold text-lg">{flight.from}</p>
              <p className="text-sm text-gray-600">
                Departure: {formatDate(flight.departureTime)}
              </p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">To</p>
              <p className="font-bold text-lg">{flight.to}</p>
              <p className="text-sm text-gray-600">
                Arrival: {formatDate(flight.arrivalTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => navigate('/booking')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Return to Booking
          </button>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">LEJET Airlines</h1>
                <p className="text-sm">Electronic Ticket</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Booking Reference</p>
                <p className="font-mono text-lg">
                  {booking.isRoundTrip ? booking.outboundTicketNumber : booking.ticketNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Search Criteria */}
          {searchCriteria && (
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Booking Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">From</p>
                  <p className="font-medium">{searchCriteria.from}</p>
                </div>
                <div>
                  <p className="text-gray-600">To</p>
                  <p className="font-medium">{searchCriteria.to}</p>
                </div>
                <div>
                  <p className="text-gray-600">Departure</p>
                  <p className="font-medium">
                    {new Date(searchCriteria.departureDate).toLocaleDateString()}
                  </p>
                </div>
                {searchCriteria.bookingType === 'round-trip' && searchCriteria.returnDate && (
                  <div>
                    <p className="text-gray-600">Return</p>
                    <p className="font-medium">
                      {new Date(searchCriteria.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Passengers</p>
                  <p className="font-medium">{searchCriteria.passengers}</p>
                </div>
                <div>
                  <p className="text-gray-600">Class</p>
                  <p className="font-medium capitalize">{searchCriteria.seatClass}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Flight Information */}
            {booking.isRoundTrip ? (
              <>
                {renderFlightSection(booking.outboundFlight)}
                {renderFlightSection(booking.returnFlight, true)}
              </>
            ) : (
              renderFlightSection(booking.flight)
            )}

            {/* Passenger Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Passenger Information</h2>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600">Class</p>
                  <p className="font-bold capitalize">{booking.seatClass}</p>
                </div>
                <div>
                  <p className="text-gray-600">Passengers</p>
                  <p className="font-bold">{booking.passengers}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-bold text-green-600 uppercase">{booking.status}</p>
                </div>
              </div>
            </div>

            {/* Fare Information */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Fare Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Base Fare</p>
                    <p className="font-bold">
                      GH₵{((booking.totalAmount || 0) * 0.9).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Taxes & Fees</p>
                    <p className="font-bold">
                      GH₵{((booking.totalAmount || 0) * 0.1).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-800">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      GH₵{(booking.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <h3 className="font-bold text-gray-800 mb-2">Important Information:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Please arrive at the airport at least 2 hours before departure</li>
                <li>Valid photo ID is required for check-in</li>
                <li>Baggage allowance: 23kg for checked baggage, 7kg for carry-on</li>
                <li>This ticket is non-transferable and non-refundable</li>
              </ul>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="border-t border-dashed border-gray-300 p-6">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="font-mono text-sm mb-2">
                  {booking.isRoundTrip ? booking.outboundTicketNumber : booking.ticketNumber}
                </div>
                <div className="h-12 w-48 bg-gradient-to-r from-black via-gray-800 to-black"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketPage;