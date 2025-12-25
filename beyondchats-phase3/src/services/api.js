import axios from "axios";

const api = axios.create({
  baseURL: 'https://beyondchats.up.railway.app/api',
});

export default api;
