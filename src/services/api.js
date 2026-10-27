import axios from "axios";

const api = axios.create({ baseURL: "https://localhost:3006" });

export default api;