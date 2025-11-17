import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../context/LocaleContext'
import ProductGallery from '../components/ProductGallery/ProductGallery'
import ProductInfo from '../components/ProductInfo/ProductInfo'
import ProductTabs from '../components/ProductTabs/ProductTabs'
import { supabase } from '../services/supabaseClient'
import { toPublicUrl } from '../services/storageService'   
import { useCart } from '../context/CartContext'          
import { useToast } from '../context/ToastContext'         

const IMAGE_FALLBACK = '/no-image.jpg'

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const { t } = useTranslation()
  const { dir, lang } = useLocale()
  const { addItem } = useCart()
  const { show } = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [product, setProduct] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true); setError('')
      try {
        const { data, error: err } = await supabase
          .from('products')
          .select(`
            id, slug, category_id, title_en, title_ar, description_en, description_ar,
            price_cents, currency, created_at, is_active, stock,
            product_images ( url, position ),
            categories:category_id ( key, name_en, name_ar )
          `)
          .eq('id', productId)
          .eq('is_active', true)
          .maybeSingle()
        if (err) throw err
        if (!data) {
          if (!cancelled) { setProduct(null); setLoading(false) }
          return
        }

        const title = lang === 'ar' ? (data.title_ar || data.title_en) : (data.title_en || data.title_ar)
        const description = lang === 'ar' ? (data.description_ar || data.description_en) : (data.description_en || data.description_ar)

        const images = (data.product_images || [])
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map(img => toPublicUrl(img.url))

        const categoryKey = data.categories?.key
        const categoryLabel = lang === 'ar'
          ? (data.categories?.name_ar || data.categories?.name_en || '')
          : (data.categories?.name_en || data.categories?.name_ar || '')

        const normalized = {
          id: data.id,
          title,
          description: description || '',
          price: (data.price_cents ?? 0) / 100,
          currency: data.currency || (lang === 'ar' ? 'SAR' : 'USD'),
          images: images.length ? images : [IMAGE_FALLBACK],
          image: images[0] || IMAGE_FALLBACK,   // for components that expect a single image
          category: categoryKey,
          categoryLabel,
          stock: data.stock ?? 0,
          createdAt: data.created_at
        }

        if (!cancelled) setProduct(normalized)
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load product.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [productId, lang])

  const handleAdd = () => {
    if (!product) return
    addItem({ id: product.id, title: product.title, price: product.price, image: product.image })
    show(t('cart.added') || 'Product added to the cart', 'success')
  }

  if (loading) {
    return (
      <Container className="py-5" dir={dir}>
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5" dir={dir}>
        <Alert variant="danger" className="mb-3">{error}</Alert>
        <Button as={Link} to="/products" variant="secondary">{t('product.backToProducts')}</Button>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="py-5" dir={dir}>
        <h3 className="mb-3">{t('product.notFound')}</h3>
        <Button as={Link} to="/products" variant="secondary">{t('product.backToProducts')}</Button>
      </Container>
    )
  }

  const images = product.images?.length ? product.images : [product.image]

  return (
    <Container className="py-4" dir={dir}>
      <Row className="gy-4">
        <Col md={6}>
          <ProductGallery images={images} title={product.title} />
        </Col>
        <Col md={6}>
          {/* If your ProductInfo has its own Add button, you can pass onAdd as a prop */}
          <ProductInfo product={product} onAdd={handleAdd} />
        </Col>
      </Row>

      <Row>
        <Col><ProductTabs product={product} /></Col>
      </Row>

      <div className="mt-4 d-flex gap-2">
        <Button as={Link} to="/products" variant="outline-secondary">
          {t('product.back')}
        </Button>
        <Button variant="primary" onClick={handleAdd}>
          {t('product.addToCart')}
        </Button>
        {/* Optional: a "Go to cart" button */}
        {/* <Button as={Link} to="/cart" variant="outline-primary">{t('cart.viewCart')}</Button> */}
      </div>
    </Container>
  )
}
