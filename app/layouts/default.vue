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
      class="text-center d-flex flex-column footer-custom bg-secondary px-2"
      style="border-top: 1px solid rgb(var(--v-theme-primary)); box-shadow: 0 -2px 8px rgba(var(--v-theme-primary), 0.1); z-index: 10; height: 72px;"
      height="72"
    >
      <div class="d-flex justify-space-between align-center" style="height: 100%; width: 100%; max-width: 600px; margin: 0 auto;">
        <NuxtLink to="/" class="text-decoration-none">
          <v-btn variant="text" class="footer-btn px-2" style="min-width: 72px; height: 56px;">
            <v-icon color="primary" size="34">mdi-home-heart</v-icon>
          </v-btn>
          <span class="footer-text mt-n2">HOME</span>
        </NuxtLink>
        <NuxtLink to="/word-register" class="text-decoration-none">
          <v-btn variant="text" class="footer-btn px-2" style="min-width: 72px; height: 56px;">
            <v-icon color="primary" size="38">mdi-pencil-plus</v-icon>
          </v-btn>
          <span class="footer-text mt-n2">ADD</span>
        </NuxtLink>
        <NuxtLink to="/flashcard" class="text-decoration-none">
          <v-btn variant="text" class="footer-btn px-2" style="min-width: 72px; height: 56px;">
            <v-icon color="primary" size="38">mdi-cards-outline</v-icon>
          </v-btn>
          <span class="footer-text mt-n2">FLASHCARDS</span>
        </NuxtLink>
        <NuxtLink to="/wordbook" class="text-decoration-none">
          <v-btn variant="text" class="footer-btn px-2" style="min-width: 72px; height: 56px;">
            <v-icon color="primary" size="38">mdi-notebook</v-icon>
          </v-btn>
          <span class="footer-text mt-n2">WORD LIST</span>
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
  font-size: 10px;
  color: rgb(var(--v-theme-primary));
  transition: color 0.3s ease;
  opacity: 0.95;
  font-weight: 600;
  white-space: nowrap;
  display: block;
  text-align: center;
  margin-top: -4px;
  letter-spacing: 0.5px;
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