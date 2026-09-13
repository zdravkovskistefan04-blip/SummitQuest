<template>
  <section class="screen achievements-bg quests-page">

    <h1>Daily Quests</h1>
    <p v-if="error" class="muted">Предизвиците моментално не се достапни. Обиди се повторно подоцна.</p>
    <p v-else-if="!quests.length" class="muted">Сè уште нема достапни дневни предизвици.</p>

    <article
        v-for="quest in quests"
        :key="quest.id"
        class="quest-row glass"
    >

      <div class="quest-info">
        <h2>{{ quest.title }}</h2>
        <p>{{ quest.description }}</p>

        <div class="xp-bar">
          <div
              :style="{
              width: Math.min((quest.progress / quest.goal) * 100, 100) + '%'
            }"
          ></div>
        </div>

        <small>
          {{ quest.progress }}/{{ quest.goal }} • +{{ quest.xpReward }} XP
        </small>
      </div>

      <button
          class="orange-btn"
          @click="completeQuest(quest.id)"
      >
        Complete
      </button>

    </article>

  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const quests = ref([])
const error = ref('')

async function loadQuests() {
  try {
    const response = await api.get('/quests/daily')
    quests.value = response.data
  } catch (err) {
    error.value = 'Предизвиците моментално не се достапни. Обиди се повторно подоцна.'
  }
}

async function completeQuest(id) {
  try {
    await api.post(`/quests/${id}/complete`)
    await loadQuests()
  } catch (err) {
    error.value = 'Предизвикот не може да се заврши. Обиди се повторно.'
  }
}

onMounted(loadQuests)
</script>
