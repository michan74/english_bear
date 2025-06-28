// Import the functions you need from the SDKs you need]
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from "firebase/auth";
export default defineNuxtPlugin((nuxtApp) => {

  const config = useRuntimeConfig();

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: config.public.apiKey,
    authDomain: config.public.authDomain,
    projectId: config.public.projectId,
    storageBucket: config.public.storageBucket,
    messagingSenderId: config.public.messagingSenderId,
    appId: config.public.appId,
  };

  // Initialize Firebase or get existing app
  const app = initializeApp(firebaseConfig);


  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  // Set the language code to Japanese
  auth.languageCode = 'ja';
  // Add the Google provider to the auth instance
  auth.useDeviceLanguage();

  // DB
  const db = getFirestore(app);

  return {
    provide: {
      firebase: { 
        auth, 
        db,
      },
    },
  };
})