import React from 'react';
import ContactInfo from './ContactInfo';
import OperatingHours from './OperatingHours';
import MessageForm from './MessageForm';
import LocationMap from './LocationMap';

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <ContactInfo />
            <OperatingHours />
          </div>

          <MessageForm />
        </div>

        <LocationMap />
      </div>
    </div>
  );
}
