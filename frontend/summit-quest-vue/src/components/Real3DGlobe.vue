<template>
  <section class="real-map-shell glass">
    <div class="real-map-header">
      <div>
        <h2>Real 3D Planet Map</h2>
        <p>Global terrain, mountains, camera flight and hiking markers.</p>
      </div>
      <button class="orange-btn compact" @click="flyToMountain">Fly to mountain</button>
    </div>

    <div ref="cesiumContainer" class="cesium-container"></div>

    <div class="map-controls">
      <button @click="flyToPreset('shar')">Шар Планина</button>
      <button @click="flyToPreset('pelister')">Pelister</button>
      <button @click="flyToPreset('everest')">Everest</button>
      <button @click="toggleRoute">Toggle Route</button>
    </div>

    <p class="map-note">
      This uses CesiumJS for a real worldwide 3D globe. Add your Cesium ion token in
      <strong>src/services/cesiumConfig.js</strong> for global 3D terrain.
    </p>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CESIUM_ION_TOKEN } from '../services/cesiumConfig'

const cesiumContainer = ref(null)
let viewer = null
let routeVisible = true
let routeEntities = []

const presets = {
  shar: { lon: 20.78, lat: 42.05, height: 10500, name: 'Шар Планина' },
  pelister: { lon: 21.19, lat: 41.00, height: 9500, name: 'Pelister' },
  everest: { lon: 86.925, lat: 27.988, height: 15000, name: 'Mount Everest' }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function loadCss(href) {
  const existing = document.querySelector(`link[href="${href}"]`)
  if (existing) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

async function setupCesium() {
  loadCss('https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Widgets/widgets.css')
  await loadScript('https://cesium.com/downloads/cesiumjs/releases/1.121/Build/Cesium/Cesium.js')

  const Cesium = window.Cesium

  if (CESIUM_ION_TOKEN && !CESIUM_ION_TOKEN.includes('PASTE_YOUR')) {
    Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN
  }

  viewer = new Cesium.Viewer(cesiumContainer.value, {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    animation: false,
    timeline: false,
    baseLayerPicker: true,
    geocoder: true,
    homeButton: true,
    navigationHelpButton: false,
    sceneModePicker: true,
    fullscreenButton: true
  })

  viewer.scene.globe.enableLighting = true
  viewer.scene.globe.depthTestAgainstTerrain = true

  addTrailMarkers()
  flyToPreset('shar')
}

function addTrailMarkers() {
  const Cesium = window.Cesium

  const trailPoints = [
    { lon: 20.735, lat: 42.018, label: 'START' },
    { lon: 20.755, lat: 42.035, label: 'Checkpoint 1' },
    { lon: 20.782, lat: 42.048, label: 'Checkpoint 2' },
    { lon: 20.805, lat: 42.064, label: 'SUMMIT' }
  ]

  routeEntities = trailPoints.map(point => viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 1700),
    point: {
      pixelSize: 10,
      color: Cesium.Color.ORANGE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
    label: {
      text: point.label,
      font: '14px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -14)
    }
  }))

  const route = viewer.entities.add({
    polyline: {
      positions: trailPoints.map(point => Cesium.Cartesian3.fromDegrees(point.lon, point.lat, 1700)),
      width: 6,
      material: Cesium.Color.ORANGE,
      clampToGround: true
    }
  })

  routeEntities.push(route)
}

function flyToPreset(key) {
  if (!viewer || !window.Cesium) return

  const Cesium = window.Cesium
  const preset = presets[key]

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(preset.lon, preset.lat, preset.height),
    orientation: {
      heading: Cesium.Math.toRadians(15),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0
    },
    duration: 1.6
  })
}

function flyToMountain() {
  flyToPreset('shar')
}

function toggleRoute() {
  routeVisible = !routeVisible
  routeEntities.forEach(entity => {
    entity.show = routeVisible
  })
}

onMounted(setupCesium)

onBeforeUnmount(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>
