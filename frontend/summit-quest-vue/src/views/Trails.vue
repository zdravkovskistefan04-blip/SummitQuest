<template>
  <div class="trails-page full-bleed-page">
    <aside class="sidebar glass">
      <div class="logo-area">
        <h2 class="logo-text">ALTIGO</h2>
      </div>
      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="`/${item.id}`"
          class="nav-item"
          :class="{ active: item.id === 'trails' }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <main class="content">
      <section class="top-card glass">
        <div class="left">
          <h3>Планински патеки</h3>
          <p>Изберете дестинација, активирајте ја рутата и започнете со следење во реално време.</p>
        </div>
        <span class="collection-badge">{{ filteredTrails.length }} достапни патеки</span>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>Филтрирај патеки</h3>
        </div>
        <div class="trail-filters glass">
        <label>
          Тежина
          <select v-model="difficultyFilter">
            <option value="all">Сите</option>
            <option value="Easy">Лесни</option>
            <option value="Medium">Средни</option>
            <option value="Hard">Тешки</option>
          </select>
        </label>
        <label>
          Должина на патеката
          <select v-model="distanceFilter">
            <option value="all">Сите</option>
            <option value="5">До 5 km</option>
            <option value="5-10">Од 5 до 10 km</option>
            <option value="10-15">Од 10 до 15 km</option>
            <option value="15+">Над 15 km</option>
          </select>
        </label>
        <button v-if="difficultyFilter !== 'all' || distanceFilter !== 'all'" class="clear-filter" @click="clearFilters">Исчисти филтри</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>Достапни патеки за активација</h3>
        </div>
        <div class="trail-grid">
        <div
            v-for="t in filteredTrails"
            :key="t.id"
            class="trail-card glass"
            @click="openTrail(t)"
        >
          <div class="img-container">
            <img :src="getMountainImage(t.name, t.image)" :alt="t.name" @error="handleImageError" />
            <span class="distance-tag">{{ t.distance }}</span>

            <span v-if="isActive(t)" class="active-pulse-tag">АКТИВНА</span>
          </div>

          <div class="card-details">
            <h4>{{ t.name }}</h4>

            <div class="card-actions">
              <button
                  v-if="!isActive(t)"
                  class="action-btn start-btn"
                  @click.stop="handleStartTrail(t)"
              >
                Започни
              </button>

              <button
                  v-else
                  class="action-btn done-btn"
                  @click.stop="handleDoneTrail(t)"
              >
                Заврши
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { saveData, loadData } from '../services/storage'
import { getMountainImage } from '../services/mountainImages'

const router = useRouter()
const menuItems = [
  { id: 'home', label: 'Почетна', icon: '🏠' },
  { id: 'explore', label: 'Истражи', icon: '🧭' },
  { id: 'map', label: 'Мапа', icon: '🗺️' },
  { id: 'social', label: 'Заедница', icon: '💬' },
  { id: 'profile', label: 'Профил', icon: '👤' }
]
const fallbackImage = getMountainImage('Пелистер')
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}

// Референца за тоа која патека е моментално активна
const currentActiveTrail = ref(null)
const difficultyFilter = ref('all')
const distanceFilter = ref('all')

onMounted(() => {
  // Го вчитуваме моменталниот статус од локалното складиште
  currentActiveTrail.value = loadData('activeTrail', null)
})

// Функција која проверува дали одредена патека е активна во моментот
const isActive = (trail) => {
  return currentActiveTrail.value && currentActiveTrail.value.id === trail.id
}

// Логика кога ќе се кликне START
const handleStartTrail = (trail) => {
  // Креираме објект со времетраење за почетната страна да изгледа побогато
  const trailToActivate = {
    ...trail,
    duration: trail.duration || '2h 45m'
  }

  saveData('activeTrail', trailToActivate) // Зачувуваме во storage
  currentActiveTrail.value = trailToActivate // Ажурираме состојба

  // Веднаш го префрламе корисникот на Home каде што ќе ја види активната патека
  router.push('/home')
}

// Логика кога ќе се кликне DONE
const handleDoneTrail = (trail) => {
  // Вчитуваме претходно комплетирани патеки од Profile или правиме празна листа
  const completedHistory = loadData('completedTrails', [])

  // Ја додаваме оваа патека во листата на завршени со датум на освојување
  completedHistory.push({
    ...trail,
    completedAt: new Date().toLocaleDateString('mk-MK')
  })

  saveData('completedTrails', completedHistory) // Зачувуваме во историјата
  saveData('activeTrail', null) // Ја бришеме од моментално активни рути
  currentActiveTrail.value = null

  // Го носиме корисникот во неговиот профил за да си ги види ордените/завршените рути
  router.push('/profile')
}

const openTrail = (trail) => {
  router.push(`/trail/${trail.id}`)
}

const filteredTrails = computed(() => trails.filter(trail => {
  const matchesDifficulty = difficultyFilter.value === 'all' || trail.difficulty === difficultyFilter.value
  const distance = Number.parseFloat(String(trail.distance).replace(',', '.'))
  const matchesDistance = distanceFilter.value === 'all'
    || (distanceFilter.value === '5' && distance <= 5)
    || (distanceFilter.value === '5-10' && distance > 5 && distance <= 10)
    || (distanceFilter.value === '10-15' && distance > 10 && distance <= 15)
    || (distanceFilter.value === '15+' && distance > 15)
  return matchesDifficulty && matchesDistance
}))

const clearFilters = () => {
  difficultyFilter.value = 'all'
  distanceFilter.value = 'all'
}

const trails = [
  { id: 1, name: 'Патека Водно', distance: '5.2 km', duration: '2h 15m', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Баба Планина', distance: '8.1 km', duration: '3h 40m', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Шар Планина', distance: '12.4 km', duration: '5h 20m', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Кањон Матка', distance: '6.7 km', duration: '2h 50m', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Национален парк Галичица', distance: '9.3 km', duration: '4h 10m', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Големо Езеро на Пелистер', distance: '14.2 km', duration: '6h 15m', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=85' },
  { id: 7, name: 'Патека покрај Треска', distance: '4.8 km', duration: '1h 50m', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85' },
  { id: 8, name: 'Круг околу Мавровско Езеро', distance: '11.5 km', duration: '4h 45m', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85' },
  { id: 9, name: 'Патека Козјак', distance: '7.6 km', duration: '3h 10m', image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85' },
  { id: 10, name: 'Клисура Демир Капија', distance: '6.2 km', duration: '2h 30m', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=85' },
  { id: 11, name: 'Гребен Смоликас', distance: '10.7 km', duration: '4h 55m', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85' },
  { id: 12, name: 'Патека до врвот Кораб', distance: '15.3 km', duration: '7h 30m', image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=900&q=85' },
  { id: 13, name: 'Патека покрај Тиквешко Езеро', distance: '8.9 km', duration: '3h 25m', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85' },
  { id: 14, name: 'Патека до Маркови Кули', distance: '5.5 km', duration: '2h 10m', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85' },
  { id: 15, name: 'Куклица - Камени кукли', distance: '3.8 km', duration: '1h 20m', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=85' },
  { id: 16, name: 'Патека на Стогово', distance: '13.1 km', duration: '5h 40m', image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=85' },
  { id: 17, name: 'Гребен Јабланица', distance: '9.8 km', duration: '4h 15m', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85' },
  { id: 18, name: 'Кратовска кањонска патека', distance: '4.2 km', duration: '1h 45m', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=85' },
  { id: 19, name: 'Преспанска планинска патека', distance: '7.4 km', duration: '2h 50m', image: 'https://images.unsplash.com/photo-1508459855340-fb63ba59186b?auto=format&fit=crop&w=900&q=85' },
  { id: 20, name: 'Патека на Осогово', distance: '12.9 km', duration: '5h 10m', image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=900&q=85' },
  { id: 21, name: 'Патека Голема Река', distance: '6.0 km', duration: '2h 20m', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=900&q=85' }
]
</script>

<style scoped>
/* ТРИК ЗА ЦЕЛ ЕКРАН БЕЗ РАМКИ */
.full-bleed-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(circle at top, #111a2e, #070b14);
  color: white;
  padding: 2.5rem 2rem;
  box-sizing: border-box;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* PREMIUM DARK GLASSMORPHISM */
.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* NAVBAR DESIGN */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
}

.nav-logo {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  padding: 0.6rem 1.1rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-link:hover, .nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

/* HEADER SECTION */
.trails-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.4rem 0;
}

.header-text p {
  margin: 0;
  color: #94a3b8;
  font-size: 1rem;
}

.collection-badge {
  background: rgba(242, 101, 34, 0.1);
  border: 1px solid rgba(242, 101, 34, 0.2);
  color: #ff8c52;
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
}

/* GRID & CARDS */
.trail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
}

.trail-card {
  padding: 0.85rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.trail-card:hover {
  transform: translateY(-6px);
  border-color: rgba(242, 101, 34, 0.3);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.4);
}

.img-container {
  position: relative;
  width: 100%;
  height: 170px;
  overflow: hidden;
  border-radius: 14px;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.trail-card:hover .img-container img {
  transform: scale(1.05);
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

.active-pulse-tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #22c55e;
  color: white;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.5px;
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.6);
  animation: pulse-border 1.5s infinite;
}

/* DETAILS & ACTION BUTTONS */
.card-details {
  padding: 0.85rem 0.25rem 0.25rem 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.card-details h4 {
  text-align: center;
  margin: 0 0 1rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
}

.card-actions {
  margin-top: auto;
}

/* БАТЛ КОПЧИЊА */
.action-btn {
  width: 100%;
  border: none;
  padding: 0.7rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.start-btn:hover {
  background: #f26522;
  color: white;
  border-color: #f26522;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.4);
}

.done-btn {
  background: #22c55e;
  color: white;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.done-btn:hover {
  background: #16a34a;
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.5);
}

/* ANIMATIONS */
@keyframes pulse-border {
  0% { opacity: 0.9; }
  50% { opacity: 0.6; }
  100% { opacity: 0.9; }
}

.trail-filters {
  display: flex;
  align-items: end;
  gap: 1rem;
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 16px;
}
.trail-filters label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #cbd5e1;
  font-size: 0.82rem;
  font-weight: 600;
}
.trail-filters select {
  min-width: 150px;
  background: #172033;
  border: 1px solid rgba(255,255,255,0.12);
  color: white;
  padding: 0.55rem 0.7rem;
  border-radius: 8px;
}
.clear-filter {
  border: 0;
  background: transparent;
  color: #ff8c52;
  padding: 0.6rem 0;
  cursor: pointer;
  font-weight: 700;
}

.full-bleed-page {
  display: flex;
  padding: 0;
  background: radial-gradient(circle at top right, #0f172a, #050814);
}

.sidebar {
  width: 260px;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  flex-shrink: 0;
  border-radius: 0;
  border-width: 0 1px 0 0;
  box-shadow: none;
}

.logo-area { display: flex; align-items: center; }
.logo-text {
  margin: 0;
  color: #f26522;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 2px;
}
.nav-menu { display: flex; flex-direction: column; gap: 0.5rem; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s, color 0.2s;
}
.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
}
.nav-item.active {
  border-left: 3px solid #f26522;
  background: rgba(242, 101, 34, 0.12);
}
.nav-item .icon { width: 1.2rem; text-align: center; color: #c084fc; }

.content {
  flex: 1;
  max-width: 1300px;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  box-sizing: border-box;
}
.top-card {
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}
.top-card h3 { margin: 0 0 0.35rem; font-size: 1.6rem; font-weight: 800; }
.top-card p { margin: 0; color: #94a3b8; }
.section h3 { margin: 0 0 1.25rem; font-size: 1.25rem; }
.trail-filters { margin: 0; }
.trail-grid {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
.trail-card { border-radius: 16px; padding: 0.75rem; }
.img-container { height: 150px; border-radius: 12px; }

@media (max-width: 600px) {
  .full-bleed-page { flex-direction: column; }
  .sidebar { width: 100%; min-height: auto; padding: 1.25rem; gap: 1.25rem; }
  .nav-menu { flex-direction: row; flex-wrap: wrap; }
  .content { padding: 1.25rem; }
  .top-card { align-items: flex-start; flex-direction: column; }
  .trail-filters { align-items: stretch; flex-direction: column; }
  .trail-filters select { width: 100%; }
}
</style>