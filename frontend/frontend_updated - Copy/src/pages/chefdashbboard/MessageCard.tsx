import React, { useEffect, useState } from "react";
import { Calendar, Table, Users, Clock, Trash2 } from "lucide-react";

// Update the MessageCard props definition
const MessageCard = ({ message, markAsRead, deleteMessage, backendUrl, onStatusUpdate }) => {
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/messages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }
      
      // Handle email after successful status update
      const subject = encodeURIComponent(
        newStatus === "confirmed" ? "Your Booking Confirmation" : "Booking Update"
      );
      
      if (newStatus === "confirmed") {
        const body = encodeURIComponent(
          `Hello ${message.name},\n\nYour booking for Table on ${message.bookingDetails.date.split('T')[0]} at ${message.bookingDetails.time} has been confirmed.\n\nThank you for choosing us!`
        );
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${message.email}&su=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');
      } else if (newStatus === "canceled") {
        const body = encodeURIComponent(
          `Hello ${message.name},\n\nWe regret to inform you that your booking for a table on ${message.bookingDetails.date.split('T')[0]} at ${message.bookingDetails.time} could not be accommodated.\n\nWe apologize for any inconvenience caused.`
        );
        const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${message.email}&su=${subject}&body=${body}`;
        window.open(mailtoLink, "_blank");
      }
      
      await onStatusUpdate(); // Refresh messages after successful update
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status. Please try again.');
    }
  };
  if (!message) {
    return <div className="text-red-500 p-4">Error: Message not found</div>;
  }

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${
        message.read ? "bg-gray-100 border-gray-300" : "bg-blue-50 border-blue-500"
      }`}
      onClick={() => markAsRead?.(message._id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">{message?.name || "Unknown"}</h4>
          <div className="text-sm text-gray-600">
            <p>{message?.email || "No email"}</p>
            <p>{message?.phone || "No phone number"}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {message?.createdAt ? new Date(message.createdAt).toLocaleString() : "No date"}
        </span>
      </div>

      {message?.isBooking && (
        <div className="mt-2 mb-3 bg-orange-50 p-3 rounded-md border border-orange-300">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-orange-500 mr-2" />
              <span>{message?.bookingDetails?.date?.split("T")[0] || "N/A"} at {message?.bookingDetails?.time || "N/A"}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-orange-500 mr-2" />
              <span>{message?.bookingDetails?.numberOfPeople || 0} people</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-orange-500 mr-2" />
              <span className={`font-medium ${
                message?.status === "pending" ? "text-yellow-600" :
                message?.status === "confirmed" ? "text-green-600" :
                message?.status === "canceled" ? "text-red-600" :
                "text-gray-600"
              }`}>
                {message?.status || "pending"}
              </span>
            </div>
            <div className="col-span-2 flex justify-end gap-2 mt-2">
              {message?.status === "pending" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(message._id, "confirmed");
                    }}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(message._id, "canceled");
                    }}
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-gray-700">{message?.message || "No message available"}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteMessage(message._id);
        }}
        className="mt-3 flex items-center text-red-600 hover:text-red-800 transition"
      >
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </button>
    </div>
  );
};

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backendUrl, setBackendUrl] = useState("");

  useEffect(() => {
    const fetchBackendIP = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ip");
        if (!response.ok) throw new Error("Failed to fetch backend IP");
        const data = await response.json();
        setBackendUrl(`http://${data.ip}:5000`);
      } catch (err) {
        setBackendUrl(`http://${window.location.hostname}:5000`);
      }
    };

    fetchBackendIP();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/messages`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setMessages(result.data);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      setError("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this message?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${backendUrl}/api/messages/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setMessages(messages.filter((msg) => msg._id !== id));
      } else {
        alert("Failed to delete the message.");
      }
    } catch (error) {
      alert("Error deleting message.");
    }
  };

  const markAsRead = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, read: true } : msg))
    );
  };

  useEffect(() => {
    if (backendUrl) {
      fetchMessages();
    }
  }, [backendUrl]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Messages</h2>
      {loading && <p className="text-gray-600">Loading messages...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {messages.length > 0 ? (
        messages.map((msg) => (
          <MessageCard 
            key={msg._id} 
            message={msg} 
            markAsRead={markAsRead} 
            deleteMessage={deleteMessage}
            backendUrl={backendUrl}
            onStatusUpdate={fetchMessages}
          />
        ))
      ) : (
        <p className="text-gray-600">No messages available.</p>
      )}
    </div>
  );
}