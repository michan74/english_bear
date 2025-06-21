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
            primary: colors.indigo.lighten2,
            secondary: colors.red.lighten4, // #FFCDD2
          }
        },
      },
    },
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})
