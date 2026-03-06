import React from "react";

const OrderCard = ({ order, onUpdateStatus }) => {
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
      <div className="p-4 sm:p-5">
        {/* Header: Order ID & Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-gray-900">
                Order #{order.id}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status?.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {new Date(order.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-base font-extrabold text-gray-900">
              ₹{order.final_amount}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 uppercase font-bold mt-1">
              {order.payment_method} • {order.payment_status}
            </span>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-2 mb-4">
          {order.status === "assigned" && order.partner && (
            <div className="bg-orange-50 rounded-xl p-3 flex items-start space-x-3 border border-orange-100">
              <div className="bg-white p-1.5 rounded-lg shadow-sm border border-orange-100">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-orange-600 uppercase mb-0.5">
                  Pickup: {order.partner.store_name}
                </p>
                <p className="text-xs text-gray-800 leading-relaxed font-medium line-clamp-2">
                  {order.partner.address}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-3 flex items-start space-x-3 border border-gray-100">
            <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-100">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-indigo-600 uppercase mb-0.5">
                Drop-off
              </p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-3">
                {order.address}
              </p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="mb-5 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Order Items
          </p>
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center text-sm bg-gray-50/50 px-2 py-1.5 rounded-lg"
            >
              <span className="text-gray-800 font-medium flex items-center text-xs">
                <span className="w-1 h-1 rounded-full bg-indigo-400 mr-2.5"></span>
                {item.item_name}
              </span>
              <span className="text-gray-900 font-bold text-xs">
                ₹{item.total_price}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={handleNavigate}
            title={
              order.status === "assigned"
                ? "Navigate to Store"
                : "Navigate to Drop"
            }
            className="flex items-center justify-center w-11 h-11 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors cursor-pointer border border-indigo-100 shrink-0"
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
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </button>

          {order.customer_phone && (
            <a
              href={`tel:${order.customer_phone}`}
              title="Call Customer"
              className="flex items-center justify-center w-11 h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors cursor-pointer border border-emerald-100 shrink-0"
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          )}

          {order.status === "assigned" && (
            <button
              onClick={() => onUpdateStatus(order.id, "picked_up")}
              className="flex-1 flex items-center justify-center bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold h-11 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]"
            >
              Mark Picked Up
            </button>
          )}

          {order.status === "picked_up" && (
            <button
              onClick={() => onUpdateStatus(order.id, "delivered")}
              className="flex-1 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold h-11 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-[0.98]"
            >
              Mark Delivered
            </button>
          )}

          {order.status !== "assigned" && order.status !== "picked_up" && (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500 text-sm font-bold h-11 rounded-xl border border-gray-100 cursor-not-allowed">
              {order.status === "delivered" ? "Delivered" : "Completed"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
