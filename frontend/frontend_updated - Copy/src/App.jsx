import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/home/Home";
import Menu from "./pages/menu/Menu";
import About from "./pages/About";
import Contact from "./pages/contact/Contact";
import ChefLogin from "./pages/ChefLogin";
import ChefDashboard from "./pages/chefdashbboard/ChefDashboard";
import Checkout from "./pages/menu/Checkout"; // Import the Checkout page
import PaymentPage from "./pages/menu/PaymentPage";
import OrderWaiting from "./pages/orderwaiting/OrderWaiting";
import OrderTrackingPage from "./pages/menu/OrderTrackingPage";
import Rating from "./pages/Rating";
import Reviews from "./pages/Reviews";
import { OrderProvider } from "./context/OrderContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { MessageProvider } from "./context/MessageContext";
import { RatingProvider } from "./context/RatingContext";

// Simple Thank You Component
const ThankYou = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You!</h1>
      <p className="text-xl text-gray-600 mb-8">We appreciate your feedback.</p>
      <a 
        href="/"
        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Return Home
      </a>
    </div>
  </div>
);

// Component to determine if Header should be displayed
function Layout({ children }) {
  const location = useLocation();
  const [isChefLoggedIn, setIsChefLoggedIn] = useState(false);

  useEffect(() => {
    const chefToken = localStorage.getItem("chefToken");
    setIsChefLoggedIn(!!chefToken);
  }, [location.pathname]); // Update when URL changes

  // Hide header only on "/chef/*" when logged in
  const shouldShowHeader = !(isChefLoggedIn && location.pathname.startsWith("/chef"));

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MessageProvider>
          <OrderProvider>
            <CartProvider>
              <RatingProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/chef-login" element={<ChefLogin />} />
                    <Route path="/order-waiting" element={<OrderWaiting />} />
                    <Route path="/rating" element={<Rating />} />
                    <Route path="/reviews" element={<Reviews />} />
                    <Route path="/thank-you" element={<ThankYou />} />

                    {/* Checkout Route */}
                    <Route path="/checkout" element={<Checkout />} />

                    <Route path="/payment" element={<PaymentPage />} />

                    <Route path="/order-tracking" element={<OrderTrackingPage />} />

                    {/* Chef Dashboard Routes */}
                    <Route path="/chef/*" element={<ChefDashboard />} />
                  </Routes>
                </Layout>
              </RatingProvider>
            </CartProvider>
          </OrderProvider>
        </MessageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
