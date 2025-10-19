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
    baseURL: process.env.VITE_API_BASE_URL,
  });

  return getApi(axiosInstance);
}
