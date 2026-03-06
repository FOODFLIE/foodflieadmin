import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRiderOrders } from "../services/riderServices";
import RiderHeader from "../components/riderHeader";
import OrderCard from "../components/OrderCard";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [riderData, setRiderData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

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

    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getRiderOrders();
      // Filter only delivered orders
      const delivered = data.filter((order) => order.status === "delivered");
      setOrders(
        delivered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        ),
      );
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
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
        status={localStorage.getItem("riderStatus") || "offline"}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/rider-dashboard")}
              className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900">Order History</h2>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full uppercase">
            {orders.length} Delivered
          </span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-300"
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
            <h3 className="text-lg font-bold text-gray-800">No History Yet</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              Orders you deliver will appear here for your records.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
