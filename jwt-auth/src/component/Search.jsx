import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeftRight, Bus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Search() {
  const { getBusJourneys } = useAuth();
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
      // Fetch all bus journeys
      const allJourneys = await getBusJourneys();
      
      // Filter journeys based on search criteria
      const matchingJourneys = allJourneys.filter(journey => 
        journey.source.toLowerCase() === source.toLowerCase() &&
        journey.destination.toLowerCase() === destination.toLowerCase() &&
        journey.date === date
      );

      setSearchResults(matchingJourneys);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 2000); // Reset success after 2s
    } catch (error) {
      console.error("Error fetching bus journeys:", error);
      alert("Failed to fetch bus journeys");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (journey) => {
    navigate('/seat-booking', { state: { journey } });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white pt-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>

      {/* Search Form Section */}
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 50 }}
        className="relative container mx-auto px-4"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Source and Swap Container */}
            <div className="relative flex items-end gap-2">
              <div className="flex-1">
                <label className="text-white/70 text-sm font-medium mb-2 block">From</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-all"
                  placeholder="Enter city"
                />
                {/* Source Suggestions */}
                {sourceSuggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute w-full mt-2 bg-gray-800/95 border border-white/10 rounded-xl overflow-hidden z-50"
                  >
                    {sourceSuggestions.map((city, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        onClick={() => selectCity("source", city)}
                        className="px-4 py-2 cursor-pointer text-white/70 hover:text-white transition-colors"
                      >
                        {city}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
              
              {/* Moved Swap Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={swapCities}
                className="mb-[2px] p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Destination Input */}
            <div className="relative">
              <label className="text-white/70 text-sm font-medium mb-2 block">To</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 transition-all"
                placeholder="Enter city"
              />
              {/* Destination Suggestions */}
              {destinationSuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute w-full mt-2 bg-gray-800/95 border border-white/10 rounded-xl overflow-hidden z-50"
                >
                  {destinationSuggestions.map((city, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      onClick={() => selectCity("destination", city)}
                      className="px-4 py-2 cursor-pointer text-white/70 hover:text-white transition-colors"
                    >
                      {city}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-white/70 text-sm font-medium mb-2 block">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Search Button - spans full width */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full md:col-span-1 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-xl px-6 py-3 text-white font-medium shadow-lg"
            >
              {loading ? "Searching..." : "Search Buses"}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Search Results Section */}
      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-4 mt-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
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
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all"
              >
                {/* Journey Card Content */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Bus className="text-cyan-400 w-6 h-6" />
                    <span className="text-lg font-semibold">{journey.busNumber}</span>
                  </div>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">
                    {journey.busType}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/50 text-sm">From</p>
                      <p className="text-white font-medium">{journey.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-sm">To</p>
                      <p className="text-white font-medium">{journey.destination}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/50 text-sm">Time</p>
                      <p className="text-white font-medium">{journey.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-sm">Price per Seat</p>
                      <p className="text-white font-medium">₹{journey.pricePerSeat}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white/50 text-sm">Date</p>
                      <p className="text-white font-medium">{journey.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50 text-sm">Available Seats</p>
                      <p className="text-white font-medium">
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
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white'
                        : 'bg-gray-600/30 text-white/50 cursor-not-allowed'
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

      {/* Scroll Indicator */}
      {searched && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8 mb-16"
        >
          <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default Search;
