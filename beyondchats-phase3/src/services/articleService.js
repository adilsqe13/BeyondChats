import api from "./api";

export const fetchArticles = async (page = 1) => {
  const response = await api.get(`/articles?page=${page}`);
  return response.data.data;
};
