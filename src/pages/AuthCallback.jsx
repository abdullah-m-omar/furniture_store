import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (user) navigate('/dashboard', { replace: true })
      else navigate('/login', { replace: true })
    }
  }, [user, loading, navigate])

  return <Container className="py-5">...</Container> // could show a spinner
}
