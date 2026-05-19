import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://empire.apphero.agency/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  timeout: 15000,
  withCredentials: false,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop if the refresh endpoint itself returns 401
    if (originalRequest.url?.includes("/admin/refresh")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axiosClient.post("/admin/refresh");
        if (refreshResponse.data?.data?.access_token) {
           localStorage.setItem("access_token", refreshResponse.data.data.access_token);
        }
        return axiosClient(originalRequest);
      } catch (refreshError) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
        return Promise.reject(refreshError);
      }
    }

    console.error("Axios Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default axiosClient;