
<template>
  <div class="trail-page">

    <img :src="trail.image" class="hero-image" />

    <div class="content">
      <h1>{{ trail.name }}</h1>
      <p>{{ trail.description }}</p>

      <div class="stats">
        <div>{{ trail.distance }}</div>
        <div>{{ trail.duration }}</div>
        <div>{{ trail.difficulty }}</div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="action-buttons">
        <button v-if="!isActive" class="start-btn" @click="startTrail">
          ▶️ Start Trail
        </button>

        <button v-else class="done-btn" @click="completeTrail">
          ✅ Mark as Done
        </button>
      </div>

      <!-- MAP -->
      <div class="map-section">
        <iframe
            src="https://www.google.com/maps/embed?..."
            loading="lazy">
        </iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { loadData, removeData, saveData } from '../services/storage'

const route = useRoute()
const trails = loadData('allTrails', [])

const trail = ref(trails.find(t => t.id == route.params.id))
const isActive = ref(false)

onMounted(() => {
  const active = loadData('activeTrail', null)
  if (active && active.id === trail.value.id) {
    isActive.value = true
  }
})

const startTrail = () => {
  saveData('activeTrail', trail.value)
  isActive.value = true
  alert('Патеката е започната!')
}

const completeTrail = () => {
  const completed = loadData('completedTrails', [])
  const exists = completed.find(t => t.id === trail.value.id)

  if (!exists) {
    completed.push(trail.value)
    saveData('completedTrails', completed)
  }

  removeData('activeTrail')
  isActive.value = false
  alert('Патеката е завршена!')
}
</script>
