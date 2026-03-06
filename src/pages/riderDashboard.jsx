import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  updateRiderLocation,
  updateRiderStatus,
  getRiderOrders,
  updateOrderStatus,
} from "../services/riderServices";

// Components
import RiderHeader from "../components/riderHeader";
import StatusToggle from "../components/statusToggle";
import ActiveOrders from "../components/activeOrders";

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [riderData, setRiderData] = useState(null);
  const [status, setStatus] = useState("offline");
  const [updating, setUpdating] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const isOnline = status !== "offline";

  // Auth and Initial Data Load
  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("riderToken");

    if (role !== "rider" || !token) {
      navigate("/");
      return;
    }

    const data = localStorage.getItem("riderData");
    if (data) {
      setRiderData(JSON.parse(data));
    }

    const savedStatus = localStorage.getItem("riderStatus");
    if (savedStatus) {
      setStatus(savedStatus);
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getRiderOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Update rider location every 10 seconds while online
  useEffect(() => {
    if (status === "offline") return;

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          await updateRiderLocation(latitude, longitude);
        } catch (error) {
          console.error("Failed to update location:", error);
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [status]);

  // Poll for new orders every 5 seconds if online
  useEffect(() => {
    if (!isOnline) {
      setOrders([]);
      return;
    }

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const toggleStatus = async () => {
    if (updating) return;

    const newStatus = isOnline ? "offline" : "available";
    setUpdating(true);

    try {
      await updateRiderStatus(newStatus);
      setStatus(newStatus);
      localStorage.setItem("riderStatus", newStatus);
      if (newStatus === "available") {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      if (newStatus === "delivered") {
        setStatus("available");
        localStorage.setItem("riderStatus", "available");
      }
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("riderToken");
    localStorage.removeItem("riderData");
    localStorage.removeItem("riderStatus");
    localStorage.removeItem("role");
    navigate("/");
  };

  if (!riderData) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <RiderHeader
        riderData={riderData}
        status={status}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:px-6 space-y-4">
        <StatusToggle
          status={status}
          isOnline={isOnline}
          updating={updating}
          onToggle={toggleStatus}
        />

        <ActiveOrders
          orders={orders}
          loading={loadingOrders}
          onRefresh={fetchOrders}
          onUpdateStatus={handleStatusUpdate}
        />

        {/* Recent Activity Section (Static/Placeholder) */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1 mt-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Recent Activity
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center min-h-[100px]">
            <p className="text-xs text-gray-400">
              Past orders and updates will appear here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RiderDashboard;
