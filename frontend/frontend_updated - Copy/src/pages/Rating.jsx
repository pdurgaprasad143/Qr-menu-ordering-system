import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRating } from "../context/RatingContext";
import { Star } from 'lucide-react';

const Rating = () => {
  const { addRating } = useRating();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [score, setScore] = useState(5);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addRating({
      name,
      score,
      feedback,
      timestamp: new Date().toISOString(),
    });
    navigate("/thank-you");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Rate Your Experience
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We value your feedback! Let us know how we did.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Your Rating
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hover || score)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="feedback" className="sr-only">
                Additional Feedback
              </label>
              <textarea
                id="feedback"
                rows="4"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Additional feedback (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-150"
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Rating;
