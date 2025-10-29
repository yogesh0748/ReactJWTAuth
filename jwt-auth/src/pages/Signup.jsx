import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [isSignup, setIsSignup] = useState(true);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        await signup(email, password, fname, lname);
        navigate("/");
      } else {
        await login(email, password);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-white">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-96 border border-gray-100 transform transition-transform duration-500 hover:scale-105">
        {/* Toggle */}
        <div className="flex justify-center mb-6 space-x-2 bg-gray-50 p-1 rounded-full">
          <button
            onClick={() => setIsSignup(true)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              isSignup ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => setIsSignup(false)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              !isSignup ? "bg-blue-600 text-white" : "text-gray-600"
            }`}
          >
            Sign in
          </button>
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-slate-900">
          {isSignup ? "Create an account" : "Welcome back"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="First name"
                className="bg-gray-50 text-slate-900 placeholder-gray-400 rounded-xl p-3 w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-200"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                className="bg-gray-50 text-slate-900 placeholder-gray-400 rounded-xl p-3 w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-200"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Enter your email"
            className="bg-gray-50 text-slate-900 placeholder-gray-400 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="bg-gray-50 text-slate-900 placeholder-gray-400 rounded-xl p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none border border-gray-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
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

        <p className="text-center text-gray-600 mt-4 text-sm">OR SIGN IN WITH</p>

        <div className="flex justify-center mt-3 space-x-3">
          <button className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-200">
            <FcGoogle size={22} />
          </button>
          <button className="bg-gray-50 hover:bg-gray-100 p-3 rounded-xl border border-gray-200">
            <FaApple size={22} className="text-slate-900" />
          </button>
        </div>
      </div>
    </div>
  );
}


