<!--
<template>
  <section class="screen summit-bg dashboard">

    &lt;!&ndash; HEADER &ndash;&gt;
    <header class="top-row dashboard-header">
      <h1>Summit</h1>
      <RouterLink to="/profile" class="avatar-btn">😎</RouterLink>
    </header>

    &lt;!&ndash; PROFILE &ndash;&gt;
    <section v-if="user" class="profile-card glass">
      <div class="avatar">😎</div>

      <div class="profile-info">
        <p class="muted">Welcome back</p>
        <h2>{{ user.fullName }}</h2>
        <small>Level {{ user.level }} · {{ user.rankTitle }}</small>

        <div class="xp-bar">
          <div :style="{ width: xpPercent + '%' }"></div>
        </div>
      </div>
    </section>

    &lt;!&ndash; DAILY QUEST &ndash;&gt;
    <section v-if="dailyQuest" class="quest-card glass">
      <div>
        <h2>Daily Quest</h2>
        <p>{{ dailyQuest.description }}</p>
        <small>+{{ dailyQuest.xpReward }} XP</small>
      </div>

      <span class="quest-icon">QUEST</span>
    </section>

    &lt;!&ndash; QUICK ACTIONS &ndash;&gt;
    <h2 class="section-title">Quick Actions</h2>

    <div class="quick-grid">
      <RouterLink to="/trails" class="quick-card glass"><span class="quick-card-mark">MAP</span><span>Патеки</span></RouterLink>
      <RouterLink to="/route-planner" class="quick-card glass"><span class="quick-card-mark">GO</span><span>Планирај</span></RouterLink>
      <RouterLink to="/quests" class="quick-card glass"><span class="quick-card-mark">QUEST</span><span>Предизвици</span></RouterLink>
      <RouterLink to="/achievements" class="quick-card glass"><span class="quick-card-mark">XP</span><span>Значки</span></RouterLink>
      <RouterLink to="/eco" class="quick-card glass"><span class="quick-card-mark">ECO</span><span>Екологија</span></RouterLink>
    </div>

  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/api'

const user = ref(null)
const quests = ref([])

const dailyQuest = computed(() => quests.value?.[0] || null)

const xpPercent = computed(() => {
  if (!user.value) return 0
  return Math.min(((user.value.xp || 0) % 500) / 500 * 100, 100)
})

onMounted(async () => {
  try {
    const [userRes, questRes] = await Promise.all([
      api.get('/users/1'),
      api.get('/quests/daily')
    ])

    user.value = userRes.data
    quests.value = questRes.data
  } catch (err) {
    console.log('API error:', err)
  }
})
</script>
-->
