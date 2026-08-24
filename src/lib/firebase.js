import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { firebaseConfig, isFirebaseConfigured } from './firebaseEnv.js'

let app
let db
let auth
let storage

export function getFirebase() {
  if (!isFirebaseConfigured) return null
  if (!app) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
    storage = getStorage(app)
  }
  return { app, db, auth, storage }
}
