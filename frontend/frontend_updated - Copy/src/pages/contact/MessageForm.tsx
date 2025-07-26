import React, { useState, useEffect } from "react";

const MessageForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    bookingDate: "",
    bookingTime: "",
    numberOfPeople: "",
    isBooking: false,
  });

  const [backendUrl, setBackendUrl] = useState(""); // Store backend URL
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch the backend IP dynamically
  useEffect(() => {
    const fetchBackendIP = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip"); // Replace with actual IP API if different
        const data = await response.json();
        console.log("Backend IP:", data.ip);
        setBackendUrl(`http://${data.ip}:5000`);
      } catch (error) {
        console.error("❌ Error fetching backend IP:", error);
        setBackendUrl(`http://${window.location.hostname}:5000`); // Fallback
      }
    };

    fetchBackendIP();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      isBooking: formData.isBooking,
      bookingDetails: formData.isBooking
        ? {
            date: formData.bookingDate,
            time: formData.bookingTime,
            numberOfPeople: formData.numberOfPeople,
          }
        : null,
    };

    try {
      const response = await fetch(`${backendUrl}/api/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to send message");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        bookingDate: "",
        bookingTime: "",
        numberOfPeople: "",
        isBooking: false,
      });

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Send us a Message</h3>

      {submitted && (
        <p className="bg-green-50 border border-green-200 rounded-md p-4 text-green-600">
          Your message has been sent successfully! We'll get back to you soon.
        </p>
      )}

      {error && (
        <p className="bg-red-50 border border-red-200 rounded-md p-4 text-red-600">
          {error}
        </p>
      )}

      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isBooking"
              id="isBooking"
              checked={formData.isBooking}
              onChange={handleChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="isBooking" className="ml-2 block text-sm text-gray-700">
              Book a Table
            </label>
          </div>

          {formData.isBooking && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleChange}
                    required={formData.isBooking}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleChange}
                    required={formData.isBooking}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of People
                </label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required={formData.isBooking}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
};

export default MessageForm;
