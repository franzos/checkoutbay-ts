import { createDiscreteApi } from 'naive-ui'
import type { ConfigProviderProps } from 'naive-ui'

let messageApi: ReturnType<typeof createDiscreteApi>['message'] | null = null

const messageConfig = {
  duration: 3000, // 3 seconds
  keepAliveOnHover: true,
  max: 3
}

try {
  const { message } = createDiscreteApi(['message'], {
    configProviderProps: {
      theme: null, // Will use the theme from n-config-provider
      themeOverrides: {
        Message: {
          padding: '10px 20px',
          borderRadius: '6px',
          maxWidth: '720px'
        }
      }
    } as ConfigProviderProps
  })
  messageApi = message
} catch (error) {
  console.error('Failed to initialize message API:', error)
}

export const showMessage = {
  success: (content: string) => {
    if (messageApi) {
      messageApi.success(content, messageConfig)
    } else {
      console.log('Success:', content)
    }
  },
  warning: (content: string) => {
    if (messageApi) {
      messageApi.warning(content, messageConfig)
    } else {
      console.warn('Warning:', content)
    }
  },
  error: (content: string) => {
    if (messageApi) {
      messageApi.error(content, { ...messageConfig, duration: 5000 }) // Errors stay longer
    } else {
      console.error('Error:', content)
    }
  },
  info: (content: string) => {
    if (messageApi) {
      messageApi.info(content, messageConfig)
    } else {
      console.info('Info:', content)
    }
  }
}
