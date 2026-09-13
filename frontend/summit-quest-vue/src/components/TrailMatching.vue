<template>
  <section class="matching-box glass">

    <div class="section-head">
      <h2>Trail Matching</h2>
      <span>🤝</span>
    </div>

    <p class="muted">
      Suggested hiking partners with similar pace and trail interests.
    </p>
    <p v-if="error" class="muted">{{ error }}</p>
    <p v-else-if="!matches.length" class="muted">Нема достапни предлози во моментов.</p>

    <article
        v-for="person in matches"
        :key="person.id"
        class="match-row"
    >

      <div class="avatar small-avatar">🥾</div>

      <div class="match-info">
        <h3>{{ person.fullName }}</h3>
        <p>{{ person.rankTitle }} · {{ person.preferredPace }} pace</p>

        <div class="match-meter">
          <div :style="{ width: person.matchPercent + '%' }"></div>
        </div>
      </div>

      <strong>{{ person.matchPercent }}%</strong>

    </article>

  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'
import { loadData } from '../services/storage'

const matches = ref([])
const error = ref('')
const user = loadData('altigoUser', null)

onMounted(async () => {
  try {
    const response = await api.get('/community/matches', {
      params: { userId: user?.id || user?.email }
    })
    matches.value = response.data
  } catch (err) {
    error.value = 'Предлозите за партнери моментално не се достапни.'
  }
})
</script>
