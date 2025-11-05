import { Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export default function ProductFilters({ categories, selectedCategory, onCategoryChange, query, onQueryChange, sort, onSortChange }) {
  const { t } = useTranslation()

  return (
    <Form className="mb-3">
      <Row className="g-2">
        <Col xs={12} md={4}>
          <Form.Control
            type="search"
            placeholder={t('products.searchPlaceholder')}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label={t('products.filterByCategory')}
          >
            <option value="">{t('products.allCategories')}</option>
            {categories.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={{ offset: 2, span: 2 }}>
          <Form.Select value={sort} onChange={(e) => onSortChange(e.target.value)} style={{ maxWidth: 220 }}>
            <option value="newest">{t('products.sort.newest')}</option>
            <option value="price-asc">{t('products.sort.priceAsc')}</option>
            <option value="price-desc">{t('products.sort.priceDesc')}</option>
          </Form.Select>
        </Col>
      </Row>
    </Form>
  )
}
