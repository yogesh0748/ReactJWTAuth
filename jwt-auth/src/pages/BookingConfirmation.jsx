import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { initializeRazorpay } from "../utils/razorpay";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const { seats, journey } = location.state || {};
  const totalPrice = seats?.length * journey?.pricePerSeat || 0;

  useEffect(() => {
    if (!journey || !seats) {
      navigate("/search");
      return;
    }

    const fetchUserDetails = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      }
    };
    fetchUserDetails();
  }, [user, journey, seats, navigate]);

  const createOrder = async () => {
    try {
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: `${userDetails.fname} ${userDetails.lname}`,
        userEmail: userDetails.email,
        journeyId: journey.id,
        seats: seats,
        amount: totalPrice * 100, // Razorpay expects paise
        status: "created",
        createdAt: serverTimestamp(),
      });

      return {
        id: orderRef.id,
        amount: totalPrice * 100,
        userName: `${userDetails.fname} ${userDetails.lname}`,
        userEmail: userDetails.email,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // update order status using created order id
      await updateDoc(doc(db, "orders", paymentResponse.razorpay_order_id), {
        status: "paid",
        paymentId: paymentResponse.razorpay_payment_id,
        paymentSignature: paymentResponse.razorpay_signature,
        paidAt: serverTimestamp(),
      });

      setPaymentStatus("success");

      // navigate to payment confirmation with nice transition
      navigate("/payment-confirmation", {
        state: {
          journey,
          seats,
          userDetails,
          totalAmount: totalPrice,
          paymentId: paymentResponse.razorpay_payment_id,
        },
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Error updating payment status");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderData = await createOrder();
      await initializeRazorpay(orderData, handlePaymentSuccess);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  if (!journey || !seats || !userDetails) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pt-20 pb-10 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 90 }}
          className="text-3xl font-bold mb-6 text-slate-900"
        >
          Booking Confirmation
        </motion.h1>

        {/* User Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-3 text-slate-900">Passenger Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-slate-800">{userDetails.fname} {userDetails.lname}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-slate-800">{userDetails.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Journey Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-3 text-slate-900">Journey Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="font-medium text-slate-800">{journey.source}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="font-medium text-slate-800">{journey.destination}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-slate-800">{journey.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium text-slate-800">{journey.time}</p>
            </div>
          </div>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-3 text-slate-900">Booking Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Selected Seats</p>
              <p className="font-medium text-slate-800">{seats.map((s) => `Seat ${s + 1}`).join(", ")}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Price per Seat</p>
              <p className="font-medium text-slate-800">₹{journey.pricePerSeat}</p>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold text-slate-900">
              <p>Total Amount</p>
              <p>₹{totalPrice}</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {paymentStatus === "pending" ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
            >
              {loading ? "Processing Payment..." : `Pay ₹${totalPrice}`}
            </motion.button>
          ) : (
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90 }}
                className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center shadow"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>

              <div className="text-green-600 text-xl font-semibold">Payment Successful!</div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-2xl bg-white border border-gray-100 hover:bg-gray-50 text-slate-900 transition-all"
              >
                Return to Home
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}