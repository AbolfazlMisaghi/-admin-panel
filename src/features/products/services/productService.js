import api from "../../../common/services/api";

export const getProducts = () => api.get("/products").then((res) => res.data);
export const getProduct = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);
export const createProduct = (data) =>
  api.post("/products", data).then((res) => res.data);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((res) => res.data);
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then(() => id);
