import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function SeatBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const journey = location.state?.journey;

  // Redirect if no journey data
  useEffect(() => {
    if (!journey) {
      navigate('/search');
    }
  }, [journey, navigate]);

  const handleSeatClick = (seatNumber) => {
    const seat = journey.seats[seatNumber];
    if (seat.available) {
      setSelectedSeats(prev => 
        prev.includes(seatNumber)
          ? prev.filter(s => s !== seatNumber)
          : [...prev, seatNumber]
      );
    }
  };

  const handleBooking = async () => {
    if (!selectedSeats.length) return;
    
    setLoading(true);
    try {
      const journeyRef = doc(db, "busJourneys", journey.id);
      
      // Update seats availability
      const updatedSeats = [...journey.seats];
      selectedSeats.forEach(seatNumber => {
        updatedSeats[seatNumber] = {
          available: false,
          bookedBy: user.uid
        };
      });

      // Update journey document
      await updateDoc(journeyRef, {
        seats: updatedSeats
      });

      // Add booking to user's bookings collection
      await updateDoc(doc(db, "users", user.uid), {
        bookings: arrayUnion({
          journeyId: journey.id,
          seats: selectedSeats,
          busNumber: journey.busNumber,
          source: journey.source,
          destination: journey.destination,
          date: journey.date,
          time: journey.time,
          bookedAt: new Date()
        })
      });

      navigate('/booking-confirmation', { 
        state: { 
          seats: selectedSeats,
          journey 
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book seats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.length * journey.pricePerSeat;
  };

  if (!journey) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white pt-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Select Your Seats</h1>
        
        {/* Journey Details */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 mb-8">
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

        {/* Seat Grid */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 mb-8">
          <div className="grid grid-cols-4 gap-4 mb-8">
            {journey.seats.map((seat, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSeatClick(index)}
                disabled={!seat.available}
                className={`
                  p-4 rounded-xl font-medium transition-all
                  ${seat.available 
                    ? selectedSeats.includes(index)
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                    : 'bg-gray-600/30 text-white/50 cursor-not-allowed'
                  }
                `}
              >
                Seat {index + 1}
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-4 justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white/20 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-500 rounded"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600/30 rounded"></div>
              <span className="text-sm">Booked</span>
            </div>
          </div>

          {/* Price Details */}
          <div className="flex justify-between items-center mb-4 p-4 bg-white/5 rounded-xl">
            <div>
              <p className="text-white/50">Price per seat</p>
              <p className="font-medium">₹{journey.pricePerSeat}</p>
            </div>
            <div>
              <p className="text-white/50">Total Price</p>
              <p className="font-medium">₹{getTotalPrice()}</p>
            </div>
          </div>

          {/* Booking Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBooking}
            disabled={!selectedSeats.length || loading}
            className={`
              w-full py-3 rounded-xl font-medium transition-all
              ${selectedSeats.length
                ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600'
                : 'bg-gray-600/30 text-white/50 cursor-not-allowed'
              }
            `}
          >
            {loading 
              ? 'Processing...' 
              : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`
            }
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}