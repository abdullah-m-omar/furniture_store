import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'

export default function TermsPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()

  return (
    <Container className="py-5" dir={dir}>
      <h1 className="mb-3">{t('terms.title')}</h1>
      <p className="text-muted">{t('terms.updated')}</p>

      <h5 className="mt-4">{t('terms.sections.usage.title')}</h5>
      <p>{t('terms.sections.usage.text')}</p>

      <h5 className="mt-4">{t('terms.sections.orders.title')}</h5>
      <p>{t('terms.sections.orders.text')}</p>

      <h5 className="mt-4">{t('terms.sections.returns.title')}</h5>
      <p>{t('terms.sections.returns.text')}</p>

      <h5 className="mt-4">{t('terms.sections.liability.title')}</h5>
      <p className="mb-0">{t('terms.sections.liability.text')}</p>
    </Container>
  )
}
