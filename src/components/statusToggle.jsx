import React from "react";

const StatusToggle = ({ status, isOnline, updating, onToggle }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div
          className={`w-3 h-3 rounded-full animate-pulse ${
            status === "available"
              ? "bg-emerald-500"
              : status === "busy"
                ? "bg-amber-500"
                : "bg-gray-400"
          }`}
        ></div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {status === "available"
              ? "You are Available"
              : status === "busy"
                ? "You are Busy"
                : "You are Offline"}
          </h2>
          <p className="text-xs text-gray-500">
            {status === "offline"
              ? "Go online to receive orders"
              : status === "busy"
                ? "Currently delivering an order"
                : "Ready for new orders"}
          </p>
        </div>
      </div>

      <div className="relative flex items-center">
        {updating && (
          <div className="absolute -left-6 z-10 w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        )}
        <button
          onClick={onToggle}
          disabled={updating}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer shadow-inner ${
            isOnline ? "bg-emerald-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 ${
              isOnline ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </section>
  );
};

export default StatusToggle;
