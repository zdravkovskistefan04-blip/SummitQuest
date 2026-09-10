<template>
  <section class="screen community-bg eco-page">

    <h1>Eco Reports</h1>

    <!-- REPORT FORM -->
    <section class="eco-box glass">

      <h2>Report Trail Problem</h2>

      <select v-model="problemType">
        <option>Trash</option>
        <option>Damaged trail</option>
        <option>Missing sign</option>
        <option>Danger zone</option>
      </select>

      <textarea
          v-model="description"
          placeholder="Describe the problem..."
      ></textarea>

      <button class="orange-btn wide" @click="submitReport">
        Submit +50 Eco Points
      </button>

      <p v-if="message" class="muted">{{ message }}</p>

    </section>

    <!-- REPORT LIST -->
    <article
        v-for="report in reports"
        :key="report.id"
        class="review-item glass"
    >
      <strong>{{ report.problemType }}</strong>
      <p>{{ report.description }}</p>
      <span class="muted">{{ report.status }}</span>
    </article>

  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../services/api'

const reports = ref([])
const problemType = ref('Trash')
const description = ref('')
const message = ref('')

async function loadReports() {
  try {
    const response = await api.get('/eco-reports')
    reports.value = response.data
  } catch (err) {
    console.log(err)
  }
}

async function submitReport() {
  try {
    const response = await api.post('/eco-reports', {
      userId: 1,
      trailId: 1,
      problemType: problemType.value,
      description: description.value || 'Problem reported on trail.'
    })

    message.value = `${response.data.message} +${response.data.reward} Eco Points`

    description.value = ''
    await loadReports()

  } catch (err) {
    console.log(err)
  }
}

onMounted(loadReports)
</script>