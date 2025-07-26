import React, { useState } from "react";

const AddTable = () => {
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [qrCode, setQrCode] = useState(""); // Store QR Code URL
  const [message, setMessage] = useState(""); // For success/error messages

  const handleAddTable = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message before request
    setQrCode(""); // Reset QR Code

    try {
      const response = await fetch("http://localhost:5000/api/tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          tableNumber: Number(tableNumber), 
          capacity: Number(capacity) 
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        setMessage("Table added successfully!");
        setQrCode(data.table.qrCode); // Store the generated QR Code
        setTableNumber("");
        setCapacity("");
      } else {
        setMessage(data.message || "Failed to add table.");
      }
    } catch (error) {
      console.error("Error adding table:", error);
      setMessage("Error adding table. Try again later.");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Table</h2>
      {message && <p className="mb-2 text-sm font-semibold text-red-500">{message}</p>}
      <form onSubmit={handleAddTable} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Table Number</label>
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Table
        </button>
      </form>

      {/* Display QR Code if available */}
      {qrCode && (
        <div className="mt-4">
          {/* <h3 className="text-lg font-bold">QR Code:</h3>
          <img src={qrCode} alt="Table QR Code" className="mt-2 w-40 h-40 border" />*/}
        </div>
      )}
    </div>
  );
};

export default AddTable;
