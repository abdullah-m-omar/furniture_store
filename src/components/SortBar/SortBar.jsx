import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function SortBar({ sort, onSortChange }) {
  const { t } = useTranslation()
  return (
    <div className="d-flex justify-content-end mb-3">
      <Form.Select value={sort} onChange={(e) => onSortChange(e.target.value)} style={{ maxWidth: 220 }}>
        <option value="newest">{t('products.sort.newest')}</option>
        <option value="price-asc">{t('products.sort.priceAsc')}</option>
        <option value="price-desc">{t('products.sort.priceDesc')}</option>
      </Form.Select>
    </div>
  )
}
