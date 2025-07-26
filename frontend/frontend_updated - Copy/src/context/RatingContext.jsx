import { createContext, useState, useContext, useEffect } from "react";

const RatingContext = createContext();

// Key for localStorage
const RATINGS_STORAGE_KEY = 'restaurant_ratings';

export const useRating = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRating must be used within a RatingProvider');
  }
  return context;
};

// Alias for consistency with other components that might use plural form
export const useRatings = useRating;

export const RatingProvider = ({ children }) => {
  const [ratings, setRatings] = useState(() => {
    try {
      // Initialize ratings from localStorage if available
      const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
      const parsedRatings = storedRatings ? JSON.parse(storedRatings) : [];
      // Sort ratings by timestamp, most recent first
      return parsedRatings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error loading ratings:', error);
      return [];
    }
  });

  useEffect(() => {
    // Listen for storage events from other tabs
    const handleStorageChange = (event) => {
      if (event.key === RATINGS_STORAGE_KEY) {
        try {
          const newRatings = JSON.parse(event.newValue || '[]');
          // Sort ratings by timestamp, most recent first
          setRatings(newRatings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to update localStorage and trigger cross-tab updates
  const updateStorage = (newRatings) => {
    try {
      // Sort ratings by timestamp, most recent first
      const sortedRatings = newRatings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(sortedRatings));
      setRatings(sortedRatings);

      // Dispatch storage event to notify other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: RATINGS_STORAGE_KEY,
        newValue: JSON.stringify(sortedRatings)
      }));
    } catch (error) {
      console.error('Error updating storage:', error);
    }
  };

  // Function to add a new rating
  const addRating = (rating) => {
    try {
      const newRating = {
        ...rating,
        id: Date.now(), // Generate a unique ID
        timestamp: new Date().toISOString(),
      };
      const updatedRatings = [...ratings, newRating];
      updateStorage(updatedRatings);
      return newRating;
    } catch (error) {
      console.error('Error adding rating:', error);
      return null;
    }
  };

  return (
    <RatingContext.Provider value={{ ratings, addRating }}>
      {children}
    </RatingContext.Provider>
  );
};

export default RatingContext;
