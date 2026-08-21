import axios from "axios";

// Read API base URL from Vite environment variables, defaulting to local backend for development
const rawApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Clean trailing slashes and ensure uniform /api/v1 prefix
const cleanApiUrl = rawApiUrl.replace(/\/+$/, "");
const baseURL = cleanApiUrl.endsWith("/api/v1")
    ? cleanApiUrl
    : `${cleanApiUrl}/api/v1`;

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export default apiClient;