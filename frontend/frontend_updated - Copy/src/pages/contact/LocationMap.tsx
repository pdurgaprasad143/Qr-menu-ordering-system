import React from 'react';

const LocationMap = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Location</h3>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.1228358879143!2d81.65537671110047!3d16.41858672992453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37d707cf0d34a5%3A0xab73194f64b31016!2sSwarnandhra%20College%20of%20Engineering%20and%20Technology(autonomous)!5e0!3m2!1sen!2sin!4v1739782541234!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationMap;
