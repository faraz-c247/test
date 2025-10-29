import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_REST_API_ENDPOINT || "http://localhost:8000/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("auth-token");

      // Fallback to sessionStorage
      if (!token) {
        token = sessionStorage.getItem("auth-token") || null;
      }

      // Fallback to NextAuth session (async) if still missing
      if (!token) {
        try {
          const { getSession } = await import("next-auth/react");
          const session = await getSession();
          const backendToken = (session as any)?.backendToken as
            | string
            | undefined;
          if (backendToken) {
            token = backendToken;
            // Cache for subsequent requests
            localStorage.setItem("auth-token", backendToken);
          }
        } catch (_e) {
          // ignore, we'll proceed without token
        }
      }

      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }

    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("❌ Response error:", error.message || "Unknown error");

    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
