<template>
  <div>
    <div v-if="!user">
      <v-btn
        class="login-button"
        color="black"
        @click="signInWithGoogle"
      >
        Log in
      </v-btn>
    </div>
    <div v-else>
      <v-avatar v-if="user.photoURL" class="mr-4">
        <v-img
        :alt="user.displayName"
        :src="user.photoURL"
        >
          <v-menu activator="parent">
            <v-list>
              <v-list-item @click="logOut">
                <v-list-item-title>Log out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-img>
      </v-avatar>
      <v-avatar v-else>
        <v-icon icon="mdi-account-circle"></v-icon>
      </v-avatar>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { useNuxtApp } from '#app'

export default {
  name: 'LoginPopup',
  setup() {
    const { user } = useUser();
    return { 
      user, 
    };
  },
};
</script>