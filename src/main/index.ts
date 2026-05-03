import { app, BrowserWindow, Menu, screen, shell } from 'electron'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const rendererDevServerUrl = process.env.ELECTRON_RENDERER_URL

function resolveWindowIconPath(): string | undefined {
  const candidatePaths = app.isPackaged
    ? [join(process.resourcesPath, 'assets/icon.png')]
    : [
        join(process.cwd(), 'build/icon.png'),
        join(app.getAppPath(), 'build/icon.png'),
        join(__dirname, '../../build/icon.png')
      ]

  const iconPath = candidatePaths.find((candidatePath) => existsSync(candidatePath))

  if (!iconPath) {
    return undefined
  }

  return iconPath
}

function createMainWindow(): void {
  const windowIconPath = resolveWindowIconPath()
  const { workArea } = screen.getPrimaryDisplay()
  const mainWindow = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,
    minWidth: 960,
    minHeight: 680,
    show: true,
    title: 'Gestor de Taquilles del Campi Qui Jugui',
    backgroundColor: '#F4EFE6',
    autoHideMenuBar: true,
    icon: windowIconPath,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (windowIconPath) {
    mainWindow.setIcon(windowIconPath)
  }

  const maximizeWindow = (): void => {
    if (!mainWindow.isDestroyed() && !mainWindow.isMaximized()) {
      mainWindow.maximize()
    }
  }

  setImmediate(maximizeWindow)
  mainWindow.once('show', maximizeWindow)
  mainWindow.webContents.once('did-finish-load', maximizeWindow)

  if (rendererDevServerUrl) {
    mainWindow.loadURL(rendererDevServerUrl)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
