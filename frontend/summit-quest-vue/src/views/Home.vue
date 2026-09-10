`<template>
  <div class="home full-bleed-page app-background">
    <div class="app-container">

      <!-- SIDEBAR (Ултра модерен стаклен дизајн) -->
      <aside class="sidebar glass-sidebar">
        <div class="brand">
          <img src="/src/img/logo.png" alt="Altigo Logo" class="logo-img" />
          <h2 class="logo-text">ALTIGO</h2>
        </div>

        <nav class="nav-menu">
          <router-link
              v-for="item in menuItems"
              :key="item.id"
              :to="`/${item.id}`"
              class="nav-item"
              :class="{ active: currentPage === item.id }"
          >
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.id === 'social' ? `${item.label} (${friendsCount})` : item.label }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="content">

        <!-- TOP CARD: TODAY'S PLAN (Динамична картичка со START копче) -->
        <section class="top-card glass-card">
          <div class="left-plan">
            <span class="section-tag">ТЕКОВЕН ПЛАН</span>
            <h3>Актуелна активност денес</h3>

            <!-- Состојба 1: Има активна патека -->
            <div v-if="activeTrail" class="active-trail-box">
              <img :src="getMountainImage(activeTrail.name, activeTrail.image)" class="trail-thumb" alt="Активна патека" @error="handleImageError" />
              <div class="active-info">
                <h4>{{ activeTrail.name }}</h4>
                <p>📏 {{ activeTrail.distance }} • ⏱️ {{ activeTrail.duration }}</p>
              </div>
            </div>

            <!-- Состојба 2: Нема активна патека -->
            <div v-else class="no-active-trail">
              <span class="empty-icon">🏔️</span>
              <p>Сè уште немате активирано планинска рута за денес.</p>
            </div>
          </div>

          <!-- Копчето е вратено и стилизирано во Altigo портокалова боја -->
          <button class="cta-btn" :disabled="!activeTrail" @click="startTrail">
            <span>ЗАПОЧНИ ПАТЕКА</span> ➔
          </button>
        </section>

        <!-- RECOMMENDED TRAILS SECTION -->
        <section class="main-section">
          <div class="section-header">
            <h3>Препорачани патеки за тебе</h3>
            <span @click="goToTrails" class="see-all">Види ги сите</span>
          </div>

          <div class="trail-grid">
            <div
                v-for="t in trails.slice(0, 3)"
                :key="t.id"
                class="trail-card glass-card"
                @click="openTrail(t)"
            >
              <div class="img-wrapper">
                <img :src="getMountainImage(t.name, t.image)" :alt="t.name" @error="handleImageError" />
                <span class="distance-tag">{{ t.distance }}</span>
              </div>
              <div class="trail-card-details">
                <h4>{{ t.name }}</h4>
                <p>Времетраење: ~{{ t.duration }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- STATS SECTION (Исполнета со икони и наслови) -->
        <section class="stats-grid">
          <div class="stat-card glass-card">
            <span class="stat-icon">🏃‍♂️</span>
            <div class="stat-info">
              <span class="stat-value">{{ trailStats.totalDistanceKm }} km</span>
              <span class="stat-title">Поминато вкупно</span>
            </div>
          </div>

          <div class="stat-card glass-card">
            <span class="stat-icon">🏔️</span>
            <div class="stat-info">
              <span class="stat-value">{{ trailStats.completedCount }}</span>
              <span class="stat-title">Завршени патеки</span>
            </div>
          </div>

          <div class="stat-card glass-card">
            <span class="stat-icon">☀️</span>
            <div class="stat-info">
              <span class="stat-value">{{ weather ? `${weather.temperature}°C` : '—' }}</span>
              <span class="stat-title">{{ weather ? `${weather.condition} · ${weather.location} · ${formatWeatherTime(weather.updatedAt)}` : 'Времето се вчитува...' }}</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadData } from '../services/storage'
import { calculateTrailStats } from '../services/trailStats'
import { getMountainImage } from '../services/mountainImages'
import { fetchMountainWeather } from '../services/weather'

const router = useRouter()
const currentPage = ref('home')

const menuItems = [
  { id: 'home', label: 'Почетна', icon: '🏠' },
  { id: 'explore', label: 'Истражи', icon: '🧭' },
  { id: 'map', label: 'Мапа', icon: '🗺️' },
  { id: 'social', label: 'Заедница', icon: '💬' },
  { id: 'profile', label: 'Профил', icon: '👤' }
]

const trails = [
  { id: 1, name: 'Патека Водно', distance: '5.2 km', duration: '2h 15m', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Баба Планина', distance: '8.1 km', duration: '3h 40m', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Шар Планина', distance: '12.4 km', duration: '5h 20m', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Кањон Матка', distance: '6.7 km', duration: '2h 50m', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85' },
]

// Се вчитува од локално складиште (доколку има поставено активна патека)
const activeTrail = ref(loadData('activeTrail', null))
const completedTrails = loadData('completedTrails', [])
const trailStats = calculateTrailStats(completedTrails)
const friendsCount = Math.max(loadData('altigoFriends', []).length, 5)
const weather = ref(null)
const fallbackImage = getMountainImage('Пелистер')
const formatWeatherTime = (value) => value
  ? new Intl.DateTimeFormat('mk-MK', { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  : ''
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}

const startTrail = () => {
  if (activeTrail.value) {
    router.push(`/trail/${activeTrail.value.id}`)
  }
}

const openTrail = (trail) => {
  router.push(`/trail/${trail.id}`)
}

const goToTrails = () => {
  router.push('/trails')
}

onMounted(async () => {
  try {
    weather.value = await fetchMountainWeather()
  } catch (error) {
    console.warn('Could not load mountain weather:', error)
  }
})

</script>

<style scoped>
/* ТРИК ЗА ЦЕЛ ЕКРАН БЕЗ БЕЛИ МАРГИНИ ОКОЛУ АПЛИКАЦИЈАТА */
.full-bleed-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  box-sizing: border-box;
}

.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* SIDEBAR RE-DESIGN (Усогласен со Route Planner и Глобална Мапа) */
.glass-sidebar {
  width: 260px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(242, 101, 34, 0.4));
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0;
  background: linear-gradient(135deg, #ffffff, #a1a1aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #94a3b8;
  text-decoration: none;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.06);
  color: white;
}

.nav-item.active {
  border-left: 3px solid #f26522;
  background: rgba(242, 101, 34, 0.1);
}

.friends-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-subtitle {
  margin: 0.35rem 0 0;
  color: #94a3b8;
  font-size: 0.88rem;
}

.friends-layout {
  display: grid;
  grid-template-columns: minmax(280px, 0.85fr) minmax(340px, 1.15fr);
  gap: 1.25rem;
}

.friends-manager,
.friends-posts {
  padding: 1.35rem;
}

.friends-manager h4,
.friends-posts h4 {
  margin: 0;
  font-size: 1.05rem;
}

.friend-help {
  color: #94a3b8;
  font-size: 0.82rem;
  margin: 0.45rem 0 1rem;
}

.friend-code-box {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: rgba(242, 101, 34, 0.1);
  border: 1px solid rgba(242, 101, 34, 0.25);
  border-radius: 12px;
  padding: 0.75rem;
}

.friend-code-box span {
  color: #cbd5e1;
  font-size: 0.75rem;
}

.friend-code-box strong {
  color: #ffb08b;
  letter-spacing: 1px;
  margin-right: auto;
}

.copy-code-btn,
.add-friend-btn {
  border: 0;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  color: white;
  background: #f26522;
  font-weight: 700;
  cursor: pointer;
}

.add-friend-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.friend-code-input {
  min-width: 0;
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.65rem;
  color: white;
  background: rgba(15, 23, 42, 0.7);
  outline: none;
}

.friend-message {
  color: #ffb08b;
  font-size: 0.78rem;
  margin: 0.65rem 0 0;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.1rem;
}

.friend-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
}

.friend-avatar,
.friend-post-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #f26522);
}

.friend-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.friend-details strong {
  font-size: 0.88rem;
}

.friend-details span,
.friend-post-meta span {
  color: #94a3b8;
  font-size: 0.72rem;
}

.remove-friend-btn {
  margin-left: auto;
  border: 0;
  color: #94a3b8;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

.empty-friends,
.empty-posts p {
  color: #64748b;
  font-size: 0.82rem;
  margin: 0;
}

.friends-posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9rem;
}

.friends-posts-header a {
  color: #ff996e;
  font-size: 0.78rem;
  text-decoration: none;
}

.friend-post-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.friend-post {
  display: flex;
  gap: 0.7rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.friend-post:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.friend-post-content {
  flex: 1;
  min-width: 0;
}

.friend-post-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.friend-post-meta strong {
  font-size: 0.86rem;
}

.friend-post-content p {
  color: #cbd5e1;
  font-size: 0.82rem;
  line-height: 1.4;
  margin: 0.35rem 0;
}

.friend-post-likes {
  color: #fda4af;
  font-size: 0.75rem;
}

.empty-posts {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.empty-posts span {
  font-size: 1.7rem;
}

@media (max-width: 720px) {
  .glass-sidebar { width: 76px; padding: 1.5rem 0.6rem; }
  .logo-text, .nav-item .label { display: none; }
  .nav-item { justify-content: center; padding: 0.8rem 0.4rem; }
  .content { padding: 1.25rem; }
  .top-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .cta-btn { width: 100%; }
  .friends-layout { grid-template-columns: 1fr; }
}

/* CONTENT CONTAINER */
.content {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  box-sizing: border-box;
}

/* GLOBAL GLASS CARD STYLE */
.glass-card {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* TOP PLAN CARD */
.top-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2.5rem;
  gap: 20px;
}

.section-tag {
  color: #f26522;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
}

.left-plan h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.6rem;
  font-weight: 800;
}

.active-trail-box {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.03);
  padding: 1rem 1.25rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.trail-thumb {
  width: 65px;
  height: 65px;
  border-radius: 12px;
  object-fit: cover;
}

.active-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.active-info p {
  margin: 0;
  font-size: 0.88rem;
  color: #94a3b8;
}

.no-active-trail {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 0.95rem;
}

.empty-icon {
  font-size: 1.5rem;
}

/* BIG CTA BUTTON */
.cta-btn {
  background: linear-gradient(135deg, #f26522, #ff8c52);
  border: none;
  padding: 1.2rem 2.2rem;
  border-radius: 16px;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(242, 101, 34, 0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.cta-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 30px rgba(242, 101, 34, 0.5);
}

.cta-btn:disabled {
  background: #1e293b;
  color: #475569;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

/* SECTIONS & GRID */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.section-header h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

.see-all {
  cursor: pointer;
  color: #ff8c52;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.see-all:hover {
  color: #f26522;
}

/* TRAIL GRID */
.trail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .trail-grid {
    grid-template-columns: 1fr;
  }
}

.trail-card {
  padding: 0.85rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.trail-card:hover {
  transform: translateY(-6px);
  border-color: rgba(242, 101, 34, 0.3);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.4);
}

.img-wrapper {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-radius: 14px;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.trail-card:hover .img-wrapper img {
  transform: scale(1.06);
}

.distance-tag {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(15, 23, 42, 0.85);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ff8c52;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.trail-card-details {
  padding: 0.75rem 0.25rem 0.25rem 0.25rem;
}

.trail-card-details h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
}

.trail-card-details p {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
}

/* STATS GRID BELOW */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 1.5rem;
}

.stat-icon {
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.6rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.03);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
}

.stat-title {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 2px;
}
</style>