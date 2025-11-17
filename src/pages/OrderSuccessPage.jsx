import { useLocation, useSearchParams, Link } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'

export default function OrderSuccessPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const [params] = useSearchParams()
  const { state } = useLocation()
  const orderNumber = params.get('ord') || '—'
  const wa = state?.wa // pre-built deep link if provided

  return (
    <Container className="py-5" dir={dir}>
      <h1 className="h4 mb-2">{t('checkout.thanks') || 'Thank you!'}</h1>
      <p className="text-muted mb-4">
        {t('checkout.orderPlaced') || 'Your order has been placed.'} {t('checkout.orderNumber') || 'Order #'} {orderNumber}
      </p>
      <div className="d-flex gap-2">
        {wa && (
          <Button as="a" href={wa} target="_blank" rel="noreferrer" variant="success">
            {t('checkout.confirmOnWhatsApp') || 'Confirm on WhatsApp'}
          </Button>
        )}
        <Button as={Link} to="/" variant="outline-secondary">
          {t('common.backHome') || 'Back to Home'}
        </Button>
      </div>
    </Container>
  )
}
