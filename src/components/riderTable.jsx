import React from "react";

const RiderTable = ({ riders, loading, searchQuery }) => {
  const statusColors = {
    online: "bg-emerald-100 text-emerald-700",
    offline: "bg-gray-100 text-gray-600",
    busy: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : riders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-gray-500 text-sm">
            {searchQuery ? "No riders match your search" : "No riders found"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rider
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {riders.map((rider) => (
                <tr
                  key={rider.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {rider.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {rider.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{rider.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700">
                    {rider.phone}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-base">
                        {rider.vehicle_type === "bike" ? "🏍️" : "🚗"}
                      </span>
                      <span className="text-sm text-gray-700 font-mono">
                        {rider.vehicle_number}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[rider.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${rider.status === "online" ? "bg-emerald-500" : rider.status === "busy" ? "bg-amber-500" : "bg-gray-400"}`}
                      ></span>
                      {rider.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500">
                    {new Date(rider.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RiderTable;
