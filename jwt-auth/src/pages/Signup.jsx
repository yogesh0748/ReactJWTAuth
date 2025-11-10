import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Signup() {
  const [isSignup, setIsSignup] = useState(true);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Alert state (reusable slide-in alert like Hero's prompt)
  const [alertMessage, setAlertMessage] = useState("");
  const [alertActionLabel, setAlertActionLabel] = useState("");
  const [alertAction, setAlertAction] = useState(null);

  const { signup, login, signInWithGoogle } = useAuth(); // Add signInWithGoogle
  const navigate = useNavigate();

  const emailIsValid = (e) => /^\S+@\S+\.\S+$/.test(e);
  const passwordIsValid = (p) => typeof p === "string" && p.length >= 6;

  const showAlert = (message, actionLabel = "", action = null) => {
    setAlertMessage(message);
    setAlertActionLabel(actionLabel);
    setAlertAction(() => action);
  };

  const closeAlert = () => {
    setAlertMessage("");
    setAlertActionLabel("");
    setAlertAction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic client-side validation
    if (!emailIsValid(email)) {
      setLoading(false);
      setError("Please enter a valid email address.");
      showAlert("Invalid email. Please provide a valid email address.");
      return;
    }

    if (!passwordIsValid(password)) {
      setLoading(false);
      setError("Password must be at least 6 characters.");
      showAlert("Password too short. Use 6+ characters.");
      return;
    }

    if (isSignup) {
      if (!fname.trim() || !lname.trim()) {
        setLoading(false);
        setError("Please provide first and last name.");
        showAlert("Name required. Provide first & last name to sign up.");
        return;
      }
    }

    try {
      if (isSignup) {
        // create account
        await signup(email, password, fname, lname);
      } else {
        // sign in
        await login(email, password);
      }

      // get current auth user uid
      const auth = getAuth();
      const current = auth.currentUser;
      const uid = current?.uid;

      // default redirect
      let destination = "/";

      if (uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data?.role === "admin") {
              destination = "/admin";
            }
          } else {
            // User auth is valid but user doc not found in users collection
            // Show alert with option to create account (redirect to signup)
            showAlert(
              "User record not found in database. Would you like to create an account record?",
              "Create account",
              () => navigate("/signup")
            );
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Failed to read user role, defaulting to home:", err);
        }
      }

      navigate(destination);
    } catch (err) {
      const msg = err?.message || "Authentication failed";
      setError(msg);
      showAlert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      const msg = err?.message || "Google sign in failed";
      showAlert(msg);
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

        <div className="flex justify-center mt-3">
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 transition-colors"
          >
            <FcGoogle size={22} />
            <span className="text-sm text-gray-600">Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* Alert box (similar style to Hero popup) */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className="w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 mb-1">Notice</div>
                  <div className="text-sm text-slate-700">{alertMessage}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {alertAction && (
                    <button
                      onClick={() => {
                        if (typeof alertAction === "function") alertAction();
                        closeAlert();
                      }}
                      className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                    >
                      {alertActionLabel || "OK"}
                    </button>
                  )}
                  <button
                    onClick={closeAlert}
                    className="text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


