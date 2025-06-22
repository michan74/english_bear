// Import the functions you need from the SDKs you need]
import { initializeApp } from "firebase/app";
import { getAI } from "firebase/vertexai";
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

  // Vertex AI service　を初期化
  // const vertexAI = getVertexAI(firebaseApp);
  // // スキーマの指定
  // const jsonSchema = Schema.object({
  //   properties: {
  //     hashtags: Schema.array({
  //       items: Schema.string(),
  //     }),
  //   }
  // });

  // 関数の指定
  // 良いAPIがあったら、使う
  // const fetchHashtag = async ({ location, date }) => {

  //   // TODO(developer): Write a standard function that would call to an external weather API.
  
  //   // For demo purposes, this hypothetical response is hardcoded here in the expected format.
  //   return {
  //     temperature: 38,
  //     chancePrecipitation: "56%",
  //     cloudConditions: "partlyCloudy",
  //   };
  // }


  // Gemini 1.5 model　を指定　（他の Gemini Versionも指定可能）
  // const model = getGenerativeModel(vertexAI, 
  //   { 
  //     model: "gemini-1.5-flash" ,
  //     systemInstruction: "You are a top instagram influencer.",
  //     generationConfig: {
  //       responseMimeType: "application/json",
  //       responseSchema: jsonSchema,
  //       temperature: 0.9,
  //     }, 
  //   });

  return {
    provide: {
      firebase: { 
        auth, 
        db,
      },
    },
  };
})