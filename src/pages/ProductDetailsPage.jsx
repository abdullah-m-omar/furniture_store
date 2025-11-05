import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import { products } from '../data/products.js'
import ProductGallery from '../components/ProductGallery/ProductGallery'
import ProductInfo from '../components/ProductInfo/ProductInfo'
import ProductTabs from '../components/ProductTabs/ProductTabs'

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const { t } = useTranslation()
  const { dir } = useLocale()

  const product = products.find(p => p.id === productId)

  if (!product) {
    return (
      <Container className="py-5" dir={dir}>
        <h3 className="mb-3">{t('product.notFound')}</h3>
        <Button as={Link} to="/products" variant="secondary">{t('product.backToProducts')}</Button>
      </Container>
    )
  }

  // If you had multiple images per product, pass that array; fallback to [image]
  const images = product.images?.length ? product.images : [product.image]

  return (
    <Container className="py-4" dir={dir}>
      <Row className="gy-4">
        <Col md={6}><ProductGallery images={images} title={product.title} /></Col>
        <Col md={6}><ProductInfo product={product} /></Col>
      </Row>
      <Row>
        <Col><ProductTabs product={product} /></Col>
      </Row>
      <div className="mt-4">
        <Button as={Link} to="/products" variant="outline-secondary">{t('product.back')}</Button>
      </div>
    </Container>
  )
}
