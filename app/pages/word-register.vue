<template>
  <div class="word-register-page">
    <h2>単語登録</h2>
    <form class="word-form" @submit.prevent="submit">
      <v-text-field
        v-model="word"
        label="単語"
        required
        class="form-field"
      />
      <v-text-field
        v-model="meaning"
        label="意味"
        required
        class="form-field"
      />
      <v-textarea
        v-model="example"
        label="例文"
        rows="3"
        auto-grow
        class="form-field"
      />
      <div class="form-actions">
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
        >
          登録する
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { useWords } from '~/composables/useWords'

export default {
  name: 'WordForm',
  data() {
    return {
      word: '',
      meaning: '',
      example: '',
      loading: false,
    }
  },
  methods: {
    async submit() {
      const { addWord } = useWords()
      this.loading = true
      try {
        await addWord(this.word, this.meaning, this.example)
        this.word = ''
        this.meaning = ''
        this.example = ''
        alert('登録しました')
      } catch (e) {
        console.error(e)
        alert('登録に失敗しました')
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
