import './styles.css'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Application root element was not found.')
}

const platform = window.appBridge?.platform

if (platform) {
  document.documentElement.dataset.platform = platform
}

root.innerHTML = `
  <main class="app-shell" aria-labelledby="app-title">
    <section class="status-panel">
      <div class="brand-mark" aria-hidden="true">TC</div>
      <div class="status-copy">
        <p class="eyebrow">Taquilla Campi</p>
        <h1 id="app-title">Gestió de taquilla</h1>
        <p class="intro">
          Aplicació preparada per definir les vendes, els informes i les exportacions.
        </p>
      </div>
    </section>

    <section class="empty-state" aria-label="Estat inicial">
      <p class="state-label">Estat</p>
      <p class="state-title">Sense dades carregades</p>
      <p class="state-detail">
        Les vistes de venda i l'exportació de CSV o Excel s'afegiran en el següent pas.
      </p>
    </section>
  </main>
`
