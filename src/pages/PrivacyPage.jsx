import { Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'

export default function PrivacyPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()

  return (
    <Container className="py-5" dir={dir}>
      <h1 className="mb-3">{t('privacy.title')}</h1>
      <p className="text-muted">{t('privacy.updated')}</p>

      <h5 className="mt-4">{t('privacy.sections.collection.title')}</h5>
      <p>{t('privacy.sections.collection.text')}</p>

      <h5 className="mt-4">{t('privacy.sections.usage.title')}</h5>
      <p>{t('privacy.sections.usage.text')}</p>

      <h5 className="mt-4">{t('privacy.sections.sharing.title')}</h5>
      <p>{t('privacy.sections.sharing.text')}</p>

      <h5 className="mt-4">{t('privacy.sections.rights.title')}</h5>
      <p className="mb-0">{t('privacy.sections.rights.text')}</p>
    </Container>
  )
}
