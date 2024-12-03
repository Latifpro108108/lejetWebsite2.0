import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const handleCallUs = () => {
    window.location.href = 'tel:+233537750997';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="relative bg-gradient-to-br from-blue-700 via-blue-500 to-green-400 text-white py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-opacity-30 bg-cover bg-no-repeat bg-center"
          style={{ backgroundImage: 'url("assets/airline.jpg")' }}
        ></div>
        <div className="relative z-10 text-center px-6 md:px-12 max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Welcome to <span className="text-yellow-300">LEJET Airline</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Your trusted travel partner for one-way and round trips across the globe. Let us take you to your next destination in style and comfort!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/booking?type=one-way"
              className="bg-yellow-400 text-gray-900 py-3 px-8 rounded-lg hover:bg-yellow-300 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
            >
              Book One-Way Trip
            </Link>
            <Link
              to="/booking?type=round-trip"
              className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-500 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
            >
              Book Round Trip
            </Link>
          </div>
        </div>
      </header>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-to-tl from-blue-400 to-blue-200 rounded-lg p-8 shadow-md transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Global Coverage</h3>
              <p className="text-gray-700">
                Fly to your favorite destinations with LEJET Airline. We cover all major cities and beyond!
              </p>
            </div>
            <div className="bg-gradient-to-tl from-green-400 to-green-200 rounded-lg p-8 shadow-md transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Easy Booking</h3>
              <p className="text-gray-700">
                Our platform offers a hassle-free booking experience for one-way and round trips.
              </p>
            </div>
            <div className="bg-gradient-to-tl from-yellow-400 to-yellow-200 rounded-lg p-8 shadow-md transform hover:scale-105 transition duration-300">
              <h3 className="text-2xl font-bold text-yellow-800 mb-4">24/7 Support</h3>
              <p className="text-gray-700">
                We're here to help! Contact us anytime for assistance with your travel plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8">How can we help you today?</h2>
          <div className="space-y-6">
            <Link
              to="/feedback"
              className="block w-full sm:w-64 mx-auto bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
            >
              Send Feedback
            </Link>
            <button
              onClick={handleCallUs}
              className="block w-full sm:w-64 mx-auto bg-yellow-500 text-white py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
            >
              Call Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;