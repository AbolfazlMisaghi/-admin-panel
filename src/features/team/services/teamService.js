import api from "../../../common/services/api";

export const getTeam = () => api.get("/team").then((res) => res.data);
export const getTeamMember = (id) =>
  api.get(`/team/${id}`).then((res) => res.data);
export const createTeamMember = (data) =>
  api.post("/team", data).then((res) => res.data);
export const updateTeamMember = (id, data) =>
  api.put(`/team/${id}`, data).then((res) => res.data);
export const deleteTeamMember = (id) =>
  api.delete(`/team/${id}`).then(() => id); // برای حذف از کش
