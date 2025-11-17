import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const CartContext = createContext(null)
const LS_KEY = 'cart.v1'

function loadInitial() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { items: [] } }
  catch { return { items: [] } }
}

function save(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state))
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { item } = action
      const idx = state.items.findIndex(it => it.id === item.id)
      let items
      if (idx >= 0) {
        items = state.items.map((it, i) => i === idx ? { ...it, quantity: it.quantity + (item.quantity || 1) } : it)
      } else {
        items = [...state.items, { ...item, quantity: item.quantity || 1 }]
      }
      const next = { items }
      save(next)
      return next
    }
    case 'INC': {
      const items = state.items.map(it => it.id === action.id ? { ...it, quantity: it.quantity + 1 } : it)
      const next = { items }; save(next); return next
    }
    case 'DEC': {
      const items = state.items
        .map(it => it.id === action.id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it)
      const next = { items }; save(next); return next
    }
    case 'REMOVE': {
      const items = state.items.filter(it => it.id !== action.id)
      const next = { items }; save(next); return next
    }
    case 'CLEAR': {
      const next = { items: [] }; save(next); return next
    }
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)

  // computed values
  const count = useMemo(() => state.items.reduce((n, it) => n + it.quantity, 0), [state.items])
  const subtotal = useMemo(() => state.items.reduce((s, it) => s + it.price * it.quantity, 0), [state.items])

  const api = useMemo(() => ({
    items: state.items,
    count, subtotal,
    addItem: (item) => dispatch({ type: 'ADD', item }),
    inc: (id) => dispatch({ type: 'INC', id }),
    dec: (id) => dispatch({ type: 'DEC', id }),
    remove: (id) => dispatch({ type: 'REMOVE', id }),
    clear: () => dispatch({ type: 'CLEAR' })
  }), [state.items, count, subtotal])

  // keep LS in sync if external changes (rare)
  useEffect(() => { save({ items: state.items }) }, [state.items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
