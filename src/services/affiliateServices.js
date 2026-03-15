import apiClient from "./apiClient";

export const getAffiliates = async () => {
  const response = await apiClient.get("/api/admin/affiliates");
  return response.data;
};

export const addAffiliate = async (affiliateData) => {
  const response = await apiClient.post("/api/admin/affiliates/add", affiliateData);
  return response.data;
};

export const getAffiliateById = async (id) => {
  const response = await apiClient.get(`/api/admin/affiliates/${id}`);
  return response.data;
};

export const updateAffiliate = async (id, updateData) => {
  const response = await apiClient.put(`/api/admin/affiliates/${id}`, updateData);
  return response.data;
};

export const deleteAffiliate = async (id) => {
  const response = await apiClient.delete(`/api/admin/affiliates/${id}`);
  return response.data;
};
