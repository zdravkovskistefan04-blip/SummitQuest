<template>
  <section class="vibe-box glass">

    <div class="section-head">
      <h2>Vibe-Check Reviews</h2>
      <span>🏷️</span>
    </div>

    <!-- TAGS -->
    <div class="tags">
      <button
          v-for="tag in tags"
          :key="tag"
          :class="{ selected: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <!-- INPUT -->
    <div class="review-form">
      <input
          v-model="comment"
          placeholder="Add quick trail comment..."
      />

      <button class="orange-btn" @click="submitReview">
        Post
      </button>
    </div>
    <p v-if="error" class="muted">{{ error }}</p>

    <!-- REVIEWS -->
    <article
        v-for="review in reviews"
        :key="review.id"
        class="review-item glass"
    >

      <strong>{{ review.userName }}</strong>
      <p>{{ review.comment }}</p>

      <div class="mini-tags">
        <span v-for="tag in review.tags" :key="tag">
          {{ tag }}
        </span>
      </div>

    </article>

  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import api from '../services/api'
import { loadData as loadStoredData } from '../services/storage'

const props = defineProps({
  trailId: { type: Number, required: true }
})

const tags = ref([])
const selectedTags = ref([])
const reviews = ref([])
const comment = ref('')
const error = ref('')
const user = loadStoredData('altigoUser', null)

async function loadData() {
  try {
    const [tagResponse, reviewResponse] = await Promise.all([
      api.get('/vibe-check/tags'),
      api.get(`/trails/${props.trailId}/reviews`)
    ])

    tags.value = tagResponse.data
    reviews.value = reviewResponse.data
  } catch (err) {
    error.value = 'Рецензиите моментално не се достапни.'
  }
}

function toggleTag(tag) {
  selectedTags.value = selectedTags.value.includes(tag)
      ? selectedTags.value.filter(t => t !== tag)
      : [...selectedTags.value, tag]
}

async function submitReview() {
  if (!comment.value.trim() && selectedTags.value.length === 0) return

  try {
    const response = await api.post(
        `/trails/${props.trailId}/reviews`,
        {
          userName: user?.name || 'Планинар',
          rating: 5,
          comment: comment.value || 'Quick vibe-check review',
          tags: selectedTags.value
        }
    )

    reviews.value.unshift(response.data)
    comment.value = ''
    selectedTags.value = []
  } catch (err) {
    error.value = 'Рецензијата не може да се објави. Обиди се повторно.'
  }
}

watch(() => props.trailId, loadData)
onMounted(loadData)
</script>
