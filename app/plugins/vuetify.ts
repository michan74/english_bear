// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'


export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#8B4513', // サドルブラウン（メインカラー）
            secondary: '#FFF3D4', // 薄いコダックイエロー（コンポーネント背景）
            accent: '#f7e08c', // コダックイエロー（アクセントカラー）
            background: '#FFFAF5', // 薄いクリーム色（アプリ全体の背景）
            surface: '#FFFFFF', // 白（カード背景）
            'brown-light': '#DEB887', // バーリーウッド（薄めの茶色）
            'brown-dark': '#654321', // ダークブラウン（テキストなど）
            error: '#B22222', // ファイアーブリック
            info: '#4682B4', // スティールブルー
            success: '#228B22', // フォレストグリーン
            warning: '#CD853F', // ペルー
          }
        },
      },
    },
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
