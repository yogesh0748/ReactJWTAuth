import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Bus, Calendar, Clock, MapPin } from "lucide-react";

export default function Journeys() {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "upcoming";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      navigate('/login');
      return;
    }

    const fetchJourneys = async () => {
      setLoading(true);
      try {
        console.log('Fetching journeys for user:', user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          console.warn("No user document found");
          return;
        }

        const userData = userDoc.data();
        const bookings = userData.bookings || [];
        console.log('Found bookings:', bookings.length);

        // Parse dates and filter based on current time
        const now = new Date();
        const processed = bookings.map(booking => ({
          ...booking,
          parsedDate: new Date(`${booking.date}T${booking.time}`)
        }));

        // Filter and sort based on the selected filter
        let filtered = processed;
        if (filter === "upcoming") {
          filtered = processed.filter(booking => booking.parsedDate >= now);
          filtered.sort((a, b) => a.parsedDate - b.parsedDate);
        } else {
          filtered = processed.filter(booking => booking.parsedDate < now);
          filtered.sort((a, b) => b.parsedDate - a.parsedDate);
        }

        setJourneys(filtered);
      } catch (error) {
        console.error("Error fetching journeys:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, [user, filter, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4 sm:mb-0">
            {filter === "upcoming" ? "Upcoming Journeys" : "Past Journeys"}
          </h1>
          
          <div className="flex gap-2 bg-white p-1 rounded-full shadow-sm border border-gray-200">
            <button
              onClick={() => navigate("/journeys?filter=upcoming")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50 text-slate-600"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => navigate("/journeys?filter=past")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === "past"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-50 text-slate-600"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : journeys.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100"
            >
              <Bus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No {filter} journeys found
              </h3>
              <p className="text-gray-500">
                {filter === "upcoming" 
                  ? "Book a new journey to get started!"
                  : "Your past journeys will appear here"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {journeys.map((journey, index) => (
                <motion.div
                  key={`${journey.journeyId}-${journey.bookedAt}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Bus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Bus #{journey.busNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {journey.seats.length} seat(s) booked
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">From</span>
                      </div>
                      <p className="font-medium text-slate-900">{journey.source}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">To</span>
                      </div>
                      <p className="font-medium text-slate-900">{journey.destination}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Date</span>
                      </div>
                      <p className="font-medium text-slate-900">{journey.date}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Time</span>
                      </div>
                      <p className="font-medium text-slate-900">{journey.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/journey/${journey.journeyId}`)}
                      className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    {filter === "upcoming" && (
                      <button
                        onClick={() => navigate(`/ticket/${journey.journeyId}`)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        Show Ticket
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}