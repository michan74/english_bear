<template>
  <v-container class="pa-4" max-width="500">
    <v-card>
      <v-card-title>単語登録</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="word"
            label="単語"
            required
          />
          <v-text-field
            v-model="meaning"
            label="意味"
            required
          />
          <v-textarea
            v-model="example"
            label="例文"
            rows="3"
            auto-grow
          />
          <v-btn
            type="submit"
            color="primary"
            class="mt-4"
            :loading="loading"
          >
            登録する
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-btn color="secondary" class="mt-4" to="/wordbook" tag="NuxtLink">
      単語帳へ
    </v-btn>
  </v-container>
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
        // TODO: スクロール
        // useGoTo(0);
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
