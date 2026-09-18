import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFirebase } from './firebase.js'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export async function uploadImage(file, folder = 'uploads') {
  const fb = getFirebase()
  if (!fb) throw new Error('Firebase is not configured.')
  if (!file) throw new Error('No file selected.')
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image is larger than 5 MB.')

  const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase()
  const name = `${Date.now()}-${Math.round(Math.random() * 9999)}.${ext}`
  const fileRef = ref(fb.storage, `${folder}/${name}`)

  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}