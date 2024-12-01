import React, { useState } from 'react';
import axios from 'axios';

function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/feedback`, { feedback });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">We Value Your Feedback</h1>

        {submitted ? (
          <div className="text-center">
            <p className="text-lg text-green-600 font-semibold mb-4">
              Thank you for sharing your thoughts!
            </p>
            <p className="text-gray-600">
              Your feedback helps us improve our services.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Submit More Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Input */}
            <div>
              <label htmlFor="feedback" className="block text-lg font-medium text-gray-700 mb-2">
                Share Your Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring focus:ring-blue-200 focus:border-blue-500"
                placeholder="Let us know your thoughts..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;
