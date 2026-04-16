import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import RiderDashboard from "./pages/riderDashboard";
import OrderHistory from "./pages/orderHistory";
import Coupons from "./pages/coupons";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/rider-dashboard" element={<RiderDashboard />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/coupons" element={<Coupons />} />
    </Routes>
  );
};

export default App;
