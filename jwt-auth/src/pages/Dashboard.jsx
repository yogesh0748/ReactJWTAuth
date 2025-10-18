import Navbar from "../component/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, token } = useAuth();

  return (
    <>
    <Navbar />
    </>
  );
}
