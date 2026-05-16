import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  hint?: string
  className?: string
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface-elevated px-4 py-3.5',
        'border-l-[3px] border-l-primary',
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'mt-1 font-semibold tabular-nums text-foreground',
          value.length > 12 ? 'text-base' : 'text-2xl',
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
