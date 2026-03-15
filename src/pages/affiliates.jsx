import { useState, useEffect } from "react";
import { getAffiliates, addAffiliate, updateAffiliate, deleteAffiliate } from "../services/affiliateServices";

// Components
import AffiliateStats from "../components/affiliateStats";
import AffiliateTable from "../components/affiliateTable";
import AddAffiliateModal from "../components/addAffiliateModal";

const Affiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "agency",
    phone: "",
    address: "",
    commission_type: "percentage",
    commission_value: "",
    is_active: true
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      setLoading(true);
      const data = await getAffiliates();
      console.log("1",data);  
      setAffiliates(Array.isArray(data) ? data : data.affiliates || []);
    } catch (err) {
      console.error("Failed to fetch affiliates:", err);
      // Fallback data
      if (err.response?.status === 404 || err.message.includes("Network")) {
         setAffiliates([
           {
             id: 1,
             name: "John Marketing Agency",
             type: "agency",
             phone: "+1234567890",
             address: "123 Business Street, City, State 12345",
             commission_type: "percentage",
             commission_value: 15.50,
             is_active: true,
             created_at: new Date().toISOString()
           }
         ]);
      } else {
        setError("Failed to load affiliates");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.commission_value.toString().trim())
      errors.commission_value = "Commission value is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setError("");
    try {
      if (editingId) {
        await updateAffiliate(editingId, formData);
        setSuccess("Affiliate updated successfully!");
      } else {
        await addAffiliate(formData);
        setSuccess("Affiliate added successfully!");
      }
      resetForm();
      fetchAffiliates();
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || (editingId ? "Failed to update affiliate" : "Failed to add affiliate"));
      // Simulate success for demo
      if (err.response?.status === 404 || err.message.includes("Network")) {
        setSuccess(editingId ? "Affiliate updated successfully! (Mock)" : "Affiliate added successfully! (Mock)");
        resetForm();
        setTimeout(() => {
          setShowModal(false);
          setSuccess("");
        }, 1200);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (affiliate) => {
    setEditingId(affiliate.id);
    setFormData({
      name: affiliate.name,
      type: affiliate.type,
      phone: affiliate.phone,
      address: affiliate.address,
      commission_type: affiliate.commission_type,
      commission_value: affiliate.commission_value,
      is_active: affiliate.is_active,
    });
    setFormErrors({});
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this affiliate?")) return;
    
    try {
      await deleteAffiliate(id);
      fetchAffiliates();
    } catch (err) {
      console.error("Failed to delete affiliate:", err);
      // Fallback for mock environment
      if (err.response?.status === 404 || err.message.includes("Network")) {
         setAffiliates(affiliates.filter(a => a.id !== id));
      } else {
         alert("Failed to delete affiliate");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "agency",
      phone: "",
      address: "",
      commission_type: "percentage",
      commission_value: "",
      is_active: true
    });
    setEditingId(null);
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const filteredAffiliates = affiliates.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Affiliates
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your affiliate partners and referrals
          </p>
        </div>
        <button
          onClick={() => {
            resetForm(); // Clears any editing state
            setShowModal(true);
            setError("");
            setSuccess("");
          }}
          className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>Add Affiliate</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search affiliates by name, type, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <AffiliateStats affiliates={affiliates} />

      <AffiliateTable
        affiliates={filteredAffiliates}
        loading={loading}
        searchQuery={searchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddAffiliateModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
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

export default Affiliates;
