import React from "react";
import OrderCard from "./orderCard";

const ActiveOrders = ({ orders, loading, onRefresh, onUpdateStatus }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Active Orders
        </h3>
        <button
          onClick={onRefresh}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1"
        >
          <svg
            className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center min-h-[160px] border-dashed border-2">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            No active orders yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            When an order is assigned to you, it will appear here.
          </p>
        </div>
      )}
    </section>
  );
};

export default ActiveOrders;
