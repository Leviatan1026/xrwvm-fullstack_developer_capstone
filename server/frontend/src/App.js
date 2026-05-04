import React from "react";
import { Routes, Route } from "react-router-dom";

//  IMPORTS
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";

// (si tienes Home en React lo importas, si no Django lo maneja)
// import Home from "./components/Home/Home";

function App() {
  return (
    <Routes>

      {/* 🔥 LOGIN */}
      <Route path="/login" element={<LoginPanel />} />

      {/* 🔥 REGISTER */}
      <Route path="/register" element={<Register />} />

    </Routes>
  );
}

export default App;