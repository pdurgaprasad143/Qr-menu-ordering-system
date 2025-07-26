import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-orange-500 mr-3" />
          <span>SCET, Narsapur, Andhra Pradesh 534280</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-orange-500 mr-3" />
          <span>+91 9340001234</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-orange-500 mr-3" />
          <span>qrrestaurantofficial@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
