<template>
  <section class="screen globe-bg globe-page app-background">
    <div class="container">

      <!-- HEADER (Clean floating glass style) -->
      <header class="globe-header glass">
        <div class="header-title">
          <span class="icon-geo" aria-hidden="true"></span>
          <h1>Глобална Мапа</h1>
        </div>
        <div class="header-actions">
          <button type="button" class="back-button" @click="goBack">← Назад</button>
          <RouterLink to="/route-planner" class="pill-link">
            <span class="icon" aria-hidden="true">+</span> Планер на Рути
          </RouterLink>
        </div>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="main-layout">

        <!-- LEFT COLUMN: MAP CONTAINER -->
        <section class="glass map-container">
          <div class="map-header-bar">
            <span class="live-pulse"></span>
            <p>Интерактивен GPS преглед на Македонија</p>
          </div>
          <div id="map"></div>
        </section>

        <!-- RIGHT COLUMN: DETAILED INFO & FILTERS -->
        <section class="glass info-card">
          <div class="info-top">
            <h2>Истражи ги патеките</h2>
            <p class="description">
              Користи ја мапата за да откриеш возбудливи планински дестинации.
              Кликни на маркерите за преглед на детални информации, висинска разлика и тежина.
            </p>
          </div>

          <!-- NEW: INTERACTIVE QUICK FILTERS (За побогат изглед) -->
          <div class="filter-section">
            <h4>Брзо филтрирање по тежина:</h4>
            <div class="filter-chips">
              <span class="chip easy">Лесни</span>
              <span class="chip medium">Средни</span>
              <span class="chip hard">Напредни</span>
            </div>
          </div>

          <!-- STATS CONTAINER -->
          <div class="stats-container">
            <div class="stat-item">
              <span class="stat-num">{{ trails.length }}</span>
              <span class="stat-label">Достапни патеки</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">5</span>
              <span class="stat-label">Главни региони</span>
            </div>
          </div>

          <!-- NEW: INFORMATIVE REGIONS LIST (Да не зјапа празно) -->
          <div class="regions-focus">
            <h4>Региони во фокус на Altigo:</h4>
            <ul class="region-list">
              <li><span>Шара & Кораб</span> — Алпски височини и леднички езера.</li>
              <li><span>Национален Парк Маврово</span> — Густи шуми и речни кањони.</li>
              <li><span>Пелистер (Баба)</span> — Карактеристични морени и молика.</li>
              <li><span>Галичица & Охрид</span> — Неверојатен поглед кон двете езера.</li>
            </ul>
          </div>

          <!-- HINT BOX -->
          <div class="hint-box">
            <p><strong>Совет:</strong> Префрли се во Планерот на рути за да ја провериш безбедносната опрема и тековните ризици пред да тргнеш на пат.</p>
          </div>
        </section>

      </div> <!-- /main-layout -->

    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const router = useRouter()
let map
let locationMarker
let positionWatchId

const goBack = () => {
  router.replace({ name: 'Home' })
}

const trails = [
  { id: 1, name: 'Водно (Врв Крстовар)', coords: [41.958, 21.427] },
  { id: 2, name: 'Кањон Матка', coords: [41.940, 21.298] },
  { id: 3, name: 'Шар Планина (Титов Врв)', coords: [42.010, 20.820] },
  { id: 4, name: 'Национален Парк Галичица', coords: [40.986, 20.807] },
  { id: 5, name: 'Врв Кораб', coords: [41.792, 20.546] },
  { id: 6, name: 'Pelister Big Lake', coords: [41.011, 21.192] },
  {id: 8,  name: 'Mavrovo Lake Loop', coords: [41.652, 20.731]},
  {id: 9,  name: 'Kozjak Reservoir Trail', coords: [41.879, 21.189]},
  {id: 12, name: 'Korab Summit Trail', coords: [41.791, 20.591]},
  {id: 14, name: 'Marko’s Tower Trail', coords: [41.365, 21.539]},
  {id: 19, name: 'Prespa Lake Shore', coords: [40.942, 20.912]},
  {id: 20, name: 'Osogovo Mountain Trail', coords: [42.082, 22.465]},
  {id: 103,name: 'Дуфски Водопад', coords: [41.61, 20.6]},
  {id: 104,name: 'Белавички Водопади', coords: [41.92, 22.4]},
  {id: 105,name: 'Габровски Водопади', coords: [41.55, 22.2]},
  {id: 106, name: 'Бабунски Водопад', coords: [41.73, 21.45]},
  {id: 107, name: 'Корабски Водопад (Пропаст)', coords: [41.79, 20.55]},
  {id: 108, name: 'Пештерски Водопад Длабока Река', coords: [41.65, 20.7]},
  {id: 109, name: 'Станечки Водопад', coords: [42.2, 22.3]},
  {id: 110, name: 'Калимански Водопади', coords: [41.9, 22.5]},
  {id: 111, name: 'Водопади на Брегалница', coords: [41.65, 22.6]},
  {id: 201, name: 'Титов Врв (Шар Планина)', coords: [42.15, 20.85]},
  {id: 202, name: 'Врв Пелистер (Баба Планина)', coords: [40.99, 21.20]},
  {id: 203, name: 'Солунска Глава (Јакупица)', coords: [41.73, 21.45]},
  {id: 204, name: 'Голем Кораб', coords: [41.79, 20.55]},
  {id: 205, name: 'Врв Руен (Осоговски Планини)', coords: [42.15, 22.45]},
  {id: 206, name: 'Врв Љуботен (Шар Планина)', coords: [42.12, 20.95]},
  {id: 207, name: 'Врв Магаро (Галичица)', coords: [40.95, 20.85]},
  {id: 208, name: 'Врв Кожуф (Зеленбрег)', coords: [41.15, 22.00]},
  {id: 209, name: 'Врв Меденица (Бистра)', coords: [41.60, 20.65]},
  {id: 210, name: 'Врв Кајмакчалан (Ниџе)', coords: [40.95, 21.80]},
  {id: 211, name: 'Врв Крчин (Дебарски регион)', coords: [41.55, 20.55]},
  {id: 212, name: 'Врв Црн Камен (Јабланица)', coords: [41.25, 20.55]},
  {id: 301, name: 'Парк Шума Гази Баба', coords: [41.98, 21.47]},
  {id: 302, name: 'Вевчански Извори', coords: [41.24, 20.59]},
  {id: 303, name: 'Крушевско Езеро Патека', coords: [41.37, 21.25]},
  {id: 304, name: 'Крајбрежје на Дојран', coords: [41.18, 22.72]},
  {id: 305, name: 'Локалитет Смрдлива Вода', coords: [41.09, 22.02]},
  {id: 306, name: 'Беровско Езеро - Кружна патека', coords: [41.70, 22.85]},
  {id: 307, name: 'Парк Свети Наум (Охрид)', coords: [40.91, 20.74]},
  {id: 308, name: 'Кањон Матка - До манастирот', coords: [41.94, 21.29]},
  {id: 309, name: 'Лесновски Манастир Патека', coords: [42.01, 22.18]},
  {id: 310, name: 'Еко патека Куклица', coords: [42.08, 22.18]},
  {id: 311, name: 'Пониква - Детска патека', coords: [41.95, 22.45]},
  {id: 312, name: 'Пелистерски Патеки за деца', coords: [41.01, 21.20]},
  {id: 401, name: 'Радика Долина', coords: [41.61, 20.60]},
  {id: 402, name: 'Мавровска Долина', coords: [41.70, 20.75]},
  {id: 403, name: 'Демир Капија Долина', coords: [41.41, 22.25]},
  {id: 404, name: 'Треска Долина', coords: [41.95, 21.30]},
  {id: 405, name: 'Кратовска Долина', coords: [42.08, 22.18]},
  {id: 406, name: 'Преспанска Долина', coords: [40.90, 21.05]},
  {id: 407, name: 'Козјачка Долина', coords: [41.95, 21.95]},
  {id: 408, name: 'Смилевска Долина', coords: [41.28, 21.20]},
  {id: 409, name: 'Кумановска Долина', coords: [42.14, 21.72]},
  {id: 410, name: 'Кичевска Долина', coords: [41.51, 20.95]},
  {id: 411, name: 'Галичичка Долина', coords: [40.95, 20.85]},
  {id: 412, name: 'Поречка Долина', coords: [41.74, 21.05]},
  {id: 501, name: 'Охрид Зајдисонце', coords: [41.11, 20.80]},
  {id: 502, name: 'Преспа Зајдисонце', coords: [40.90, 21.05]},
  {id: 503, name: 'Козјак Зајдисонце', coords: [41.95, 21.95]},
  {id: 504, name: 'Водно Зајдисонце', coords: [41.95, 21.43]},
  {id: 505, name: 'Галичица Зајдисонце', coords: [40.95, 20.85]},
  {id: 506, name: 'Кратово Зајдисонце', coords: [42.08, 22.18]},
  {id: 507, name: 'Берово Зајдисонце', coords: [41.70, 22.85]},
  {id: 508, name: 'Крушево Зајдисонце', coords: [41.37, 21.25]},
  {id: 509, name: 'Струга Зајдисонце', coords: [41.18, 20.68]},
  {id: 510, name: 'Куманово Зајдисонце', coords: [42.14, 21.72]},
  {id: 511, name: 'Штип Зајдисонце', coords: [41.74, 22.20]},
  {id: 612, name: 'Сува Гора Шумска Патека', coords: [41.74, 21.05]},
  {id: 701, name: 'Короб Врв', coords: [41.79, 20.55]},
  {id: 702, name: 'Пелистер Големо Езеро', coords: [40.99, 21.20]},
  {id: 703, name: 'Шар Планина Алпски Врвови', coords: [42.12, 20.95]},
  {id: 704, name: 'Јабланица Врв', coords: [41.25, 20.55]},
  {id: 705, name: 'Осогово Врв Руен', coords: [42.15, 22.45]},
  {id: 706, name: 'Стогово Врв', coords: [41.55, 20.55]},
  {id: 707, name: 'Кожуф Врв Зелен Брег', coords: [41.15, 22.00]},
  {id: 708, name: 'Галичица Врв Магаро', coords: [40.95, 20.85]},
  {id: 709, name: 'Сува Гора Врв', coords: [41.74, 21.05]},
  {id: 710, name: 'Караорман Врв', coords: [41.55, 20.65]},
  {id: 711, name: 'Славеј Планина Врв', coords: [41.40, 21.90]},
  {id: 712, name: 'Беласица Врв Тумба', coords: [41.36, 22.90]}
]

onMounted(() => {
  map = L.map('map', {
    scrollWheelZoom: true
  }).setView([41.75, 20.9], 8.5)

  // OpenStreetMap tiles are free and do not require a provider API key.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  trails.forEach(trail => {
    const marker = L.marker(trail.coords).addTo(map)

    const popupContent = `
      <div class="custom-popup">
        <h3>${trail.name}</h3>
        <p>Кликни за да ги отвориш деталните GPS координати и рути.</p>
        <button class="popup-btn">Прегледај патека ➔</button>
      </div>
    `
    marker.bindPopup(popupContent, { maxWidth: 240 })

    marker.on('popupopen', event => {
      const button = event.popup.getElement()?.querySelector('.popup-btn')
      button?.addEventListener('click', () => {
        router.push({ name: 'TrailDetail', params: { id: trail.id } })
      }, { once: true })
    })
  })

  locationMarker = L.circleMarker([41.75, 20.9], {
    radius: 5,
    color: '#ffffff',
    weight: 2,
    fillColor: '#2563eb',
    fillOpacity: 1
  }).addTo(map)
  locationMarker.setStyle({ opacity: 1, fillOpacity: 1 })
  if (navigator.geolocation) {
    positionWatchId = navigator.geolocation.watchPosition(
      ({ coords }) => locationMarker.setLatLng([coords.latitude, coords.longitude]).setStyle({ opacity: 1, fillOpacity: 1 }),
      () => locationMarker.setStyle({ opacity: 1, fillOpacity: 1 }),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    )
  }
})

onBeforeUnmount(() => {
  if (positionWatchId !== undefined) navigator.geolocation?.clearWatch(positionWatchId)
  if (map) map.remove()
})
</script>

<style scoped>
/* ТРИК ЗА ЦЕЛ ЕКРАН БЕЗ БЕЛИ РАМКИ */
.globe-page {
  min-height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  padding: 3rem 2rem;
  box-sizing: border-box;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* GLASSMORPHISM ТЕМНА ВЕРЗИЈА */
.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* HEADER */
.globe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.back-button {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 0.7rem 1.15rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title h1 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.icon-geo {
  font-size: 1.8rem;
}

/* PILL LINK WITH BRAND ORANGE */
.pill-link {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f26522;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.3);
  transition: all 0.2s ease;
}

.pill-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 101, 34, 0.5);
  background: #ff7332;
}

/* LAYOUT */
.main-layout {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}

/* MAP CONTAINER */
.map-container {
  height: 620px;
  overflow: hidden;
  position: relative;
  padding: 0;
}

.map-header-bar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.map-header-bar p {
  margin: 0;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.live-pulse {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: pulse 1.5s infinite;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* INFO CARD */
.info-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: space-between;
}

.info-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.description {
  color: #94a3b8;
  line-height: 1.6;
  font-size: 0.95rem;
  margin: 0;
}

/* FILTERS CHIPS */
.filter-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.filter-chips {
  display: flex;
  gap: 10px;
}

.chip {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}
.chip:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #f26522;
}

/* STATS */
.stats-container {
  display: flex;
  gap: 1rem;
}

.stat-item {
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 14px;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #f26522;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* REGIONS FOCUS LIST */
.regions-focus h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #cbd5e1;
}

.region-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.88rem;
  color: #94a3b8;
}

.region-list li span {
  color: #f1f5f9;
  font-weight: 600;
}

/* HINT BOX */
.hint-box {
  background: rgba(242, 101, 34, 0.1);
  border-left: 4px solid #f26522;
  padding: 1rem;
  border-radius: 4px 14px 14px 4px;
  font-size: 0.88rem;
  color: #cbd5e1;
  line-height: 1.5;
}

/* LEAFLET POPUP CUSTOM STYLING */
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
</style>

<!-- ГЛОБАЛНИ СТИЛОВИ ЗА POPUP НА МAПАТА (Бидејќи Leaflet ги генерира надвор од скоупот) -->
<style>
.custom-popup {
  text-align: center;
  font-family: 'Inter', sans-serif;
  padding: 6px;
  background: #0f172a;
  color: white;
}
.custom-popup h3 {
  margin: 0 0 6px 0;
  font-size: 1rem;
  color: white;
}
.custom-popup p {
  margin: 0 0 12px 0;
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.4;
}
.popup-btn {
  background: #f26522;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  transition: all 0.2s;
}
.popup-btn:hover {
  background: #ff7332;
  box-shadow: 0 4px 12px rgba(242, 101, 34, 0.3);
}
.leaflet-popup-content-wrapper {
  background: #0f172a !important;
  color: white !important;
  border-radius: 14px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
}
.leaflet-popup-tip {
  background: #0f172a !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>