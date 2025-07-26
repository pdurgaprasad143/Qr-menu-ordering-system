import React from 'react';
import { Clock } from 'lucide-react';

const OperatingHours = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-orange-500 mr-3" />
          <div>
            <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
            <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatingHours;
