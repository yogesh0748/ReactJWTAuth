import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight, Bus, Calendar, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Search() {
  const { getBusJourneys, user } = useAuth();
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [success, setSuccess] = useState(false);
  // Add new state for bus type
  const [busType, setBusType] = useState("all");

  // Add bus types array
  const busTypes = [
    { value: "all", label: "All Types" },
    { value: "Seater", label: "Seater" },
    { value: "Sleeper", label: "Sleeper" },
    { value: "AC Seater", label: "AC Seater" },
    { value: "AC Sleeper", label: "AC Sleeper" },
    { value: "Non-AC Seater", label: "Non-AC Seater" },
    { value: "Non-AC Sleeper", label: "Non-AC Sleeper" }
  ];

  // ✅ Fetch cities of India using Axios
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("https://countriesnow.space/api/v0.1/countries");
        const india = response.data.data.find((country) => country.country === "India");
        if (india) setCities(india.cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // ✅ Debounce search for source
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (source.trim() === "") setSourceSuggestions([]);
      else {
        setSourceSuggestions(
          cities.filter((city) => city.toLowerCase().includes(source.toLowerCase()))
        );
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [source, cities]);

  // ✅ Debounce search for destination
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (destination.trim() === "") setDestinationSuggestions([]);
      else {
        setDestinationSuggestions(
          cities.filter((city) => city.toLowerCase().includes(destination.toLowerCase()))
        );
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [destination, cities]);

  const selectCity = (type, city) => {
    if (type === "source") {
      setSource(city);
      setSourceSuggestions([]);
    } else {
      setDestination(city);
      setDestinationSuggestions([]);
    }
  };

  const swapCities = () => {
    setSource(destination);
    setDestination(source);
  };

  // Modify handleSubmit to include bus type filter
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (source === destination) {
      alert("Source and destination cannot be the same!");
      return;
    }

    setLoading(true);
    setSearched(true);
    setSuccess(false);
    try {
      const allJourneys = await getBusJourneys();
      
      const matchingJourneys = allJourneys.filter(journey => 
        journey.source.toLowerCase() === source.toLowerCase() &&
        journey.destination.toLowerCase() === destination.toLowerCase() &&
        journey.date === date &&
        (busType === "all" || journey.busType === busType)
      );

      setSearchResults(matchingJourneys);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Error fetching bus journeys:", error);
      alert("Failed to fetch bus journeys");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (journey) => {
    // Check if user is logged in first
    if (!user) {
      // Show login prompt
      navigate('/login', { 
        state: { 
          redirectTo: '/seat-booking',
          journeyData: journey 
        }
      });
      return;
    }

    // If logged in, proceed to seat booking
    try {
      navigate('/seat-booking', { 
        state: { 
          journey,
          returnTo: '/search' // Add return path
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Unable to proceed to booking. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pt-20 pb-20"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:20px_20px]"></div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="relative container mx-auto px-4"
      >
        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Source Input */}
            <div className="relative flex items-end gap-2">
              <div className="flex-1">
                <label className="text-gray-600 text-sm font-medium mb-2 block">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Enter city"
                  />
                </div>
                <AnimatePresence>
                  {sourceSuggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl overflow-hidden z-50 shadow-lg"
                    >
                      {sourceSuggestions.map((city, index) => (
                        <motion.li
                          key={index}
                          whileHover={{ backgroundColor: "#f8fafc" }}
                          onClick={() => selectCity("source", city)}
                          className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {city}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Swap Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                type="button"
                onClick={swapCities}
                className="mb-[2px] p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Destination Input */}
            <div className="relative">
              <label className="text-gray-600 text-sm font-medium mb-2 block">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="Enter city"
                />
              </div>
              <AnimatePresence>
                {destinationSuggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl overflow-hidden z-50 shadow-lg"
                  >
                    {destinationSuggestions.map((city, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                        onClick={() => selectCity("destination", city)}
                        className="px-4 py-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {city}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Date Input */}
            <div>
              <label className="text-gray-600 text-sm font-medium mb-2 block">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Add Bus Type Dropdown */}
            <div>
              <label className="text-gray-600 text-sm font-medium mb-2 block">Bus Type</label>
              <div className="relative">
                <Bus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={busType}
                  onChange={(e) => setBusType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {busTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="mt-6 w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              "Search Buses"
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 0.2 }}
            className="container mx-auto px-4 mt-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
              {loading ? (
                "Finding your perfect journey..."
              ) : searchResults.length ? (
                `Found ${searchResults.length} buses for your journey`
              ) : (
                "No buses available for this route"
              )}
            </h2>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((journey, index) => (
                <motion.div
                  key={journey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                >
                  {/* Journey Card Content - Updated with light theme colors */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Bus className="text-blue-600 w-6 h-6" />
                      <span className="text-lg font-semibold text-gray-900">{journey.busNumber}</span>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {journey.busType}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">From</p>
                        <p className="text-gray-900 font-medium">{journey.source}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">To</p>
                        <p className="text-gray-900 font-medium">{journey.destination}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">Time</p>
                        <p className="text-gray-900 font-medium">{journey.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Price per Seat</p>
                        <p className="text-gray-900 font-medium">₹{journey.pricePerSeat}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-sm">Date</p>
                        <p className="text-gray-900 font-medium">{journey.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Available Seats</p>
                        <p className="text-gray-900 font-medium">
                          {journey.seats?.filter(s => s.available).length || 0}/40
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBooking(journey)}
                      disabled={!journey.seats?.some(s => s.available)}
                      className={`w-full mt-4 py-3 rounded-xl font-medium transition-all ${
                        journey.seats?.some(s => s.available)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {journey.seats?.some(s => s.available) ? 'Book Now' : 'Sold Out'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator */}
      {searched && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default Search;
