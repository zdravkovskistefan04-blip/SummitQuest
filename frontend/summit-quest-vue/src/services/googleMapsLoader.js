import { GOOGLE_MAPS_API_KEY } from './googleMapsConfig'

let googleMapsPromise = null

export function hasGoogleMapsKey() {
  return Boolean(GOOGLE_MAPS_API_KEY)
}

export function loadGoogleMaps() {
  if (!hasGoogleMapsKey()) {
    return Promise.reject(new Error('Missing Google Maps API key.'))
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps)
  }

  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]')

    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps))
      existing.addEventListener('error', reject)
      return
    }

    const script = document.createElement('script')
    script.dataset.googleMaps = 'true'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = () => reject(new Error('Google Maps failed to load.'))
    document.head.appendChild(script)
  })

  return googleMapsPromise
}
