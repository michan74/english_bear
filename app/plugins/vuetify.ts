// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'


import colors from 'vuetify/util/colors'
export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#f7e08c', // コダックの体色に近いクリームイエロー
            secondary: '#fffbe7', // さらに淡いクリーム色
            accent: '#fff', // くちばしや手足の白
            brown: '#bfa76a', // 影やライン用のブラウン
            black: '#222', // 頭の毛や目の黒
          }
        },
      },
    },
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
