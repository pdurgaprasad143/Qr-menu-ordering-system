import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import MyScanner from "./MyScanner"; // Import the Scanner Component

const Header = () => {
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const onScanSuccess = (decodedText) => {
    console.log(`Scanned QR Code: ${decodedText}`);

    try {
      const url = new URL(decodedText);

      // Check if it's an internal route
      if (url.hostname === "192.168.0.106" || url.hostname === "localhost") {
        const path = url.pathname + url.search + url.hash; // Preserve full path
        navigate(path);
      } else {
        window.location.href = decodedText; // Open external links
      }
    } catch (error) {
      console.error("Invalid URL:", decodedText);
    }

    setIsScannerOpen(false);
  };

  const onScanFailure = (error) => {
    console.warn(`QR Scan Error: ${error}`);
  };

  return (
    <div className="relative h-[600px]">
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop"
        alt="Restaurant interior"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to QR Restaurant</h1>
          <p className="text-xl mb-8">Come Join Us For A Magical Experience.</p>
          <div className="flex flex-col items-center space-y-4">
            <Link
              to="/menu"
              className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-colors w-48"
            >
              View Menu
            </Link>

            {/* QR Scanner Button */}
            {/** 
            <button
              onClick={() => setIsScannerOpen(true)}
              className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors w-48 flex items-center justify-center"
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan QR
            </button>*/}

            <Link
              to="/contact"
              className="bg-white text-orange-500 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors w-48"
            >
              Book a Table
            </Link>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Scan QR Code</h2>
            <MyScanner onScanSuccess={onScanSuccess} onScanFailure={onScanFailure} />
            <button
              onClick={() => setIsScannerOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
