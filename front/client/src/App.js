import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Profil from "./pages/Profil";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="*" element={<Navigate to="/" replace />} />{" "}
    </Routes>
  );
};

export default App;
