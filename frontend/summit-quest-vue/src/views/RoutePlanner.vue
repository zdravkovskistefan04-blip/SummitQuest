<template>
  <div class="route-planner-page">
    <div class="container">

      <!-- HEADER (Clean floating style) -->
      <header class="page-header">
        <div class="header-text">
          <h2><span class="heading-compass" aria-hidden="true">✦</span><span>Route Planner <em>&amp; Safety</em></span></h2>
          <p>Подгответе се паметно и безбедно пред да тргнете на следната планинска авантура со Altigo.</p>
        </div>
        <RouterLink to="/explore" class="back-btn">
          ← Назад кон Истражи
        </RouterLink>
      </header>

      <!-- MAIN LAYOUT -->
      <div class="planner-layout">

        <div class="map-card glass">
          <div class="map-overlay-info">
            <span class="live-tag">МАПА НА ПАТЕКАТА</span>
            <p>{{ routeName }} · провери ја рутата пред да тргнеш</p>
          </div>
          <div id="map">
            <div class="map-placeholder" v-if="mapError">
              <span class="map-icon" aria-hidden="true">GPS</span>
              <p>{{ mapError }}</p>
            </div>
            <div class="map-progress" v-else>
              <span>{{ progressLabel }}</span>
              <div class="route-stats">
                <span><b>Вкупна должина:</b> {{ totalRouteDistance }}</span>
                <span><b>Од почеток до крај:</b> {{ totalRouteTime }}</span>
              </div>
              <div class="arrival-guide">
                <div class="arrival-guide-title">До почетокот на патеката</div>
                <div v-if="routeToStartDistance !== null" class="arrival-options">
                  <span><b>Растојание:</b> {{ formatDistance(routeToStartDistance) }}</span>
                  <span><b>Пешки:</b> {{ formatDuration(routeToStartDistance / 3.5) }}</span>
                  <span><b>Со кола:</b> {{ formatDuration(routeToStartDistance / 45) }}</span>
                </div>
                <div v-else class="arrival-waiting">Вклучете GPS за рута од вашата локација.</div>
              </div>
              <div class="travel-mode">
                <button :class="{ active: travelMode === 'walk' }" @click="travelMode = 'walk'">Пешки</button>
                <button :class="{ active: travelMode === 'car' }" @click="travelMode = 'car'">Со кола</button>
              </div>
              <div class="gps-progress-track">
                <div class="gps-progress-fill" :style="{ width: `${routeProgress}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-wrapper">

          <div class="card glass">
            <div class="card-title">
              <h3>Опрема и пакување</h3>
              <span class="count-badge" :class="{ 'all-done': completedCount === checklist.length }">
                {{ completedCount }} / {{ checklist.length }}
              </span>
            </div>

            <p class="card-subtitle">Штиклирај што веќе имаш ставено во ранецот:</p>

            <div class="items">
              <label
                  v-for="item in checklist"
                  :key="item"
                  :class="{ 'item-checked': checkedItems[item] }"
              >
                <div class="checkbox-wrapper">
                  <input type="checkbox" v-model="checkedItems[item]" />
                </div>
                <span class="item-text">{{ item }}</span>
              </label>
            </div>

            <div class="progress-container">
              <div class="progress-bar" :style="{ width: (completedCount / checklist.length) * 100 + '%' }"></div>
            </div>
          </div>

          <div class="card glass risk-card">
            <div class="card-title">
              <h3>Услови на патеката</h3>
            </div>
            <div class="risk-indicators">
              <div class="risk-item">
                <span class="risk-label">Терен:</span>
                <span class="risk-badge badge-orange">Лизгави карпи</span>
              </div>
              <div class="risk-item">
                <span class="risk-label">Време:</span>
                <span class="risk-badge badge-yellow">{{ weatherStatus }}</span>
              </div>
              <div class="risk-item">
                <span class="risk-label">Мрежа:</span>
                <span class="risk-badge badge-red">Слаб мобилен сигнал</span>
              </div>
            </div>
          </div>

          <!-- SAFETY TIPS CARD -->
          <div class="card glass safety-card">
            <div class="card-title">
              <h3>Важни напомени</h3>
            </div>
            <ul class="safety-list">
              <li>
                <strong>Проверете го времето:</strong> Планинските услови се менуваат брзо. Не тргнувајте при најава за невреме.
              </li>
              <li>
                <strong>Батерија:</strong> Чувајте го телефонот во режим на заштеда и секогаш носете полн Power Bank.
              </li>
              <li>
                <strong>Пријавете ја рутата:</strong> Секогаш кажете на близок пријател каде точно планирате да пешачите денес.
              </li>
            </ul>
          </div>

        </div> <!-- /sidebar-wrapper -->

      </div> <!-- /planner-layout -->

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import { fetchMountainWeather } from '../services/weather'
import { loadData } from '../services/storage'

const checklist = [
  'Вода (Минимум 2L)',
  'Power Bank (Полна батерија)',
  'Прва Помош (Завои, антисептик)',
  'Планинарски чевли (Удобни)',
  'Храна и високоенергетски благо',
  'Ветровка / Кабаница за дожд',
  'Ламба / Фенерче за глава',
  'Офлајн GPS мапа на телефонот'
]

const checkedItems = ref({})
const weatherStatus = ref('Се проверува...')
const gpsStatus = ref('Чекам GPS локација...')
const routeProgress = ref(0)
const mapError = ref('')
const travelMode = ref('walk')
const routeToStartDistance = ref(null)

const pageRoute = useRoute()
const defaultRoute = [
  [42.018, 20.735],
  [42.035, 20.755],
  [42.048, 20.782],
  [42.064, 20.805]
]
const savedTrail = loadData('routePlannerTrail', null)
const selectedTrail = savedTrail && String(savedTrail.id) === String(pageRoute.query.trail) ? savedTrail : null
const route = selectedTrail?.coords?.length > 1 ? selectedTrail.coords : defaultRoute
const routeName = selectedTrail?.name || 'Планинска патека'

let map
let gpsMarker
let progressLayer
let remainingLayer
let routeToStartLayer
let waypointMarkers = []
let positionWatchId
let previousPosition = null
let currentPosition = null
let lastNavigationRequest = 0

checklist.forEach(item => {
  checkedItems.value[item] = false
})

onMounted(async () => {
  initializeMap()
  startGpsTracking()

  try {
    const weather = await fetchMountainWeather()
    weatherStatus.value = `${weather.condition}, ${weather.temperature}°C`
  } catch (error) {
    weatherStatus.value = 'Податоците не се достапни'
    console.warn('Could not load mountain weather:', error)
  }
})

const progressLabel = computed(() => {
  if (gpsStatus.value === 'GPS локацијата е исклучена.') return 'Вклучете ја локацијата за да го следите напредокот.'
  if (gpsStatus.value.includes('надвор од рутата')) return 'Приближете се до означената патека за да се пресмета напредокот.'
  if (gpsStatus.value.startsWith('GPS грешка')) return 'Рутата ќе се ажурира кога GPS ќе стане достапен.'
  return `${Math.round(routeProgress.value)}% од рутата е помината`
})

const totalRouteDistance = computed(() => formatDistance(routeDistance(route)))
const totalRouteTime = computed(() => {
  const speed = travelMode.value === 'car' ? 45 : 3.5
  return formatDuration(routeDistance(route) / speed)
})

watch(travelMode, () => {
  if (currentPosition) loadRouteToStart(currentPosition)
})

function initializeMap() {
  try {
    map = L.map('map', { scrollWheelZoom: true }).fitBounds(route, { padding: [35, 35] })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    L.polyline(route, {
      color: '#ff7a1a',
      weight: 6,
      opacity: 0.95
    }).addTo(map)
    progressLayer = L.polyline(route.slice(0, 1), {
      color: '#22c55e',
      weight: 8,
      opacity: 0.95
    }).addTo(map)
    remainingLayer = L.polyline(route, {
      color: '#38bdf8',
      weight: 3,
      opacity: 0.9,
      dashArray: '8 10'
    }).addTo(map)
    routeToStartLayer = L.polyline([], {
      color: '#60a5fa',
      weight: 4,
      opacity: 0.95,
      dashArray: '7 11'
    }).addTo(map)
    const startIcon = L.divIcon({ className: 'route-point route-start', html: '<span>▶</span>', iconSize: [30, 30], iconAnchor: [15, 15] })
    const endIcon = L.divIcon({ className: 'route-point route-end', html: '<span>★</span>', iconSize: [30, 30], iconAnchor: [15, 15] })
    L.marker(route[0], { icon: startIcon }).bindTooltip('Почеток', { direction: 'top' }).addTo(map)
    L.marker(route[route.length - 1], { icon: endIcon }).bindTooltip('Врв', { direction: 'top' }).addTo(map)
    waypointMarkers = route.slice(1, -1).map((point, index) => {
      const marker = L.marker(point, {
        icon: createWaypointIcon(false, index + 1)
      }).bindTooltip(`Контролна точка ${index + 1}`, { direction: 'top' }).addTo(map)
      return marker
    })

    gpsMarker = L.marker(route[0], {
      icon: createGpsIcon(0)
    }).addTo(map)
    // Show the compact blue position marker at the trail start before GPS resolves.
    gpsMarker.setOpacity(1)
    setTimeout(() => map.invalidateSize(), 100)
  } catch (error) {
    console.error('Неуспешно вчитување на мапата:', error)
    mapError.value = 'Мапата не може да се вчита. Проверете ја интернет конекцијата.'
  }
}

function startGpsTracking() {
  if (!navigator.geolocation) {
    gpsStatus.value = 'GPS не е поддржан на овој уред.'
    return
  }

  positionWatchId = navigator.geolocation.watchPosition(
    ({ coords }) => updateGpsPosition(coords.latitude, coords.longitude, coords.heading),
    error => {
      gpsStatus.value = error.code === error.PERMISSION_DENIED
        ? 'GPS локацијата е исклучена.'
        : `GPS грешка (${error.message})`
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  )
}

function updateGpsPosition(latitude, longitude, heading) {
  if (!gpsMarker || !map) return

  const position = [latitude, longitude]
  const isFirstPosition = !currentPosition
  currentPosition = position
  routeToStartDistance.value = haversineDistance(position, route[0])
  const calculatedHeading = Number.isFinite(heading) ? heading : previousPosition
    ? getBearing(previousPosition, position)
    : 0
  gpsMarker
    .setLatLng(position)
    .setIcon(createGpsIcon(calculatedHeading))
    .setOpacity(1)
  previousPosition = position
  if (routeToStartLayer) {
    routeToStartLayer.setLatLngs([position, route[0]])
    routeToStartLayer.bringToFront()
  }
  if (isFirstPosition) {
    map.fitBounds([...route, position], { padding: [45, 45], maxZoom: 13 })
  }
  loadRouteToStart(position)
  const nearestPoint = findNearestRoutePoint(latitude, longitude)

  if (nearestPoint.distance > 0.03) {
    routeProgress.value = 0
    if (progressLayer) progressLayer.setLatLngs(route.slice(0, 1))
    if (remainingLayer) remainingLayer.setLatLngs(route)
    updateWaypointMarkers(0)
    gpsStatus.value = 'GPS е активен, но сте надвор од рутата'
    return
  }

  const passedRoute = [...route.slice(0, nearestPoint.index + 1), nearestPoint.position]
  const distancePassed = routeDistance(passedRoute)
  const totalDistance = routeDistance(route)
  routeProgress.value = Math.round((distancePassed / totalDistance) * 100)
  if (progressLayer) progressLayer.setLatLngs(passedRoute)
  if (remainingLayer) remainingLayer.setLatLngs([nearestPoint.position, ...route.slice(nearestPoint.index + 1)])
  updateWaypointMarkers(nearestPoint.index)
  gpsStatus.value = 'GPS локацијата е активна'
}

function createGpsIcon(heading) {
  return L.divIcon({
    className: 'gps-location-marker',
    html: `<span style="transform: rotate(${heading}deg)"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  })
}

function getBearing(first, second) {
  const latitude = Math.PI / 180
  const y = Math.sin((second[1] - first[1]) * latitude) * Math.cos(second[0] * latitude)
  const x = Math.cos(first[0] * latitude) * Math.sin(second[0] * latitude) -
    Math.sin(first[0] * latitude) * Math.cos(second[0] * latitude) * Math.cos((second[1] - first[1]) * latitude)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

async function loadRouteToStart(position) {
  const now = Date.now()
  if (now - lastNavigationRequest < 10000) return
  lastNavigationRequest = now

  const profile = travelMode.value === 'car' ? 'driving' : 'foot'
  const [startLatitude, startLongitude] = route[0]

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${profile}/${position[1]},${position[0]};${startLongitude},${startLatitude}?overview=full&geometries=geojson`
    )
    if (!response.ok) throw new Error(`OSRM одговори со ${response.status}`)
    const data = await response.json()
    const coordinates = data.routes?.[0]?.geometry?.coordinates
    const routedDistance = data.routes?.[0]?.distance
    if (Number.isFinite(routedDistance)) routeToStartDistance.value = routedDistance / 1000
    if (coordinates?.length > 1 && routeToStartLayer) {
      routeToStartLayer.setLatLngs(coordinates.map(([longitude, latitude]) => [latitude, longitude]))
      routeToStartLayer.bringToFront()
    }
  } catch (error) {
    console.warn('Неуспешно вчитување на рутата до почетокот:', error)
  }
}

function createWaypointIcon(reached, number) {
  return L.divIcon({
    className: `route-waypoint ${reached ? 'waypoint-reached' : ''}`,
    html: `<span>${reached ? '✓' : number}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

function updateWaypointMarkers(reachedIndex) {
  waypointMarkers.forEach((marker, index) => {
    marker.setIcon(createWaypointIcon(index + 1 <= reachedIndex, index + 1))
  })
}

function findNearestRoutePoint(latitude, longitude) {
  let nearest = { distance: Infinity, index: 0, position: route[0] }
  for (let index = 0; index < route.length - 1; index += 1) {
    const start = route[index]
    const end = route[index + 1]
    const lengthSquared = (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2
    const ratio = Math.max(0, Math.min(1, ((latitude - start[0]) * (end[0] - start[0]) + (longitude - start[1]) * (end[1] - start[1])) / lengthSquared))
    const position = [start[0] + ratio * (end[0] - start[0]), start[1] + ratio * (end[1] - start[1])]
    const distance = Math.hypot(position[0] - latitude, position[1] - longitude)
    if (distance < nearest.distance) nearest = { distance, index, position }
  }
  return nearest
}

function haversineDistance(first, second) {
  const earthRadius = 6371
  const latDistance = (second[0] - first[0]) * Math.PI / 180
  const lngDistance = (second[1] - first[1]) * Math.PI / 180
  const latitude = first[0] * Math.PI / 180
  const secondLatitude = second[0] * Math.PI / 180
  const value = Math.sin(latDistance / 2) ** 2 + Math.cos(latitude) * Math.cos(secondLatitude) * Math.sin(lngDistance / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

function routeDistance(points) {
  return points.slice(1).reduce((total, point, index) => total + haversineDistance(points[index], point), 0)
}

function formatDistance(distance) {
  return `${distance < 1 ? Math.round(distance * 1000) + ' m' : distance.toFixed(1) + ' km'}`
}

function formatDuration(hours) {
  const minutes = Math.max(0, Math.round(hours * 60))
  if (minutes < 60) return `${minutes} мин`
  return `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`
}

const completedCount = computed(() =>
    Object.values(checkedItems.value).filter(Boolean).length
)

onBeforeUnmount(() => {
  if (positionWatchId !== undefined) navigator.geolocation?.clearWatch(positionWatchId)
  if (map) map.remove()
})
</script>

<style scoped>
/* ТРИК ЗА ЦЕЛ ЕКРАН: Го шириме контејнерот на 100% од ширината и ја неутрализираме надворешната маргина */
.route-planner-page {
  min-height: 100vh;
  width: 100vw;

  /* Ги поништуваме евентуалните маргини од App.vue */
  position: absolute;
  top: 0;
  left: 0;

  background: radial-gradient(circle at top, #111a2e, #070b14);
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 3rem 2rem;
  box-sizing: border-box;
  overflow-x: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* HEADER STYLE */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  gap: 20px;
}

.header-text h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.heading-compass {
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  flex: 0 0 2.65rem;
  place-items: center;
  border: 1px solid rgba(255, 181, 122, 0.55);
  border-radius: 50%;
  background: linear-gradient(145deg, #f26522, #a84419);
  color: #fff;
  font-size: 1.55rem;
  line-height: 1;
  -webkit-text-fill-color: #fff;
  box-shadow: 0 8px 18px rgba(242, 101, 34, 0.25), inset 0 1px rgba(255, 255, 255, 0.28);
  transform: rotate(45deg);
}

.header-text h2 em {
  color: #f59e72;
  font-style: normal;
  -webkit-text-fill-color: #f59e72;
}

.header-text p {
  margin: 0;
  color: #94a3b8;
  font-size: 1rem;
}

/* BACK BUTTON */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  background: linear-gradient(135deg, rgba(242, 101, 34, 0.18), rgba(139, 92, 246, 0.14));
  border: 1px solid rgba(242, 101, 34, 0.35);
  color: #f8fafc;
  padding: 0.72rem 1rem 0.72rem 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.back-btn:hover {
  background: linear-gradient(135deg, #f26522, #c94d18);
  color: white;
  border-color: #f26522;
  box-shadow: 0 4px 15px rgba(242, 101, 34, 0.4);
}

/* GRID LAYOUT */
.planner-layout {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .planner-layout {
    grid-template-columns: 1fr;
  }
}

/* GLASSMORPHISM */
.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* MAP CARD */
.map-card {
  position: relative;
  height: 650px; /* Малку поголема за подобар визуелен импакт */
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
  background: #0f172a;
}

.map-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #64748b;
  gap: 15px;
}

.map-progress {
  position: absolute;
  z-index: 500;
  right: 1.25rem;
  bottom: 1.25rem;
  width: min(280px, calc(100% - 2.5rem));
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(10, 20, 37, 0.96), rgba(21, 31, 52, 0.94));
  color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.map-progress strong,
.map-progress span {
  display: block;
}

.map-progress strong {
  color: #f8fafc;
  font-size: 0.9rem;
}

.gps-label {
  display: flex !important;
  align-items: center;
  gap: 0.45rem;
}

.gps-pin {
  position: relative;
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid #fff;
  border-radius: 50% 50% 50% 0;
  background: #2563eb;
  transform: rotate(-45deg);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}

.gps-pin::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  content: '';
}

.map-progress span {
  margin-top: 0.25rem;
  color: #94a3b8;
  font-size: 0.78rem;
}

.map-progress .gps-status {
  color: #86efac;
}

.route-stats {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.65rem;
  padding-top: 0.55rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.map-progress .route-stats span {
  margin-top: 0;
  color: #cbd5e1;
  font-size: 0.78rem;
}

.route-stats b {
  color: #f8fafc;
}

.arrival-guide {
  margin-top: 0.7rem;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.arrival-guide-title {
  color: #f8fafc;
  font-size: 0.8rem;
  font-weight: 800;
}

.arrival-options {
  display: grid;
  gap: 0.2rem;
  margin-top: 0.3rem;
}

.arrival-options span,
.arrival-waiting {
  margin-top: 0 !important;
  color: #cbd5e1 !important;
  font-size: 0.76rem !important;
}

.arrival-options b {
  color: #f8fafc;
}

.gps-progress-track {
  height: 7px;
  margin-top: 0.7rem;
  overflow: hidden;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.12);
}

.gps-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #86efac);
  transition: width 0.4s ease;
}

.travel-mode {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
}

.travel-mode button {
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.45rem;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  transition: 0.2s ease;
}

.travel-mode button.active {
  background: linear-gradient(135deg, #f26522, #d95c1e);
  color: #fff;
  box-shadow: 0 4px 12px rgba(242, 101, 34, 0.28);
}

.route-point {
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45);
}

.route-start { background: #22c55e; }
.route-end { background: #f26522; }

.route-waypoint {
  display: grid;
  place-items: center;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #64748b;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

.route-waypoint.waypoint-reached {
  background: #22c55e;
}

.gps-location-marker {
  display: grid;
  place-items: center;
  background: transparent;
}

.gps-location-marker span {
  display: block;
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-bottom: 12px solid #2563eb;
  border-left: 4px solid transparent;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  transform-origin: 50% 50%;
}

.map-icon {
  font-size: 3.5rem;
  animation: float 3s ease-in-out infinite;
}

.map-overlay-info {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 10;
  background: rgba(15, 23, 42, 0.85);
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.map-overlay-info p {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
}

.live-tag {
  color: #ef4444;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 2px;
}

/* SIDEBAR WRAPPER */
.sidebar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  padding: 1.5rem;
}
.card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-title h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.card-subtitle {
  margin: 0 0 1.25rem 0;
  font-size: 0.88rem;
  color: #94a3b8;
}

.count-badge {
  background: rgba(255, 255, 255, 0.08);
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f26522;
  border: 1px solid rgba(242, 101, 34, 0.2);
  transition: all 0.3s ease;
}

.count-badge.all-done {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
}

/* ITEMS */
.items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 340px; /* Ова ја прави тесна како претходно */
  overflow-y: auto;   /* Ова го враќа скролот кога има повеќе ставки */
  padding-right: 5px;
}
.items::-webkit-scrollbar {
  width: 6px;
}
.items::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}


.items label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.2s ease;
}

.items label:hover {
  background: rgba(255, 255, 255, 0.07);
  transform: translateX(3px);
}

.items label.item-checked {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.2);
}

.items label.item-checked .item-text {
  text-decoration: line-through;
  color: #64748b;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #f26522;
  cursor: pointer;
}

.item-text {
  font-size: 0.95rem;
  color: #e2e8f0;
}

/* PROGRESS BAR */
.progress-container {
  background: rgba(255, 255, 255, 0.05);
  height: 6px;
  border-radius: 10px;
  margin-top: 1.25rem;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #f26522, #ff8c52);
  height: 100%;
  width: 0%;
  transition: width 0.3s ease;
}

/* NEW: RISK CARD STYLE */
.risk-card {
  border-left: 4px solid #ef4444; /* Црвен маркер за ризици */
}

.risk-indicators {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1rem;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 0.6rem 1rem;
  border-radius: 10px;
}

.risk-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

.risk-badge {
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
}

.badge-orange { background: rgba(242, 101, 34, 0.15); color: #ff7a39; border: 1px solid rgba(242, 101, 34, 0.3); }
.badge-yellow { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }
.badge-red { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

/* SAFETY CARD */
.safety-card {
  border-left: 4px solid #3b82f6; /* Син информативен маркер */
}

.safety-list {
  margin: 0;
  padding: 0 0 0 1.20rem;
  color: #cbd5e1;
  font-size: 0.88rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
  line-height: 1.5;
}

/* ANIMATIONS */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}
</style>