import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "./AnimatedLogo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("User");
  const [isOpen, setIsOpen] = useState(false);
  const [journeyMenuOpen, setJourneyMenuOpen] = useState(false);
  const journeyRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.fname || "User");
      } else {
        console.warn("⚠️ No user document found");
        setFirstName("User");
      }
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    // lock body scroll on mobile when menu open
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // close journey dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (journeyRef.current && !journeyRef.current.contains(e.target)) {
        setJourneyMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // redirect after logout if needed
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    { label: "Home", to: "/" },
    // Team removed — replaced by Journeys dropdown below
    { label: "Feature", to: "/feature" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const goToJourneys = (filter) => {
    setJourneyMenuOpen(false);
    setIsOpen(false);
    navigate(`/journeys?filter=${filter}`);
  };

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        {/* Logo - full and compact */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="max-sm:hidden"
            aria-label="GoGoBus home"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="flex items-center space-x-3">
              <AnimatedLogo />
              <span className="text-slate-900 font-semibold text-lg">
                
              </span>
            </div>
          </a>

          <a
            href="/"
            className="hidden max-sm:block"
            aria-label="GoGoBus home short"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <div className="flex items-center">
              <AnimatedLogo small />
            </div>
          </a>
        </div>

        {/* Desktop / Mobile menu */}
        <div
          id="collapseMenu"
          className={`lg:block ${
            isOpen ? "block" : "hidden"
          } max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50 lg:relative lg:top-auto lg:left-auto lg:p-0`}
        >
          {/* Close button for mobile */}
          <button
            id="toggleClose"
            onClick={() => setIsOpen(false)}
            className={`lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border border-gray-200 cursor-pointer ${
              isOpen ? "block" : "hidden"
            }`}
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"></path>
              <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"></path>
            </svg>
          </button>

          <ul
            className={`lg:flex gap-x-4 max-lg:space-y-3 ${
              isOpen ? "mt-8" : "mt-0"
            }`}
          >
            {/* Mobile logo inside menu */}
            <li className="mb-6 hidden max-lg:block">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  navigate("/");
                }}
              >
                <div className="flex items-center space-x-3">
                  <AnimatedLogo />
                  <span className="text-slate-900 font-semibold text-lg">
                    GOGOBUS
                  </span>
                </div>
              </a>
            </li>

            {/* Journeys dropdown */}
            <li ref={journeyRef} className="relative px-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setJourneyMenuOpen((v) => !v);
                }}
                className="hover:text-blue-700 text-slate-900 block font-medium text-[15px] flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded={journeyMenuOpen}
              >
                Journeys
                <svg
                  className={`w-4 h-4 transition-transform ${
                    journeyMenuOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {journeyMenuOpen && (
                <div className="absolute left-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-lg w-44 z-60">
                  <button
                    onClick={() => goToJourneys("upcoming")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-slate-700"
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => goToJourneys("past")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-slate-700"
                  >
                    Past
                  </button>
                </div>
              )}
            </li>

            {/* other nav items */}
            {navItems.map((item) => (
              <li
                key={item.label}
                className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"
              >
                <a
                  href={item.to}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    navigate(item.to);
                  }}
                  className="hover:text-blue-700 text-slate-900 block font-medium text-[15px]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right actions */}
        <div className="flex max-lg:ml-auto space-x-4 items-center">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-slate-700">
                Hello,{" "}
                <span className="text-teal-500 font-medium">{firstName}</span>
              </span>

              <button
                className="relative hover:scale-110 transition-transform duration-300"
                aria-label="Notifications"
              >
                <Bell className="text-slate-700" size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  3
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border bg-red-500 hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
          

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 text-sm rounded-full font-medium cursor-pointer tracking-wide text-white border border-blue-600 bg-blue-600 hover:bg-blue-700 transition-all"
              >
                Sign up
              </button>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            id="toggleOpen"
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden cursor-pointer p-2 rounded-md hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg
              className="w-7 h-7"
              fill="#000"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
