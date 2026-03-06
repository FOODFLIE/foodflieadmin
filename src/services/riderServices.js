import apiClient from "./apiClient";

export const getRiders = async () => {
  const response = await apiClient.get("/api/admin/riders");
  return response.data;
};

export const addRider = async (riderData) => {
  const response = await apiClient.post("/api/admin/riders/add", riderData);
  return response.data;
};

export const riderLogin = async (username, password) => {
  const response = await apiClient.post("/api/rider/login", {
    username,
    password,
  });
  return response.data;
};

export const updateRiderStatus = async (status) => {
  const response = await apiClient.put("/api/rider/status", { status });
  return response.data;
};

export const updateRiderLocation = async (latitude, longitude) => {
  const response = await apiClient.post("/api/rider/location", {
    latitude,
    longitude,
  });
  return response.data;
};

export const getRiderOrders = async () => {
  const response = await apiClient.get("/api/rider/orders");
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await apiClient.put("/api/rider/orders/status", {
    order_id: orderId,
    status,
  });
  return response.data;
};
