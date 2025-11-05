import { useState } from 'react'
import { Row, Col, Image } from 'react-bootstrap'

export default function ProductGallery({ images = [], title = '' }) {
  const list = images.length ? images : ['/no-image.jpg']
  const [active, setActive] = useState(0)

  return (
    <div>
      <Image src={list[active]} alt={title} fluid rounded className="border mb-3" />
      {list.length > 1 && (
        <Row xs={5} className="g-2">
          {list.map((src, i) => (
            <Col key={i}>
              <Image
                src={src}
                alt={`${title} ${i + 1}`}
                fluid
                rounded
                className={`border ${i === active ? 'border-primary' : ''}`}
                onClick={() => setActive(i)}
                role="button"
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
