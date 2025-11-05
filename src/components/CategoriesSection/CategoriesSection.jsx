import { Container, Row, Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import catLiving from '../../assets/images/cat-living.jpg'
import catBedroom from '../../assets/images/cat-bedroom.jpg'
import catDining from '../../assets/images/cat-dining.jpg'
import catOffice from '../../assets/images/cat-office.jpg'

export default function CategoriesSection() {
  const { t } = useTranslation()
  const cats = [
    { key: 'living', img: catLiving, to: '/products?category=Living%20Room' },
    { key: 'bedroom', img: catBedroom, to: '/products?category=Bedroom' },
    { key: 'dining', img: catDining, to: '/products?category=Dining' },
    { key: 'office', img: catOffice, to: '/products?category=Office' }
  ]

  return (
    <section className="py-5 bg-light">
      <Container>
        <h3 className="mb-4">{t('home.categories.title')}</h3>
        <Row xs={2} md={4} className="g-3">
          {cats.map(c => (
            <Col key={c.key}>
              <Card as={Link} to={c.to} className="h-100 text-decoration-none shadow-sm">
                <Card.Img src={c.img} alt="" style={{ height: 150, objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title className="fs-6 mb-0">{t(`home.categories.items.${c.key}`)}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}
