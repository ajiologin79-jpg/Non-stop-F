import axios from "axios";

const api = axios.create({
  baseURL: "https://non-stop-b-production.up.railway.app"
});

export default api;