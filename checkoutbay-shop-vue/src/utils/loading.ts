import { createDiscreteApi } from 'naive-ui'

let loadingBarApi: ReturnType<typeof createDiscreteApi>['loadingBar'] | null = null

try {
  const { loadingBar } = createDiscreteApi(['loadingBar'])
  loadingBarApi = loadingBar
} catch (error) {
  console.error('Failed to initialize loading bar API:', error)
}

export const showLoadingBar = {
  start: () => {
    if (loadingBarApi) {
      loadingBarApi.start()
    }
  },
  finish: () => {
    if (loadingBarApi) {
      loadingBarApi.finish()
    }
  },
  error: () => {
    if (loadingBarApi) {
      loadingBarApi.error()
    }
  }
}
