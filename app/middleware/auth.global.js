import { useUser } from '~/composables/useUser'

export default defineNuxtRouteMiddleware(async(to, from) => {
  const { user, authReadyPromise } = useUser()

  if (authReadyPromise) {
    await authReadyPromise // 認証状態が確定するまで待つ
  }

  if (to.path === '/login' && user.value) {
    return navigateTo('/')
  }

  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})