import api from "../../../common/services/api";

export const getArticles = () => api.get("/articles").then((res) => res.data);
export const getArticle = (id) =>
  api.get(`/articles/${id}`).then((res) => res.data);
export const createArticle = (data) =>
  api.post("/articles", data).then((res) => res.data);
export const updateArticle = (id, data) =>
  api.put(`/articles/${id}`, data).then((res) => res.data);
export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`).then(() => id);
