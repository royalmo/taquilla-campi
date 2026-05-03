import { spawn } from 'node:child_process'

const args = process.argv.slice(2)

const child = spawn(
  process.execPath,
  ['./node_modules/electron-vite/bin/electron-vite.js', ...args],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: undefined
    }
  }
)

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
