const VODNO_WEATHER = {
  latitude: 41.95,
  longitude: 21.43,
  label: 'Водно, Скопје'
}

const weatherLabels = {
  0: 'Ведро',
  1: 'Претежно ведро',
  2: 'Делумно облачно',
  3: 'Облачно',
  45: 'Магла',
  48: 'Магла со наслаги',
  51: 'Слаба роса',
  53: 'Роса',
  55: 'Густа роса',
  61: 'Слаб дожд',
  63: 'Дожд',
  65: 'Обилен дожд',
  71: 'Слаб снег',
  73: 'Снег',
  75: 'Обилен снег',
  80: 'Краткотрајни врнежи',
  81: 'Врнежи',
  82: 'Обилни врнежи',
  95: 'Невреме',
  96: 'Невреме со град',
  99: 'Невреме со силен град'
}

export async function fetchMountainWeather() {
  const params = new URLSearchParams({
    latitude: String(VODNO_WEATHER.latitude),
    longitude: String(VODNO_WEATHER.longitude),
    current: 'temperature_2m,weather_code,wind_speed_10m',
    timezone: 'Europe/Skopje'
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)

  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`)
  }

  const data = await response.json()
  const current = data.current

  if (!current || typeof current.temperature_2m !== 'number') {
    throw new Error('Weather response did not contain current conditions')
  }

  return {
    location: VODNO_WEATHER.label,
    temperature: Math.round(current.temperature_2m),
    condition: weatherLabels[current.weather_code] || 'Непознати услови',
    windSpeed: Math.round(current.wind_speed_10m),
    updatedAt: current.time
  }
}
