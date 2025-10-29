import React, { useEffect, useState } from "react";
import RealisticCube from "./RealisticCube";
import "../styles/MagneticButton.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import UpcomingJourneysHero from "./UpcomingJourneysHero";

export default function HeroSection() {
  const { user, role } = useAuth(); // Add role from useAuth
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchParams] = useSearchParams();

  // subtle particle field (kept but toned down)
  useEffect(() => {
    const particleField = document.getElementById("particleField");
    if (!particleField) return;
    particleField.innerHTML = "";
    for (let i = 0; i < 24; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.setProperty("--x", `${Math.random() * 160 - 80}px`);
      particle.style.setProperty("--y", `${Math.random() * 160 - 80}px`);
      particle.style.animation = `particleFloat ${2 + Math.random() * 3}s infinite`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particleField.appendChild(particle);
    }
  }, []);

  // Auto redirect after 5s in popup
  useEffect(() => {
    if (showPopup) {
      setProgress(0);
      let value = 0;
      const interval = setInterval(() => {
        value += 2;
        setProgress(value);
        if (value >= 100) {
          clearInterval(interval);
          navigate("/signup");
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showPopup, navigate]);

  const handleActionClick = () => {
    if (!user) {
      setShowPopup(true);
      return;
    }

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/search");
    }
  };

  // If route has filter=upcoming, show the UpcomingJourneysHero instead of default hero
  const filter = searchParams.get("filter") || "";

  if (filter.toLowerCase() === "upcoming") {
    return <UpcomingJourneysHero />;
  }

  return (
    <section className="relative overflow-hidden pt-6">
      {/* Light background matching navbar theme */}
      <div className="min-h-[72vh] flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-12 bg-gradient-to-b from-cyan-50 to-white rounded-2xl shadow-sm">
        {/* Left content */}
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Book fast. Travel easy.
          </h1>
          <p className="mt-4 text-slate-600 max-w-xl">
            GoGoBus — your online bus reservation platform. Real-time seat
            availability, secure payments, and instant e-tickets for stress-free
            journeys.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={handleActionClick}
              className="px-6 py-3 rounded-full text-white font-semibold bg-blue-600 hover:bg-blue-700 shadow-md transition"
            >
              {role === "admin" ? "Create Journey" : "Start Your Journey"}
            </button>

            {role !== "admin" && (
              <button
                onClick={() => navigate("/routes")}
                className="px-5 py-3 rounded-full text-slate-800 font-medium border border-gray-300 bg-white hover:bg-gray-50 transition"
              >
                View Routes
              </button>
            )}

            {role !== "admin" && (
              <div className="text-sm text-slate-500 mt-2 sm:mt-0">
                Prefer phone?{" "}
                <span className="text-slate-700 font-medium">+1 (800) GOGOBUS</span>
              </div>
            )}
          </div>
        </div>

        {/* Right visual */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center items-center z-10">
          <div className="w-72 h-72 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <RealisticCube />
          </div>
        </div>

        {/* subtle particles absolute layer (for the magnetic button) */}
        <div className="absolute inset-0 pointer-events-none">
          <div id="particleField" className="w-full h-full"></div>
        </div>
      </div>

      {/* Slide-in Signup prompt (light card matching theme) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-50 flex items-end md:items-center justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative w-full sm:w-[420px] bg-white rounded-l-2xl shadow-2xl border-l border-slate-200 p-6 m-4"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Please sign in
                </h2>
                <p className="mt-2 text-sm text-slate-600 mb-4">
                  Sign in or create an account to book tickets and manage your
                  trips.
                </p>

                <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 rounded-full border border-gray-300 bg-white text-slate-700 hover:bg-gray-50"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Create account
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
