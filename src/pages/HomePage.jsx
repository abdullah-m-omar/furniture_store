import HeroSlider from '../components/HeroSlider/HeroSlider'
import AboutSection from '../components/AboutSection/AboutSection'
import CategoriesSection from '../components/CategoriesSection/CategoriesSection'
import ProductListSection from '../components/ProductListSection/ProductListSection'
import TestimonialsSection from '../components/TestimonialsSection/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSection />
      <CategoriesSection />
      <ProductListSection />
      <TestimonialsSection />
    </>
  )
}
