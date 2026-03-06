import React from "react";

const RiderStats = ({ riders }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Total Riders</p>
        <p className="text-xl font-bold text-gray-900">{riders.length}</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Online</p>
        <p className="text-xl font-bold text-emerald-600">
          {riders.filter((r) => r.status === "online").length}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Offline</p>
        <p className="text-xl font-bold text-gray-500">
          {riders.filter((r) => r.status === "offline").length}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Active</p>
        <p className="text-xl font-bold text-indigo-600">
          {riders.filter((r) => r.is_active).length}
        </p>
      </div>
    </div>
  );
};

export default RiderStats;
