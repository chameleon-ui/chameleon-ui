import { Badge, Button, Card, Chart, EmptyState, Gauge, Typography } from '@chameleon-ui/components-react'
import { useState } from 'react'
import { createBlockCopy } from '../copy.js'
import { iotPanelLocaleTrees } from './locale-map.js'
import './styles.css'

export type IotDeviceStatus = 'online' | 'offline' | 'alert'

export interface IotDevice {
  id: string
  name: string
  status: IotDeviceStatus
  metric: number
  series: number[]
}

export interface IotPanelProps {
  locale?: string
  devices?: IotDevice[]
  onAcknowledge?: (id: string) => void
  className?: string
}

const DEFAULT_DEVICES: IotDevice[] = [
  { id: 'alpha', name: 'Chiller A', status: 'online', metric: 42, series: [20, 28, 35, 42] },
  { id: 'bravo', name: 'Pump B', status: 'alert', metric: 88, series: [60, 72, 80, 88] },
  { id: 'charlie', name: 'Sensor C', status: 'offline', metric: 0, series: [] },
]

function badgeVariant(status: IotDeviceStatus): 'success' | 'danger' | 'default' {
  if (status === 'online') return 'success'
  if (status === 'alert') return 'danger'
  return 'default'
}

function statusKey(status: IotDeviceStatus) {
  if (status === 'online') return 'iot.statusOnline'
  if (status === 'alert') return 'iot.statusAlert'
  return 'iot.statusOffline'
}

function aiState(devices: IotDevice[]) {
  if (devices.length === 0) return 'empty'
  if (devices.some((device) => device.status === 'alert')) return 'alert'
  return 'default'
}

export function IotPanel({
  locale = 'en',
  devices: initialDevices = DEFAULT_DEVICES,
  onAcknowledge,
  className,
}: IotPanelProps) {
  const { t } = createBlockCopy(iotPanelLocaleTrees, locale)
  const [devices, setDevices] = useState<IotDevice[]>(initialDevices)
  const classes = ['cu-block-iot-panel', className].filter(Boolean).join(' ')

  const handleAcknowledge = (id: string) => {
    setDevices((current) =>
      current.map((device) => (device.id === id ? { ...device, status: 'online' } : device)),
    )
    onAcknowledge?.(id)
  }

  return (
    <section
      className={classes}
      data-ai-role="iot-panel"
      data-ai-intent="monitor-devices"
      data-ai-state={aiState(devices)}
    >
      <div className="cu-block-iot-panel__header">
        <Typography variant="heading-1">{t('iot.title')}</Typography>
        <Typography variant="body">{t('iot.subtitle')}</Typography>
        <p className="cu-block-iot-panel__meta">{t('iot.deviceCount', { count: devices.length })}</p>
      </div>
      {devices.length === 0 ? (
        <EmptyState description={t('iot.emptyDescription')} title={t('iot.emptyTitle')} />
      ) : (
        <div className="cu-block-iot-panel__devices">
          {devices.map((device) => (
            <Card className="cu-block-iot-panel__device" key={device.id} padding="md" variant="outlined">
              <div className="cu-block-iot-panel__device-head">
                <Typography variant="heading-2">{device.name}</Typography>
                <Badge variant={badgeVariant(device.status)}>{t(statusKey(device.status))}</Badge>
              </div>
              <Gauge
                label={t('iot.gaugeLabel', { name: device.name })}
                max={100}
                value={device.metric}
                valueLabel={`${device.metric}%`}
              />
              <Chart
                emptyLabel={t('iot.emptyChart')}
                label={t('iot.chartLabel', { name: device.name })}
                series={[{ name: device.name, data: device.series }]}
                type="line"
              />
              {device.status === 'alert' ? (
                <Button onClick={() => handleAcknowledge(device.id)} type="button" variant="outline">
                  {t('iot.acknowledge', { name: device.name })}
                </Button>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
