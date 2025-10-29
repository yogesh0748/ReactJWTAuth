import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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

  // ✅ Login
  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
