import { useEffect, useMemo, useState } from 'react'
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard/ProductCard'
import ProductFilters from '../components/ProductFilters/ProductFilters'
import { useLocale } from '../context/LocaleContext'
import { getCategories, getProducts } from '../services/productService'

export default function ProductsPage() {
  const { t } = useTranslation()
  const { dir, lang } = useLocale()
  const [params, setParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cats, setCats] = useState([])  // [{key,label}]
  const [items, setItems] = useState([])

  // URL-driven filters (so Home category links work)
  const urlCategory = params.get('category') || ''
  const urlSearch = params.get('search') || ''
  const urlSort = params.get('sort') || 'newest'

  const [selectedCategory, setSelectedCategory] = useState(urlCategory)
  const [query, setQuery] = useState(urlSearch)
  const [sort, setSort] = useState(urlSort) // 'newest' | 'price-asc' | 'price-desc'

  // Keep URL in sync with UI
  useEffect(() => {
    const next = new URLSearchParams()
    if (selectedCategory) next.set('category', selectedCategory)
    if (query) next.set('search', query)
    if (sort !== 'newest') next.set('sort', sort)
    setParams(next, { replace: true })
  }, [selectedCategory, query, sort, setParams])

  // Fetch categories & products
  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true); setError('')
      try {
        const [c, p] = await Promise.all([
          getCategories({ lang }),
          getProducts({
            lang,
            categoryKey: selectedCategory || undefined,
            search: query || undefined,
            sort
          })
        ])
        if (!alive) return
        setCats(c)
        setItems(p)
      } catch (e) {
        if (alive) setError(e.message || 'Failed to load products.')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    // re-run when filters or lang change
  }, [lang, selectedCategory, query, sort])

  const catMap = useMemo(() => Object.fromEntries(cats.map(c => [c.key, c.label])), [cats])

  return (
    <Container className="py-4" dir={dir}>
      <h2 className="mb-3">{t('products.title')}</h2>

      <ProductFilters
        categories={cats}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
      />

      {loading && <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {items.map(p => (
            <Col key={p.id}>
              <ProductCard p={p} categoryLabel={p.categoryLabel || catMap[p.category]} />
            </Col>
          ))}
          {items.length === 0 && (
            <Col><div className="text-muted">{t('products.noResults')}</div></Col>
          )}
        </Row>
      )}
    </Container>
  )
}
