import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("User");

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.fname || "User");
      } else {
        console.warn("No user document found");
        setFirstName("User");
      }
    });

    return () => unsub();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signup"); // redirect to signup after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold text-teal-400">GOGOBUS</h1>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <span className="text-gray-200 font-medium">
              Hello,{" "}
              <span className="text-teal-300 transition-colors duration-300">
                {firstName}
              </span>
            </span>

            {/* Notification Icon */}
            <button className="relative hover:scale-110 transition-transform duration-300">
              <Bell className="text-gray-200 hover:text-teal-400" size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-300"
          >
            Signup
          </button>
        )}
      </div>
    </nav>
  );
}
