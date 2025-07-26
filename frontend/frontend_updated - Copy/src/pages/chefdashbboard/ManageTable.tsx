import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const API_URL = "http://localhost:5000/api/tables";
const IP_API_URL = "http://localhost:5000/api/ip"; // Backend endpoint to get IP

const ManageTable = () => {
  const [tables, setTables] = useState([]);
  const [host, setHost] = useState("localhost");

  // ✅ Fetch IP from backend
  useEffect(() => {
    const fetchServerIP = async () => {
      try {
        const response = await fetch(IP_API_URL);
        const data = await response.json();
        if (data.ip) {
          console.log("📡 Server IP Address:", data.ip);
          setHost(data.ip); // Set the local network IP dynamically
        }
      } catch (error) {
        console.error("❌ Error fetching server IP:", error);
      }
    };

    fetchServerIP();
  }, []);

  // ✅ Fetch table data from backend
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success) {
          setTables(data.tables);
        } else {
          console.error("Failed to fetch tables:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, []);

  // ✅ Function to generate the QR URL dynamically
  const getQRUrl = (tableNumber) => {
    return `http://${host}:5173/menu?table=${tableNumber}`;
  };

  // ✅ Function to download QR code
  const downloadQR = (tableNumber) => {
    const qrCanvas = document.getElementById(`qr-${tableNumber}`);
    if (!qrCanvas) return;

    const link = document.createElement("a");
    link.href = qrCanvas.toDataURL("image/png", 1.0);
    link.download = `Table_${tableNumber}_QR.png`;
    link.click();
  };

  // ✅ Function to delete a table
  const deleteTable = async (tableId) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;

    try {
      const response = await fetch(`${API_URL}/${tableId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        setTables((prevTables) => prevTables.filter((table) => table._id !== tableId));
      } else {
        console.error("Failed to delete table:", data.message);
      }
    } catch (error) {
      console.error("Error deleting table:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Tables</h2>
      <div className="border rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border">Table Number</th>
              <th className="p-3 border">Capacity</th>
              <th className="p-3 border">QR Code</th>
              <th className="p-3 border">Download</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table._id} className="border">
                <td className="p-3">{table.tableNumber}</td>
                <td className="p-3">{table.capacity}</td>
                <td className="p-3 flex justify-center">
                  <QRCodeCanvas
                    id={`qr-${table.tableNumber}`}
                    value={getQRUrl(table.tableNumber)}
                    size={200}
                    level="H"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => downloadQR(table.tableNumber)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Download QR
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteTable(table._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTable;