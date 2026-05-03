export {}

declare global {
  interface Window {
    appBridge?: {
      platform: NodeJS.Platform
    }
  }
}
