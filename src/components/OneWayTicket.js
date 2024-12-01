import React from 'react';
import { toast } from 'react-toastify';

const OneWayTicket = ({ booking }) => {
  if (!booking) {
    toast.error('No booking information available');
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-blue-500">
        {/* Header Section */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">LEJET Airlines</h1>
              <p className="text-lg">Electronic Ticket / Boarding Pass</p>
              <p className="text-sm mt-1">One Way Flight</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Ticket Number</p>
              <p className="font-mono text-xl">{booking.ticketNumber}</p>
            </div>
          </div>
        </div>

        {/* Flight Details Section */}
        <div className="p-6 space-y-6">
          {/* From/To Section */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <p className="text-gray-600">From</p>
              <p className="text-2xl font-bold">{booking.flight.from}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <div className="flex-1 text-right">
              <p className="text-gray-600">To</p>
              <p className="text-2xl font-bold">{booking.flight.to}</p>
            </div>
          </div>

          {/* Flight Information */}
          <div className="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-gray-600">Flight</p>
              <p className="font-bold">{booking.flight.airplane?.name || 'TBA'}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-bold">{formatDate(booking.flight.departureTime)}</p>
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
              <p className="text-gray-600">Total Amount</p>
              <p className="font-bold text-blue-600">
                GH₵{booking.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="border-t border-dashed border-gray-300 pt-6">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="font-mono text-lg mb-2">{booking.ticketNumber}</div>
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

      {/* Print Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Ticket
        </button>
      </div>
    </div>
  );
};

export default OneWayTicket;