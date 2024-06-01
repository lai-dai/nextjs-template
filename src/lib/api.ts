import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

import { atomStore } from '@/components/providers/jotai'

import { userAtom } from './atom/auth'
import { env } from './env'
import { User } from 'next-auth'

const baseURL = env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
})

// For Make Log on Develop Mode
const devLog = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('%c' + message, 'color:blue;')
  }
}

// Request Interceptor
const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const { method, url } = config
  // Set Headers Here
  // Check Authentication Here
  // Set Loading Start Here
  devLog(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`)

  if (method === 'get') {
    config.timeout = 10000
  }

  if (typeof window !== 'undefined' && config.withBearerToken) {
    const user = atomStore.get(userAtom)

    if (user) {
      config.headers.Authorization = 'Bearer ' + (user as User).token
    }
  }

  return config
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config
  const { status } = response
  // Set Loading End Here
  // Handle Response Data Here
  // Error Handling When Return Success with Error Code Here
  devLog(`✅✅✅ [API] ${method?.toUpperCase()} ${url} | Response ${status}`)

  return response
}

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
  if (axios.isAxiosError(error)) {
    const { message } = error
    const { method, url } = error.config as AxiosRequestConfig
    const { status } = (error.response as AxiosResponse) ?? {}

    devLog(
      `💥💥💥 [API] (axios) ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
    )

    switch (status) {
      case 401: {
        // "Login required"
        break
      }
      case 403: {
        // "Permission denied"
        break
      }
      case 404: {
        // "Invalid request"
        break
      }
      case 500: {
        // "Server error"
        break
      }
      default: {
        // "Unknown error occurred"
        break
      }
    }

    return Promise.reject(error)
  }

  devLog(`💥 [API] | Error ${error.message}`)

  return Promise.reject(error)
}

api.interceptors.request.use(onRequest, onErrorResponse)
api.interceptors.response.use(onResponse, onErrorResponse)
