import { useMemo, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import ProductCard from '../components/ProductCard/ProductCard'
import ProductFilters from '../components/ProductFilters/ProductFilters'
import { products } from '../data/products'
import { categories as rawCategories } from '../data/Categories'
import { useLocale } from '../context/LocaleContext'

export default function ProductsPage() {
  const { t } = useTranslation()
  const { dir } = useLocale()

  // Localize category labels from i18n
  const categories = useMemo(
    () => rawCategories.map(c => ({ ...c, label: t(`categories.${c.key}`) })),
    [t]
  )
  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.key, c.label])), [categories])

  const [selectedCategory, setSelectedCategory] = useState('')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    let list = products.slice()

    if (selectedCategory) list = list.filter(p => p.category === selectedCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    // 'newest' → keep insertion order for now (you can add a 'createdAt' later)

    return list
  }, [selectedCategory, query, sort])

  return (
    <Container className="py-4" dir={dir}>
      <h2 className="mb-3">{t('products.title')}</h2>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        query={query}
        onQueryChange={setQuery}
        sort={sort} onSortChange={setSort}
      />

      {/* <SortBar sort={sort} onSortChange={setSort} /> */}

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">
        {filtered.map(p => (
          <Col key={p.id}>
            <ProductCard p={p} categoryLabel={catMap[p.category]} />
          </Col>
        ))}
        {filtered.length === 0 && (
          <Col>
            <div className="text-muted">{t('products.noResults')}</div>
          </Col>
        )}
      </Row>
    </Container>
  )
}
