/**
 * axios setup to use mock service
 */

import axios from "axios";

import { dispatch } from "@/store";
import { hideLoading, showLoading } from "@/store/slices/loadingSlice";

const item_axios: any = {
  baseURL: import.meta.env.VITE_BACKEND_URI as string,
  timeout: 100000
};
const axiosServices = axios.create(item_axios);

let requestCount: number | 0 = 0;
function decreaseRequestCount(): void {
  requestCount = requestCount - 1;
  if (requestCount === 0) {
    dispatch(hideLoading());
  }
}
// interceptor for http
axiosServices.interceptors.request.use(
  (config: any) => {
    const accessToken: string = window.localStorage.getItem("access_token") as string;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.headers.isShowLoading) {
      requestCount++;
      dispatch(showLoading());
    }
    return config;
  },
  (err: any) => {
    if (err.config.headers.isShowLoading) {
      decreaseRequestCount();
    }
    return Promise.reject(err.response);
  }
);
axiosServices.interceptors.response.use(
  (res: any) => {
    if (res.config.headers.isShowLoading) {
      decreaseRequestCount();
    }
    return res;
  },
  (err: any) => {
    if (err.config.headers.isShowLoading) {
      decreaseRequestCount();
    }
    if (err.response?.status === 401) {
      window.localStorage.removeItem("access_token");
    }
    return Promise.reject(err.response);
  }
);

export default axiosServices;
