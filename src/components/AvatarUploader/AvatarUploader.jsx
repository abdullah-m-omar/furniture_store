import { useRef, useState } from 'react'
import { Button, Image, Form } from 'react-bootstrap'

const ACCEPT = 'image/png, image/jpeg, image/jpg, image/webp'
const MAX_MB = 3

export default function AvatarUploader({ value, onChange, label = 'Avatar', dir }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  const openPicker = () => inputRef.current?.click()

  const onFile = (e) => {
    setError('')
    const f = e.target.files?.[0]
    if (!f) return
    if (!ACCEPT.includes(f.type)) {
      setError('Please select a PNG/JPEG/WEBP image.')
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Max file size is ${MAX_MB}MB.`)
      return
    }
    setPreview(URL.createObjectURL(f))
    onChange?.(f)
  }

  const clearFile = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    onChange?.(null)
  }

  const shown = preview || value || '/no-image.jpg'

  return (
    <div dir={dir}>
      <Form.Label className="mb-2">{label}</Form.Label>
      <div className="d-flex align-items-center gap-3">
        <Image src={shown} roundedCircle width={72} height={72} style={{ objectFit: 'cover' }} />
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-primary" onClick={openPicker}>Choose</Button>
          {preview && <Button size="sm" variant="outline-secondary" onClick={clearFile}>Reset</Button>}
        </div>
      </div>
      <Form.Control
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onFile}
        className="d-none"
      />
      {error && <div className="text-danger mt-2" style={{ fontSize: 12 }}>{error}</div>}
    </div>
  )
}
