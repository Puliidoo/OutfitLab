import { useState } from "react";
import Hero from "./components/landing/Hero";
import Navbar from "./components/landing/Navbar";
import CallToAction from "./components/landing/CallToAction";
import Register from "./components/Register";
import Profile from "./components/Profile";

function App() {
  const [screen, setScreen] = useState("home");
  const [user, setUser] = useState(null);

  const handleRegister = () => setScreen("register");
  const handleBack = () => setScreen("home");

  const handleProfile = (userData) => {
    setUser(userData);
    setScreen("profile");
  };

  return (
    <div>
      {screen === "home" && (
        <>
          <Navbar onRegister={handleRegister} />
          <Hero />
          <CallToAction />
        </>
      )}

      {screen === "register" && (
        <Register
          onBack={handleBack}
          onSubmit={handleProfile}
        />
      )}

      {screen === "profile" && (
        <Profile user={user} onBack={handleBack} />
      )}
    </div>
  );
}

export default App;
