import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const MyScanner = ({ onScanSuccess, onScanFailure }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear();
    };
  }, [onScanSuccess, onScanFailure]);

  return <div id="qr-reader" />;
};

export default MyScanner;
