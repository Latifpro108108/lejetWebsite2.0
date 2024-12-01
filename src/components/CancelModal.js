import React from 'react';

function CancelModal({ booking, onCancel, onConfirm, loading }) {
  if (!booking || !booking.flight) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Cancel Booking</h2>
        <p className="mb-6">
          Are you sure you want to cancel your booking for the flight from{' '}
          <span className="font-medium">{booking.flight.from}</span> to{' '}
          <span className="font-medium">{booking.flight.to}</span> on{' '}
          <span className="font-medium">
            {new Date(booking.flight.departureTime).toLocaleDateString()}
          </span>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelModal;