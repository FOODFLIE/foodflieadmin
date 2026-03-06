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
