import { Routes, Route } from "react-router-dom";

import Hero from "./components/landing/Hero";
import Navbar from "./components/landing/Navbar";
import CallToAction from "./components/landing/CallToAction";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ← AÑADIDO

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <CallToAction />
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} /> {/* ← AÑADIDO */}
      </Routes>
    </div>
  );
}

export default App;
