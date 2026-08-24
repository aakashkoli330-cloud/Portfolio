import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { getFirebase } from './firebase.js'

const db = () => getFirebase().db

export function createItem(name, data) {
  return addDoc(collection(db(), name), data)
}

export function updateItem(name, id, data) {
  return updateDoc(doc(db(), name, id), data)
}

export function deleteItem(name, id) {
  return deleteDoc(doc(db(), name, id))
}

export async function reorderItem(name, items, index, dir) {
  const arr = [...items]
  const [moved] = arr.splice(index, 1)
  arr.splice(index + dir, 0, moved)

  await Promise.all(
    arr
      .map((item, order) => ({ item, order }))
      .filter(({ item, order }) => Boolean(item.id) && (item.order ?? null) !== order)
      .map(({ item, order }) => updateDoc(doc(db(), name, item.id), { order })),
  )
}

export async function saveSettings(data) {
  await setDoc(doc(db(), 'settings', 'site'), data, { merge: true })
}

export function markMessage(id, read) {
  return updateDoc(doc(db(), 'messages', id), { read })
}

export function deleteMessage(id) {
  return deleteDoc(doc(db(), 'messages', id))
}
