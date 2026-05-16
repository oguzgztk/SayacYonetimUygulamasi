import { useMemo } from 'react'
import { format, subMonths, startOfMonth } from 'date-fns'
import { tr } from 'date-fns/locale'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Meter } from '@/types/meter'

interface MonthlyChartProps {
  meters: Meter[]
}

export function MonthlyChart({ meters }: MonthlyChartProps) {
  const data = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(startOfMonth(new Date()), 5 - i)
      return { key: format(d, 'yyyy-MM'), label: format(d, 'MMM', { locale: tr }) }
    })

    return months.map(({ key, label }) => ({
      label,
      count: meters.filter((m) => {
        const k = format(new Date(m.readingDate), 'yyyy-MM')
        return k === key
      }).length,
    }))
  }, [meters])

  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div style={{ height: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, max + 1]}
          />
          <Tooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.5 }}
            contentStyle={{
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v} okuma`, '']}
            labelFormatter={(l) => l}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  i === data.length - 1
                    ? 'var(--primary)'
                    : 'var(--border)'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
