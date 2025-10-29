import { useAuth } from "../context/AuthContext";
import Hero from "../component/Hero"; 
export default function Dashboard() {
  const { user, token } = useAuth();

  return (
    <>
      <Hero />
    </>
  );
}
