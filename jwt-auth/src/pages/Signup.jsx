import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [isSignup, setIsSignup] = useState(true);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        await signup(email, password, fname, lname);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 backdrop-blur-lg">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-96 border border-white/20 transform transition-transform duration-500 hover:scale-105">
        {/* Toggle */}
        <div className="flex justify-center mb-6 space-x-2 bg-black/30 p-1 rounded-full">
          <button
            onClick={() => setIsSignup(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              isSignup ? "bg-white text-black" : "text-gray-300"
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => setIsSignup(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              !isSignup ? "bg-white text-black" : "text-gray-300"
            }`}
          >
            Sign in
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-white">
          {isSignup ? "Create an account" : "Welcome back"}
        </h2>

        {error && (
          <p className="text-red-400 text-sm bg-red-900/50 p-2 rounded text-center mb-4 animate-pulse">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="First name"
                className="bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 w-1/2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                className="bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 w-1/2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="bg-white/10 text-white placeholder-gray-400 rounded-lg p-3 w-full focus:ring-2 focus:ring-teal-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
              loading
                ? "bg-teal-400/60 text-gray-200 cursor-not-allowed animate-pulse"
                : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:scale-105 hover:from-teal-400 hover:to-cyan-400 text-white"
            }`}
          >
            {loading
              ? isSignup
                ? "Creating Account..."
                : "Signing In..."
              : isSignup
              ? "Create an account"
              : "Sign in"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4 text-sm">OR SIGN IN WITH</p>

        <div className="flex justify-center mt-3 space-x-3">
          <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg">
            <FcGoogle size={22} />
          </button>
          <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg">
            <FaApple size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
