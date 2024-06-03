import axios from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { env } from './env.js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mergeEventHandlers<E>(
  ...handlers: (((event: E) => void) | undefined)[]
) {
  return (event: E) => {
    handlers.forEach((handler) => {
      if (handler instanceof Function) {
        handler(event)
      }
    })
  }
}

export const getErrorMessage = (error: unknown, defaultMessage = 'Lỗi') => {
  let message

  if (axios.isAxiosError(error)) {
    message =
      error.response?.data?.error?.message ||
      error.response?.data?.data?.message ||
      error.response?.data?.message ||
      error.message
  } else {
    message = (error as Error)?.message
  }

  return message || defaultMessage
}

export function arrayMove(arr: any[], fromIndex: number, toIndex: number) {
  const newArr = [...arr]
  newArr.splice(fromIndex, 1)
  newArr.splice(toIndex, 0, arr[fromIndex])
  return newArr
}

export function absoluteUrl(path?: string | null, defaultValue = path || '') {
  if (!path) return defaultValue
  return `${env.NEXT_PUBLIC_BASE_URL}${path}`
}
