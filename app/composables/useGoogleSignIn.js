// Googleサインイン用のComposable

import { GoogleAuthProvider, signInWithPopup, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";


export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  // 認証状態の永続化を設定
  const { $firebase } = useNuxtApp();
  setPersistence($firebase.auth, browserLocalPersistence)
  .then(async () => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    
    // 認証状態の永続化が設定された後に、ポップアップでサインインを実行
    try {
      const result = await signInWithPopup($firebase.auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log("Google Sign-In successful:", user);
      
      return { user, token };
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      throw { errorCode, errorMessage, email, credential };
    }
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

export function logOut() {
  const { $firebase } = useNuxtApp();
  signOut($firebase.auth).then(() => {
    // Sign-out successful.
    console.log("Sign-out successful.");
  }).catch((error) => {
    // An error happened.
    console.error("Sign-out error:", error);
    throw error;
  });
}