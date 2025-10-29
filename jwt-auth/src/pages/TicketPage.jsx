import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { Bus, Calendar, Clock, MapPin, User, Download, ArrowLeft } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

export default function TicketPage() {
  const { journeyId } = useParams();
  const [searchParams] = useSearchParams();
  const bookedAtSeconds = searchParams.get('bookedAt');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.uid || !journeyId || !bookedAtSeconds) {
      setLoading(false);
      setError('Invalid booking details provided.');
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) throw new Error('User document not found.');

        const userData = userDocSnap.data();
        setPassenger({
          name: `${userData.fname} ${userData.lname}`,
          email: userData.email,
        });

        const userBookings = userData.bookings || [];
        const foundBooking = userBookings.find(
          b => b.journeyId === journeyId && b.bookedAt.seconds.toString() === bookedAtSeconds
        );

        if (!foundBooking)
          throw new Error('Booking not found. It might be a past journey or invalid link.');

        setBooking(foundBooking);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [user, journeyId, bookedAtSeconds]);

  // 📸 Handle screenshot download
  const handleDownload = async () => {
    try {
      const node = document.querySelector('.ticket-container');
      const dataUrl = await htmlToImage.toPng(node, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `GoGoBus-Ticket-${journeyId}-${bookedAtSeconds}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => navigate('/journeys')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go to My Journeys
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={20} /> Back
          </button>

          {/* 📸 Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            <Download size={18} /> Download Ticket
          </button>
        </div>

        {/* Ticket Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ticket-container bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Boarding Pass</h1>
              <p className="opacity-80">GoGoBus - Your Trusted Travel Partner</p>
            </div>
            <Bus size={40} />
          </div>

          <div className="p-6 md:p-8">
            {/* Passenger Info */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Passenger Details
              </h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-900 text-lg">{passenger?.name}</p>
                  <p className="text-sm text-gray-600">{passenger?.email}</p>
                </div>
              </div>
            </div>

            {/* Journey Info */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Journey Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-semibold text-slate-800">{booking.source}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-semibold text-slate-800">{booking.destination}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-slate-800">{booking.date}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-semibold text-slate-800">{booking.time}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed my-6"></div>

            {/* Bus & Seat Info */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Bus & Seat Info
              </h2>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold text-slate-800">Bus Number:</span> {booking.busNumber}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Seat Numbers:</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {booking.seats.map(seat => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-blue-100 text-blue-700 font-bold rounded-md"
                    >
                      {seat + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Thank you for choosing GoGoBus. Have a safe and pleasant journey!</p>
              <p>Booking ID: {journeyId}-{bookedAtSeconds}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
