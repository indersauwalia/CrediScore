import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
    throw new Error("VITE_API_URL is not defined");
}

const api = axios.create({
    baseURL: BASE_URL + "/api",
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.replace("/login");
        }
        return Promise.reject(error);
    }
);

export default api;