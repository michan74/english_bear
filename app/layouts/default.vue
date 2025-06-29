<template>
  <v-app>
    <div class="login-button-wrapper">
      <LoginButton />
    </div>
    
    <v-main class="pa-0 mb-15" style="overflow:auto; min-height:0;">
      <NuxtPage />
    </v-main>
    
    <!-- footer -->
    <v-footer
      app
      class="text-center d-flex flex-column pb-2 pt-1 footer-custom bg-secondary"
      style="border-top: 1px solid rgb(var(--v-theme-primary)); box-shadow: 0 -2px 8px rgba(var(--v-theme-primary), 0.1); z-index: 10; min-height: 70px;"
      height="auto"
    >
      <div class="d-flex justify-center align-center" style="height:60px;">
        <NuxtLink to="/" class="flex-grow-1 text-center" style="text-decoration:none;">
          <v-btn variant="text" class="d-flex flex-column align-center mx-2 footer-btn" style="min-width:0;">
            <v-icon color="primary" size="28">mdi-home-heart</v-icon>
            <span class="footer-text">Home</span>
          </v-btn>
        </NuxtLink>
        <NuxtLink to="/flashcard" class="flex-grow-1 text-center" style="text-decoration:none;">
          <v-btn variant="text" class="d-flex flex-column align-center mx-2 footer-btn" style="min-width:0;">
            <v-icon color="primary" size="28">mdi-check</v-icon>
            <span class="footer-text">Study</span>
          </v-btn>
        </NuxtLink>
        <NuxtLink to="/word-register" class="flex-grow-1 text-center" style="text-decoration:none;">
          <v-btn variant="text" class="d-flex flex-column align-center mx-2 footer-btn" style="min-width:0;">
            <v-icon color="primary" size="28">mdi-plus</v-icon>
            <span class="footer-text">Add</span>
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

.footer-custom {
  opacity: 1 !important;
  background-color: rgb(var(--v-theme-secondary)) !important;
}

.footer-text {
  font-size: 13px;
  color: rgb(var(--v-theme-primary));
  transition: color 0.3s ease;
  opacity: 0.95;
  font-weight: 500;
}

.footer-btn {
  transition: all 0.3s ease;
}

.footer-btn:hover {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
}

.footer-btn:hover .footer-text {
  color: rgb(var(--v-theme-primary));
  opacity: 1;
}

.footer-btn:hover .v-icon {
  opacity: 1;
  transform: scale(1.05);
}

.v-btn--active .footer-text {
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

.v-btn--active .v-icon {
  transform: scale(1.1);
  opacity: 1;
}

.login-button-wrapper {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>