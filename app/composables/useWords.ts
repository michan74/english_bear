// composables/useWords.ts
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'

export const useWords = () => {
  const { $firebase } = useNuxtApp();
  const addWord = async (word: string, meaning: string, imageUrl: string = '') => {
    const user = $firebase.auth.currentUser
    if (!user) throw new Error('ログインしていません')

    const uid = user.uid

    await addDoc(collection($firebase.db, `users/${uid}/words`), {
      word,
      meaning,
      imageUrl, // 画像URLを追加
      createdAt: serverTimestamp()
    })
  }

  const getWords = async () => {
    const { $firebase } = useNuxtApp();
    const user = $firebase.auth.currentUser
    if (!user) throw new Error('ログインしていません')
    const uid = user.uid

    const snapshot = await getDocs(collection($firebase.db, `users/${uid}/words`))
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  return { addWord, getWords }
}
