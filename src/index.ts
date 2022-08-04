import qs from "qs";
import { omitBy, isUndefined, isArrayBuffer } from "./utils/lodashChunk";
import axios, { AxiosInstance, Method, AxiosRequestHeaders } from "axios";

import type {
  HttpClientConfig,
  ProxyConfig,
  RequestBeforeHook,
  ResponseAfterHook,
  ShowMessage,
  ErrorCallback,
  HttpClientRequestConfig,
  HttpClientResponse,
} from "./types/index";

class HttpClient {
  baseURL: string;
  timeout: number;
  method?: Method;
  headers?: AxiosRequestHeaders;
  requestBeforeHook?: RequestBeforeHook;
  responseAfterHook?: ResponseAfterHook;
  showMessage?: ShowMessage;
  errorCallback?: ErrorCallback;
  proxyConfig: { code: string; data: string; message: string };
  pendingMap: any;
  successCode: number[];

  constructor(config: HttpClientConfig = {}, proxyConfig: ProxyConfig = {}, pendingInstance: any = window) {
    this.baseURL = config.baseURL || "";
    this.timeout = config.timeout || 60 * 1000; // 请求超时时间
    this.headers = config.headers || {};
    this.method = config.method || "GET";
    this.requestBeforeHook = config.requestBeforeHook;
    this.responseAfterHook = config.responseAfterHook;
    this.showMessage = config.showMessage; // 消息弹窗方法
    this.errorCallback = config.errorCallback;
    this.proxyConfig = Object.assign({}, { code: "code", data: "data", message: "message" }, proxyConfig);

    if (Array.isArray(proxyConfig.successCode)) {
      this.successCode = proxyConfig.successCode;
    } else {
      const code = isUndefined(proxyConfig.successCode) ? 20000 : proxyConfig.successCode;
      this.successCode = [code];
    }

    this.pendingMap = pendingInstance;

    // 添加请求拦截器
    this.pendingMap.httpIsPending = new Map(); // 全局请求状态
  }

  // 初始化请求拦截
  setInterceptors(instance: AxiosInstance) {
    // 请求拦截
    instance.interceptors.request.use((config: HttpClientRequestConfig) => {
      // 不能重复请求
      this.registerCancelToken(config);
      if (this.requestBeforeHook) this.requestBeforeHook(config);
      return config;
    });
    // 响应拦截
    instance.interceptors.response.use(
      (response: HttpClientResponse) => {
        const { url = "", method = "GET", showSuccessMessage = false, showErrorMessage = true } = response.config;
        // 响应结束 删除pending状态的http
        this.removeCancelToken(url, method);
        // 文件流
        if (isArrayBuffer(response.data)) return response.data;

        // 自定义响应处理
        if (this.responseAfterHook) {
          return this.responseAfterHook(response.data);
        }

        // 业务层处理分发
        const body = this.buildResponseData(response.data);
        let result: any = null;

        if (this.successCode.includes(body.code)) {
          // 请求成功
          result = this.successFull(body, showSuccessMessage);
        } else {
          // 处理异常
          if (this.errorCallback) this.errorCallback(body);
          if (this.showMessage && showErrorMessage) this.showMessage(body);
          result = Promise.reject(body);
        }
        return result;
      },
      (error) => {
        if (axios.isCancel(error)) return new Promise(() => {});
        if (this.showMessage) this.showMessage({ code: 500, message: "网络错误：500" });
        if (this.errorCallback) this.errorCallback(error);
        // 对响应错误做点什么
        return Promise.reject(error);
      }
    );
  }
  // 响应成功
  successFull(option: { code: number; data: any; message: string }, showSuccessMessage: Boolean) {
    // 判断是否需要展示提示信息
    if (this.showMessage && showSuccessMessage) this.showMessage(option);
    return Promise.resolve(option);
  }
  // 构建响应数据
  buildResponseData(response: any) {
    const { code, data, message } = this.proxyConfig;
    return {
      code: response[code],
      data: response[data],
      message: response[message],
    };
  }
  // 注册 CancelToken
  registerCancelToken(config: HttpClientRequestConfig) {
    if (!config.repeatReq) {
      const url = config.url + "_" + config.method;
      config.cancelToken = new axios.CancelToken((executor) => {
        this.pendingMap.httpIsPending.set(url, executor);
      });
    }
  }
  // 删除 CancelToken
  removeCancelToken(url: string, method: Method | string) {
    const uuid = url + "_" + method;
    this.pendingMap.httpIsPending.delete(uuid);
  }
  // 合并参数
  mergeOptions(options: HttpClientRequestConfig = {}): HttpClientRequestConfig {
    const { url, useFormData = false, headers = {} } = options;
    // 判断是否是完整的 请求地址
    const isCompletelyUrl = url?.startsWith("http");
    // 判断是否使用JSON提交数据
    const data = useFormData ? qs.stringify(options.data) : options.data

    // 默认使用 x-www-form 表单提交
    const localHeaders: AxiosRequestHeaders = {
      ...this.headers,
      "Content-Type": useFormData ? "application/x-www-form-urlencoded" : "application/json",
    };
    // 合并请求头
    if (headers) {
      Object.keys(headers).forEach((key) => (localHeaders[key] = headers[key]));
    }
    return {
      baseURL: isCompletelyUrl ? "" : this.baseURL, // 完整的请求地址则不需要 baseURL
      timeout: this.timeout,
      method: this.method, // 默认 get 请求方法
      ...options, // 解构&覆盖 默认参数
      headers: omitBy(localHeaders, isUndefined),
      data,
    };
  }
  // 请求方法
  request(options: HttpClientRequestConfig = {}) {
    const instance = axios.create();
    this.setInterceptors(instance);
    const opts = this.mergeOptions(options); // 合并选项
    return instance(opts);
  }
}

export default HttpClient;
