import axios from "axios";
import { toast } from "react-toastify";
import { redirectToLogin } from "./navigation";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Your backend API URL
    withCredentials: true, // Include cookies if using sessions
});

// Axios response interceptor
api.interceptors.response.use(
    (response) => response, // ✅ Pass successful responses
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("authToken");
            toast.error("Session timed-out. Please login again.");
            redirectToLogin();
        }
        return Promise.reject(error);
    }
);

export default api;