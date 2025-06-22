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

      <!-- 作成ボタン -->
      <v-btn
        type="submit"
        color="primary"
        class="form-field"
      >
        Generate!!
      </v-btn>

      <!-- <v-text-field
        v-model="meaning"
        label="Meaning"
        required
        class="form-field"
      />
      <v-textarea
        v-model="example"
        label="Example Sentence"
        rows="3"
        auto-grow
        class="form-field"
      /> -->
      <input type="file" accept="image/*" @change="onFileChange" class="form-field" />
      <div class="form-actions">
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
        >
          Register
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { useWords } from '~/composables/useWords'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

export default {
  name: 'WordForm',
  data() {
    return {
      word: '',
      meaning: '',
      example: '',
      loading: false,
      imageFile: null,
    }
  },
  methods: {
    async generateWordCard() {
      // ここに単語カード生成のロジックを追加
      // 例えば、単語と意味を使ってカードを生成するなど
      console.log(`Generating card for: ${this.word} - ${this.meaning}`)
      const response = await generatePrompt(this.word);
      console.log('-------------------');
      console.log(`app/pages/word-register.vue: 71`);
      console.log(`word: ${this.word}`);
      console.log(`response: ${response}`);
    },
    onFileChange(e) {
      this.imageFile = e.target.files[0] || null
    },
    async submit() {
      const { addWord } = useWords()
      this.loading = true
      let imageUrl = ''
      try {
        if (this.imageFile) {
          const storage = getStorage()
          const user = this.$firebase.auth.currentUser
          const uid = user ? user.uid : 'unknown'
          // ファイル名をランダムなID＋拡張子にする
          const ext = this.imageFile.name.split('.').pop()
          const randomId = Math.random().toString(36).slice(2) + Date.now()
          const filePath = `users/${uid}/words/${randomId}.${ext}`
          const fileRef = storageRef(storage, filePath)
          await uploadBytes(fileRef, this.imageFile)
          imageUrl = await getDownloadURL(fileRef)
        }
        await addWord(this.word, this.meaning, this.example, imageUrl)
        this.word = ''
        this.meaning = ''
        this.example = ''
        this.imageFile = null
        alert('Registered!')
      } catch (e) {
        console.error(e)
        alert('Registration failed')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.word-register-page {
  max-width: 500px;
  margin: 48px auto 0 auto;
  padding: 32px 24px 40px 24px;
  background: none;
}
.word-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.form-field {
  margin-bottom: 8px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
