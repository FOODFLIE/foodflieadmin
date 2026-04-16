import apiClient from "./apiClient";


export const getCoupons = async () => {
  const response = await apiClient.get("/api/admin/coupons");
  return response.data.coupons;
};

export const createCoupon = async (couponData) => {
  const response = await apiClient.post("/api/admin/coupons/add", couponData);
  return response.data;
};

export const updateCoupon = async (id, couponData) => {
  const response = await apiClient.put(`/api/admin/coupons/${id}`, couponData);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await apiClient.delete(`/api/admin/coupons/${id}`);
  return response.data;
};
