import React from 'react';

function RoundTripTicket({ booking }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Round Trip Ticket</h1>
        <p className="text-gray-600 mt-2">
          Booking Reference: {booking.outboundFlight.ticketNumber}
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold mb-4">Outbound Flight</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><span className="font-medium">From:</span> {booking.outboundFlight.from}</p>
              <p className="text-gray-700"><span className="font-medium">To:</span> {booking.outboundFlight.to}</p>
              <p className="text-gray-700">
                <span className="font-medium">Departure:</span>{' '}
                {new Date(booking.outboundFlight.departureTime).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Arrival:</span>{' '}
                {new Date(booking.outboundFlight.arrivalTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Return Flight</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><span className="font-medium">From:</span> {booking.returnFlight.from}</p>
              <p className="text-gray-700"><span className="font-medium">To:</span> {booking.returnFlight.to}</p>
              <p className="text-gray-700">
                <span className="font-medium">Departure:</span>{' '}
                {new Date(booking.returnFlight.departureTime).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Arrival:</span>{' '}
                {new Date(booking.returnFlight.arrivalTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Passenger Details</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <span className="font-medium">Class:</span> {booking.seatClass === 'firstClass' ? 'First Class' : 'Economy'}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Passengers:</span> {booking.passengers}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Status:</span>{' '}
              <span className={`font-medium ${
                booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoundTripTicket;