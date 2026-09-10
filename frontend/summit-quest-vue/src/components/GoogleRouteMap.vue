<template>
  <section class="google-map-card glass">

    <div class="google-map-header">
      <div>
        <h2>Планер на планинарски рути</h2>
        <p>Одбери од каде тргнуваш и каде сакаш да стигнеш.</p>
      </div>

      <button class="orange-btn compact" @click="resetRoute">
        Ресетирај
      </button>
    </div>

    <section v-if="!hasKey" class="setup-warning">
      <h3>Потребен е Google Maps API клуч</h3>
      <p>
        Додади го во локалната <strong>.env</strong> датотека како
        <strong>VITE_GOOGLE_MAPS_API_KEY</strong>, потоа рестартирај ја апликацијата.
      </p>
    </section>

    <div class="route-inputs">
      <input
          ref="startInput"
          v-model="startText"
          placeholder="Почетна локација (на пр. Водно)"
      />

      <input
          ref="endInput"
          v-model="endText"
          placeholder="Дестинација (на пр. Кањон Матка)"
      />
    </div>

    <div class="mode-row">
      <button
          :class="{ active: selectionMode === 'start' }"
          @click="selectionMode = 'start'"
      >
        Избери почеток
      </button>

      <button
          :class="{ active: selectionMode === 'end' }"
          @click="selectionMode = 'end'"
      >
        Избери дестинација
      </button>

      <button class="orange-btn no-margin" @click="calculateRoute">
        Креирај рута
      </button>
    </div>

    <div ref="mapElement" class="google-map"></div>

    <section v-if="routeResult" class="route-result">

      <div>
        <small>Растојание</small>
        <strong>{{ routeResult.distanceText }}</strong>
      </div>

      <div>
        <small>Време</small>
        <strong>{{ routeResult.durationText }}</strong>
      </div>

      <div>
        <small>Награда</small>
        <strong>+{{ routeResult.xpReward }}</strong>
      </div>

      <div>
        <small>Тежина</small>
        <strong>{{ routeResult.difficulty }}</strong>
      </div>

    </section>

    <button
        v-if="routeResult"
        class="start-wide"
        @click="startTrek"
    >
      ЗАПОЧНИ ТУРА
    </button>

    <section v-if="trekStarted" class="trek-started glass">
      <h3>Турата започна ⛰️</h3>
      <p>Среќно! Внимавај на теренот и уживај во патеката.</p>
    </section>

  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../services/api'
import {
  hasGoogleMapsKey,
  loadGoogleMaps
} from '../services/googleMapsLoader'

const mapElement = ref(null)
const startInput = ref(null)
const endInput = ref(null)

const hasKey = computed(() => hasGoogleMapsKey())

const startText = ref('')
const endText = ref('')
const selectionMode = ref('start')

const routeResult = ref(null)
const trekStarted = ref(false)

let map = null
let googleMaps = null
let directionsService = null
let directionsRenderer = null

let startMarker = null
let endMarker = null

let startPlace = null
let endPlace = null

const defaultCenter = { lat: 41.9981, lng: 21.4254 }

async function initMap() {
  if (!hasGoogleMapsKey()) return

  googleMaps = await loadGoogleMaps()

  map = new googleMaps.Map(mapElement.value, {
    center: defaultCenter,
    zoom: 11,
    mapTypeId: 'terrain',
    tilt: 45,
    streetViewControl: false,
    fullscreenControl: true
  })

  directionsService = new googleMaps.DirectionsService()

  directionsRenderer = new googleMaps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#ff7a1a',
      strokeWeight: 6,
      strokeOpacity: 0.95
    }
  })

  map.addListener('click', (event) => {
    const location = event.latLng

    if (selectionMode.value === 'start') {
      setStart(location)
    } else {
      setEnd(location)
    }
  })

  setupAutocomplete()
}

function setupAutocomplete() {
  const startAutocomplete =
      new googleMaps.places.Autocomplete(startInput.value)

  const endAutocomplete =
      new googleMaps.places.Autocomplete(endInput.value)

  startAutocomplete.addListener('place_changed', () => {
    const place = startAutocomplete.getPlace()

    if (place.geometry?.location) {
      startText.value = place.formatted_address || place.name
      setStart(place.geometry.location)
    }
  })

  endAutocomplete.addListener('place_changed', () => {
    const place = endAutocomplete.getPlace()

    if (place.geometry?.location) {
      endText.value = place.formatted_address || place.name
      setEnd(place.geometry.location)
    }
  })
}

function setStart(location) {
  startPlace = location

  if (startMarker) startMarker.setMap(null)

  startMarker = new googleMaps.Marker({
    position: location,
    map,
    label: 'S',
    title: 'Start'
  })

  startText.value =
      `${location.lat().toFixed(5)}, ${location.lng().toFixed(5)}`

  map.panTo(location)
}

function setEnd(location) {
  endPlace = location

  if (endMarker) endMarker.setMap(null)

  endMarker = new googleMaps.Marker({
    position: location,
    map,
    label: 'E',
    title: 'Destination'
  })

  endText.value =
      `${location.lat().toFixed(5)}, ${location.lng().toFixed(5)}`

  map.panTo(location)
}

async function calculateRoute() {
  if (!directionsService || !startPlace || !endPlace) return

  const request = {
    origin: startPlace,
    destination: endPlace,
    travelMode: googleMaps.TravelMode.WALKING,
    provideRouteAlternatives: true
  }

  directionsService.route(async (result, status) => {
    if (status !== 'OK') {
      alert('Could not generate route')
      return
    }

    directionsRenderer.setDirections(result)

    const route = result.routes[0]
    const leg = route.legs[0]

    const distanceKm = leg.distance.value / 1000
    const estimatedMinutes = Math.round(leg.duration.value / 60)

    const backendResponse = await api.post('/routes/calculate', {
      distanceKm,
      estimatedMinutes,
      startName: startText.value,
      endName: endText.value
    })

    routeResult.value = {
      distanceText: leg.distance.text,
      durationText: leg.duration.text,
      ...backendResponse.data
    }

    trekStarted.value = false
  })
}
function resetRoute() {
  routeResult.value = null
  trekStarted.value = false

  startText.value = ''
  endText.value = ''

  startPlace = null
  endPlace = null

  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] })
  }

  if (startMarker) startMarker.setMap(null)
  if (endMarker) endMarker.setMap(null)

  startMarker = null
  endMarker = null
}

function startTrek() {
  trekStarted.value = true
}

onMounted(initMap)
</script>
