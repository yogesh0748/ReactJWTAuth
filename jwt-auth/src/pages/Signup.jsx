import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 animate-gradient-bg">
      <form 
        onSubmit={handleSignup} 
        className="w-96 p-8 bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl space-y-6 transform transition-transform duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center text-teal-400 animate-pulse">Bus Reservation Signup</h2>

        {error && (
          <p className="text-red-500 text-sm bg-red-900 bg-opacity-70 p-2 rounded animate-shake">
            {error}
          </p>
        )}

        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-800 text-gray-100 placeholder-gray-500 p-3 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none transition duration-300 ease-in-out hover:ring-teal-300"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-800 text-gray-100 placeholder-gray-500 p-3 rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none transition duration-300 ease-in-out hover:ring-teal-300"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white font-semibold transition-all duration-300 transform ${
            loading 
              ? "bg-teal-300 cursor-not-allowed animate-pulse" 
              : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:scale-105 hover:from-teal-400 hover:to-cyan-400"
          }`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Register"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-teal-400 hover:underline hover:text-teal-300 transition-colors">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
