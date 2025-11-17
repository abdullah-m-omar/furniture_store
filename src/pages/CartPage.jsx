import { Container } from 'react-bootstrap'
import { useLocale } from '../context/LocaleContext'
import CartTable from '../components/CartTable/CartTable'

export default function CartPage() {
  const { locale, dir } = useLocale()
  const currency = locale === 'ar-SA' ? 'SAR' : 'USD'

  return (
    <Container className="py-4" dir={dir}>
      <h2 className="mb-3">Shopping Cart</h2>
      <CartTable locale={locale} currency={currency} />
    </Container>
  )
}
