import React from "react";
import RealisticCube from "./RealisticCube";

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white px-8 md:px-16 py-12 overflow-hidden mt-16">
      {/* Left Side - Text */}
      <div className="md:w-1/2 flex flex-col items-start space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight font-[Playfair_Display]">
          "Travel not to escape life, <br />
          but so life doesn't escape you."
        </h1>
        <p className="text-gray-300 text-lg max-w-md">
          Experience the journey, not just the destination. Let every mile bring you a new story.
        </p>
        <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition-all px-6 py-3 rounded-full font-semibold text-white shadow-lg">
          Start Your Journey
        </button>
      </div>

      {/* Right Side - Spinning Cube */}
      <div className="md:w-1/2 mt-20 md:mt-0 flex justify-center items-center overflow-visible">
        <div className="w-64 h-64"> {/* Adjusted size */}
          <RealisticCube />
        </div>
      </div>

    </section>
  );
}
