<template>
  <v-container class="py-4" max-width="900">
    <v-row>
      <v-col
        v-for="word in words"
        :key="word.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mx-auto" elevation="3">
          <v-card-title class="text-h5">{{ word.word }}</v-card-title>
          <v-card-subtitle class="text-subtitle-1 mb-2">{{ word.meaning }}</v-card-subtitle>
          <v-card-text>
            <div v-if="word.example" class="text-body-2">
              <strong>例文:</strong><br />
              {{ word.example }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert type="info" v-if="loading" class="mt-4">読み込み中...</v-alert>
    <v-alert type="warning" v-if="!loading && words.length === 0" class="mt-4">
      まだ単語が登録されていません
    </v-alert>
  </v-container>
</template>

<script>
import { useWords } from '~/composables/useWords'

export default {
  name: 'WordCardList',
  data() {
    return {
      words: [],
      loading: true,
    }
  },
  async mounted() {
    const { getWords } = useWords()
    try {
      this.words = await getWords()
    } catch (e) {
      alert('単語の取得に失敗しました')
      console.error(e)
    } finally {
      this.loading = false
    }
  }
}
</script>
