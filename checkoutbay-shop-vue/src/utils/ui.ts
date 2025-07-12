export { showMessage } from './message'
export { showLoadingBar } from './loading'
export { showDialog } from './dialog'
export { showNotification } from './notification'

// Re-export types from naive-ui for convenience
export type {
  MessageOptions,
  DialogOptions,
  NotificationOptions,
  LoadingBarApi
} from 'naive-ui'

// Common UI constants
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 200,
  TRANSITION_TIMING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  PRIMARY_COLOR: '#18a058',
  BORDER_RADIUS: '6px',
  MAX_WIDTH: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  },
  SPACING: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  Z_INDEX: {
    modal: 1000,
    notification: 1100,
    tooltip: 1200,
    loading: 1300
  }
} as const
