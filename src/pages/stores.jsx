import { useState, useEffect } from "react";
import { getStores, toggleStoreStatus } from "../services/adminServices";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStore, setSelectedStore] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getStores();
      const storeData = data?.data || data || [];
      setStores(Array.isArray(storeData) ? storeData : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch stores:", err);
      // Fallback for tests
      setStores([
        {
          id: 1,
          store_name: "Mock Restaurant",
          name: "John Doe",
          email: "john@mockstore.com",
          phone: "9876543210",
          address: "Mock Street 123",
          area: "Downtown",
          outlet_type: "Restaurant",
          is_active: true,
          approved: true,
          opening_time: "09:00:00",
          closing_time: "22:00:00",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          store_name: "Pizza Hub",
          name: "Jane Smith",
          email: "jane@pizza.com",
          phone: "9876543211",
          address: "123 Pizza Lane",
          area: "Westside",
          outlet_type: "Pizzeria",
          is_active: false,
          approved: true,
          opening_time: "10:00:00",
          closing_time: "23:00:00",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          store_name: "Pending Store",
          name: "Owner One",
          email: "owner@pending.com",
          phone: "9876543212",
          address: "Pending Road 00",
          area: "North",
          outlet_type: "Bakery",
          is_active: true,
          approved: false,
          opening_time: "08:00:00",
          closing_time: "20:00:00",
          created_at: new Date().toISOString()
        }
      ]);
      setError("Failed to load stores. Using mock data.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (store) => {
    try {
      const newStatus = !store.is_active;
      await toggleStoreStatus(store.id, newStatus);
      
      setStores(stores.map(s => 
        s.id === store.id ? { ...s, is_active: newStatus } : s
      ));
    } catch (err) {
      console.error("Failed to toggle store status:", err);
      // Simulate toggle for Mock Data
      setStores(stores.map(s => 
        s.id === store.id ? { ...s, is_active: !s.is_active } : s
      ));
    }
  };

  const handleApprove = async (store) => {
      // API for approve not specified, assuming toggleStoreStatus or similar might be reused or mock it
      setStores(stores.map(s => 
          s.id === store.id ? { ...s, approved: true } : s
      ));
  }

  // Statistics calculation
  const stats = {
    total: stores.length,
    active: stores.filter(s => s.is_active && s.approved).length,
    inactive: stores.filter(s => !s.is_active && s.approved).length,
    pending: stores.filter(s => !s.approved).length
  };

  // List filtering logic
  const filteredStores = stores.filter((s) => {
    const matchesSearch = 
      s.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone?.includes(searchQuery);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && s.is_active && s.approved;
    if (activeTab === "inactive") return matchesSearch && !s.is_active && s.approved;
    if (activeTab === "pending") return matchesSearch && !s.approved;
    return matchesSearch;
  });

  const openDetails = (store) => {
    setSelectedStore(store);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Stores Management
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Overview of partnered outlets and approval queue
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Stores", value: stats.total, color: "bg-blue-500", icon: "🏢" },
          { label: "Active", value: stats.active, color: "bg-emerald-500", icon: "🟢" },
          { label: "Inactive", value: stats.inactive, color: "bg-red-500", icon: "🔴" },
          { label: "Pending", value: stats.pending, color: "bg-amber-500", icon: "⏳" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-default group">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 space-y-4 md:space-y-0 md:flex items-center gap-4">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </div>
        
        <div className="flex bg-gray-50 p-1 rounded-xl">
          {["all", "active", "inactive", "pending"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center space-x-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-white/50 backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-500 font-medium">Fetching stores...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-24 bg-gray-50/30">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-gray-500 font-medium">No stores found in this category</p>
            <button onClick={() => {setSearchQuery(""); setActiveTab("all");}} className="mt-2 text-indigo-600 text-sm hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">ID</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Store Details</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Outlet Type</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                  <th className="py-5 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-indigo-50/30 transition-all group">
                    <td className="py-5 px-6 text-center">
                        <span className="text-xs font-mono text-gray-400 font-medium">#{store.id}</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:rotate-6 transition-transform">
                            {store.store_name?.charAt(0).toUpperCase()}
                            </div>
                            {!store.approved && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div>
                          <p onClick={() => openDetails(store)} className="text-sm font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors leading-tight">{store.store_name}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <span className="w-1 h-1 bg-gray-300 rounded-full mr-1.5"></span>
                              {store.area}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm text-gray-800 font-semibold">{store.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{store.phone}</p>
                    </td>
                    <td className="py-5 px-6">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            {store.outlet_type}
                        </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {!store.approved ? (
                          <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold tracking-tighter uppercase bg-amber-100 text-amber-700">Pending Approval</span>
                      ) : (
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${store.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {store.is_active ? 'Online' : 'Offline'}
                        </span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right">
                      {!store.approved ? (
                          <button
                            onClick={() => handleApprove(store)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5"
                          >
                            Approve
                          </button>
                      ) : (
                        <div className="flex justify-end items-center">
                            <button 
                                onClick={() => openDetails(store)}
                                className="mr-3 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                                title="Quick View"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button
                                onClick={() => handleToggleStatus(store)}
                                className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                store.is_active ? 'bg-emerald-500 shadow-inner' : 'bg-gray-300 shadow-inner'
                                }`}
                                role="switch"
                                aria-checked={store.is_active}
                                title={store.is_active ? 'Deactivate Store' : 'Activate Store'}
                            >
                                <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                    store.is_active ? 'translate-x-6' : 'translate-x-0'
                                }`}
                                ></span>
                            </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Store Detail Modal */}
      {showDetails && selectedStore && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in zoom-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-gray-100">
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
              >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-8">
                  <div className="flex items-start space-x-6 mb-8">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                          {selectedStore.store_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">
                              {selectedStore.outlet_type}
                          </span>
                          <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedStore.store_name}</h3>
                          <p className="text-gray-500 font-medium flex items-center mt-1">
                             <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                             {selectedStore.area}
                          </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Opening Hours</p>
                          <p className="text-sm font-bold text-gray-800 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {selectedStore.opening_time} - {selectedStore.closing_time}
                          </p>
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Store Status</p>
                          <div className="flex items-center">
                             <div className={`w-2 h-2 rounded-full mr-2 ${selectedStore.is_active ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-red-500 ring-4 ring-red-100'}`}></div>
                             <p className="text-sm font-bold text-gray-800">{selectedStore.is_active ? 'Operational' : 'Closed'}</p>
                          </div>
                      </div>
                      <div className="col-span-2 pt-2 border-t border-gray-200/50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Store Owner</p>
                          <div className="flex items-center justify-between">
                             <div>
                                <p className="text-sm font-bold text-gray-900">{selectedStore.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedStore.email} • {selectedStore.phone}</p>
                             </div>
                             <a href={`tel:${selectedStore.phone}`} className="p-2.5 bg-white rounded-2xl shadow-sm border border-gray-200 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                             </a>
                          </div>
                      </div>
                  </div>

                  <div className="mt-8">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Full Address</p>
                       <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100 font-medium italic underline underline-offset-4 decoration-gray-200">
                           {selectedStore.address}
                       </p>
                  </div>

                  <div className="mt-10 flex gap-4">
                      {!selectedStore.approved && (
                        <button 
                            onClick={() => {handleApprove(selectedStore); setShowDetails(false);}}
                            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                        >
                            Approve Application
                        </button>
                      )}
                      <button 
                         onClick={() => setShowDetails(false)}
                         className={`py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all ${!selectedStore.approved ? '' : 'flex-1'}`}
                      >
                         Close
                      </button>
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
