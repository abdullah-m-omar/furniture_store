import { Tabs, Tab } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function ProductTabs({ product }) {
  const { t } = useTranslation()
  return (
    <Tabs defaultActiveKey="details" className="mt-4">
      <Tab eventKey="details" title={t('product.tabs.details')}>
        <div className="pt-3">
          <p>{product.description}</p>
        </div>
      </Tab>
      <Tab eventKey="specs" title={t('product.tabs.specs')}>
        <div className="pt-3">
          {/* Replace with real specs later */}
          <ul className="mb-0">
            <li>{t('product.specs.material')}: {t('product.specs.sample.material')}</li>
            <li>{t('product.specs.dimensions')}: {t('product.specs.sample.dimensions')}</li>
            <li>{t('product.specs.color')}: {t('product.specs.sample.color')}</li>
          </ul>
        </div>
      </Tab>
      <Tab eventKey="reviews" title={t('product.tabs.reviews')}>
        <div className="pt-3 text-muted">{t('product.reviews.placeholder')}</div>
      </Tab>
    </Tabs>
  )
}
