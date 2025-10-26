import Navbar from "../component/Navbar";
import { useAuth } from "../context/AuthContext";
import Hero from "../component/Hero";
import Search from "../component/Search"; 

export default function Dashboard() {
  const { user, token } = useAuth();

  return (
    <>
      <Hero />
      <Search />
    </>
  );
}
