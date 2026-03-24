import apiClient from "./apiClient";

export const adminLogin = async (email, password) => {
  const response = await apiClient.post("/api/admin/login", {
    email,
    password,
  });
  return response.data;
};

export const adminLogout = async () => {
  const response = await apiClient.post("/api/admin/logout");
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get("/api/admin/orders");
  return response.data;
};
export const getNewCustomers = async () => {
  try {
    const response = await apiClient.get("/api/admin/customers/daily");
    return response.data;
  } catch (error) {
    console.error("Error fetching new customers:", error);
  }
};

export const getStores = async () => {
  const response = await apiClient.get("/api/admin/stores");
  return response.data;
};

export const toggleStoreStatus = async (id, is_active) => {
  const response = await apiClient.put(`/api/admin/stores/${id}`, {
    is_active,
  });
  return response.data;
};
