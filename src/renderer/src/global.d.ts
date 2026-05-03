/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    appBridge?: {
      platform: NodeJS.Platform
    }
  }
}
