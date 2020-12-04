import { AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
// import { transformRequest, transformResponse } from '../helpers/data'
import { flattenHeaders } from '../helpers/header'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)

  processConfig(config)
  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIFRequested()
  }
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method as Method)
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url as string, params)
}

// function transformRequestData(config: AxiosRequestConfig): any {
//   return transformRequest(config.data)
// }
//
// function transformHeaders(config: AxiosRequestConfig) {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}
