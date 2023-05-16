## 使用示例
```ts
import HttpClient, { HttpClientConfig, HttpClientRequestConfig } from 'http-client'

// 初始化请求实例
const config:HttpClientConfig = {
  baseURL: '',
  headers: {
    Authorization: 'xx--x-x-x-x-x-x--xxxxx'
  },
  showMessage: ({ code, message }) => alert(message)
}

const http = new HttpClient(config)

// 配置单次请求信息
const options:HttpClientRequestConfig = { url: '/api/auth' }
http.request(options).then(res => {
  console.log(res);
})

```


## 初始化参数

```ts
import type { Method, AxiosRequestHeaders, AxiosRequestConfig, AxiosResponseHeaders } from "axios";

/**
 * 响应结果自定义 key 
 * 不要忘记设置 successCode 的值，避免出现不符合预期的情况
 */
type ProxyConfig = {
  code?: string;
  data?: string;
  message?: string;
  successCode?: number | number[] // 请求成功 code 码, 默认是 0
};

/**
 * 初始化配置信息
 */
type HttpClientConfig = {
  baseURL?: string; // 公共请求地址 
  timeout?: number; // 公共超时时间 默认为 60 * 1000
  method?: Method; // 公共默认请求方法 默认为 GET
  headers?: AxiosRequestHeaders; // 公共默认请求头
  requestBeforeHook?: RequestBeforeHook; // 公共请求拦截钩子
  responseAfterHook?: ResponseAfterHook; // 公共响应拦截钩子 ！！！如果设置了此方法，则公共响应处理则会失效，需要自行处理公共响应拦截
  showMessage?: ShowMessage; // 展示提示信息钩子
  errorCallback?: ErrorCallback; // 响应错误钩子
};

type RequestBeforeHook = (config: HttpClientRequestConfig) => void;

type ResponseAfterHook = (option: HttpClientResponse) => Promise<any>;

type ShowMessage = (options: { code: number; message: string }) => void;

type ErrorCallback = (data: any) => void;

interface HttpClientRequestConfig extends AxiosRequestConfig {
  useFormData?: Boolean; // 使用 formData 方式提交
  showSuccessMessage?: Boolean; // 触发响应成功提示信息 默认为 false
  showErrorMessage?: Boolean; // 触发响应错误提示信息 默认为 true
  repeatReq?: Boolean; //  是否允许在pending状态中重复请求
}

interface HttpClientResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: HttpClientRequestConfig;
  request?: any;
}
```

### tips

请求结果如果是文件流，需要是`ArrayBuffer`的格式，响应拦截会返回完整的响应体，否则会造成报错以及不符合预期的情况

