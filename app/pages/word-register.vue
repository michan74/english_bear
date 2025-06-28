<template>
  <div class="word-register-page">
    <h2>Word Registration</h2>
    <form class="word-form" @submit.prevent="generateWordCard">
      <!-- 英単語入力 -->
      <v-text-field
        v-model="word"
        label="Word"
        required
        class="form-field"
      />

      <!-- 生成ボタン -->
      <v-btn
        type="submit"
        color="primary"
        class="form-field"
        :loading="generating"
      >
        Generate!!
      </v-btn>

      <!-- 意味の説明 -->
      <v-text-field
        v-model="meaning"
        label="Meaning"
        readonly
        class="form-field"
      />

      <!-- AI生成画像プレビュー -->
      <v-card v-if="generatedImageUrl" class="mb-4">
        <v-img
          :src="generatedImageUrl"
          height="200"
          cover
          class="bg-grey-lighten-2"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <!-- <v-card-actions>
          <v-btn
            block
            color="primary"
            @click="useGeneratedImage"
            :disabled="!generatedImageUrl"
          >
            Use this image
          </v-btn>
        </v-card-actions> -->
      </v-card>

      <!-- 手動アップロード -->
      <!-- <div v-if="!generatedImageUrl" class="manual-upload">
        <input 
          type="file" 
          accept="image/*" 
          @change="onFileChange" 
          class="form-field" 
        />
      </div> -->

      <!-- 登録ボタン -->
      <div class="form-actions">
        <v-btn
          color="primary"
          :loading="loading"
          @click="submit"
          :disabled="!word || !meaning"
        >
          Register
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { useWords } from "~/composables/useWords";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { usePromptGenerate, useImageGenerateWithOpenAI } from "~/composables/useImagePrompt";

export default {
  name: "WordForm",
  data() {
    return {
      word: "",
      meaning: "",
      example: "",
      loading: false,
      generating: false,
      imageFile: null,
      generatedImageUrl: null,
    }
  },
  methods: {
    async generateWordCard() {
      this.generating = true;
      try {
        // プロンプト生成
        console.log("Generating prompt for word:", this.word);
        const data = await usePromptGenerate(this.word);
        console.log("Response data:", data);
        
        if (!data) {
          throw new Error("Failed to generate prompt");
        }
        
        // 意味の説明を表示
        if (data.simple_definition) {
          this.meaning = data.simple_definition;
        } else {
          throw new Error("No meaning received");
        }
        
        // OpenAIで画像生成
        if (data.image_prompt) {
          console.log("Generating image with OpenAI, prompt:", data.image_prompt);
          const imageUrl = await useImageGenerateWithOpenAI(data.image_prompt);
          console.log("Generated image URL:", imageUrl);
          
          if (imageUrl) {
            this.generatedImageUrl = imageUrl;
            
            // 画像URLからBlobを作成
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();
            this.imageFile = new File([imageBlob], `${this.word}_ai_generated.png`, {
              type: "image/png"
            });
          }
        } else {
          throw new Error("No image prompt received");
        }
      } catch (error) {
        console.error("Error in generateWordCard:", error);
        alert(error.message || "Failed to generate word card");
      } finally {
        this.generating = false;
      }
    },
    async submit() {
      this.loading = true;
      try {
        // ユーザーIDの取得
        const { $firebase } = useNuxtApp();
        const user = $firebase.auth.currentUser
        console.log("Current user:", user);
        if (!user) {
          throw new Error('Please login first! 🐾');
        }

        // Firebase Storageに画像をアップロード
        if (this.imageFile) {
          const storage = getStorage();
          const userId = user.uid;
          // ユーザーごとのパスに画像を保存
          const imageRef = storageRef(
            storage, 
            `users/${userId}/words/${this.word}_${Date.now()}.webp`
          );
          
          await uploadBytes(imageRef, this.imageFile);
          const imageUrl = await getDownloadURL(imageRef);
          
          // 単語と意味をFirestoreに登録
          const { addWord } = useWords();
          await addWord(this.word, this.meaning, imageUrl);
          
          // 成功したらフォームをクリア
          this.word = "";
          this.meaning = "";
          this.imageFile = null;
          this.generatedImageUrl = null;
          
          alert('Word registered successfully! 🎉');
        } else {
          alert('Please generate an image first! 🐾');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        if (error.message.includes('login')) {
          alert('Please login to register words! 🔑');
        } else {
          alert('Failed to register word. Please try again! 🙏');
        }
      } finally {
        this.loading = false;
      }
    },
    // onFileChange(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.imageFile = file;
        
    //     // FileReaderを使って画像を表示
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //       this.generatedImageUrl = e.target.result;
    //     };
    //     reader.readAsDataURL(file);
    //   }
    // },
    // useGeneratedImage() {
    //   // 生成された画像を手動アップロード用に設定
    //   this.imageFile = null;
    //   this.generatedImageUrl = URL.createObjectURL(this.generatedImageBlob);
    // },
  },
}
</script>

<style scoped>
.word-register-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.word-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-field {
  margin-bottom: 16px;
}

.form-actions {
  margin-top: 20px;
}
</style>
