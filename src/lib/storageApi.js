const MAX_OUTPUT_CHARS = 500 * 1024
const MAX_SIDE = 1400
const MAX_RAW_BYTES = 12 * 1024 * 1024

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image file.'))
    }
    img.src = url
  })
}

function render(img, maxSide, quality, type) {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL(type, Math.max(0.5, quality))
}

export async function uploadImage(file) {
  if (!file) throw new Error('No file selected.')
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > MAX_RAW_BYTES) {
    throw new Error('Image is larger than 12 MB — pick a smaller file.')
  }

  const { img, url } = await loadImage(file)
  URL.revokeObjectURL(url)

  const isWebp =
    typeof document !== 'undefined' &&
    document.createElement('canvas').toDataURL('image/webp', 1).startsWith(
      'data:image/webp',
    )
  const type = isWebp ? 'image/webp' : 'image/jpeg'

  let quality = 0.84
  let maxSide = MAX_SIDE
  let dataUrl = render(img, maxSide, quality, type)

  while (dataUrl.length > MAX_OUTPUT_CHARS && maxSide > 480) {
    maxSide = Math.round(maxSide * 0.8)
    quality -= 0.12
    dataUrl = render(img, maxSide, quality, type)
  }

  if (dataUrl.length > MAX_OUTPUT_CHARS) {
    throw new Error(
      'Image stayed too large after compression — use a smaller or simpler picture.',
    )
  }

  return dataUrl
}