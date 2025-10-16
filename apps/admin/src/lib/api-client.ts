import * as ApiClient from '@web-extension-accessibility-frontend/api-client';
import axios, { type AxiosInstance } from 'axios';

type ApiNames<T> = Extract<
  keyof T,
  `${string}Api`
> extends `${infer ApiName}Api`
  ? ApiName
  : never;

type DefaultApiNames = ApiNames<typeof ApiClient>;
type DefaultApis = {
  [ApiName in DefaultApiNames]: InstanceType<
    (typeof ApiClient)[`${ApiName}Api`]
  >;
};

export function getApi(axiosInstance: AxiosInstance) {
  const Default = new Proxy<DefaultApis>({} as DefaultApis, {
    get(_, apiName: DefaultApiNames) {
      const ApiClass = ApiClient[`${apiName}Api`];
      return new ApiClass(undefined, '', axiosInstance);
    },
  });

  return { Default };
}

export function getClientApi() {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://0.0.0.0:8000',
  });

  // Request interceptor to include bearer token
  axiosInstance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle 401 errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return getApi(axiosInstance);
}
