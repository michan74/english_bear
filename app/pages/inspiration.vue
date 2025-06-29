<template>
  <v-container class="pa-4 mt-15">
    <div class="d-flex justify-center mb-6">
      <v-img
        src="/bear_horizon.png"
        alt="Inspiring Bear"
        max-width="250"
      />
    </div>
    <v-card class="inspiration-card mb-6 mx-auto" max-width="600" rounded="xl" elevation="0">
      <v-card-text class="pa-8 text-center">
        <template v-if="isInitialLoading || isLoading">
          <div class="d-flex justify-center align-center" style="min-height: 150px">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="50"
            ></v-progress-circular>
          </div>
        </template>
        <template v-else>
          <div class="quote-text mb-4">
            {{ quote }}
            <span class="quote-author">{{ author }}</span>
          </div>
        </template>

        <!-- Action Buttons -->
        <div class="d-flex flex-column align-center">
          <!-- Primary Actions -->
          <div class="d-flex justify-center mb-6">
            <v-btn
              color="primary"
              variant="tonal"
              size="large"
              class="px-6 mr-8"
              prepend-icon="mdi-refresh"
              @click="generateNewQuote"
              :loading="isLoading"
              :disabled="isInitialLoading"
            >
              New Quote
            </v-btn>
            <v-btn
              v-if="audioUrl"
              color="primary"
              variant="tonal"
              size="large"
              class="px-6"
              prepend-icon="mdi-volume-high"
              @click="playAudio"
              :loading="isPlayingAudio"
              :disabled="isInitialLoading || isLoading"
            >
              Listen
            </v-btn>
          </div>

          <!-- Share Action -->
          <v-btn
            color="grey-darken-3"
            variant="tonal"
            size="large"
            prepend-icon="mdi-alpha-x-box"
            @click="shareToX"
            :disabled="isInitialLoading || isLoading || !quote"
            class="px-8"
          >
            Share on X
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useInspiration } from '~/composables/useInspiration'
import { useSpeech } from '~/composables/useSpeech'

export default {
  name: 'InspirationPage',
  data() {
    return {
      isInitialLoading: true,
      isLoading: false,
      isPlayingAudio: false,
      quote: "",
      author: "",
      audioUrl: null
    }
  },
  async mounted() {
    await this.generateNewQuote()
    this.isInitialLoading = false
  },
  methods: {
    async generateNewQuote() {
      this.isLoading = true
      try {
        const { generateQuote } = useInspiration()
        const newQuote = await generateQuote()
        this.quote = newQuote.text
        this.author = newQuote.author
        this.audioUrl = newQuote.audioUrl
      } catch (error) {
        console.error('Error fetching new quote:', error)
      } finally {
        this.isLoading = false
      }
    },
    async playAudio() {
      if (this.audioUrl) {
        this.isPlayingAudio = true
        try {
          const { playAudio } = useSpeech()
          await playAudio(this.audioUrl)
        } catch (error) {
          console.error('Error playing audio:', error)
        } finally {
          this.isPlayingAudio = false
        }
      }
    },
    shareToX() {
      const text = encodeURIComponent(`${this.quote}\n- Bear Horizon\n\n#BearHorizon #英語学習 #英語勉強`)
      const url = `https://twitter.com/intent/tweet?text=${text}`
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>
.inspiration-card {
  background: rgb(var(--v-theme-secondary));
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.quote-text {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.5;
  color: rgb(var(--v-theme-primary));
  font-style: italic;
}

.quote-author {
  font-size: 16px;
  color: rgba(var(--v-theme-primary), 0.7);
}

.quote-history-card {
  background: rgb(var(--v-theme-secondary));
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.quote-text-small {
  font-size: 16px;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  font-style: italic;
}

.quote-timestamp {
  font-size: 12px;
  color: rgba(var(--v-theme-primary), 0.6);
}
</style>
