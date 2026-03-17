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
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Delivered
            </p>
            <p className="text-2xl font-black text-gray-900">
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Total Earnings
            </p>
            <p className="text-2xl font-black text-emerald-600">
              ₹
              {orders
                .filter((o) => o.status === "delivered")
                .reduce((sum, o) => sum + parseFloat(o.final_amount || 0), 0)
                .toFixed(0)}
            </p>
          </div>
        </div>

        <StatusToggle
          status={status}
          isOnline={isOnline}
          updating={updating}
          onToggle={toggleStatus}
        />

        <ActiveOrders
          orders={orders.filter((o) => o.status !== "delivered")}
          loading={loadingOrders}
          onRefresh={fetchOrders}
          onUpdateStatus={handleStatusUpdate}
        />

        {/* Recent Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1 mt-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Recent Activity
            </h3>
            <button
              onClick={() => navigate("/order-history")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              View All History
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div
              onClick={() =>navigate("/order-history") }
              >
                <p className="text-sm font-bold text-gray-800">Order History</p>
                <p className="text-[10px] text-gray-400 font-medium">
                  View your past successful deliveries
                </p>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RiderDashboard;
