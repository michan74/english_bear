<template>
  <v-container class="pa-4 mt-15">
    <v-card class="inspiration-card mb-6 mx-auto" max-width="600" rounded="xl" elevation="0">
      <v-card-text class="pa-8 text-center">
        <div class="d-flex justify-center mb-6">
          <v-img
            src="/bear_horizon.png"
            alt="Inspiring Bear"
            max-width="120"
            class="rounded-circle"
          />
        </div>
        <div class="quote-text mb-4">
          "Remember, every new word you learn is a step closer to your dreams. Keep going, you're doing great!"
        </div>
        <div class="quote-author mb-6">- Your Study Buddy Bear</div>
        <v-btn
          color="primary"
          variant="tonal"
          class="mr-4"
          prepend-icon="mdi-refresh"
          @click="generateNewQuote"
          :loading="isLoading"
        >
          New Quote
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-volume-high"
          @click="playAudio"
          :loading="isPlayingAudio"
        >
          Listen
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Previous Quotes -->
    <div class="text-subtitle-1 font-weight-bold mb-4 px-4">Previous Inspirations</div>
    <v-card
      v-for="(quote, index) in previousQuotes"
      :key="index"
      class="quote-history-card mb-4 mx-auto"
      max-width="600"
      rounded="lg"
      elevation="0"
    >
      <v-card-text class="pa-6">
        <div class="quote-text-small mb-2">{{ quote.text }}</div>
        <div class="quote-timestamp">{{ quote.timestamp }}</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const isLoading = ref(false);
const isPlayingAudio = ref(false);
const previousQuotes = ref([
  { text: '"Learning English is like planting a garden. Every word is a new flower blooming in your mind."', timestamp: '2 hours ago' },
  { text: '"The journey of a thousand words begins with a single flash card. Keep up the excellent work!"', timestamp: '5 hours ago' },
]);

const generateNewQuote = async () => {
  isLoading.value = true;
  // TODO: AIを使って新しい名言を生成
  await new Promise(resolve => setTimeout(resolve, 1500)); // ダミーの遅延
  isLoading.value = false;
};

const playAudio = async () => {
  isPlayingAudio.value = true;
  // TODO: 音声合成を実装
  await new Promise(resolve => setTimeout(resolve, 1500)); // ダミーの遅延
  isPlayingAudio.value = false;
};
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
