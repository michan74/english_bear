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
})
