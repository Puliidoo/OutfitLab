import Hero from "./components/landing/Hero";
import Navbar from "./components/landing/Navbar";
import CallToAction from "./components/landing/CallToAction";

function App() {
  const handleLogin = () => {
    alert("Aquí irá tu pantalla de login");
  };

  const handleRegister = () => {
    alert("Aquí irá tu pantalla de registro");
  };

  return (
    <div>
      <Navbar onLogin={handleLogin} onRegister={handleRegister} />
      <Hero />
      <CallToAction />
    </div>
  );
}

export default App;
