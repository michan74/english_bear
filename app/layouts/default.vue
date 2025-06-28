<template>
  <v-app>
    <!-- header -->
    <v-app-bar
      color="primary"
      density="compact"
      flat
    >
      <v-app-bar-title>
        <NuxtLink to="/" class="text-black" style="text-decoration: none;">
          Bear English
        </NuxtLink>
      </v-app-bar-title>

      <LoginButton />

      <!-- <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template> -->
    </v-app-bar>
    
    <v-main class="pa-0" style="overflow:auto; min-height:0;">
      <NuxtPage />
    </v-main>
    
    <!-- footer -->
    <v-footer
      app
      class="bg-white text-center d-flex flex-column pb-2 pt-1"
      style="border-top: 1px solid #eee; box-shadow: 0 -2px 8px #0001; z-index: 10; min-height: 70px;"
      height="auto"
    >
      <div class="d-flex justify-center align-center" style="height:60px;">
        <NuxtLink to="/" class="flex-grow-1 text-center" style="text-decoration:none;">
          <v-btn variant="text" class="d-flex flex-column align-center mx-2" style="min-width:0;">
            <v-icon color="#FFD700" size="28">mdi-home-heart</v-icon>
            <span style="font-size:13px; color:#1E90FF;">Home</span>
          </v-btn>
        </NuxtLink>
        <NuxtLink to="/flashcard" class="flex-grow-1 text-center" style="text-decoration:none;">
          <v-btn variant="text" class="d-flex flex-column align-center mx-2" style="min-width:0;">
            <v-icon color="#FFD700" size="28">mdi-check</v-icon>
            <span style="font-size:13px; color:#1E90FF;">Study</span>
          </v-btn>
        </NuxtLink>
        <NuxtLink to="/word-register" class="flex-grow-1 text-center" style="text-decoration:none;">
          <v-btn variant="text" class="d-flex flex-column align-center mx-2" style="min-width:0;">
            <v-icon color="#FFD700" size="28">mdi-plus</v-icon>
            <span style="font-size:13px; color:#1E90FF;">Add</span>
          </v-btn>
        </NuxtLink>
      </div>
    </v-footer>
  </v-app>
</template>

<style>
html, body, #__nuxt, #app {
  height: 100vh !important;
  min-height: 100vh !important;
}
</style>