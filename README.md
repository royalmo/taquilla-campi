# Taquilla Campi

Desktop scaffold for a counter ticket-management app for Campi Qui Jugui de Manresa.

The app shell is intentionally minimal for now. The renderer UI is in Catalan; source code, comments, and project documentation are in English.

## Stack

- Electron for the desktop runtime.
- Vite through `electron-vite` for local development and production builds.
- TypeScript for main, preload, and renderer code.
- Electron Builder for Windows `.exe` packaging.

## Requirements

- Node.js 24.x LTS, and npm available on `PATH`.
```bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

- For building Windows installers from Linux/macOS, Electron Builder may require Wine/Mono depending on the target and signing requirements.

## Development

```bash
npm install
npm run dev
```

## Build

Create a production build without packaging:

```bash
npm run build
```

Create Windows `.exe` artifacts:

```bash
npm run dist:win
```

Create only the portable Windows executable:

```bash
npm run dist:win:portable
```

Packaged output is written to `release/`.
