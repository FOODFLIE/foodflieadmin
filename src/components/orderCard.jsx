import { useState, useEffect } from "react";
import { getFlieOptions } from "../services/flieUtils";

const OrderCard = ({ order, onUpdateStatus }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const options = getFlieOptions();

  useEffect(() => {
    if (order.status === "delivered" || order.status === "cancelled") {
      setTimeLeft(null);
      localStorage.removeItem(`order_deadline_${order.id}`);
      return;
    }

    let deadline;
    const storedDeadline = localStorage.getItem(`order_deadline_${order.id}`);
    
    if (storedDeadline) {
      deadline = parseInt(storedDeadline);
    } else {
      const assignedTime = order.assigned_at
        ? new Date(order.assigned_at).getTime()
        : Date.now();
      const limitMin = options.delivery_time_limit || 30;
      deadline = assignedTime + limitMin * 60 * 1000;
      localStorage.setItem(`order_deadline_${order.id}`, deadline.toString());
    }

    const calculate = () => {
      const now = Date.now();
      const diff = deadline - now;
      setTimeLeft(diff <= 0 ? 0 : diff);
    };

    calculate(); // Set initial value immediately
    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [order.id, order.status, options.delivery_time_limit]);

  const formatTimeLeft = (ms) => {
    if (ms === null) return "";
    if (ms <= 0) return "EXPIRED";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getTimerStyles = (ms) => {
    if (ms === null) return "";
    const minutes = ms / (1000 * 60);
    if (minutes <= 3)
      return "bg-red-100 text-red-600 border-red-200 animate-pulse";
    if (minutes <= 10) return "bg-orange-100 text-orange-600 border-orange-200";
    return "bg-indigo-50 text-indigo-700 border-indigo-100";
  };

  const handleNavigate = () => {
    const isPrePickup = order.status === "assigned";
    const destLat = isPrePickup ? order.partner?.latitude : order.latitude;
    const destLng = isPrePickup ? order.partner?.longitude : order.longitude;

    if (destLat && destLng) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;
      window.open(url, "_blank");
    } else {
      alert(
        `Location coordinates not available for ${isPrePickup ? "store" : "customer"}.`,
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "picked_up":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-3.5 sm:p-4">
        {/* Header: Order ID & Status */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-extrabold text-gray-900 leading-none">
              #{order.id}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(
                order.status,
              )}`}
            >
              {order.status?.replace("_", " ")}
            </span>
          </div>
          <div className="text-right flex items-center space-x-3">
            <span className="text-sm font-extrabold text-gray-900">
              ₹{order.final_amount}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase font-bold">
              {order.payment_method}
            </span>
          </div>
        </div>

        {/* Delivery Timer - Starts from rider assignment */}
        {order.status !== "delivered" && order.status !== "cancelled" && timeLeft !== null && (
          <div className="mb-3 px-1">
            <div
              className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 shadow-sm transition-all duration-300 ${getTimerStyles(
                timeLeft,
              )}`}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[11px] font-black uppercase tracking-wider">
                  Deliver In
                </span>
              </div>
              <span className="text-lg font-black tabular-nums tracking-tighter">
                {formatTimeLeft(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* Compressed Address Timeline */}
        <div className="relative mb-3.5 px-1">
          <div className="absolute left-[11px] top-[10px] bottom-[10px] w-0.5 border-l-2 border-dashed border-gray-200"></div>

          {order.status === "assigned" && order.partner && (
            <div className="relative flex items-start space-x-3 mb-2.5">
              <div className="mt-1 w-4 h-4 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">
                  Pickup • {order.partner.store_name}
                </p>
                <p className="text-xs text-gray-600 font-medium truncate">
                  {order.partner.address}
                </p>
              </div>
            </div>
          )}

          <div className="relative flex items-start space-x-3">
            <div className="mt-1 w-4 h-4 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">
                Drop-off
              </p>
              <p className="text-xs text-gray-700 font-semibold truncate">
                {order.address}
              </p>
            </div>
          </div>
        </div>

        {/* Condensed Items Summary */}
        <div className="mb-4 bg-gray-50/80 rounded-lg px-2.5 py-2 flex items-center justify-between">
          <p className="text-[11px] text-gray-600 font-medium truncate flex-1 mr-2">
            <span className="text-indigo-600 font-bold mr-1.5">
              {order.items?.length || 0} Items:
            </span>
            {order.items?.map((item) => item.item_name).join(", ")}
          </p>
          <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
            {new Date(order.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t border-gray-100 pt-3.5">
          <button
            onClick={handleNavigate}
            title={
              order.status === "assigned"
                ? "Navigate to Store"
                : "Navigate to Drop"
            }
            className="flex items-center justify-center w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors cursor-pointer border border-indigo-100 shrink-0"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </button>

          {order.customer_phone && (
            <a
              href={`tel:${order.customer_phone}`}
              title="Call Customer"
              className="flex items-center justify-center w-10 h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors cursor-pointer border border-emerald-100 shrink-0"
            >
              <svg
                className="w-4.5 h-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          )}

          {order.status === "assigned" && (
            <button
              onClick={() => onUpdateStatus(order.id, "picked_up")}
              className="flex-1 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold h-10 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              Mark Picked Up
            </button>
          )}

          {order.status === "picked_up" && (
            <button
              onClick={() => onUpdateStatus(order.id, "delivered")}
              className="flex-1 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-10 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              Mark Delivered
            </button>
          )}

          {order.status !== "assigned" && order.status !== "picked_up" && (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400 text-xs font-bold h-10 rounded-xl border border-gray-100 italic">
              Order {order.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
