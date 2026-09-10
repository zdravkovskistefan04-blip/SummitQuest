<template>
  <section class="screen achievements-bg achievements-page">

    <h1>Achievements</h1>

    <!-- FEATURED BADGE -->
    <section class="main-badge glass">
      <div class="medal" aria-hidden="true"></div>
      <h2>New Badge Unlocked!</h2>
      <p class="muted">Peak Bagger</p>
    </section>

    <!-- BADGES GRID -->
    <section class="badge-grid">
      <article
          v-for="badge in achievements"
          :key="badge.id"
          class="badge-card glass"
      >
        <div class="badge-icon">{{ badge.icon }}</div>
        <h3>{{ badge.name }}</h3>
        <p class="muted">{{ badge.description }}</p>
      </article>
    </section>

  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const achievements = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/achievements')
    achievements.value = response.data
  } catch (err) {
    console.log(err)
  }
})
</script>
