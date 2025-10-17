import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user?.email}</h2>
      <p className="text-gray-600 text-sm mb-6">Your JWT token is valid ✅</p>
      <pre className="bg-gray-100 p-4 rounded max-w-lg text-xs overflow-auto">
        {token}
      </pre>
      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
