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

const props = defineProps({
  trailId: { type: Number, required: true }
})

const tags = ref([])
const selectedTags = ref([])
const reviews = ref([])
const comment = ref('')

async function loadData() {
  try {
    const [tagResponse, reviewResponse] = await Promise.all([
      api.get('/vibe-check/tags'),
      api.get(`/trails/${props.trailId}/reviews`)
    ])

    tags.value = tagResponse.data
    reviews.value = reviewResponse.data
  } catch (err) {
    console.log(err)
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
          userName: 'Guest Hiker',
          rating: 5,
          comment: comment.value || 'Quick vibe-check review',
          tags: selectedTags.value
        }
    )

    reviews.value.unshift(response.data)
    comment.value = ''
    selectedTags.value = []
  } catch (err) {
    console.log(err)
  }
}

watch(() => props.trailId, loadData)
onMounted(loadData)
</script>
