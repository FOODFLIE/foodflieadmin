import React from "react";

const RiderHeader = ({ riderData, status, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${
              status === "available"
                ? "bg-emerald-500"
                : status === "busy"
                  ? "bg-amber-500"
                  : "bg-gray-400"
            }`}
          >
            {riderData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">
              {riderData.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">FoodFlie Rider</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg cursor-pointer"
          title="Logout"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default RiderHeader;
