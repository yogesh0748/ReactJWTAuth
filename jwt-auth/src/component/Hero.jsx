import React, { useEffect, useState } from "react";
import RealisticCube from "./RealisticCube";
import "../styles/MagneticButton.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);

  // Particle field setup
  useEffect(() => {
    const particleField = document.getElementById("particleField");
    if (!particleField) return;
    particleField.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.setProperty("--x", `${Math.random() * 200 - 100}px`);
      particle.style.setProperty("--y", `${Math.random() * 200 - 100}px`);
      particle.style.animation = `particleFloat ${1 + Math.random() * 2}s infinite`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particleField.appendChild(particle);
    }
  }, []);

  // Auto redirect after 5s
  useEffect(() => {
    if (showPopup) {
      setProgress(0);
      let value = 0;
      const interval = setInterval(() => {
        value += 1;
        setProgress(value);
        if (value >= 100) {
          clearInterval(interval);
          navigate("/signup");
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showPopup, navigate]);

  const handleJourneyClick = () => {
    if (!user) setShowPopup(true);
    else navigate("/search");
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white px-8 md:px-16 py-12 overflow-hidden mt-16 relative">
      {/* Left Side */}
      <div className="md:w-1/2 flex flex-col items-start space-y-6 z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight font-[Playfair_Display]">
          "Travel not to escape life, <br />
          but so life doesn't escape you."
        </h1>
        <p className="text-gray-300 text-lg max-w-md">
          Experience the journey, not just the destination. Let every mile bring
          you a new story.
        </p>

        {/* Magnetic Button */}
        <button className="btn magnetic mt-4" onClick={handleJourneyClick}>
          <span>Start Your Journey</span>
          <div className="particles-field" id="particleField"></div>
        </button>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 mt-20 md:mt-0 flex justify-center items-center overflow-visible">
        <div className="w-64 h-64">
          <RealisticCube />
        </div>
      </div>

      {/* Slide-in Popup (content-sized, no blur, cross on right) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-full sm:w-[400px] bg-gray-900/95 border-l border-white/20 rounded-l-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] p-8 text-white my-auto mr-4"
            >
              {/* Close Button on Right */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="flex flex-col justify-center items-center text-center">
                <h2 className="text-3xl font-bold mb-3">Sign In Required</h2>
                <p className="text-gray-300 mb-6 max-w-sm">
                  Please sign in to start your journey.
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => navigate("/signup")}
                  className="mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 px-6 py-2 rounded-full font-semibold text-white shadow-md"
                >
                  Go to Signup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
