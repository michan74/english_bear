<template>
  <div>
    <div v-if="!user">
      <v-btn
        class="login-button"
        color="primary"
        @click="signInWithGoogle"
      >
        Log in
      </v-btn>
    </div>
    <div v-else>
      <v-avatar>
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