import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('appBridge', {
  platform: process.platform
})
