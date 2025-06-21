import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'

const user = ref(null) // ← 関数の外で定義

export function useUser() {
  const { $firebase } = useNuxtApp()
  if ($firebase && !$firebase._userWatcher) {
    onAuthStateChanged($firebase.auth, (u) => {
      console.log('Auth state changed:', u)
      user.value = u
    })
    $firebase._userWatcher = true // 二重登録防止
  }
  return { user }
}