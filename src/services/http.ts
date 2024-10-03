import { Query } from '@/types/query';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      UserInfo: `${localStorage.getItem("user_info") || ""}`,
    },
  });

  return instance;
};


const instance = createAxiosInstance();

const Http = (axios: AxiosInstance) => {
  return {
    get: (url: string, query?: Query, config: AxiosRequestConfig = {}) => {
      let urlAdd = '';
      if (query) {
        for (const key in query) {
          if (key) {
            urlAdd += `&${key}=${query[key]}`;
          }
        }
      }
      if (urlAdd) {
        url += urlAdd.replace('&', '?');
      }
      return axios.get(url, config);
    },

    post: (url: string, body: unknown, config: AxiosRequestConfig = {}) => {
      return axios.post(url, body, config);
    },

    delete: (url: string, config: AxiosRequestConfig = {}) => {
      return axios.delete(url, config);
    },

    put: (url: string, body: unknown, config: AxiosRequestConfig = {}) => {
      return axios.put(url, body, config);
    },

    patch: (url: string, body: unknown = {}, config: AxiosRequestConfig = {}) => {
      return axios.patch(url, body, config);
    },

  };
};

const Axios = Http(instance);

export { Axios };
