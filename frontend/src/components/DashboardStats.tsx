import { CalendarDays, Hash, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatReadingDate } from '@/lib/format'
import type { Meter } from '@/types/meter'

interface DashboardStatsProps {
  meters: Meter[]
}

export function DashboardStats({ meters }: DashboardStatsProps) {
  const now = new Date()
  const thisMonthCount = meters.filter((m) => {
    const d = new Date(m.readingDate)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const latest = meters.length
    ? [...meters].sort(
        (a, b) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime(),
      )[0]
    : null

  const stats = [
    {
      title: 'Toplam Kayıt',
      value: String(meters.length),
      icon: Hash,
      accent: 'text-primary',
    },
    {
      title: 'Bu Ay Okuma',
      value: String(thisMonthCount),
      icon: Zap,
      accent: 'text-accent',
    },
    {
      title: 'Son Okuma',
      value: latest ? formatReadingDate(latest.readingDate) : '—',
      icon: CalendarDays,
      accent: 'text-primary',
      small: true,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.accent}`} />
          </CardHeader>
          <CardContent>
            <p className={stat.small ? 'text-lg font-semibold' : 'text-3xl font-bold'}>
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
