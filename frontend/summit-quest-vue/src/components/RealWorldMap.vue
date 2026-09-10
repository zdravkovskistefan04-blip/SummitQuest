<template>
  <section class="real-map-shell glass">
    <div class="real-map-header">
      <div>
        <h2>Мапа на планинарски патеки</h2>
        <p>OpenStreetMap мапа со македонски планини и планинарска рута.</p>
      </div>

      <button class="orange-btn compact" @click="toggle3D">
        {{ is3D ? '2D' : '3D' }}
      </button>
    </div>

    <div :class="['leaflet-wrap', { tilted: is3D }]">
      <div ref="mapContainer" class="leaflet-map"></div>
    </div>

    <div class="map-controls">
      <button @click="flyTo('shar')">Шар Планина</button>
      <button @click="flyTo('pelister')">Пелистер</button>
      <button @click="flyTo('everest')">Еверест</button>
      <button @click="toggleRoute">{{ routeVisible ? 'Сокриј рута' : 'Прикажи рута' }}</button>
    </div>

    <p class="map-note">
      Мапата користи OpenStreetMap и работи без API токен. Копчето 3D прикажува накосен поглед.
    </p>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const mapContainer = ref(null)
const is3D = ref(true)
const routeVisible = ref(true)

let map = null
let routeLayer = null
let markerLayer = null

const presets = {
  shar: { lat: 42.05, lng: 20.78, zoom: 12 },
  pelister: { lat: 41.00, lng: 21.19, zoom: 12 },
  everest: { lat: 27.9881, lng: 86.9250, zoom: 11 }
}

const route = [
  [42.018, 20.735],
  [42.035, 20.755],
  [42.048, 20.782],
  [42.064, 20.805]
]

function loadCss(href) {
  if (document.querySelector(`link[href="${href}"]`)) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (window.L) {
      resolve()
      return
    }

    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener('load', resolve)
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function initMap() {
  loadCss('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css')
  await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')

  const L = window.L

  if (!mapContainer.value) throw new Error('Контејнерот за мапата не е достапен.')
  map = L.map(mapContainer.value, {
    zoomControl: true,
    worldCopyJump: true
  }).setView([42.05, 20.78], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)

  L.marker(route[0]).bindPopup('ПОЧЕТОК').addTo(markerLayer)
  L.marker(route[1]).bindPopup('Контролна точка 1').addTo(markerLayer)
  L.marker(route[2]).bindPopup('Контролна точка 2').addTo(markerLayer)
  L.marker(route[3]).bindPopup('ВРВ').addTo(markerLayer)

  routeLayer = L.polyline(route, {
    color: '#ff7a1a',
    weight: 6,
    opacity: 0.95
  }).addTo(map)

  map.fitBounds(routeLayer.getBounds(), { padding: [25, 25] })

  setTimeout(() => {
    map.invalidateSize()
  }, 300)
}

function flyTo(key) {
  if (!map) return

  const place = presets[key]
  map.flyTo([place.lat, place.lng], place.zoom, {
    duration: 1.2
  })
}

function toggle3D() {
  is3D.value = !is3D.value

  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 200)
}

function toggleRoute() {
  if (!map || !routeLayer || !markerLayer) return

  routeVisible.value = !routeVisible.value

  if (routeVisible.value) {
    routeLayer.addTo(map)
    markerLayer.addTo(map)
  } else {
    routeLayer.remove()
    markerLayer.remove()
  }
}

onMounted(() => {
  initMap().catch(error => {
    console.error('Неуспешно вчитување на мапата', error)
  })
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>
