import { Container, Accordion } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'

export default function FAQPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()
  const faqs = t('faq.items', { returnObjects: true })

  return (
    <Container className="py-5" dir={dir}>
      <h1 className="mb-3">{t('faq.title')}</h1>
      <p className="text-muted mb-4">{t('faq.sub')}</p>
      <Accordion alwaysOpen>
        {faqs.map((f, i) => (
          <Accordion.Item eventKey={String(i)} key={i}>
            <Accordion.Header>{f.q}</Accordion.Header>
            <Accordion.Body>{f.a}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  )
}
