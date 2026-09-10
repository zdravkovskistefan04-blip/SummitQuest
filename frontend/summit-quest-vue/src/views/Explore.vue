
<template>
  <div class="explore full-bleed-page">

    <aside class="sidebar glass">
      <div class="logo-area">
        <img src="/src/img/logo.png" alt="Altigo Logo" class="logo" v-if="false" /> <h2 class="logo-text">ALTIGO</h2>
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
          <span class="label">{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <main class="content">

      <section class="top-card glass">
        <div class="left">
          <h3>Истражи Нови Авантури</h3>
          <p>Филтрирај ги патеките според твоето моментално расположение и подготвеност.</p>
        </div>

        <div class="smart-filter-pills">
          <button
              type="button"
              class="filter-pill"
              :class="{ active: activeFilter === 'all' }"
              @click="setFilter('all')"
          >
            Сите рути
          </button>
          <button
              type="button"
              class="filter-pill"
              :class="{ active: activeFilter === 'easy' }"
              @click="setFilter('easy')"
          >
            Лесни прошетки
          </button>
          <button
              type="button"
              class="filter-pill"
              :class="{ active: activeFilter === 'hard' }"
              @click="setFilter('hard')"
          >
            Предизвикувачки патеки
          </button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>ПОПУЛАРНИ АТРАКЦИИ</h3>
        </div>
        <div class="collection-grid">
          <div class="collection-card glass" @click="openCollection('waterfalls')">
            <div class="img-wrapper">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/KoleshinoWaterfall.JPG" alt="Колешински Водопад" />
            </div>
            <h4>Водопади на Македонија</h4>
          </div>
          <div class="collection-card glass" @click="openCollection('valleys')">
            <div class="img-wrapper">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Mavrovo_Lake-Republic_of_Macedonia.JPG" alt="Мавровска Долина" />
            </div>
            <h4>Скриени долински патеки</h4>
          </div>
          <div class="collection-card glass" @click="openCollection('sunsets')">
            <div class="img-wrapper">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Pamje_e_liqenit_t%C3%AB_Ohrit_nga_parku_komb%C3%ABtar_i_Gali%C3%A7ic%C3%ABs.jpg" alt="Поглед од Галичица кон Охридското Езеро" />
            </div>
            <h4>Погледи на зајдисонце</h4>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>Истражи по категорија</h3>
        </div>
        <div class="category-grid">
          <button class="category-card glass" :class="{ active: activeCategory === 'alpine' }" @click="setCategory('alpine')">Високи врвови</button>
          <button class="category-card glass" :class="{ active: activeCategory === 'forest' }" @click="setCategory('forest')">Шумски прошетки</button>
          <button class="category-card glass" :class="{ active: activeCategory === 'family' }" @click="setCategory('family')">Семејни патеки</button>
          <button class="category-card glass" :class="{ active: activeCategory === 'expert' }" @click="setCategory('expert')">Предизвици за искусни</button>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <h3>Достапни патеки за активација ({{ filteredTrails.length }})</h3>
        </div>
        <div class="trail-grid">
          <div
              v-for="t in filteredTrails"
              :key="t.id"
              class="trail-card glass"
              @click="openTrail(t)"
          >
            <div class="trail-img-container">
              <img :src="getMountainImage(t.name, t.image, t.id)" :alt="t.name" @error="handleImageError" />
              <span class="distance-tag">{{ t.distance }}</span>
              <span v-if="isActive(t)" class="active-pulse-tag">АКТИВНА</span>
            </div>
            <div class="trail-details">
              <h4>{{ t.name }}</h4>
              <span class="difficulty-indicator" :class="t.difficulty.toLowerCase()">
                {{ t.difficulty }}
              </span>

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
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { saveData, loadData } from '../services/storage'
import { getMountainImage } from '../services/mountainImages'

const router = useRouter()
const currentPage = ref('explore')
const fallbackImage = getMountainImage('Пелистер')
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}
const activeFilter = ref('all') // Го менаџира филтерот: 'all', 'easy', 'hard'
const activeCategory = ref(null)
const currentActiveTrail = ref(null)

const setFilter = (filter) => {
  activeFilter.value = filter
  activeCategory.value = null
}

const menuItems = [
  { id: 'home', label: 'Почетна', icon: '🏠' },
  { id: 'explore', label: 'Истражи', icon: '🧭' },
  { id: 'map', label: 'Мапа', icon: '🗺️' },
  { id: 'social', label: 'Заедница', icon: '💬' },
  { id: 'profile', label: 'Профил', icon: '👤' }
]

// Твојата датабаза која служи за приказ на патеките директно тука
const trailsDatabase = [
  { id: 1, name: 'Патека Водно', distance: '5.2 km', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Баба Планина', distance: '8.1 km', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Шар Планина', distance: '12.4 km', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Кањон Матка', distance: '6.7 km', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Национален парк Галичица', distance: '9.3 km', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85' },
  { id: 101, name: 'Колешински Водопад', distance: '1.2 km', difficulty: 'Easy', image: 'https://upload.wikimedia.org/wikipedia/commons/d/da/KoleshinoWaterfall.JPG' },
  { id: 201, name: 'Титов Врв', distance: '21.0 km', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=900&q=85' },
  { id: 401, name: 'Мавровска Долина', distance: '8.2 km', difficulty: 'Medium', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Mavrovo_Lake-Republic_of_Macedonia.JPG' },
  { id: 501, name: 'Охрид Зајдисонце', distance: '4.2 km', difficulty: 'Easy', image: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Pamje_e_liqenit_t%C3%AB_Ohrit_nga_parku_komb%C3%ABtar_i_Gali%C3%A7ic%C3%ABs.jpg' },
  { id: 402, name: 'Радика Долина', distance: '6.7 km', difficulty: 'Medium', image: '' },
  { id: 403, name: 'Демир Капија Долина', distance: '5.5 km', difficulty: 'Easy', image: '' },
  { id: 404, name: 'Треска Долина', distance: '4.8 km', difficulty: 'Easy', image: '' },
  { id: 405, name: 'Кратовска Долина', distance: '6.2 km', difficulty: 'Medium', image: '' },
  { id: 406, name: 'Преспанска Долина', distance: '7.4 km', difficulty: 'Medium', image: '' },
  { id: 407, name: 'Козјачка Долина', distance: '5.9 km', difficulty: 'Medium', image: '' },
  { id: 408, name: 'Смилевска Долина', distance: '3.8 km', difficulty: 'Easy', image: '' },
  { id: 409, name: 'Кумановска Долина', distance: '9.1 km', difficulty: 'Hard', image: '' },
  { id: 410, name: 'Кичевска Долина', distance: '7.0 km', difficulty: 'Medium', image: '' },
  { id: 411, name: 'Галичичка Долина', distance: '8.5 km', difficulty: 'Hard', image: '' },
  { id: 412, name: 'Поречка Долина', distance: '7.6 km', difficulty: 'Medium', image: '' },
  { id: 502, name: 'Преспа Зајдисонце', distance: '5.0 km', difficulty: 'Easy', image: '' },
  { id: 503, name: 'Козјак Зајдисонце', distance: '6.1 km', difficulty: 'Medium', image: '' },
  { id: 504, name: 'Водно Зајдисонце', distance: '3.5 km', difficulty: 'Easy', image: '' },
  { id: 505, name: 'Галичица Зајдисонце', distance: '7.8 km', difficulty: 'Medium', image: '' },
  { id: 506, name: 'Кратово Зајдисонце', distance: '4.0 km', difficulty: 'Easy', image: '' },
  { id: 507, name: 'Берово Зајдисонце', distance: '5.6 km', difficulty: 'Medium', image: '' },
  { id: 508, name: 'Крушево Зајдисонце', distance: '6.3 km', difficulty: 'Medium', image: '' },
  { id: 509, name: 'Струга Зајдисонце', distance: '4.7 km', difficulty: 'Easy', image: '' },
  { id: 510, name: 'Куманово Зајдисонце', distance: '5.9 km', difficulty: 'Medium', image: '' },
  { id: 511, name: 'Штип Зајдисонце', distance: '3.8 km', difficulty: 'Easy', image: '' },
  { id: 512, name: 'Гостивар Зајдисонце', distance: '6.5 km', difficulty: 'Medium', image: '' }
]

onMounted(() => {
  currentActiveTrail.value = loadData('activeTrail', null)
})

// Проверка за активна патека
const isActive = (trail) => {
  return currentActiveTrail.value && currentActiveTrail.value.id === trail.id
}

// Филтрирање на патеките според одбраното паметно копче
const filteredTrails = computed(() => {
  let trails = trailsDatabase
  if (activeCategory.value === 'alpine') {
    trails = trails.filter(t => [2, 3, 201].includes(t.id))
  } else if (activeCategory.value === 'forest') {
    trails = trails.filter(t => [1, 2, 3].includes(t.id))
  } else if (activeCategory.value === 'family') {
    trails = trails.filter(t => t.difficulty === 'Easy' || [4, 101].includes(t.id))
  } else if (activeCategory.value === 'expert') {
    trails = trails.filter(t => t.difficulty === 'Hard')
  }

  if (activeFilter.value === 'easy') {
    return trails.filter(t => t.difficulty === 'Easy')
  }
  if (activeFilter.value === 'hard') {
    return trails.filter(t => t.difficulty === 'Hard')
  }
  return trails
})

// ЛОГИКА ЗА СТАРТ (Оди на Home)
const handleStartTrail = (trail) => {
  const trailToActivate = { ...trail, duration: '2h 30m' }
  saveData('activeTrail', trailToActivate)
  currentActiveTrail.value = trailToActivate
  router.push('/home')
}

// ЛОГИКА ЗА DONE (Оди на Profile)
const handleDoneTrail = (trail) => {
  const completedHistory = loadData('completedTrails', [])
  completedHistory.push({
    ...trail,
    completedAt: new Date().toLocaleDateString('mk-MK')
  })
  saveData('completedTrails', completedHistory)
  saveData('activeTrail', null)
  currentActiveTrail.value = null
  router.push('/profile')
}

const openCollection = (id) => router.push(`/collection/${id}`)
const setCategory = (id) => {
  activeCategory.value = activeCategory.value === id ? null : id
  activeFilter.value = 'all'
}
const openTrail = (trail) => router.push(`/trail/${trail.id}`)
</script>

<style scoped>
/* СУПЕР СТИЛИЗИРАЊЕ НА ЦЕЛ ЕКРАН */
.full-bleed-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(circle at top right, #0f172a, #050814);
  color: white;
  display: flex;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* PREMIUM DARK GLASSMORPHISM */
.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* SIDEBAR DESIGN */
.sidebar {
  width: 260px;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #ff8c52, #f26522);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
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

/* MAIN CONTENT CONTAINER */
.content {
  flex: 1;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 1300px;
}

/* TOP CARD И ФИЛТРИ */
.top-card {
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.top-card h3 { margin: 0 0 0.3rem 0; font-size: 1.6rem; font-weight: 800; }
.top-card p { margin: 0; color: #94a3b8; font-size: 0.95rem; }

.smart-filter-pills {
  display: flex;
  gap: 0.75rem;
}

.filter-pill {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.filter-pill:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.filter-pill.active {
  background: #f26522;
  color: white;
  border-color: #f26522;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.3);
}

/* SECTIONS Обшто */
.section h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.25rem 0;
  color: #f1f5f9;
}

/* FEATURED COLLECTIONS GRID */
.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.collection-card {
  border-radius: 16px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.collection-card:hover {
  transform: translateY(-4px);
  border-color: rgba(242, 101, 34, 0.3);
}

.img-wrapper {
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
}

.img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.collection-card h4 { margin: 0.75rem 0 0.25rem 0; font-size: 1rem; font-weight: 700; }
.collection-card h4 { text-align: center; }

/* CATEGORY GRID */
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.category-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.75rem;
  border-radius: 14px;
  text-align: center;
  color: #f8fafc;
  background: rgba(30, 41, 59, 0.35);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-card.active {
  background: rgba(242, 101, 34, 0.16);
  border-color: #f26522;
  color: #fff;
}

.category-card:hover {
  background: rgba(242, 101, 34, 0.15);
  border-color: #f26522;
}

/* TRAILS LIST GRID WITH BUTTONS */
.trail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.trail-card {
  border-radius: 16px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.trail-card:hover {
  transform: translateY(-5px);
  border-color: rgba(242, 101, 34, 0.3);
}

.trail-img-container {
  position: relative;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
}

.trail-img-container img { width: 100%; height: 100%; object-fit: cover; }

.distance-tag {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(15, 23, 42, 0.85);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #ff8c52;
  font-weight: 700;
}

.active-pulse-tag {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #22c55e;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.trail-details {
  padding: 0.75rem 0.2rem 0.2rem 0.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.trail-details h4 { margin: 0 0 0.5rem 0; font-size: 1.05rem; font-weight: 700; text-align: center; }

.difficulty-indicator {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: inline-block;
}
.difficulty-indicator.easy { color: #22c55e; }
.difficulty-indicator.medium { color: #eab308; }
.difficulty-indicator.hard { color: #ef4444; }

.card-actions { margin-top: auto; }

.action-btn {
  width: 100%;
  border: none;
  padding: 0.6rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
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
}

.done-btn {
  background: #22c55e;
  color: white;
}
.done-btn:hover { background: #16a34a; }
</style>
