// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      cloudFunctionUrl: process.env.CLOUD_FUNCTION_URL, // Cloud FunctionのURLを環境変数から取得
      // Firebase Emulator用のURL
      cloudFunctionPromptUrl: process.env.CLOUD_FUNCTION_PROMPT_URL,
      cloudFunctionImageUrl: process.env.CLOUD_FUNCTION_IMAGE_URL,
      cloudFunctionImageWithOpenAIUrl: process.env.CLOUD_FUNCTION_IMAGE_WITH_OPENAI_URL,
      cloudFunctionAudioUrl: process.env.CLOUD_FUNCTION_AUDIO_URL, // 音声合成用のCloud FunctionのURL
      cloudFunctionQuoteUrl: process.env.CLOUD_FUNCTION_QUOTE_URL, // インスピレーション用のCloud FunctionのURL
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  app: {
    head: {
      title: 'Bear Horizon',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Bear Horizon - Your English Learning Companion' },
        { name: 'theme-color', content: '#ffffff' },
      ],
    },
  },
})
