import React from 'react';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Heading Section */}
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">About LEJET Airline</h1>
        <p className="text-gray-700 text-lg text-center mb-8">
          Connecting Ghana with the skies, delivering safety, comfort, and reliability.
        </p>

        {/* About Section */}
        <div className="text-gray-800">
          <p className="mb-6">
            LEJET Airline is a leading domestic airline in Ghana, committed to providing safe, reliable, and comfortable air travel experiences for our passengers.
          </p>
          <p className="mb-6">
            Founded in 2024, we have quickly grown to become one of the most trusted airlines in the region, serving major cities across Ghana including Accra, Kumasi, Tamale, and Takoradi.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">Our Mission</h2>
          <p className="text-gray-700 text-lg mb-6">
            To connect Ghana through efficient and enjoyable air travel, fostering economic growth and cultural exchange across the nation.
          </p>
        </div>

        {/* Values Section */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
            <li>Safety First</li>
            <li>Customer Satisfaction</li>
            <li>Reliability</li>
            <li>Innovation</li>
            <li>Environmental Responsibility</li>
          </ul>
        </div>

        {/* Decorative Line */}
        <div className="mt-12 border-t border-gray-300"></div>

        
      </div>
    </div>
  );
}

export default AboutPage;
