import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.code === "TOKEN_EXPIRED"
    ) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return API(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};

export const refreshToken = async () => {
  const response = await API.post("/auth/refresh-token");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.post("/auth/me");
  return response.data;
};

export const getGoogleAuthUrl = async () => {
  return `${API.defaults.baseURL}/auth/google`;
};

export const getGithubAuthUrl = async () => {
  return `${API.defaults.baseURL}/auth/github`;
};

export default API;
