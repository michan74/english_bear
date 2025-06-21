<template>
  <v-app>
    <!-- header -->
    <v-app-bar
      color="primary"
      density="compact"
      flat
    >
      <v-app-bar-title>
        <NuxtLink to="/" class="text-white" style="text-decoration: none;">
          <v-icon left>mdi-bear</v-icon>
          Bear English
        </NuxtLink>
      </v-app-bar-title>

      <LoginButton />

      <!-- <template v-slot:append>
        <v-btn icon="mdi-dots-vertical"></v-btn>
      </template> -->
    </v-app-bar>
    
    <v-main>
      <NuxtPage />
    </v-main>
    
    <!-- footer -->
    <v-footer
      class="bg-primary text-center d-flex flex-column"
    >
      <div>
        <v-btn
          key="mdi-twitter"
          icon="mdi-twitter"
          class="mx-4"
          variant="text"
          href="https://x.com/SPuemi"
        ></v-btn>
      </div>

      <v-divider></v-divider>

      <div>
        <strong>© 2025 dorayaki, All Rights Reserved</strong>
      </div>
    </v-footer>
  </v-app>
</template>