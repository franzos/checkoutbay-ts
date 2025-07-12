import { createDiscreteApi } from 'naive-ui'
import type { DialogOptions } from 'naive-ui'

let dialogApi: ReturnType<typeof createDiscreteApi>['dialog'] | null = null

try {
  const { dialog } = createDiscreteApi(['dialog'])
  dialogApi = dialog
} catch (error) {
  console.error('Failed to initialize dialog API:', error)
}

const defaultOptions: Partial<DialogOptions> = {
  positiveText: 'Confirm',
  negativeText: 'Cancel',
  closable: true,
  maskClosable: false
}

export const showDialog = {
  confirm: (options: DialogOptions) => {
    if (dialogApi) {
      return dialogApi.create({
        type: 'warning',
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to native confirm
    return window.confirm(options.content as string)
  },
  info: (options: DialogOptions) => {
    if (dialogApi) {
      return dialogApi.create({
        type: 'info',
        positiveText: 'OK',
        negativeText: undefined,
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to native alert
    window.alert(options.content)
  },
  error: (options: DialogOptions) => {
    if (dialogApi) {
      return dialogApi.create({
        type: 'error',
        positiveText: 'OK',
        negativeText: undefined,
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to native alert
    window.alert(options.content)
  },
  success: (options: DialogOptions) => {
    if (dialogApi) {
      return dialogApi.create({
        type: 'success',
        positiveText: 'OK',
        negativeText: undefined,
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to native alert
    window.alert(options.content)
  }
}
