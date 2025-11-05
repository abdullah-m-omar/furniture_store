import { Carousel, Container } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import hero_1 from '../../assets/images/hero-1.jpg'
import hero_2 from '../../assets/images/hero-2.jpg'
import hero_3 from '../../assets/images/hero-3.jpg'

export default function HeroSlider() {
  const { t } = useTranslation()
  const slides = [
    { id: 1, img: hero_1, title: t('home.hero.1.title'), sub: t('home.hero.1.sub') },
    { id: 2, img: hero_2, title: t('home.hero.2.title'), sub: t('home.hero.2.sub') },
    { id: 3, img: hero_3, title: t('home.hero.3.title'), sub: t('home.hero.3.sub') }
  ]

  return (
    <section aria-label={t('home.hero.aria')}>
      <Carousel fade>
        {slides.map(s => (
          <Carousel.Item key={s.id}>
            <div
              style={{
                backgroundImage: `url(${s.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '60vh',
                minHeight: 380
              }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
              <h2 className="fw-bold">{s.title}</h2>
              <p className="mb-0">{s.sub}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      {/* Optional small container shadow overlap effect */}
      <Container />
    </section>
  )
}
