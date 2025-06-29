// composables/useWords.ts
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, getStorage, ref } from 'firebase/storage';

export const useWords = () => {
  const { $firebase } = useNuxtApp();
  const addWord = async (word: string, meaning: string, imageUrl: string = '', audioUrl: string = '', exampleSentence: string = '') => {
    const user = $firebase.auth.currentUser
    if (!user) throw new Error('ログインしていません')

    const uid = user.uid

    await addDoc(collection($firebase.db, `users/${uid}/words`), {
      word,
      meaning,
      imageUrl, // 画像URLを追加
      audioUrl, // 音声URLを追加
      exampleSentence, // 例文を追加
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

  const deleteWord = async (wordId: string, imageUrl: string, audioUrl: string) => {
    const { $firebase } = useNuxtApp();
    const user = $firebase.auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    try {
      // Firestoreからドキュメントを削除
      const wordRef = doc($firebase.db, "users", user.uid, "words", wordId);
      await deleteDoc(wordRef);

      // Storageから画像と音声を削除
      const storage = getStorage();
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(error => {
          console.error("Error deleting image:", error);
        });
      }
      if (audioUrl) {
        const audioRef = ref(storage, audioUrl);
        await deleteObject(audioRef).catch(error => {
          console.error("Error deleting audio:", error);
        });
      }
    } catch (error) {
      console.error("Error deleting word:", error);
      throw error;
    }
  };

  const getWordCount = async () => {
    const words = await getWords();
    return words.length;
  };

  return { addWord, getWords, deleteWord, getWordCount }
}
