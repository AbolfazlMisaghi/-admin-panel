import api from "../../../common/services/api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data; // شامل token و user
};
