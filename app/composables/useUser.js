// useUser.js
import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'

const user = ref(null)
let authReadyPromise

export function useUser() {
  const { $firebase } = useNuxtApp()
  if (!$firebase) return { user, authReadyPromise }
  if (!authReadyPromise) {
    authReadyPromise = new Promise((resolve) => {
      onAuthStateChanged($firebase.auth, (u) => {
        user.value = u
        resolve()
      })
    })
  }
  return { user, authReadyPromise }
}