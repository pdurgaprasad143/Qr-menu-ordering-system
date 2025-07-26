import React from 'react';
import { Leaf, ChefHat, Coffee } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
        <p className="mt-4 text-lg text-gray-600">
          Experience the perfect blend of quality, expertise, and ambiance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-4">
              <Leaf className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Fresh Ingredients</h3>
            <p className="text-gray-600">We use only the finest, locally-sourced ingredients</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-4">
              <ChefHat className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Expert Chefs</h3>
            <p className="text-gray-600">Our master chefs create culinary masterpieces</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="bg-orange-100 p-3 rounded-full mb-4">
              <Coffee className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Cozy Atmosphere</h3>
            <p className="text-gray-600">Enjoy your meal in our warm, welcoming environment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
