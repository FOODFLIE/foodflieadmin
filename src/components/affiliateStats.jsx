import React from "react";

const AffiliateStats = ({ affiliates }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Total Affiliates</p>
        <p className="text-xl font-bold text-gray-900">{affiliates.length}</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Active</p>
        <p className="text-xl font-bold text-emerald-600">
          {affiliates.filter((a) => a.is_active).length}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Inactive</p>
        <p className="text-xl font-bold text-gray-500">
          {affiliates.filter((a) => !a.is_active).length}
        </p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Agencies</p>
        <p className="text-xl font-bold text-indigo-600">
          {affiliates.filter((a) => a.type === "agency").length}
        </p>
      </div>
    </div>
  );
};

export default AffiliateStats;
