<template>
  <v-container class="pa-4" max-width="500">
    <h1>メニュー</h1>
    <div class="menu-grid">
      <NuxtLink to="/word-register" class="menu-card">単語登録</NuxtLink>
      <NuxtLink to="/wordbook" class="menu-card">単語帳</NuxtLink>
      <NuxtLink to="/flashcard" class="menu-card">フラッシュカード</NuxtLink>
      <NuxtLink to="/settings" class="menu-card">設定</NuxtLink>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'MenuPage',
}
</script>

<style scoped>
.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}
.menu-card {
  background: #f7e08c; /* コダックの体色に近いクリームイエロー */
  color: #222;
  border-radius: 18px;
  padding: 2.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(247,224,140,0.15);
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  border: 2px solid #bfa76a; /* 影やライン用のブラウン */
}
.menu-card:hover {
  background: #fffbe7; /* さらに淡いクリーム色 */
  color: #bfa76a;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px rgba(191,167,106,0.18);
}
</style>
