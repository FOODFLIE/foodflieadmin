import { useState, useEffect } from "react";
import { getRiders, addRider } from "../services/riderServices";

// Components
import RiderStats from "../components/riderStats";
import RiderTable from "../components/riderTable";
import AddRiderModal from "../components/addRiderModal";

const Riders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    username: "",
    password: "",
    vehicle_type: "bike",
    vehicle_number: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchRiders();
  }, []);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const data = await getRiders();
      setRiders(data.riders || []);
    } catch (err) {
      console.error("Failed to fetch riders:", err);
      setError("Failed to load riders");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^\+\d{10,15}$/.test(formData.phone.trim()))
      errors.phone = "Enter a valid phone (e.g. +919381972536)";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Minimum 6 characters";
    if (!formData.vehicle_number.trim())
      errors.vehicle_number = "Vehicle number is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError("");
    try {
      await addRider(formData);
      setSuccess("Rider added successfully!");
      setFormData({
        name: "",
        phone: "",
        username: "",
        password: "",
        vehicle_type: "bike",
        vehicle_number: "",
      });
      setFormErrors({});
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 1200);
      fetchRiders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add rider");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const filteredRiders = riders.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Riders
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your delivery riders
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError("");
            setSuccess("");
          }}
          className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 cursor-pointer"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add Rider</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search riders by name, phone, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <RiderStats riders={riders} />

      <RiderTable
        riders={filteredRiders}
        loading={loading}
        searchQuery={searchQuery}
      />

      <AddRiderModal
        show={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        formErrors={formErrors}
        submitting={submitting}
        error={error}
        success={success}
        onSubmit={handleSubmit}
        onChange={handleChange}
      />
    </div>
  );
};

export default Riders;
