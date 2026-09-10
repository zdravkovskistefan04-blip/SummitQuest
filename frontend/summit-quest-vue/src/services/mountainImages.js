const imageByPlace = {
  vodno: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Skopje_view_from_Vodno_Mountain.jpg',
  pelister: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Pogled_kon_Golemo_ezero_Pelister.jpg',
  shar: 'https://upload.wikimedia.org/wikipedia/commons/9/94/View_to_the_mountain_peak_Kobilica_with_ice_cliffs%2C_Shar_Mountain%2C_North_Macedonia.jpg',
  korab: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Mount_Korab_from_Qafa.jpg',
  galicica: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Pamje_e_liqenit_t%C3%AB_Ohrit_nga_parku_komb%C3%ABtar_i_Gali%C3%A7ic%C3%ABs.jpg',
  matka: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Matka_Canyon_Skopje_3.jpg',
  mavrovo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Mavrovo_Lake-Republic_of_Macedonia.JPG'
}

const imageByExactPlace = {
  'колешински водопад': 'https://upload.wikimedia.org/wikipedia/commons/d/da/KoleshinoWaterfall.JPG',
  'смоларски водопад': 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Smolarski_vodopad_18.JPG',
  'дуфски водопад': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Duf_Waterfalls_in_Rostu%C5%A1e_6.JPG',
  'радика долина': imageByPlace.mavrovo,
  'мавровска долина': imageByPlace.mavrovo,
  'треска долина': imageByPlace.matka,
  'охрид зајдисонце': imageByPlace.galicica,
  'водно зајдисонце': imageByPlace.vodno,
  'галичица зајдисонце': imageByPlace.galicica,
  'преспа зајдисонце': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Prespa_Lake_from_Galicica.jpg'
}

const imageByTrail = [
  imageByPlace.vodno,
  'https://upload.wikimedia.org/wikipedia/commons/9/9d/Pelister_National_Park%2C_Autumn_16.jpg',
  imageByPlace.shar,
  imageByPlace.matka,
  imageByPlace.galicica,
  imageByPlace.pelister,
  'https://upload.wikimedia.org/wikipedia/commons/4/45/Hiking_Jablanica_Mountain%2C_January_2020_01.jpg',
  imageByPlace.mavrovo,
  'https://upload.wikimedia.org/wikipedia/commons/8/89/Hiking_Jablanica_Mountain%2C_January_2020_06.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6a/Hikers%2C_Jablanica_Mountain_in_Autumn%2C_2019.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/79/Hikers_in_Jablanica_mountain_in_winter_2020%2C_in_background_Struga%2C_Lake_of_Ohrid%2C_and_Pelister_peak.jpg',
  imageByPlace.korab,
  'https://upload.wikimedia.org/wikipedia/commons/c/ca/Hiking_Jablanica_Mountain%2C_January_2020_08.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d2/Hiking_Jablanica_Mountain%2C_January_2020_02.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/a/ad/Gali%C4%8Dica_-_hiking_trail_to_Lako_Signoj.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/c/ce/Black_Stone_peak%2C_Jablanica_Mountain%2C_January_2020_04.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/14/Hiking_Jablanica_Mountain%2C_January_2020_07.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/7/7f/Hiking_Jablanica_Mountain%2C_January_2020_09.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/56/Pelister_National_Park%2C_Autumn_19.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4c/Pelister_National_Park%2C_Autumn_21.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d8/Galichica_Mountain_from_Struga_01.jpg'
]
const collectionFallbacks = {
    waterfalls: [
      'https://upload.wikimedia.org/wikipedia/commons/d/da/KoleshinoWaterfall.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/f/fd/Smolarski_vodopad_18.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/b/b4/Duf_Waterfalls_in_Rostu%C5%A1e_6.JPG'
    ],
    valleys: [imageByPlace.mavrovo, imageByPlace.matka, imageByPlace.galicica],
    sunsets: [imageByPlace.galicica, imageByPlace.mavrovo, imageByPlace.vodno]
}
const categoryFallbacks = {
    alpine: imageByPlace.shar,
    forest: imageByPlace.pelister,
    family: imageByPlace.matka,
    expert: imageByPlace.korab
}
const fallbackImage = imageByPlace.pelister

export function getMountainImage(name, currentImage = fallbackImage, id) {
    const place = String(name || '').toLowerCase()
    const exactImage = Object.entries(imageByExactPlace)
    .find(([placeName]) => place.includes(placeName))
    if (exactImage) return exactImage[1]

    const collection = Number(id) >= 101 && Number(id) <= 112
      ? 'waterfalls'
      : Number(id) >= 401 && Number(id) <= 412
        ? 'valleys'
        : Number(id) >= 501 && Number(id) <= 512
          ? 'sunsets'
          : null
    if (collection) {
      const firstId = collection === 'waterfalls' ? 101 : collection === 'valleys' ? 401 : 501
      return collectionFallbacks[collection][(Number(id) - firstId) % collectionFallbacks[collection].length]
    }
    if (Number(id) >= 201 && Number(id) <= 212) return categoryFallbacks.alpine
    if (Number(id) >= 301 && Number(id) <= 312) return categoryFallbacks.family
    if (Number(id) >= 601 && Number(id) <= 612) return categoryFallbacks.forest
    if (Number(id) >= 701 && Number(id) <= 712) return categoryFallbacks.expert

    const trailIndex = [
    'водно', 'баба планина', 'шар планина', 'матка', 'галичица',
    'големо езеро', 'треска', 'мавровско', 'козјак', 'демир капија',
    'смоликас', 'кораб', 'тиквешко', 'маркови кули', 'куклица',
    'стогово', 'јабланица', 'осогово', 'пелистер', 'галичичка'
  ].findIndex(keyword => place.includes(keyword))

  if (trailIndex >= 0) return imageByTrail[trailIndex]

  if (place.includes('водно') || place.includes('vodno')) return imageByPlace.vodno
  if (place.includes('пелистер') || place.includes('pelister') || place.includes('баба')) return imageByPlace.pelister
  if (place.includes('шар') || place.includes('титов') || place.includes('kobilica')) return imageByPlace.shar
  if (place.includes('кораб') || place.includes('korab')) return imageByPlace.korab
  if (place.includes('галич') || place.includes('galic')) return imageByPlace.galicica
  if (place.includes('матка') || place.includes('matka')) return imageByPlace.matka
  if (place.includes('мавров') || place.includes('mavrovo')) return imageByPlace.mavrovo

  return currentImage || imageByTrail[0]
}
