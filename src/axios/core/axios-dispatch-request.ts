import { AxiosRequest, AxiosResponse, AxiosResponsePromise } from '../types/axios-config';
import sendXMLHttpRequest from './axios-xhr';
import { buildRequestURL } from '../lib/axios-url';
import { flattenHeaders } from '../lib/axios-headers';
import axiosTransform from './axios-transform';

// 将 params 参数转换到 url 上
const transformRequestURL = (config: AxiosRequest): string => {
  const { url, params } = config;
  return buildRequestURL(url!, params);
};

// 处理请求配置参数
const processRequestConfig = (config: AxiosRequest): AxiosRequest => {
  config.url = transformRequestURL(config);
  config.data = axiosTransform(config.data, config.headers, config.transformRequest);
  // 对 headers 对象进行删除层级处理
  config.headers = flattenHeaders(config.headers, config.method!);
  return config;
};

// 处理响应结果
const processResponseResult = (res: AxiosResponse): AxiosResponse => {
  res.data = axiosTransform(res.data, res.headers, res.config.transformResponse);
  return res;
};

// axios 核心的函数
// 主要功能：解析参数以及发送请求到服务器
const axiosDispatchRequest = (config: AxiosRequest): AxiosResponsePromise => {
  config = processRequestConfig(config);
  // 发送异步请求
  return sendXMLHttpRequest(config).then(res => {
    return processResponseResult(res);
  });
};

export default axiosDispatchRequest;
