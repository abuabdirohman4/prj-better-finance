import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

// SWR Configuration - Only serializable values
export const swrConfig = {
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // Reduced from 2000 to 5000ms
  keepPreviousData: true,
  refreshInterval: 10000, // Auto-refresh every 10 seconds
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  suspense: false
};

export default instance;