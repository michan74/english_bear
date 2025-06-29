<template>
  <v-container class="py-4 mt-15" max-width="900">
    <v-row dense>
      <v-col
        v-for="word in words"
        :key="word.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="word-card mx-auto">
          <div class="word-header">
            <h3 class="text-h6 word-text">{{ word.word }}</h3>
            <v-btn
              v-if="word.audioUrl"
              icon="mdi-volume-high"
              size="small"
              color="accent"
              variant="plain"
              @click="playAudio(word.audioUrl)"
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
 
          <div class="word-content">
            <div class="meaning-section">
              <div class="section-label">Definition</div>
              <div class="text-body-1 meaning-text">{{ word.meaning }}</div>
            </div>

            <div v-if="word.exampleSentence" class="example-section mt-4">
              <div class="section-label">Example</div>
              <div class="text-body-2 example-text">{{ word.exampleSentence }}</div>
            </div>
          </div>
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
import { useSpeech } from '~/composables/useSpeech'

export default {
  name: 'WordCardList',
  data() {
    return {
      words: [],
      loading: true,
    }
  },
  methods: {
    async playAudio(audioUrl) {
      if (audioUrl) {
        const { playAudio } = useSpeech()
        playAudio(audioUrl)
      }
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

<style scoped>
.word-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
}

.word-header {
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.word-text {
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

.word-content {
  padding: 12px 16px;
}

.section-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 4px;
}

.meaning-text {
  color: #2d3436;
  line-height: 1.5;
}

.example-text {
  color: #636e72;
  line-height: 1.6;
  font-style: italic;
}
</style>
