<template>
  <section class="matching-box glass">

    <div class="section-head">
      <h2>Trail Matching</h2>
      <span>🤝</span>
    </div>

    <p class="muted">
      Suggested hiking partners with similar pace and trail interests.
    </p>

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

const matches = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/community/matches?userId=1')
    matches.value = response.data
  } catch (err) {
    console.log(err)
  }
})
</script>
