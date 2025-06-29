<template>
  <v-container class="pa-4 mt-4 mt-15">
    <!-- Bear Image -->
    <div class="text-center mb-6">
      <v-img
        src="/bear_horizon.png"
        alt="Cute English Learning Bear"
        max-width="200"
        class="mx-auto"
        style="border-radius: 24px;"
      />
    </div>

    <!-- Learning Status Card -->
    <v-card class="status-card mb-8 mx-auto" max-width="450" rounded="xl" elevation="0">
      <v-card-text class="pa-8 text-center">
        <div class="status-label mb-2">TOTAL WORDS</div>
        <div class="total-words-value">{{ totalWords }}</div>
        <div class="total-words-subtitle">words registered</div>
      </v-card-text>
    </v-card>

    <!-- Menu Grid -->
    <div class="menu-grid">
      <NuxtLink to="/word-register" class="menu-card">
        <div class="menu-icon">
          <v-icon size="32" color="primary">mdi-pencil-plus</v-icon>
        </div>
        <div class="menu-text">Add Card</div>
      </NuxtLink>
      <NuxtLink to="/flashcard" class="menu-card">
        <div class="menu-icon">
          <v-icon size="32" color="primary">mdi-cards-outline</v-icon>
        </div>
        <div class="menu-text">Flashcards</div>
      </NuxtLink>
      <NuxtLink to="/wordbook" class="menu-card">
        <div class="menu-icon">
          <v-icon size="32" color="primary">mdi-notebook</v-icon>
        </div>
        <div class="menu-text">Word List</div>
      </NuxtLink>
      <NuxtLink to="/difficult-words" class="menu-card">
        <div class="menu-icon">
          <v-icon size="32" color="primary">mdi-lightbulb-outline</v-icon>
        </div>
        <div class="menu-text">Inspirations</div>
        <div class="badge">5</div>
      </NuxtLink>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const { getWordCount } = useWords();
const totalWords = ref(0);

// 単語数を取得
onMounted(async () => {
  try {
    totalWords.value = await getWordCount();
  } catch (error) {
    console.error('Error fetching word count:', error);
  }
});
</script>

<style scoped>
.status-card {
  background: rgb(var(--v-theme-secondary));
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.status-item {
  text-align: center;
}

.status-label {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  color: rgb(var(--v-theme-primary));
  text-transform: uppercase;
}

.total-words-value {
  font-size: 64px;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1.2;
}

.total-words-subtitle {
  font-size: 16px;
  font-weight: 500;
  color: rgba(var(--v-theme-primary), 0.7);
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0 0.5rem;
}

.menu-card {
  position: relative;
  background: rgb(var(--v-theme-secondary));
  border-radius: 16px;
  padding: 1.25rem;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.menu-icon {
  background: rgba(var(--v-theme-primary), 0.1);
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  transition: all 0.3s ease;
}

.menu-text {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.5px;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff5252;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 600;
}

.menu-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
}

.menu-card:hover .menu-icon {
  background: rgba(var(--v-theme-primary), 0.15);
  transform: scale(1.05);
}
</style>
