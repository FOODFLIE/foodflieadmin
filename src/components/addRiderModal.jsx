import React from "react";

const AddRiderModal = ({
  show,
  onClose,
  formData,
  formErrors,
  submitting,
  error,
  success,
  onSubmit,
  onChange,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Add New Rider</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Fill in the details to register a new delivery rider
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-gray-600 cursor-pointer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center space-x-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center space-x-2">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g. Nandu Boda"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${formErrors.name ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-transparent"}`}
            />
            {formErrors.name && (
              <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="+919381972536"
              className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${formErrors.phone ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-transparent"}`}
            />
            {formErrors.phone && (
              <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
            )}
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={onChange}
                placeholder="ENTER USERNAME"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${formErrors.username ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-transparent"}`}
              />
              {formErrors.username && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.username}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="••••••"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${formErrors.password ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-transparent"}`}
              />
              {formErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Vehicle Type & Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vehicle Type
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={onChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
              >
                <option value="bike">🏍️ Bike</option>
                <option value="car">🚗 Car</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Vehicle Number
              </label>
              <input
                type="text"
                name="vehicle_number"
                value={formData.vehicle_number}
                onChange={onChange}
                placeholder="AP40AW0954"
                className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${formErrors.vehicle_number ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500 focus:border-transparent"}`}
              />
              {formErrors.vehicle_number && (
                <p className="text-xs text-red-500 mt-1">
                  {formErrors.vehicle_number}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding Rider...</span>
                </>
              ) : (
                <>
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Add Rider</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRiderModal;
