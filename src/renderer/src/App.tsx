import { useState } from 'react'
import { Group, Paper, Tabs } from '@mantine/core'
import ajuntamentManresaLogo from './assets/logo-ajuntament-manresa.png'
import caeLogo from './assets/cae-logo.png'
import campiLogo from './assets/logo-campi.png'

type TabId = 'sales' | 'count' | 'export' | 'subscriptions'

type TabDefinition = {
  id: TabId
  label: string
}

const tabs: TabDefinition[] = [
  { id: 'sales', label: 'Venda' },
  { id: 'count', label: 'Recompte' },
  { id: 'export', label: 'Exportar' },
  { id: 'subscriptions', label: 'Abonaments' }
]

export function App() {
  const [activeTab, setActiveTab] = useState<TabId>('sales')

  const handleTabChange = (value: string | null): void => {
    if (value) {
      setActiveTab(value as TabId)
    }
  }

  return (
    <main className="app-layout" aria-labelledby="app-title">
      <h1 id="app-title" className="sr-only">
        Gestor de Taquilles del Campi Qui Jugui
      </h1>

      <Paper component="header" radius="sm" withBorder className="topbar">
        <Group justify="space-between" align="center" wrap="nowrap" className="topbar-inner">
          <img className="campi-logo" src={campiLogo} alt="Campi Qui Jugui" />

          <Group gap="lg" align="center" wrap="nowrap" className="partner-logos">
            <img
              className="ajuntament-logo"
              src={ajuntamentManresaLogo}
              alt="Ajuntament de Manresa"
            />
            <img className="cae-logo" src={caeLogo} alt="CAE" />
          </Group>
        </Group>
      </Paper>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="pills"
        radius="sm"
        classNames={{
          root: 'tabs-root',
          list: 'tabs-list',
          tab: 'tabs-tab',
          panel: 'tabs-panel'
        }}
      >
        <Tabs.List grow>
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id} value={tab.id}>
              {tab.label}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Paper withBorder radius="sm" className="panel-surface">
          {tabs.map((tab) => (
            <Tabs.Panel key={tab.id} value={tab.id}>
              <div className="empty-panel" />
            </Tabs.Panel>
          ))}
        </Paper>
      </Tabs>
    </main>
  )
}
