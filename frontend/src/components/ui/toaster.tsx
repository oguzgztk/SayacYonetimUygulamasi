import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex min-w-[280px] max-w-sm items-start gap-3 rounded-md border px-4 py-3 shadow-md',
            toast.variant === 'destructive'
              ? 'border-destructive/30 bg-destructive text-white'
              : 'border-border bg-surface-elevated text-foreground',
          )}
        >
          <div className="flex-1">
            {toast.title && <p className="text-sm font-medium">{toast.title}</p>}
            {toast.description && (
              <p className="mt-0.5 text-sm opacity-80">{toast.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="opacity-60 hover:opacity-100"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
