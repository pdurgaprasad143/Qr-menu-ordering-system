import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';

const CustomerReviews = ({ ratings }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 mt-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
        <p className="mt-4 text-lg text-gray-600">
          What our valued customers say about their dining experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ratings.slice(-6).reverse().map((rating, index) => (
          <div
            key={rating.timestamp}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= rating.score
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Quote className="h-8 w-8 text-orange-200" />
            </div>

            {rating.feedback && (
              <p className="text-gray-600 mb-4 line-clamp-3">
                "{rating.feedback}"
              </p>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-900">{rating.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(rating.timestamp).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/rating"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-150"
        >
          Share Your Experience
        </Link>
      </div>
    </div>
  );
};

export default CustomerReviews;
