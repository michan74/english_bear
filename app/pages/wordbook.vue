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
            <div class="d-flex align-center gap-2">
              <v-btn
                v-if="word.audioUrl"
                icon="mdi-volume-high"
                size="small"
                color="white"
                variant="plain"
                @click.stop="playAudio(word.audioUrl)"
              >
                <v-icon>mdi-volume-high</v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  Play audio
                </v-tooltip>
              </v-btn>
              <v-btn
                icon="mdi-delete-outline"
                size="small"
                color="white"
                variant="plain"
                class="delete-btn"
                @click.stop="confirmDelete(word)"
              >
                <v-icon>mdi-delete-outline</v-icon>
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  Delete card
                </v-tooltip>
              </v-btn>
            </div>
          </div>
          <v-card-text>
            <div class="meaning-text mb-2">{{ word.meaning }}</div>
            <div v-if="word.exampleSentence" class="d-flex align-center example-section">
              <v-icon
                size="small"
                color="grey-darken-1"
                class="me-2"
              >
                mdi-format-quote-open
              </v-icon>
              <div class="example-text">{{ word.exampleSentence }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert type="warning" v-if="!loading && words.length === 0" class="mt-4">
      You haven't added any words yet.
    </v-alert>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 pa-4 text-pink-lighten-1">
          Delete Card
        </v-card-title>
        <v-card-text class="pa-4 text-grey-darken-1">
          Are you sure you want to delete "<span class="font-weight-bold text-pink-darken-1">{{ wordToDelete?.word }}</span>"?
          This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="flat"
            @click="showDeleteDialog = false"
            :disabled="deleteLoading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="pink-lighten-4"
            variant="flat"
            @click="deleteWord"
            :loading="deleteLoading"
            class="delete-confirm-btn"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useWords } from '~/composables/useWords'
import { useSpeech } from '~/composables/useSpeech'

export default {
  name: 'WordbookPage',
  data() {
    return {
      words: [],
      loading: true,
      showDeleteDialog: false,
      wordToDelete: null,
      deleteLoading: false,
    }
  },
  methods: {
    async playAudio(audioUrl) {
      if (audioUrl) {
        const { playAudio } = useSpeech()
        playAudio(audioUrl)
      }
    },
    confirmDelete(word) {
      this.wordToDelete = word;
      this.showDeleteDialog = true;
    },
    async deleteWord() {
      if (!this.wordToDelete) return;
      
      this.deleteLoading = true;
      try {
        const { deleteWord } = useWords();
        await deleteWord(
          this.wordToDelete.id,
          this.wordToDelete.imageUrl,
          this.wordToDelete.audioUrl
        );
        
        // 成功したら配列から削除
        this.words = this.words.filter(w => w.id !== this.wordToDelete.id);
        this.showDeleteDialog = false;
        this.wordToDelete = null;
      } catch (error) {
        console.error('Error deleting word:', error);
        alert('Failed to delete the word. Please try again.');
      } finally {
        this.deleteLoading = false;
      }
    }
  },
  async mounted() {
    const { getWords } = useWords()
    try {
      this.words = await getWords()
    } catch (error) {
      console.error('Error fetching words:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
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

.v-card-text {
  padding: 16px;
}

.meaning-text {
  color: #2d3436;
  line-height: 1.5;
  font-size: 1rem;
}

.example-section {
  color: #636e72;
}

.example-text {
  font-style: italic;
  line-height: 1.5;
  font-size: 0.95rem;
}

.gap-2 {
  gap: 8px;
}

.delete-btn {
  opacity: 0.8;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.delete-confirm-btn {
  color: rgb(var(--v-theme-error)) !important;
  font-weight: 500;
}
</style>
