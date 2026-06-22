import api from "../../../common/services/api";

export const getStats = () => api.get("/stats").then((res) => res.data);
