<template>
  <section class="screen active-screen active-trail-page">

    <!-- HEADER -->
    <header class="trail-header">
      <div>
        <h1>Активна патека</h1>
        <p>{{ trail?.name || 'Loading trail...' }}</p>
      </div>

      <span aria-hidden="true"></span>
    </header>

    <!-- MAP -->
    <TrailMap
        v-if="trail"
        :trail="trail"
        :progress="progress"
    />

    <!-- MAIN ACTION BUTTON -->
    <button
        class="start-btn"
        @click="toggleTrek"
        :class="{ done: finished }"
    >
      <span>⛰️</span>

      <span v-if="finished">
        TREK DONE
      </span>

      <span v-else-if="started">
        FINISH TREK
      </span>

      <span v-else>
        START TREK
      </span>
    </button>

    <!-- STATS -->
    <section v-if="trail" class="trek-stats glass">
      <div>
        <small>Distance</small>
        <strong>{{ trail.distanceKm }} km</strong>
      </div>

      <div>
        <small>Elevation</small>
        <strong>{{ trail.elevationGainM }} m</strong>
      </div>

      <div>
        <small>XP Reward</small>
        <strong>+{{ trail.xpReward }}</strong>
      </div>
    </section>

    <!-- RESULT -->
    <section v-if="result" class="result glass">
      <h2>{{ result.message }}</h2>
      <p>+{{ result.earnedXp }} XP</p>
      <p>Unlocked badge: <strong>{{ result.badge }}</strong></p>
    </section>

  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import TrailMap from '../components/TrailMap.vue'

const route = useRoute()

const trail = ref(null)
const started = ref(false)
const finished = ref(false)
const progress = ref(0)
const result = ref(null)

onMounted(async () => {
  try {
    const response = await api.get(`/trails/${route.params.id}`)
    trail.value = response.data
  } catch (err) {
    console.log(err)
  }
})

async function toggleTrek() {
  try {
    if (!started.value) {
      await api.post(`/trails/${route.params.id}/start`)
      started.value = true
      progress.value = 50
      return
    }

    const response = await api.post(`/trails/${route.params.id}/finish`)
    result.value = response.data

    finished.value = true
    progress.value = 100
  } catch (err) {
    console.log(err)
  }
}
</script>