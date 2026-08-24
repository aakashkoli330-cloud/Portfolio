import { isFirebaseConfigured } from './firebaseEnv.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function sendMessage({ name, email, message }) {
  if (!isFirebaseConfigured) {
    await delay(700)
    console.info('[demo mode] Contact message captured locally:', {
      name,
      email,
      message,
    })
    return
  }

  const [{ getFirebase }, { collection, addDoc, serverTimestamp }] =
    await Promise.all([
      import('./firebase.js'),
      import('firebase/firestore'),
    ])

  const { db } = getFirebase()
  await addDoc(collection(db, 'messages'), {
    name,
    email,
    message,
    read: false,
    createdAt: serverTimestamp(),
  })
}
