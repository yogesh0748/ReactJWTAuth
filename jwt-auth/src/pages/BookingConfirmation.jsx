import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { initializeRazorpay } from '../utils/razorpay';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  
  const { seats, journey } = location.state || {};
  const totalPrice = seats?.length * journey?.pricePerSeat || 0;

  useEffect(() => {
    if (!journey || !seats) {
      navigate('/search');
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
      // Create order in Firebase
      const orderRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userName: `${userDetails.fname} ${userDetails.lname}`,
        userEmail: userDetails.email,
        journeyId: journey.id,
        seats: seats,
        amount: totalPrice * 100, // Razorpay expects amount in paise
        status: 'created',
        createdAt: serverTimestamp()
      });

      return {
        id: orderRef.id,
        amount: totalPrice * 100,
        userName: `${userDetails.fname} ${userDetails.lname}`,
        userEmail: userDetails.email
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Update payment status in Firebase
      await updateDoc(doc(db, "orders", paymentResponse.razorpay_order_id), {
        status: 'paid',
        paymentId: paymentResponse.razorpay_payment_id,
        paymentSignature: paymentResponse.razorpay_signature,
        paidAt: serverTimestamp()
      });

      // Navigate to success page
      navigate('/payment-confirmation', {
        state: {
          journey,
          seats,
          userDetails,
          totalAmount: totalPrice,
          paymentId: paymentResponse.razorpay_payment_id
        }
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Booking Confirmation</h1>

        {/* User Details */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50">Name</p>
              <p className="font-medium">{userDetails.fname} {userDetails.lname}</p>
            </div>
            <div>
              <p className="text-white/50">Email</p>
              <p className="font-medium">{userDetails.email}</p>
            </div>
          </div>
        </div>

        {/* Journey Details */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Journey Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/50">From</p>
              <p className="font-medium">{journey.source}</p>
            </div>
            <div>
              <p className="text-white/50">To</p>
              <p className="font-medium">{journey.destination}</p>
            </div>
            <div>
              <p className="text-white/50">Date</p>
              <p className="font-medium">{journey.date}</p>
            </div>
            <div>
              <p className="text-white/50">Time</p>
              <p className="font-medium">{journey.time}</p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-white/50">Selected Seats</p>
              <p className="font-medium">
                {seats.map(seat => `Seat ${seat + 1}`).join(', ')}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white/50">Price per Seat</p>
              <p className="font-medium">₹{journey.pricePerSeat}</p>
            </div>
            <div className="flex justify-between items-center text-lg font-semibold">
              <p>Total Amount</p>
              <p>₹{totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {paymentStatus === 'pending' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={loading}
            className="w-full py-4 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition-all"
          >
            {loading ? 'Processing Payment...' : `Pay ₹${totalPrice}`}
          </motion.button>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-400 text-xl font-semibold">
              Payment Successful!
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/')}
              className="px-8 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            >
              Return to Home
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}