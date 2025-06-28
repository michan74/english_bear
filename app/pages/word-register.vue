<template>
  <div class="word-register-page">
    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorMessage"
      color="pink-lighten-4"
      location="top"
      :timeout="3000"
      elevation="0"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="pink-darken-1">mdi-alert-circle</v-icon>
        <span class="text-pink-darken-1">{{ errorMessage }}</span>
      </div>
      
      <template v-slot:actions>
        <v-btn
          color="pink-darken-1"
          variant="text"
          @click="showErrorMessage = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      color="blue-lighten-4"
      location="top"
      :timeout="3000"
      elevation="0"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="blue-darken-1">mdi-check-circle</v-icon>
        <span class="text-blue-darken-1">{{ successMessage }}</span>
      </div>
      
      <template v-slot:actions>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="showSuccessMessage = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <div class="page-header text-center mb-6 mt-15">
      <h2>Add Card</h2>
      <p class="text-subtitle-1 text-medium-emphasis">Create a new flashcard with AI-powered visuals</p>
    </div>

    <form class="word-form" @submit.prevent="generateWordCard">
      <!-- Initial Input Section -->
      <div v-if="!meaning && !generatedImageUrl">
        <v-text-field
          v-model="word"
          label="Enter a word or phrase"
          placeholder="Type any English word..."
          required
        />

        <v-btn
          type="submit"
          color="primary"
          class="form-field"
          :loading="generating"
          variant="flat"
          block
        >
          <v-icon left>mdi-auto-fix</v-icon>
          Generate Card
        </v-btn>
      </div>

      <!-- Results Section -->
      <div v-else>
        <!-- Word Display -->
        <div class="d-flex align-center mb-4">
          <div class="text-h5 font-weight-medium text-primary">
            {{ word }}
          </div>
          <v-btn
            icon="mdi-volume-high"
            :disabled="!word || !audioUrl"
            color="primary"
            @click="playAudio"
            class="ml-2"
            density="comfortable"
            variant="outlined"
            size="small"
          >
            <v-icon>mdi-volume-high</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >
              Play audio
            </v-tooltip>
          </v-btn>
        </div>

        <!-- Meaning Display -->
        <v-textarea
          v-model="meaning"
          label="Definition"
          readonly
          class="form-field mb-4"
          variant="outlined"
          auto-grow
          rows="2"
          :hide-details="true"
          density="comfortable"
        />

        <!-- Image Section -->
        <v-card class="mb-4 elevation-0 rounded-lg overflow-hidden">
          <!-- Loading State -->
          <div v-if="generating" class="image-loading-container">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <div class="text-body-2 text-medium-emphasis mt-3">
              Creating your card illustration...
            </div>
          </div>

          <!-- Generated Image -->
          <v-img
            v-else-if="generatedImageUrl"
            :src="generatedImageUrl"
            height="240"
            cover
            class="bg-grey-lighten-2 rounded-lg"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-card>

        <!-- Action Buttons -->
        <div class="d-flex flex-column">
          <v-btn
            color="primary"
            :loading="loading"
            @click="submit"
            block
            variant="flat"
            class="primary-button mb-6"
          >
            <v-icon left>mdi-content-save</v-icon>
            Save Card
          </v-btn>

          <v-btn
            color="blue-lighten-4"
            @click="resetForm"
            block
            variant="flat"
            class="retry-button"
          >
            <v-icon left class="text-blue-darken-1">mdi-refresh</v-icon>
            <span class="text-blue-darken-1">Generate Another</span>
          </v-btn>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useWords } from "~/composables/useWords";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { usePromptGenerate, useImageGenerateWithOpenAI } from "~/composables/useImagePrompt";
import { useSpeech } from "~/composables/useSpeech";
import { ref } from 'vue';

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
      errorMessage: "",
      showErrorMessage: false,
      showSuccessMessage: false,
      successMessage: "",
      audioUrl: null,
      audioFile: null,
      generatingSpeech: ref(false),
    }
  },
  methods: {
    showError(message) {
      this.errorMessage = message;
      this.showErrorMessage = true;
    },
    showSuccess(message) {
      this.successMessage = message;
      this.showSuccessMessage = true;
    },
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

        // 音声の生成
        console.log("Generating audio for word:", this.word);
        await this.generateSpeech(this.word);

      } catch (error) {
        console.error("Error in generateWordCard:", error);
        this.showError(error.message || "Failed to generate word card...");
      } finally {
        this.generating = false;
      }
    },
    async submit() {
      this.loading = true;
      try {
        const { $firebase } = useNuxtApp();
        const user = $firebase.auth.currentUser;
        console.log("Current user:", user);
        if (!user) {
          throw new Error('Please login first! 🐾');
        }

        const storage = getStorage();
        const userId = user.uid;
        const timestamp = Date.now();
        let imageUrl = null;
        let audioUrl = null;

        // 画像の保存
        if (this.imageFile) {
          const imageRef = storageRef(
            storage, 
            `users/${userId}/words/${this.word}_${timestamp}.webp`
          );
          await uploadBytes(imageRef, this.imageFile);
          imageUrl = await getDownloadURL(imageRef);
        } else {
          throw new Error('Please generate an image first!');
        }

        // 音声の保存
        if (this.audioFile) {
          const audioRef = storageRef(
            storage,
            `users/${userId}/words/${this.word}_${timestamp}.mp3`
          );
          await uploadBytes(audioRef, this.audioFile);
          audioUrl = await getDownloadURL(audioRef);
        }

        // FirestoreにURLを保存
        const { addWord } = useWords();
        await addWord(this.word, this.meaning, imageUrl, audioUrl);

        // 成功したらフォームをクリア
        this.word = "";
        this.meaning = "";
        this.imageFile = null;
        this.generatedImageUrl = null;
        this.audioFile = null;
        this.audioUrl = null;

        this.showSuccess('Card saved successfully!');
      } catch (error) {
        console.error('Error during registration:', error);
        if (error.message.includes('login')) {
          this.showError('Please login to save cards! ');
        } else {
          this.showError(error.message || 'Failed to save card. Please try again! ');
        }
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.word = "";
      this.meaning = "";
      this.imageFile = null;
      this.generatedImageUrl = null;
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
    async generateSpeech(text) {
      try {
        const { generateSpeech } = useSpeech()
        const { audioUrl, audioFile } = await generateSpeech(text)
        this.audioUrl = audioUrl
        this.audioFile = audioFile
      } catch (error) {
        this.showError('Failed to generate audio... ')
      }
    },

    playAudio() {
      if (this.audioUrl) {
        const { playAudio } = useSpeech()
        playAudio(this.audioUrl)
      }
    },
  },
}
</script>

<style scoped>
.word-register-page {
  max-width: 600px;
  margin: 80px auto 0;
  padding: 20px;
}

.error-alert {
  margin-bottom: 20px;
  border-radius: 12px;
  font-size: 0.9em;
  opacity: 0.95;
}

.word-form {
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.page-header {
  h2 {
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  p {
    color: rgba(var(--v-theme-primary), 0.7);
    font-weight: 400;
  }
}

h2 {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  font-size: 1.8em;
  margin-bottom: 1em;
}

.form-field {
  margin-bottom: 1rem;
}

/* Vuetifyのスタイル上書き */
:deep(.v-text-field) {
  .v-input__slot {
    background-color: #fafbfc !important;
  }
}

:deep(.v-btn) {
  letter-spacing: 0.5px;
  font-weight: 500;
  text-transform: none;
  
  &.primary-button {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: white !important;
    font-weight: 600 !important;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &.retry-button {
    font-weight: 500 !important;
    margin-bottom: 8px;
    
    &:hover {
      background-color: rgb(var(--v-theme-blue-lighten-3)) !important;
      opacity: 0.95;
    }
  }
}

:deep(.v-textarea) {
  .v-field__input {
    min-height: unset !important;
    padding-top: 12px !important;
    line-height: 1.6 !important;
  }
  
  textarea {
    font-size: 0.95em !important;
    color: rgba(var(--v-theme-on-surface), 0.85) !important;
  }
}

.image-loading-container {
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--v-theme-secondary));
  border-radius: 8px;
}
</style>
