import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import './styles.css'
import { App } from './App'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Application root element was not found.')
}

const platform = window.appBridge?.platform

if (platform) {
  document.documentElement.dataset.platform = platform
}

const theme = createTheme({
  primaryColor: 'campi',
  defaultRadius: 'sm',
  fontFamily: '"Avenir Next", "Montserrat", "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"Avenir Next", "Montserrat", "Segoe UI", sans-serif'
  },
  colors: {
    campi: [
      '#fff5f5',
      '#fee6e5',
      '#fdd4d2',
      '#fbb7b4',
      '#f88984',
      '#f6615a',
      '#ef3d35',
      '#cb2d27',
      '#a82320',
      '#881c1b'
    ]
  }
})

createRoot(root).render(
  <MantineProvider theme={theme} defaultColorScheme="light">
    <App />
  </MantineProvider>
)
