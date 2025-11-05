// IMPORTANT: named export 'products' (to match your import)
import prodSofa from '../assets/images/prod-sofa.jpg'
import prodCoffeeTable from '../assets/images/prod-coffee-table.jpg'
import prodBed from '../assets/images/prod-bed.jpg'
import prodWardrobe from '../assets/images/prod-wardrobe.jpg'
import prodDiningTable from '../assets/images/prod-dining-table.jpg'

export const products = [
  {
    id: 'p1',
    title: 'Modern 3-Seater Sofa',
    price: 1499,
    image: prodSofa,
    category: 'living',
    description: 'Comfy fabric sofa with solid wood legs and deep cushions.'
  },
  {
    id: 'p2',
    title: 'Walnut Coffee Table',
    price: 499,
    image: prodCoffeeTable,
    category: 'living',
    description: 'Low-profile table in walnut veneer with a storage shelf.'
  },
  {
    id: 'p3',
    title: 'Queen Bed Frame',
    price: 1299,
    image: prodBed,
    category: 'bedroom',
    description: 'Minimalist steel frame with wooden slats and center support.'
  },
  {
    id: 'p4',
    title: '2-Door Wardrobe',
    price: 899,
    image: prodWardrobe,
    category: 'bedroom',
    description: 'Compact wardrobe with hanging rail and adjustable shelves.'
  },
  {
    id: 'p5',
    title: 'Oak Dining Table',
    price: 1099,
    image: prodDiningTable,
    category: 'dining',
    description: 'Seats six comfortably; durable oak top with matte finish.'
  }
]
