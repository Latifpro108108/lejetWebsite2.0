import React from 'react';

function OneWayTicket({ booking }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">One Way Ticket</h1>
        <p className="text-gray-600 mt-2">
          Booking Reference: {booking.ticketNumber}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Flight Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><span className="font-medium">From:</span> {booking.flight.from}</p>
              <p className="text-gray-700"><span className="font-medium">To:</span> {booking.flight.to}</p>
              <p className="text-gray-700">
                <span className="font-medium">Departure:</span>{' '}
                {new Date(booking.flight.departureTime).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Arrival:</span>{' '}
                {new Date(booking.flight.arrivalTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
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
    </div>
  );
}

export default OneWayTicket;