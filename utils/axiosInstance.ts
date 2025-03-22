import axios from "axios";
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { API_BASE_URL } = publicRuntimeConfig

// Store the access token in memory
let accessToken: string | null = null;

// Track whether a token refresh is in progress
let isRefreshing = false;

// Array to hold callbacks waiting for the token refresh to complete
let refreshSubscribers: (() => void)[] = [];

/**
 * Executes all queued callbacks after the access token is refreshed.
 */
function onRefreshed(): void {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = []; // Clear the subscribers after notifying them
}

/**
 * Adds a callback to be executed once the access token is refreshed.
 * @param callback - A function to be executed after the token is refreshed
 */
function addRefreshSubscriber(callback: () => void): void {
  refreshSubscribers.push(callback);
}

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  withCredentials: true, // Ensure cookies are included in requests
});

// Interceptor for adding Authorization header
apiClient.interceptors.request.use(
  (config) => {
  if (accessToken && config.headers) {
    if (config.url === '/login' || config.url === '/register') {
      return Promise.reject('You are already logged in')
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error)
});

// Interceptor for refreshing access token on 401 responses
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses through
  
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; //mark the request as retried

      // Check if a refresh is already in progress
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Attempt to refresh tokens
          await apiClient.post('/refresh-token'); // Refresh tokens

          // Notify subscribers that the tokens have been refreshed
          onRefreshed();
          isRefreshing = false;

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;