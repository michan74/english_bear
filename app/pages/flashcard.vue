<template>
  <div class="flashcard-page">
    <v-container class="py-8" max-width="600" v-if="words.length > 0">
      <v-switch
        v-model="isTestMode"
        color="primary"
        hide-details
        inset
        density="compact"
      >
        <template v-slot:label>
          <div class="d-flex align-center">
            <v-icon :color="isTestMode ? 'primary' : 'grey'" class="mr-2" size="18">
              {{ isTestMode ? 'mdi-school' : 'mdi-book-open-variant' }}
            </v-icon>
            <span class="mode-label">{{ isTestMode ? 'Test Mode' : 'Study Mode' }}</span>
          </div>
        </template>
      </v-switch>

      <div class="flashcard-container">
        <!-- フラッシュカード -->
        <div class="flashcard-wrapper">
          <div
            class="flashcard"
          >
            <div class="front">
              <!-- 学習モード -->
              <template v-if="!isTestMode">
                <div class="word-header">
                  <h1 class="word-text">{{ currentWord.word }}</h1>
                  <button 
                    class="phonetic-button" 
                    @click.stop="playAudio(currentWord.audioUrl)"
                    :disabled="!currentWord.audioUrl"
                  >
                    <v-icon class="audio-icon" size="16">mdi-volume-high</v-icon>
                  </button>
                </div>
                <div class="image-container">
                  <v-img
                    :src="currentWord.imageUrl"
                    :alt="currentWord.word"
                    class="flashcard-image"
                    cover
                  >
                    <template v-slot:placeholder>
                      <div class="image-loading">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                          size="32"
                        ></v-progress-circular>
                        <div class="loading-text">Loading image...</div>
                      </div>
                    </template>
                  </v-img>
                </div>
                <div class="word-meaning">{{ currentWord.meaning }}</div>
              </template>

              <!-- テストモード -->
              <template v-else>
                <div 
                  class="word-header"
                  @click.stop="handleCardClick"
                  :style="{ cursor: 'pointer' }"
                >
                  <template v-if="!showBack">
                    <h1 class="word-text">???</h1>
                    <div class="test-badge">Guess the word!</div>
                  </template>
                  <template v-else>
                    <h1 class="word-text">{{ currentWord.word }}</h1>
                    <button 
                      class="phonetic-button" 
                      @click.stop="playAudio(currentWord.audioUrl)"
                      :disabled="!currentWord.audioUrl"
                    >
                      <v-icon class="audio-icon" size="16">mdi-volume-high</v-icon>
                    </button>
                  </template>
                </div>
                <div class="image-container">
                  <v-img
                    :src="currentWord.imageUrl"
                    :alt="currentWord.word"
                    class="flashcard-image"
                    cover
                  >
                    <template v-slot:placeholder>
                      <div class="image-loading">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                          size="32"
                        ></v-progress-circular>
                        <div class="loading-text">Loading image...</div>
                      </div>
                    </template>
                  </v-img>
                </div>
                <div class="word-meaning">{{ currentWord.meaning }}</div>
              </template>
            </div>
            <div class="back">
              <div class="word-header" v-if="isTestMode">
                <h1 class="word-text">{{ currentWord.word }}</h1>
                <button 
                  class="phonetic-button" 
                  @click.stop="playAudio(currentWord.audioUrl)"
                  :disabled="!currentWord.audioUrl"
                >
                  <v-icon class="audio-icon" size="16">mdi-volume-high</v-icon>
                </button>
              </div>
              <div class="content-wrapper">
                <template v-if="!isTestMode">
                  <h2>{{ currentWord.word }}</h2>
                  <div class="meaning-detail">{{ currentWord.meaning }}</div>
                </template>
                <template v-else>
                  <div class="meaning-detail">{{ currentWord.meaning }}</div>
                  <v-btn
                    class="mt-6"
                    color="primary"
                    variant="flat"
                    @click.stop="playAudio(currentWord.audioUrl)"
                    :disabled="!currentWord.audioUrl"
                  >
                    <v-icon left>mdi-volume-high</v-icon>
                    Play Pronunciation
                  </v-btn>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- ナビゲーションコントロール -->
        <div class="navigation-controls">
          <!-- プログレスバー -->
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress" :style="{ width: ((currentIndex + 1) / words.length * 100) + '%' }"></div>
            </div>
          </div>

          <div class="navigation-buttons">
            <div class="navigation-group">
              <!-- 左ナビゲーションボタン -->
              <div class="nav-button left" @click="prevCard" :class="{ disabled: currentIndex === 0 }" v-tooltip="'Previous card'">
                <v-icon size="32">mdi-chevron-left</v-icon>
              </div>
            </div>

            <!-- カード番号 -->
            <div class="card-counter">{{ currentIndex + 1 }} / {{ words.length }}</div>

            <div class="navigation-group">
              <!-- 右ナビゲーションボタン -->
              <div class="nav-button right" @click="nextCard" :class="{ disabled: currentIndex === words.length - 1 }">
                <v-icon size="32">mdi-chevron-right</v-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>

    <v-container v-else class="text-center py-12">
      <v-alert
        type="info"
        color="blue-lighten-4"
        class="empty-alert"
        icon="mdi-information"
      >
        <div class="text-body-1">
          <div class="english-text">Your flashcard deck is empty!</div>
          <div class="hint-text">Let's add some new words to study together!</div>
        </div>
      </v-alert>
    </v-container>
  </div>
</template>

<script>
import { useWords } from '~/composables/useWords'

export default {
  data() {
    return {
      words: [],
      currentIndex: 0,
      showBack: false,
      isTestMode: false,
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
    handleCardClick() {
      if (this.isTestMode) {
        this.toggleCard();
      }
    },
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
    playAudio(audioUrl) {
      if (audioUrl) {
        const { playAudio } = useSpeech()
        playAudio(audioUrl)
      }
    },
  },
}
</script>

<style scoped>
.flashcard-page {
  padding-top: 50px;
  background-color: #f8f9fa;
  min-height: calc(100vh - 80px);
  padding-left: 20px; /* スイッチ分のスペース確保 */
}

.empty-alert {
  max-width: 400px;
  margin: 0 auto;
  border-radius: 12px;
  opacity: 0.9;
}

.english-text {
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 8px;
}

.hint-text {
  font-size: 0.9em;
  color: #666;
}

.flashcard-wrapper {
  perspective: 1000px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-top: 20px;
}

.navigation-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-label {
  color: #636e72;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
}

.card-counter {
  font-size: 1rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

/* 既存のナビゲーションボタンスタイルを調整 */
.nav-button {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  color: rgb(var(--v-theme-primary));

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(var(--v-theme-primary), 0.15);
  }

  &.disabled {
    background: #f1f2f6;
    color: #b2bec3;
    cursor: not-allowed;
    box-shadow: none;

    &:hover {
      transform: none;
    }
  }
}

/* Previous/Nextの位置調整 */
.navigation-group:first-child {
  .nav-label {
    order: 2;
  }
}

.navigation-group:last-child {
  .nav-label {
    order: 1;
  }
}

.progress-container {
  margin: 0;
}

.progress-bar {
  height: 4px;
  background: #f1f2f6;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: rgb(var(--v-theme-primary));
  transition: width 0.3s ease;
}

.flashcard {
  width: 400px;
  height: 560px;
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
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.flashcard .back {
  transform: rotateY(180deg);
  padding: 32px;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.word-header-wrapper {
  position: relative;
  perspective: 1000px;
}

.word-header {
  transform-style: preserve-3d;
  transition: transform 0.6s;
  background-color: rgb(var(--v-theme-primary));
  color: white;
  padding: 32px;
  border-radius: 20px 20px 0 0;
  text-align: center;
}

.header-front,
.header-back {
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.header-back {
  transform: rotateX(180deg);
}

.word-header.header-flipped {
  transform: rotateX(180deg);
}

.word-text {
  font-size: 2.5em;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.02em;
}

.phonetic-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.audio-icon {
  opacity: 0.9;
}

.phonetic {
  font-size: 1.1em;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.word-type {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  margin-top: 12px;
}

.image-container {
  padding: 24px;
  background-color: #f8f9fa;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-loading {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.loading-text {
  font-size: 0.9rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
  opacity: 0.8;
}

.flashcard-image {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.word-meaning {
  padding: 24px 32px;
  font-size: 1.1em;
  color: #2d3436;
  line-height: 1.6;
  flex-grow: 1;
  display: flex;
  align-items: center;
  text-align: center;
}

.back h2 {
  color: rgb(var(--v-theme-primary));
  font-size: 2em;
  margin-bottom: 24px;
}

.meaning-detail {
  font-size: 1.2em;
  color: #2d3436;
  margin-bottom: 24px;
  line-height: 1.6;
}

.example {
  font-style: italic;
  color: #636e72;
  line-height: 1.6;
}

/* ボタンのスタイルも更新 */
:deep(.v-btn) {
  background-color: rgb(108, 92, 231) !important;
  color: white !important;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0 24px !important;
  height: 44px;
  border-radius: 12px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #b2bec3 !important;
    opacity: 0.7;
  }
}



.mode-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.test-hint {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgb(var(--v-theme-grey-darken-1));
  font-size: 0.9rem;
}

.content-wrapper {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.test-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-top: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
}
</style>
