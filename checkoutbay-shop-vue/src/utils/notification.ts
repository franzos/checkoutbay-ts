import { createDiscreteApi } from 'naive-ui'
import type { NotificationOptions } from 'naive-ui'

let notificationApi: ReturnType<typeof createDiscreteApi>['notification'] | null = null

try {
  const { notification } = createDiscreteApi(['notification'])
  notificationApi = notification
} catch (error) {
  console.error('Failed to initialize notification API:', error)
}

const defaultOptions: Partial<NotificationOptions> = {
  duration: 4500,
  keepAliveOnHover: true,
  closable: true
}

export const showNotification = {
  success: (options: NotificationOptions | string) => {
    if (notificationApi) {
      return notificationApi.success(typeof options === 'string' ? {
        title: 'Success',
        content: options,
        ...defaultOptions
      } : {
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to console
    console.log('Success:', typeof options === 'string' ? options : options.content)
  },
  warning: (options: NotificationOptions | string) => {
    if (notificationApi) {
      return notificationApi.warning(typeof options === 'string' ? {
        title: 'Warning',
        content: options,
        ...defaultOptions
      } : {
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to console
    console.warn('Warning:', typeof options === 'string' ? options : options.content)
  },
  error: (options: NotificationOptions | string) => {
    if (notificationApi) {
      return notificationApi.error(typeof options === 'string' ? {
        title: 'Error',
        content: options,
        duration: 6000, // Errors stay longer
        ...defaultOptions
      } : {
        ...defaultOptions,
        duration: 6000,
        ...options
      })
    }
    // Fallback to console
    console.error('Error:', typeof options === 'string' ? options : options.content)
  },
  info: (options: NotificationOptions | string) => {
    if (notificationApi) {
      return notificationApi.info(typeof options === 'string' ? {
        title: 'Info',
        content: options,
        ...defaultOptions
      } : {
        ...defaultOptions,
        ...options
      })
    }
    // Fallback to console
    console.info('Info:', typeof options === 'string' ? options : options.content)
  },
  // Clear all notifications
  clear: () => {
    if (notificationApi) {
      notificationApi.destroyAll()
    }
  }
}
