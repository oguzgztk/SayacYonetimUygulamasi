import * as React from 'react'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 4000

type ToastVariant = 'default' | 'destructive'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

type Action =
  | { type: 'ADD'; toast: Toast }
  | { type: 'DISMISS'; toastId: string }
  | { type: 'REMOVE'; toastId: string }

interface State {
  toasts: Toast[]
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'DISMISS':
      return state
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.toastId) }
    default:
      return state
  }
}

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

export function toast({
  title,
  description,
  variant = 'default',
}: Omit<Toast, 'id'>) {
  const id = genId()
  dispatch({ type: 'ADD', toast: { id, title, description, variant } })
  setTimeout(() => dispatch({ type: 'REMOVE', toastId: id }), TOAST_REMOVE_DELAY)
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) => {
      dispatch({ type: 'DISMISS', toastId })
      dispatch({ type: 'REMOVE', toastId })
    },
  }
}
