import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, Calendar, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function UpcomingJourneysHero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);

  const parseJourneyDate = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const tryIso = new Date(`${dateStr}T${timeStr || "00:00"}`);
    if (!isNaN(tryIso)) return tryIso;
    return null;
  };

  useEffect(() => {
    // Log the UID whenever it changes
    console.log('Current User UID:', user?.uid);
    
    if (!user?.uid) return;
    
    const fetchUserBookings = async () => {
      setLoading(true);
      try {
        // Also log before fetching bookings
        console.log('Fetching bookings for UID:', user.uid);
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          console.warn("User document not found for UID:", user.uid);
          return;
        }
        
        // Log the entire user document for debugging
        console.log('User document data:', userDoc.data());

        const userData = userDoc.data();
        const bookings = userData.bookings || [];
        
        // Filter and sort upcoming bookings
        const now = new Date();
        const upcomingBookings = bookings
          .map(booking => {
            const dt = parseJourneyDate(booking.date, booking.time);
            return {
              ...booking,
              _datetime: dt
            };
          })
          .filter(booking => booking._datetime && booking._datetime >= now)
          .sort((a, b) => a._datetime - b._datetime);

        setUpcoming(upcomingBookings);
      } catch (err) {
        console.error("Failed to fetch user bookings for UID:", user.uid, err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user?.uid]);

  return (
    <section className="relative overflow-hidden pt-6">
      <div className="min-h-[48vh] flex items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-12 bg-gradient-to-b from-cyan-50 to-white rounded-2xl shadow-sm">
        <div className="md:w-1/2 z-10">
          <motion.h1
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight"
          >
            Your upcoming journeys
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="mt-4 text-slate-600 max-w-xl"
          >
            Quickly review upcoming trips, manage passengers and payments, or view past travel history. Tap below to
            view all upcoming journeys booked with GoGoBus.
          </motion.p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/journeys?filter=upcoming")}
              className="px-6 py-3 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-md transition"
            >
              View Upcoming
            </motion.button>

            <button
              onClick={() => navigate("/bookings")}
              className="px-5 py-3 rounded-full text-slate-800 font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
            >
              My Bookings
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center z-10">
          <motion.div
            initial={{ scale: 0.9, rotate: -6, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 70 }}
            className="w-64 h-64 bg-white rounded-2xl shadow-lg flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2">
              <Bus className="text-blue-600 w-14 h-14" />
              <div className="text-slate-900 font-semibold">Upcoming Journeys</div>
              <div className="text-sm text-slate-500">Stay on top of your travel plans</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Your Upcoming Journeys
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
              />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No upcoming journeys found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((booking, idx) => (
                <motion.div
                  key={`${booking.journeyId}-${booking.bookedAt}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Bus className="text-blue-600 w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900">
                          Bus #{booking.busNumber}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(booking.bookedAt?.seconds * 1000).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{booking.time}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-500">Seats:</span>
                        <div className="flex gap-1">
                          {booking.seats.map(seat => (
                            <span
                              key={seat}
                              className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded"
                            >
                              #{seat + 1}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/journey/${booking.journeyId}`)}
                      className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}