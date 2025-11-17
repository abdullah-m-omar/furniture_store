import { createContext, useContext, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function show(message, variant = 'success') {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <ToastContainer position="top-end" className="p-3 fixed-top">
        {toasts.map(t => (
          <Toast key={t.id} bg={t.variant} show>
            <Toast.Body className="text-white">{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
