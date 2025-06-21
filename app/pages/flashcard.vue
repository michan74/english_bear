<template>
  <v-container class="py-8" max-width="600" v-if="words.length > 0">
    <div class="flashcard-wrapper">
      <div
        class="flashcard"
        :class="{ flipped: showBack }"
        @click="toggleCard"
      >
        <div class="front">
          <h2>{{ currentWord.word }}</h2>
        </div>
        <div class="back">
          <h3>{{ currentWord.meaning }}</h3>
          <p>{{ currentWord.example }}</p>
        </div>
      </div>
    </div>

    <v-row class="mt-6" justify="center">
      <v-btn color="primary" @click="prevCard" :disabled="currentIndex === 0">← 前へ</v-btn>
      <v-btn class="ml-4" color="primary" @click="nextCard" :disabled="currentIndex === words.length - 1">次へ →</v-btn>
    </v-row>
  </v-container>

  <v-container v-else class="text-center py-12">
    <v-alert type="info">単語帳が空です。先に単語を登録してください。</v-alert>
  </v-container>
</template>

<script>
import { useWords } from '~/composables/useWords'

export default {
  data() {
    return {
      words: [],
      currentIndex: 0,
      showBack: false,
    }
  },
  computed: {
    currentWord() {
      return this.words[this.currentIndex]
    },
  },
  async mounted() {
    const { getWords } = useWords()
    this.words = await getWords()
  },
  methods: {
    toggleCard() {
      this.showBack = !this.showBack
    },
    nextCard() {
      if (this.currentIndex < this.words.length - 1) {
        this.currentIndex++
        this.showBack = false
      }
    },
    prevCard() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this.showBack = false
      }
    },
  },
}
</script>

<style scoped>
.flashcard-wrapper {
  perspective: 1000px;
  display: flex;
  justify-content: center;
}

.flashcard {
  width: 300px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  cursor: pointer;
}
.flashcard.flipped {
  transform: rotateY(180deg);
}

.flashcard .front,
.flashcard .back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.flashcard .back {
  transform: rotateY(180deg);
}
</style>
