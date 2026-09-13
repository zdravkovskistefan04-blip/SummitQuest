<template>
  <RouterLink to="/profile" class="profile-badge" aria-label="Отвори профил">
    <img
      v-if="profile.avatar"
      :src="profile.avatar"
      :alt="`Профилна слика на ${profile.name}`"
      class="profile-avatar"
      @error="profile.avatar = ''"
    />
    <span v-else class="profile-avatar profile-initials">{{ initials }}</span>
    <span class="profile-details">
      <small>Најавен корисник</small>
      <strong>{{ profile.name }}</strong>
    </span>
    <span class="profile-arrow" aria-hidden="true">↗</span>
  </RouterLink>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadData } from '../services/storage'

const route = useRoute()
const profile = ref(loadData('altigoUser', { name: 'Планинар', avatar: '' }))

const initials = computed(() => {
  const name = profile.value.name?.trim() || 'Планинар'
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
})

const refreshProfile = () => {
  profile.value = loadData('altigoUser', { name: 'Планинар', avatar: '' })
}

watch(() => route.fullPath, refreshProfile)

onMounted(() => window.addEventListener('altigo-profile-updated', refreshProfile))
onMounted(() => window.addEventListener('altigo-session-changed', refreshProfile))
onUnmounted(() => {
  window.removeEventListener('altigo-profile-updated', refreshProfile)
  window.removeEventListener('altigo-session-changed', refreshProfile)
})
</script>

<style scoped>
.profile-badge {
  position: fixed;
  left: 1.5rem;
  bottom: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 220px;
  padding: 0.35rem 0.2rem;
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: opacity 0.2s ease;
}

.profile-badge:hover {
  opacity: 0.8;
}

.profile-avatar {
  width: 2.6rem;
  height: 2.6rem;
  flex: 0 0 2.6rem;
  object-fit: cover;
  object-position: center 45%;
  border-radius: 50%;
  border: 2px solid rgba(242, 101, 34, 0.5);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.3);
}

.profile-initials {
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, #f26522, #8b5cf6);
}

.profile-details {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.profile-details small {
  display: none;
}

.profile-details strong {
  overflow: hidden;
  font-size: 0.86rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-arrow {
  display: none;
}

@media (max-width: 600px) {
  .profile-badge {
    left: 1.5rem;
    bottom: 1rem;
    width: 220px;
  }
}
</style>
