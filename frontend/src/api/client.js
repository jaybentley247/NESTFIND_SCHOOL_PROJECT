import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const REFRESH_TOKEN_KEY = "nestfind_refresh_token";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Access token lives in memory only (never persisted) so it can't be read
// by an injected script. Refresh token goes in localStorage — PRD page 9
// explicitly allows "an httpOnly cookie or secure storage"; httpOnly would
// need the backend to set cookies itself, which stock Simple JWT doesn't do,
// so this project uses the PRD's sanctioned "secure storage" alternative.
let accessToken = null;
let onAuthFailure = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function setRefreshToken(token) {
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// AuthContext registers a callback here so the interceptor can clear user
// state when even the refresh token has expired (PRD page 9: "force logout
// only if refresh also fails").
export function setOnAuthFailure(callback) {
  onAuthFailure = callback;
}

client.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const AUTH_ENDPOINTS = ["/auth/login/", "/auth/register/", "/auth/refresh/"];

let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    refreshPromise = axios
      .post(`${BASE_URL}/auth/refresh/`, { refresh: refreshToken })
      .then(({ data }) => {
        setAccessToken(data.access);
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthEndpoint = config && AUTH_ENDPOINTS.some((path) => config.url?.includes(path));

    if (response?.status === 401 && !isAuthEndpoint && !config._retried && getRefreshToken()) {
      config._retried = true;
      try {
        const newAccessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return client(config);
      } catch {
        setAccessToken(null);
        setRefreshToken(null);
        onAuthFailure?.();
      }
    }

    return Promise.reject(error);
  },
);

export default client;
