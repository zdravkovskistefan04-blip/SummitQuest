
<template>
  <div class="app-shell">
    <RouterView />
    <ProfileBadge v-if="showProfileBadge" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProfileBadge from './components/ProfileBadge.vue'

const route = useRoute()
const publicRoutes = new Set(['Login', 'Signup', 'ForgotPassword'])
const sidebarRoutes = new Set(['Home', 'Explore', 'Trails', 'Social', 'Profile'])
const showProfileBadge = computed(() =>
  !publicRoutes.has(route.name) && sidebarRoutes.has(route.name)
)
</script>

<style scoped>
/* ако имаш глобални стилови, можеш да ги оставиш празни */
/* или да додадеш layout styling */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
