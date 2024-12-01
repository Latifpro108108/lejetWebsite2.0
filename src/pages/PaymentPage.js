import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [mobileMoneyDetails, setMobileMoneyDetails] = useState({
    phoneNumber: '',
    network: ''
  });

  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    if (!bookingDetails || !bookingDetails.bookingId) {
      console.log('No booking details found:', bookingDetails);
      toast.error('No booking information found');
      navigate('/booking');
      return;
    }
    console.log('Booking details:', bookingDetails);
  }, [bookingDetails, navigate]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'credit_card') {
      if (!cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast.error('Please fill in all card details');
        return false;
      }
      // Add more card validation if needed
    } else if (paymentMethod === 'mobile_money') {
      if (!mobileMoneyDetails.network || !mobileMoneyDetails.phoneNumber) {
        toast.error('Please fill in all mobile money details');
        return false;
      }
      // Add phone number validation if needed
    } else {
      toast.error('Please select a payment method');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePaymentDetails()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

      console.log('Processing payment for booking:', bookingDetails.bookingId);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings/confirm-payment`,
        {
          bookingId: bookingDetails.bookingId,
          paymentMethod,
          paymentDetails: paymentMethod === 'credit_card' ? cardDetails : mobileMoneyDetails
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('Payment response:', response.data);

      if (response.data.booking) {
        toast.success('Payment successful!');
        navigate(`/ticket/${response.data.booking._id}`, {
          state: { bookingDetails: response.data.booking }
        });
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">No booking information found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Payment Details</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Amount to Pay</h2>
        <p className="text-3xl font-bold text-blue-600">
          GH₵{bookingDetails.totalAmount}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handlePaymentMethodChange('credit_card')}
            className={`px-4 py-2 rounded-md ${
              paymentMethod === 'credit_card'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300'
            }`}
          >
            Credit Card
          </button>
          <button
            onClick={() => handlePaymentMethodChange('mobile_money')}
            className={`px-4 py-2 rounded-md ${
              paymentMethod === 'mobile_money'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300'
            }`}
          >
            Mobile Money
          </button>
        </div>

        {paymentMethod === 'credit_card' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={(e) => handleInputChange(e, setCardDetails)}
                placeholder="1234 5678 9012 3456"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleInputChange(e, setCardDetails)}
                  placeholder="MM/YY"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => handleInputChange(e, setCardDetails)}
                  placeholder="123"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md bg-blue-600 text-white ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}

        {paymentMethod === 'mobile_money' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Network</label>
              <select
                name="network"
                value={mobileMoneyDetails.network}
                onChange={(e) => handleInputChange(e, setMobileMoneyDetails)}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">Select Network</option>
                <option value="mtn">MTN Mobile Money</option>
                <option value="vodafone">Vodafone Cash</option>
                <option value="airteltigo">AirtelTigo Money</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={mobileMoneyDetails.phoneNumber}
                onChange={(e) => handleInputChange(e, setMobileMoneyDetails)}
                placeholder="0XX XXX XXXX"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md bg-blue-600 text-white ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;