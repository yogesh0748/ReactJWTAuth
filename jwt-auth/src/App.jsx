import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Search from "./component/Search";
import Navbar from "./component/Navbar";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AdminPage from "./pages/AdminPage";
import SeatBooking from "./pages/SeatBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentConfirmation from "./pages/PaymentConfirmation";

export default function App() {
  return (

    <BrowserRouter>
      <AuthProvider>
        {/* Navbar stays visible on every route */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />   {/* Hero Section here */}
          <Route path="/search" element={<Search />} /> {/* Search Page */}
          <Route path="/signup" element={<Signup />} /> {/* Signup Page */}
           <Route path="/admin" element={<AdminPage />} />
           <Route path="/seat-booking" element={<SeatBooking />} /> {/* Add this line */}
           <Route path="/booking-confirmation" element={<BookingConfirmation />} />
           <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  );
}
