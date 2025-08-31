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
  dedupingInterval: 2000,
  keepPreviousData: true,
  refreshInterval: 0,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  suspense: false
};

export default instance;