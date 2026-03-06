import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import RiderDashboard from "./pages/riderDashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rider-dashboard" element={<RiderDashboard />} />
    </Routes>
  );
};

export default App;
