import {
  AxiosRequestConfig as DefaultAxiosRequestConfig,
  InternalAxiosRequestConfig as DefaultInternalAxiosRequestConfig,
} from 'axios'

declare module 'axios' {
  export interface InternalAxiosRequestConfig
    extends DefaultInternalAxiosRequestConfig {
    withBearerToken?: boolean
  }
  export interface AxiosRequestConfig extends DefaultAxiosRequestConfig {
    withBearerToken?: boolean
  }
}
