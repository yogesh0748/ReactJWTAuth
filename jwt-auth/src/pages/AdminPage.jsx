import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { createBusJourney, getBusJourneys, deleteBusJourney, role } = useAuth();
  const [journeys, setJourneys] = useState([]);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    busNumber: "",
    busType: "Seater",
    pricePerSeat: "", // Add this line
  });
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState(generateSeats()); // 8x5 = 40

  // ✅ Generate initial seat matrix (8x5)
  function generateSeats() {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsArray = [];
    rows.forEach((row) => {
      for (let i = 1; i <= 5; i++) {
        seatsArray.push({ seatNo: `${row}${i}`, available: true });
      }
    });
    return seatsArray;
  }

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    const data = await getBusJourneys();
    setJourneys(data);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleSeat = (index) => {
    const updatedSeats = [...seats];
    updatedSeats[index].available = !updatedSeats[index].available;
    setSeats(updatedSeats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "admin")
      return alert("❌ Unauthorized. Only admin can create journeys.");

    setLoading(true);
    try {
      const journeyData = { ...formData, seats };
      await createBusJourney(journeyData);
      alert("✅ Bus journey created successfully!");

      setFormData({
        source: "",
        destination: "",
        date: "",
        time: "",
        busNumber: "",
        busType: "Seater",
                pricePerSeat: "", // Add this line
      });
      setSeats(generateSeats());
      await fetchJourneys();
    } catch (err) {
      console.error("Error creating journey:", err);
      alert("Failed to create journey.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journey?")) return;
    await deleteBusJourney(id);
    fetchJourneys();
  };

  if (role !== "admin")
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        ❌ Access Denied: Admins only.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-slate-900">
        🚌 Admin Panel - Bus Management
      </h1>

      {/* Journey Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={formData.source}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-50 text-slate-900 border border-gray-200"
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-50 text-slate-900 border border-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-50 text-slate-900 border border-gray-200"
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-50 text-slate-900 border border-gray-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="busNumber"
            placeholder="Bus Number"
            value={formData.busNumber}
            onChange={handleChange}
            required
            className="p-2 rounded bg-gray-50 text-slate-900 border border-gray-200"
          />
          <select
            name="busType"
            value={formData.busType}
            onChange={handleChange}
            className="p-2 rounded bg-gray-50 text-slate-900 border border-gray-200"
          >
            <option value="Seater">Seater</option>
            <option value="Sleeper">Sleeper</option>
            <option value="AC Seater">AC Seater</option>
            <option value="AC Sleeper">AC Sleeper</option>
            <option value="Non-AC Seater">Non-AC Seater</option>
            <option value="Non-AC Sleeper">Non-AC Sleeper</option>
          </select>
        </div>

        {/* Price per Seat */}
        <div>
          <label className="text-slate-900/70 text-sm font-medium mb-2 block">
            Price per Seat (₹)
          </label>
          <input
            type="number"
            name="pricePerSeat"
            value={formData.pricePerSeat}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-900/30 focus:outline-none focus:border-cyan-500 transition-all"
            placeholder="Enter price per seat"
            required
          />
        </div>

        {/* Seat layout */}
        <div>
          <h3 className="text-xl font-semibold mb-2">🪑 Seat Layout (8x5)</h3>
          <div className="grid grid-cols-5 gap-2 bg-gray-700 p-4 rounded-lg">
            {seats.map((seat, index) => (
              <div
                key={seat.seatNo}
                onClick={() => toggleSeat(index)}
                className={`cursor-pointer text-center py-2 rounded ${
                  seat.available
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {seat.seatNo}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            ✅ Green = Available | 🔴 Red = Unavailable
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg font-semibold"
        >
          {loading ? "Creating..." : "Create Journey"}
        </button>
      </form>

      {/* List of Bus Journeys */}
      <div className="mt-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900">📋 Existing Bus Journeys</h2>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {journeys.length === 0 ? (
            <p className="text-gray-400">No journeys found.</p>
          ) : (
            <table className="w-full text-left border border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-3">Source</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Bus No.</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {journeys.map((j) => (
                  <tr
                    key={j.id}
                    className="border-t border-gray-700 hover:bg-gray-800"
                  >
                    <td className="p-3">{j.source}</td>
                    <td className="p-3">{j.destination}</td>
                    <td className="p-3">{j.date}</td>
                    <td className="p-3">{j.time}</td>
                    <td className="p-3">{j.busNumber}</td>
                    <td className="p-3">{j.busType}</td>
                    <td className="p-3">
                      {j.seats?.filter((s) => s.available).length || 0}/40
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
