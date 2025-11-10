import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Add this at the top level outside the component
const loginAttempts = new Map();
const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 10 * 60 * 1000, // 10 minutes in milliseconds
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  // 🔹 To store Firestore real-time subscriptions for cleanup
  const listeners = useRef([]);

  // ✅ Signup (default role = "user")
  const signup = async (email, password, fname, lname) => {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", userCred.user.uid);

    await setDoc(userRef, {
      email,
      fname,
      lname,
      role: "user",
      createdAt: new Date(),
    });
  };

  // Add this helper function
  const checkRateLimit = (email) => {
    const now = Date.now();
    const userAttempts = loginAttempts.get(email) || [];
    
    // Clean up old attempts outside the window
    const validAttempts = userAttempts.filter(
      timestamp => now - timestamp < RATE_LIMIT.windowMs
    );
    
    if (validAttempts.length >= RATE_LIMIT.maxAttempts) {
      const oldestAttempt = validAttempts[0];
      const timeRemaining = Math.ceil((RATE_LIMIT.windowMs - (now - oldestAttempt)) / 1000 / 60);
      throw new Error(`Too many login attempts. Please try again in ${timeRemaining} minutes.`);
    }
    
    // Add new attempt
    validAttempts.push(now);
    loginAttempts.set(email, validAttempts);
  };

  // ✅ Login
  const login = async (email, password) => {
    try {
      checkRateLimit(email);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.message.includes("Too many login attempts")) {
        throw error;
      }
      // For other errors, still track the attempt
      const userAttempts = loginAttempts.get(email) || [];
      userAttempts.push(Date.now());
      loginAttempts.set(email, userAttempts);
      throw error;
    }
  };

  // ✅ Logout (with cleanup)
  const logout = async () => {
    try {
      // Stop all active Firestore listeners
      listeners.current.forEach((unsub) => unsub && unsub());
      listeners.current = [];

      await signOut(auth);
      setUser(null);
      setRole(null);
      navigate("/signup");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Fetch role from Firestore
  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) return userDoc.data().role;
    return null;
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchedRole = await fetchUserRole(currentUser.uid);
        setRole(fetchedRole);

        // Only navigate on initial load
        if (isInitialLoad) {
          if (fetchedRole === "admin") navigate("/admin");
          else navigate("/");
          setIsInitialLoad(false);
        }
      } else {
        setUser(null);
        setRole(null);
        if (isInitialLoad) {
          navigate("/signup");
          setIsInitialLoad(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate, isInitialLoad]);


  // ✅ Bus Journey management (admin only)
  const createBusJourney = async (journeyData) => {
    if (role !== "admin") throw new Error("Unauthorized");
    
    // Validate price
    if (!journeyData.pricePerSeat || isNaN(journeyData.pricePerSeat)) {
      throw new Error("Invalid price per seat");
    }

    // Convert price to number
    const dataToSave = {
      ...journeyData,
      pricePerSeat: Number(journeyData.pricePerSeat),
      seats: Array(40).fill({ available: true }),
      createdAt: new Date()
    };

    await addDoc(collection(db, "busJourneys"), dataToSave);
  };

  const getBusJourneys = async () => {
    const snapshot = await getDocs(collection(db, "busJourneys"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // 🔹 Real-time journey listener (auto cleanup handled)
  const listenBusJourneys = (callback) => {
    const unsub = onSnapshot(collection(db, "busJourneys"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });

    // Store for later cleanup
    listeners.current.push(unsub);
    return unsub;
  };

  const deleteBusJourney = async (id) => {
    if (role !== "admin") throw new Error("Unauthorized: Only admin can delete journeys.");
    await deleteDoc(doc(db, "busJourneys", id));
  };

  // Add this new function
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", result.user.uid);
      
      // Check if user document exists
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userRef, {
          email: result.user.email,
          fname: result.user.displayName?.split(' ')[0] || '',
          lname: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          role: "user",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    role,
    signup,
    login,
    logout,
    createBusJourney,
    getBusJourneys,
    deleteBusJourney,
    listenBusJourneys,
    signInWithGoogle, // Add this to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
