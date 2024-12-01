import React from 'react';
import { toast } from 'react-toastify';

const RoundTripTicket = ({ booking }) => {
  if (!booking || !booking.outboundFlight || !booking.returnFlight) {
    toast.error('Invalid round trip booking information');
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFlightSection = (flight, ticketNumber, title, isReturn = false) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-blue-600 mb-4">{title}</h2>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
        {/* Header Section */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">LEJET Airlines</h1>
              <p className="text-lg">Electronic Ticket / Boarding Pass</p>
              <p className="text-sm mt-1">{isReturn ? 'Return Flight' : 'Outbound Flight'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Ticket Number</p>
              <p className="font-mono text-xl">{ticketNumber}</p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="p-6 space-y-6">
          {/* From/To Section */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <p className="text-gray-600">From</p>
              <p className="text-2xl font-bold">{flight.from}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="flex-1 text-right">
              <p className="text-gray-600">To</p>
              <p className="text-2xl font-bold">{flight.to}</p>
            </div>
          </div>

          {/* Flight Information */}
          <div className="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-gray-600">Flight</p>
              <p className="font-bold">{flight.airplane?.name || 'TBA'}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-bold">{formatDate(flight.departureTime)}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-bold text-green-600 uppercase">{booking.status}</p>
            </div>
          </div>

          {/* Passenger Information */}
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
              <p className="text-gray-600">Flight Price</p>
              <p className="font-bold text-blue-600">
                GH₵{(isReturn ? booking.returnAmount : booking.outboundAmount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="border-t border-dashed border-gray-300 pt-6">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="font-mono text-lg mb-2">{ticketNumber}</div>
                <div className="h-12 bg-gray-800">
                  <div className="h-full w-48 bg-gradient-to-r from-black via-gray-800 to-black"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-bold text-lg mb-2">Important Information:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Please arrive at the airport at least 2 hours before departure</li>
              <li>Valid photo ID is required for check-in</li>
              <li>This ticket is non-transferable and non-refundable</li>
              <li>Baggage allowance: 23kg for checked baggage, 7kg for carry-on</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Outbound Flight */}
      {renderFlightSection(booking.outboundFlight, booking.outboundTicketNumber, 'Outbound Flight')}
      
      {/* Return Flight */}
      {renderFlightSection(booking.returnFlight, booking.returnTicketNumber, 'Return Flight', true)}

      {/* Total Trip Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-600">Total Trip Summary</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">
              GH₵{booking.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>Outbound Flight: GH₵{booking.outboundAmount.toLocaleString()}</p>
            <p>Return Flight: GH₵{booking.returnAmount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p>{booking.passengers} Passenger(s)</p>
            <p className="capitalize">{booking.seatClass} Class</p>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="mt-6 text-center space-y-4">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Tickets
        </button>
        <p className="text-gray-600">
          Both tickets will be printed together
        </p>
      </div>
    </div>
  );
};

export default RoundTripTicket;