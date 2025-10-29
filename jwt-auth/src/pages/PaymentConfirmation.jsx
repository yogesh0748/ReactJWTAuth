import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PaymentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { journey, seats, userDetails, totalAmount } = location.state || {};
  
  useEffect(() => {
    if (!journey || !seats) {
      navigate('/search');
      return;
    }

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [journey, seats, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white pt-20 px-4"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-white/70 mb-8">Your booking has been confirmed</p>

        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-white/50">Booking Reference</p>
              <p className="text-xl font-semibold">
                {`${journey.busNumber}-${seats[0] + 1}`.toUpperCase()}
              </p>
            </div>
            
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

            <div>
              <p className="text-white/50">Seats</p>
              <p className="font-medium">
                {seats.map(seat => `Seat ${seat + 1}`).join(', ')}
              </p>
            </div>

            <div>
              <p className="text-white/50">Amount Paid</p>
              <p className="text-xl font-semibold">₹{totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 font-medium"
          >
            Return Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.print()}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium"
          >
            Download Ticket
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}