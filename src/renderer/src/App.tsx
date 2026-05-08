import { useMemo, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Table,
  Tabs,
  Text,
  Title
} from '@mantine/core'
import ajuntamentManresaLogo from './assets/logo-ajuntament-manresa.png'
import caeLogo from './assets/cae-logo.png'
import campiLogo from './assets/logo-campi.png'
import ticketCatalogData from './data/ticketCatalog.json'

type TabId = 'sales' | 'count' | 'export' | 'subscriptions'
type PaymentMethod = 'cash' | 'card'

type TabDefinition = {
  id: TabId
  label: string
}

type TicketPrice = {
  id: string
  label: string
  priceCents: number
}

type PercentageDiscount = {
  id: string
  label: string
  type: 'percentage'
  percentOff: number
}

type TicketCatalog = {
  currency: string
  'standard-prices': TicketPrice[]
  discounts: PercentageDiscount[]
  packs: unknown[]
}

type QuantityMap = Record<string, number>

const tabs: TabDefinition[] = [
  { id: 'sales', label: 'Venda' },
  { id: 'count', label: 'Recompte' },
  { id: 'export', label: 'Exportar' },
  { id: 'subscriptions', label: 'Abonaments' }
]

const ticketCatalog = ticketCatalogData as TicketCatalog

const moneyFormatter = new Intl.NumberFormat('ca-ES', {
  style: 'currency',
  currency: ticketCatalog.currency
})

const initialQuantities: QuantityMap = Object.fromEntries(
  ticketCatalog['standard-prices'].map((ticket) => [ticket.id, 0])
)

function formatMoney(cents: number): string {
  return moneyFormatter.format(cents / 100)
}

function normalizeQuantity(value: number | string): number {
  const numericValue = typeof value === 'number' ? value : Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 0
  }

  return Math.trunc(numericValue)
}

function SalesPanel() {
  const [quantities, setQuantities] = useState<QuantityMap>(initialQuantities)
  const [activeDiscountIds, setActiveDiscountIds] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')

  const orderItems = useMemo(
    () =>
      ticketCatalog['standard-prices']
        .map((ticket) => {
          const quantity = quantities[ticket.id] ?? 0

          return {
            ticket,
            quantity,
            lineTotalCents: ticket.priceCents * quantity
          }
        })
        .filter((item) => item.quantity > 0),
    [quantities]
  )

  const subtotalCents = useMemo(
    () => orderItems.reduce((total, item) => total + item.lineTotalCents, 0),
    [orderItems]
  )

  const selectedDiscounts = useMemo(
    () => ticketCatalog.discounts.filter((discount) => activeDiscountIds.includes(discount.id)),
    [activeDiscountIds]
  )

  const discountTotalCents = useMemo(
    () =>
      selectedDiscounts.reduce((total, discount) => {
        if (discount.type === 'percentage') {
          return total + Math.round(subtotalCents * (discount.percentOff / 100))
        }

        return total
      }, 0),
    [selectedDiscounts, subtotalCents]
  )

  const totalCents = Math.max(0, subtotalCents - discountTotalCents)
  const totalTickets = orderItems.reduce((total, item) => total + item.quantity, 0)

  const setTicketQuantity = (ticketId: string, value: number | string): void => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [ticketId]: normalizeQuantity(value)
    }))
  }

  const adjustTicketQuantity = (ticketId: string, delta: number): void => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [ticketId]: Math.max(0, (currentQuantities[ticketId] ?? 0) + delta)
    }))
  }

  return (
    <div className="sales-panel">
      <section className="sales-primary" aria-label="Venda d'entrades">
        <Paper withBorder radius="sm" className="ticket-list-panel">
          <Group justify="space-between" align="flex-start" wrap="nowrap" className="panel-heading">
            <Box>
              <Title order={2} className="panel-title">
                Entrades
              </Title>
              <Text size="sm" c="dimmed">
                Tarifes estàndard
              </Text>
            </Box>
            <Badge variant="light" color="campi">
              {ticketCatalog['standard-prices'].length} preus
            </Badge>
          </Group>

          <ScrollArea className="ticket-list-scroll" type="auto" offsetScrollbars>
            <Stack gap="sm" className="ticket-list">
              {ticketCatalog['standard-prices'].map((ticket) => {
                const quantity = quantities[ticket.id] ?? 0

                return (
                  <Paper key={ticket.id} withBorder radius="sm" className="ticket-row">
                    <Group justify="space-between" gap="md" wrap="nowrap" className="ticket-row-inner">
                      <Box className="ticket-copy">
                        <Text fw={700}>{ticket.label}</Text>
                        <Text size="sm" c="dimmed">
                          {formatMoney(ticket.priceCents)}
                        </Text>
                      </Box>

                      <Group gap="xs" wrap="nowrap" className="quantity-control">
                        <ActionIcon
                          variant="default"
                          size="lg"
                          aria-label={`Restar ${ticket.label}`}
                          disabled={quantity === 0}
                          onClick={() => adjustTicketQuantity(ticket.id, -1)}
                        >
                          -
                        </ActionIcon>
                        <NumberInput
                          value={quantity}
                          min={0}
                          step={1}
                          allowDecimal={false}
                          allowNegative={false}
                          hideControls
                          aria-label={`Quantitat de ${ticket.label}`}
                          classNames={{ input: 'quantity-input' }}
                          onChange={(value) => setTicketQuantity(ticket.id, value)}
                        />
                        <ActionIcon
                          variant="filled"
                          color="campi"
                          size="lg"
                          aria-label={`Afegir ${ticket.label}`}
                          onClick={() => adjustTicketQuantity(ticket.id, 1)}
                        >
                          +
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Paper>
                )
              })}
            </Stack>
          </ScrollArea>
        </Paper>

        <Paper withBorder radius="sm" className="invoice-panel">
          <Group justify="space-between" align="flex-start" wrap="nowrap" className="panel-heading">
            <Box>
              <Title order={2} className="panel-title">
                Resum
              </Title>
              <Text size="sm" c="dimmed">
                Línies de venda
              </Text>
            </Box>
            <Badge variant="light" color={totalTickets > 0 ? 'campi' : 'gray'}>
              {totalTickets} entrades
            </Badge>
          </Group>

          <ScrollArea className="invoice-scroll" type="auto" offsetScrollbars>
            {orderItems.length === 0 ? (
              <div className="empty-summary">
                <Text c="dimmed" ta="center">
                  Cap entrada seleccionada
                </Text>
              </div>
            ) : (
              <Table verticalSpacing="sm" horizontalSpacing="xs" className="invoice-table">
                <Table.Tbody>
                  {orderItems.map((item) => (
                    <Table.Tr key={item.ticket.id}>
                      <Table.Td>
                        <Text fw={700}>{item.ticket.label}</Text>
                        <Text size="xs" c="dimmed">
                          {item.quantity} x {formatMoney(item.ticket.priceCents)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text fw={700}>{formatMoney(item.lineTotalCents)}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </ScrollArea>

          <Divider />

          <Group justify="space-between" wrap="nowrap" className="invoice-total-row">
            <Text fw={700}>Subtotal</Text>
            <Text fw={800} size="lg">
              {formatMoney(subtotalCents)}
            </Text>
          </Group>
        </Paper>
      </section>

      <section className="sales-checkout" aria-label="Opcions de cobrament">
        <Paper withBorder radius="sm" className="checkout-panel">
          <Checkbox.Group
            label="Descomptes"
            value={activeDiscountIds}
            onChange={setActiveDiscountIds}
          >
            <Stack gap="xs" mt="sm">
              {ticketCatalog.discounts.map((discount) => (
                <Checkbox
                  key={discount.id}
                  value={discount.id}
                  label={`${discount.label} ${discount.percentOff}%`}
                />
              ))}
            </Stack>
          </Checkbox.Group>
        </Paper>

        <Paper withBorder radius="sm" className="checkout-panel">
          <Text fw={700} mb="sm">
            Mètode de pagament
          </Text>
          <SegmentedControl
            fullWidth
            value={paymentMethod}
            onChange={(value) => setPaymentMethod(value as PaymentMethod)}
            data={[
              { label: 'Efectiu', value: 'cash' },
              { label: 'Targeta', value: 'card' }
            ]}
          />
        </Paper>

        <Paper withBorder radius="sm" className="checkout-panel totals-panel">
          <Stack gap="xs">
            <Group justify="space-between" wrap="nowrap">
              <Text c="dimmed">Subtotal</Text>
              <Text>{formatMoney(subtotalCents)}</Text>
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text c="dimmed">Descomptes</Text>
              <Text c={discountTotalCents > 0 ? 'campi.7' : 'dimmed'}>
                {discountTotalCents > 0 ? `-${formatMoney(discountTotalCents)}` : formatMoney(0)}
              </Text>
            </Group>
            <Divider my="xs" />
            <Group justify="space-between" align="flex-end" wrap="nowrap">
              <Text fw={800}>Total rectificat</Text>
              <Text fw={900} className="rectified-total">
                {formatMoney(totalCents)}
              </Text>
            </Group>
            <Button fullWidth size="md" mt="xs">
              Validar
            </Button>
          </Stack>
        </Paper>
      </section>
    </div>
  )
}

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
              {tab.id === 'sales' ? <SalesPanel /> : <div className="empty-panel" />}
            </Tabs.Panel>
          ))}
        </Paper>
      </Tabs>
    </main>
  )
}
