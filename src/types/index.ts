import type { Method, AxiosRequestHeaders, AxiosRequestConfig, AxiosResponseHeaders } from "axios";

export interface HttpClientRequestConfig extends AxiosRequestConfig {
  useFormData?: Boolean;
  showSuccessMessage?: Boolean;
  showErrorMessage?: Boolean;
  repeatReq?: Boolean;
}

export interface HttpClientResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: HttpClientRequestConfig;
  request?: any;
}

export type RequestBeforeHook = (config: HttpClientRequestConfig) => void;

export type ResponseAfterHook = (option: HttpClientResponse) => Promise<any>;

export type ShowMessage = (options: { code: number; message: string }) => void;

export type ErrorCallback = (data: any) => void;

export type HttpClientConfig = {
  baseURL?: string;
  timeout?: number;
  method?: Method;
  headers?: AxiosRequestHeaders;
  requestBeforeHook?: RequestBeforeHook;
  responseAfterHook?: ResponseAfterHook;
  showMessage?: ShowMessage;
  errorCallback?: ErrorCallback;
};

export type ProxyConfig = {
  code?: string;
  data?: string;
  message?: string;
  successCode?: number | number[];
};
