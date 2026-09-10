<template>
  <div class="explore-detail-page">
    <div class="container">

      <!-- Хедер со копче за назад -->
      <header class="page-header">
        <button @click="goBackToExplore" class="back-btn">← Назад кон Истражи</button>
        <h1 class="page-title">{{ currentData.title }}</h1>
        <p class="page-subtitle">{{ currentData.subtitle }}</p>
        <div class="count-tag">Пронајдени патеки: {{ currentData.places.length }}</div>
      </header>

      <!-- Мрежа (Grid) со над 12 патеки по категорија -->
      <div class="trails-grid">
        <div
            v-for="trail in currentData.places"
            :key="trail.id"
            class="trail-card"
            @click="openTrail(trail.id)"
        >
          <div class="card-image-wrapper">
            <img :src="getMountainImage(trail.name, trail.image, trail.id)" :alt="trail.name" class="trail-img" @error="handleImageError" />
            <span class="difficulty-tag" :class="trail.difficulty.toLowerCase()">
              {{ trail.difficulty }}
            </span>
          </div>

          <div class="card-content">
            <h3>{{ trail.name }}</h3>
            <p class="trail-desc">{{ trail.description }}</p>

            <div class="trail-meta">
              <span>📏 {{ trail.distance }}</span>
              <span>⏱️ {{ trail.duration }}</span>
              <span>⛰️ {{ trail.altitude }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { getMountainImage } from '../services/mountainImages'

const route = useRoute()
const router = useRouter()
const fallbackImage = getMountainImage('Пелистер')
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}

const paramId = computed(() => route.params.id)

// СУПЕР БАЗА: Најмалку 12 карактеристични места за секоја селекција
const exploreDatabase = {
  // 1. WATERFALL WONDERS (12 водопади)
  'waterfalls': {
    title: 'Водопади на Македонија',
    subtitle: 'Најживописните водопади во Македонија скриени длабоко во планините.',
    places: [
      { id: 101, name: 'Колешински Водопад', distance: '1.2 km', duration: '40m', altitude: '610m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1432406186174-2b24f4a6d777?w=600', description: 'Сместен на реката Баба во пазувите на Беласица, опкружен со густа јаворова шума.' },
      { id: 102, name: 'Смоларски Водопад', distance: '2.0 km', duration: '1h 10m', altitude: '630m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600', description: 'Највисокиот постојан водопад во државата (39.5 метри), со уредена патека и панорамски мост.' },
      { id: 103, name: 'Дуфски Водопад', distance: '3.5 km', duration: '1h 30m', altitude: '1,020m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600', description: 'Спектакуларен водопад кај с. Ростуше, сместен во тесен и мистичен карпест кањон.' },
      { id: 104, name: 'Белавички Водопади', distance: '5.0 km', duration: '2h 00m', altitude: '1,100m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600', description: 'Скриено природно богатство на Осоговските планини во близина на Кочани со неколку каскади.' },
      { id: 105, name: 'Габровски Водопади', distance: '1.8 km', duration: '50m', altitude: '550m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1508459855340-fb63ba59186b?w=600', description: 'Три помали, но исклучително шармантни водопади лоцирани веднаш над селото Габрово.' },
      { id: 106, name: 'Бабунски Водопад', distance: '12.5 km', duration: '4h 30m', altitude: '1,350m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', description: 'Се наоѓа под самиот врв Солунска Глава. Патеката до него е долга и исполнета со планински убавини.' },
      { id: 107, name: 'Корабски Водопад (Пропаст)', distance: '18.0 km', duration: '8h 00m', altitude: '2,120m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600', description: 'Највисокиот водопад на Балканот кој се појавува во пролет со топењето на снеговите на Кораб.' },
      { id: 108, name: 'Пештерски Водопад Длабока Река', distance: '14.2 km', duration: '6h 30m', altitude: '1,800m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600', description: 'Екстремно скриен водопад во дивината на кањонот на Длабока Река, опкружен со алпски терен.' },
      { id: 109, name: 'Станечки Водопад', distance: '4.0 km', duration: '1h 45m', altitude: '1,150m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Убав водопад на Осоговијата во близина на Крива Паланка, лоциран покрај густа букова шума.' },
      { id: 110, name: 'Калимански Водопади', distance: '3.2 km', duration: '1h 15m', altitude: '780m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Мали водопади со кристално чиста изворска вода во близина на вештачкото езеро Калиманци.' },
      { id: 111, name: 'Водопади на Брегалница', distance: '6.8 km', duration: '2h 30m', altitude: '1,250m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600', description: 'Скриени каскади во горниот тек на реката Брегалница, во недопрените делови на Малешевијата.' },
      { id: 112, name: 'Зрзески Водопад', distance: '2.5 km', duration: '1h 00m', altitude: '950m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Се наоѓа во карпите веднаш под манастирот Зрзе, карактеристичен по бигорот и свежината.' }
    ]
  },
  // 4. ALPINE PEAKS (12 планински врвови за искачување)
  'alpine': {
    title: 'Високи македонски врвови',
    subtitle: 'Високопланински сурови патеки наменети за освојување на највисоките врвови.',
    places: [
      { id: 201, name: 'Титов Врв (Шар Планина)', distance: '21.0 km', duration: '8h 00m', altitude: '2,747m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Освојување на највисокиот врв на Шара по Вакуфска патека. Ве очекува каменит терен и прекрасни видиковци.' },
      { id: 202, name: 'Врв Пелистер (Баба Планина)', distance: '16.5 km', duration: '6h 30m', altitude: '2,601m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600', description: 'Искачување по техничката патека „Дива Коза“ преку камените грамади (морени) до самиот врв.' },
      { id: 203, name: 'Солунска Глава (Јакупица)', distance: '24.0 km', duration: '9h 30m', altitude: '2,540m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Патека позната како „папокот на Македонија“. Комплексна тура до грандиозната јужна карпа.' },
      { id: 204, name: 'Голем Кораб', distance: '13.5 km', duration: '5h 30m', altitude: '2,764m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600', description: 'Освојување на највисоката точка во Македонија. Патеката започнува од караулата Стрезимир.' },
      { id: 205, name: 'Врв Руен (Осоговски Планини)', distance: '18.2 km', duration: '5h 45m', altitude: '2,252m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Долга патека со постепен, благ наклон, која нуди поглед кон цела Источна Македонија и Бугарија.' },
      { id: 206, name: 'Врв Љуботен (Шар Планина)', distance: '11.0 km', duration: '5h 00m', altitude: '2,498m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600', description: 'Карактеристичен шилест врв во форма на пирамида. Стрмно качување по камени сртови.' },
      { id: 207, name: 'Врв Магаро (Галичица)', distance: '8.5 km', duration: '3h 30m', altitude: '2,255m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85', description: 'Врв лоциран помеѓу двете најголеми езера (Охридското и Преспанското). Глетката од горе е незаменлива.' },
      { id: 208, name: 'Врв Кожуф (Зеленбрег)', distance: '12.0 km', duration: '4h 45m', altitude: '2,166m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600', description: 'Патека по широки тревнати пасишта кои во зима се претвораат во суров алпски предел.' },
      { id: 209, name: 'Врв Меденица (Бистра)', distance: '9.0 km', duration: '3h 15m', altitude: '2,163m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=600', description: 'Највисокиот врв на Бистра, лоциран над с. Галичник. Се одликува со прекрасни карстни полиња.' },
      { id: 210, name: 'Врв Кајмакчалан (Ниџе)', distance: '15.4 km', duration: '6h 00m', altitude: '2,521m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600', description: 'Историски значаен врв на македонско-грчката граница со преубава мала црква и капела на самиот врв.' },
      { id: 211, name: 'Врв Крчин (Дебарски регион)', distance: '14.0 km', duration: '6h 30m', altitude: '2,341m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85', description: 'Остра и стрмна гранитна патека со преубав отворен поглед кон долината на реката Радика.' },
      { id: 212, name: 'Врв Црн Камен (Јабланица)', distance: '13.2 km', duration: '5h 15m', altitude: '2,257m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600', description: 'Стрмно искачување до највисоката карпа на Јабланица, во близина на прекрасните Вевчански локви.' }
    ]
  },
  // 6. FAMILY TRAILS (12 лесни и семејни места)
  'family': {
    title: 'Семејни патеки',
    subtitle: 'Лесни, безбедни и рамни патеки уредени за уживање со вашите најмили.',
    places: [
      { id: 301, name: 'Парк Шума Гази Баба', distance: '3.0 km', duration: '1h 00m', altitude: '280m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85', description: 'Комплетно уредена зелена оаза во Скопје со чисти шумски патеки, детски игралишта и клупи за одмор.' },
      { id: 302, name: 'Вевчански Извори', distance: '1.5 km', duration: '45m', altitude: '830m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600', description: 'Преубави дрвени мостчиња и патеки над разиграните извори на вода. Идеално за мали деца.' },
      { id: 303, name: 'Крушевско Езеро Патека', distance: '4.0 km', duration: '1h 20m', altitude: '1,150m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Рамна и асфалтирана патека околу вештачкото езеро во Крушево, одлична за пикник и игра.' },
      { id: 304, name: 'Крајбрежје на Дојран', distance: '5.2 km', duration: '1h 30m', altitude: '145m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85', description: 'Рамна рамномерна патека покрај езерото, соодветна за детски колички и тротинети.' },
      { id: 305, name: 'Локалитет Смрдлива Вода', distance: '2.5 km', duration: '1h 00m', altitude: '720m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', description: 'Излетничко место на Кожуф планина со кратка патека низ шумата и чист воздух.' },
      { id: 306, name: 'Беровско Езеро - Кружна патека', distance: '6.0 km', duration: '2h 00m', altitude: '980m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600', description: 'Пријатна, широка патека околу езерото опкружена со борови дрвја и ливади.' },
      { id: 307, name: 'Парк Свети Наум (Охрид)', distance: '2.0 km', duration: '50m', altitude: '695m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Прошетка покрај изворите на Црн Дрим, со убаво уредени тревници и ресторани покрај вода.' },
      { id: 308, name: 'Кањон Матка - До манастирот', distance: '3.5 km', duration: '1h 10m', altitude: '320m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85', description: 'Рамна и обезбедена пешачка патека која се движи по самата карпа покрај езерото Матка.' },
      { id: 309, name: 'Лесновски Манастир Патека', distance: '1.8 km', duration: '40m', altitude: '880m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Кратка прошетка низ автентичниот карпест кратер на изгаснат вулкан до самиот манастир.' },
      { id: 310, name: 'Еко патека Куклица', distance: '1.2 km', duration: '30m', altitude: '420m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600', description: 'Интересна и едукативна прошетка низ камените кукли (Камена Свадба) во близина на Кратово.' },
      { id: 311, name: 'Пониква - Детска патека', distance: '3.0 km', duration: '1h 00m', altitude: '1,560m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600', description: 'Лесна планинска патека на Осогово наменета за деца, со многу места за одмор и забава.' },
      { id: 312, name: 'Пелистерски Патеки за деца', distance: '2.2 km', duration: '55m', altitude: '1,100m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600', description: 'Специјално дизајнирана детска патека „Историска патека“ со едукативни табли низ шумата.' }
    ]
  },
  // Оставено место за другите ID-а за да не паѓа рутерот ако се кликнат
  valleys: {
    title: 'Скриени долински патеки',
    subtitle: 'Мистични долини',
    places: [
      { id: 401, name: 'Радика Долина', distance: '6.7 km', duration: '2h 30m', altitude: '1,200m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Патека низ мистичната долина на реката Радика.' },
      { id: 402, name: 'Мавровска Долина', distance: '8.2 km', duration: '3h 10m', altitude: '1,450m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Прошетка низ Мавровската долина со погледи кон езерото.' },
      { id: 403, name: 'Демир Капија Долина', distance: '5.5 km', duration: '2h 00m', altitude: '900m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600', description: 'Долина со уникатни карпести формации и вински лозја.' },
      { id: 404, name: 'Треска Долина', distance: '4.8 km', duration: '1h 40m', altitude: '850m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Патека покрај реката Треска со мирна атмосфера.' },
      { id: 405, name: 'Кратовска Долина', distance: '6.2 km', duration: '2h 15m', altitude: '950m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=85', description: 'Долина со камени мостови и средновековни кули.' },
      { id: 406, name: 'Преспанска Долина', distance: '7.4 km', duration: '2h 50m', altitude: '1,000m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=85', description: 'Планинска патека низ долината во близина на Преспанското Езеро.' },
      { id: 407, name: 'Козјачка Долина', distance: '5.9 km', duration: '2h 10m', altitude: '1,100m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600', description: 'Долина со погледи кон Козјачкото Езеро.' },
      { id: 408, name: 'Смилевска Долина', distance: '3.8 km', duration: '1h 20m', altitude: '780m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Кратка патека низ зелената долина кај Смилево.' },
      { id: 409, name: 'Кумановска Долина', distance: '9.1 km', duration: '3h 30m', altitude: '1,300m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Долга патека низ долината кај Куманово.' },
      { id: 410, name: 'Кичевска Долина', distance: '7.0 km', duration: '2h 40m', altitude: '1,050m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Патека низ долината кај Кичево.' },
      { id: 411, name: 'Галичичка Долина', distance: '8.5 km', duration: '3h 20m', altitude: '1,500m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Алпска долина во срцето на Галичица.' },
      { id: 412, name: 'Поречка Долина', distance: '7.6 km', duration: '2h 50m', altitude: '1,120m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Патека низ живописната Поречка долина, со мали водопади и традиционални камени куќи.'
      }
    ]
  },
  sunsets: {
    title: 'Погледи на зајдисонце',
    subtitle: 'Совршени зајдисонца',
    places: [
      { id: 501, name: 'Охрид Зајдисонце', distance: '4.2 km', duration: '1h 30m', altitude: '750m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Патека покрај Охридското Езеро со спектакуларен зајдисонце.' },
      { id: 502, name: 'Преспа Зајдисонце', distance: '5.0 km', duration: '2h 00m', altitude: '800m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=85', description: 'Планинска прошетка над Преспанската долина со мирни бои на зајдисонце.' },
      { id: 503, name: 'Козјак Зајдисонце', distance: '6.1 km', duration: '2h 20m', altitude: '1,100m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=900&q=85', description: 'Патека со погледи кон Козјак и зајдисонце над планините.' },
      { id: 504, name: 'Водно Зајдисонце', distance: '3.5 km', duration: '1h 10m', altitude: '1,066m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Кратка патека на Водно со поглед кон Скопје при зајдисонце.' },
      { id: 505, name: 'Галичица Зајдисонце', distance: '7.8 km', duration: '3h 00m', altitude: '1,600m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Патека со погледи кон Охрид и Преспа при зајдисонце.' },
      { id: 506, name: 'Кратово Зајдисонце', distance: '4.0 km', duration: '1h 20m', altitude: '900m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Патека со погледи кон средновековните кули на Кратово.' },
      { id: 507, name: 'Берово Зајдисонце', distance: '5.6 km', duration: '2h 10m', altitude: '1,050m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600', description: 'Патека со погледи кон Беровското Езеро при зајдисонце.' },
      { id: 508, name: 'Крушево Зајдисонце', distance: '6.3 km', duration: '2h 30m', altitude: '1,350m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600', description: 'Патека со погледи кон највисокиот град во Македонија.' },
      { id: 509, name: 'Струга Зајдисонце', distance: '4.7 km', duration: '1h 40m', altitude: '780m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85', description: 'Шумска патека над Струга со зајдисонце над планините.' },
      { id: 510, name: 'Куманово Зајдисонце', distance: '5.9 km', duration: '2h 15m', altitude: '950m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Патека со погледи кон полињата кај Куманово при зајдисонце.' },
      { id: 511, name: 'Штип Зајдисонце', distance: '3.8 km', duration: '1h 20m', altitude: '820m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Кратка патека со погледи кон Штип и околните ридови.' },
      { id: 512, name: 'Гостивар Зајдисонце', distance: '6.5 km', duration: '2h 40m', altitude: '1,200m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Патека со погледи кон Полошката котлина и зајдисонце над Шар Планина.' }
    ]
  },
  forest: {
    title: 'Шумски прошетки',
    subtitle: 'Густи планински шуми',
    places: [
      { id: 601, name: 'Водно Шумска Патека', distance: '3.5 km', duration: '1h 20m', altitude: '950m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Кратка прошетка низ шумите на Водно.' },
      { id: 602, name: 'Пелистер Шумска Патека', distance: '7.8 km', duration: '3h 40m', altitude: '1,600m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Патека низ густи шуми во Националниот парк Пелистер.' },
      { id: 603, name: 'Шар Планина Шумска Патека', distance: '9.2 km', duration: '4h 10m', altitude: '1,800m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Долга патека низ алпски шуми на Шар Планина.' },
      { id: 604, name: 'Маврово Шумска Патека', distance: '6.4 km', duration: '2h 30m', altitude: '1,200m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Патека низ шумите околу Мавровското Езеро.' },
      { id: 605, name: 'Галичица Шумска Патека', distance: '5.7 km', duration: '2h 15m', altitude: '1,300m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85', description: 'Прошетка низ густи шуми на Галичица.' },
      { id: 606, name: 'Осогово Шумска Патека', distance: '8.1 km', duration: '3h 20m', altitude: '1,500m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85', description: 'Патека низ шумите на Осоговските Планини.' },
      { id: 607, name: 'Јабланица Шумска Патека', distance: '4.9 km', duration: '1h 50m', altitude: '1,100m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600', description: 'Кратка патека низ шумите на Јабланица.' },
      { id: 608, name: 'Стогово Шумска Патека', distance: '7.3 km', duration: '3h 00m', altitude: '1,400m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600', description: 'Патека низ густи шуми на Стогово.' },
      { id: 609, name: 'Кожуф Шумска Патека', distance: '6.0 km', duration: '2h 20m', altitude: '1,250m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Патека низ шумите на Кожуф Планина.' },
      { id: 610, name: 'Славеј Планина Шумска Патека', distance: '5.2 km', duration: '2h 00m', altitude: '1,050m', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Прошетка низ шумите на Славеј Планина.' },
      { id: 611, name: 'Караорман Шумска Патека', distance: '8.7 km', duration: '3h 30m', altitude: '1,600m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Долга патека низ густи шуми на Караорман.' },
      { id: 612, name: 'Сува Гора Шумска Патека', distance: '7.5 km', duration: '3h 10m', altitude: '1,350m', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Патека низ шумите на Сува Гора.' }
    ]
  },
  expert: {
    title: '⚡ Предизвици за искусни',
    subtitle: 'Екстремни рути за професионалци',
    places: [
      { id: 701, name: 'Короб Врв', distance: '15.3 km', duration: '6h 30m', altitude: '2,764m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600', description: 'Највисокиот врв во Македонија – предизвик за искусни планинари.' },
      { id: 702, name: 'Пелистер Големо Езеро', distance: '14.2 km', duration: '6h 00m', altitude: '2,200m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Екстремна рута до Големото Езеро на Пелистер.' },
      { id: 703, name: 'Шар Планина Алпски Врвови', distance: '18.0 km', duration: '7h 30m', altitude: '2,747m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Долга и предизвикувачка рута низ алпските врвови на Шар Планина.' },
      { id: 704, name: 'Јабланица Врв', distance: '13.5 km', duration: '5h 40m', altitude: '2,200m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600', description: 'Предизвикувачка рута до врвот на Јабланица.' },
      { id: 705, name: 'Осогово Врв Руен', distance: '16.2 km', duration: '6h 50m', altitude: '2,252m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600', description: 'Долга рута до највисокиот врв на Осогово – Руен.' },
      { id: 706, name: 'Стогово Врв', distance: '14.8 km', duration: '6h 10m', altitude: '2,320m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85', description: 'Алпска рута до врвот на Стогово.' },
      { id: 707, name: 'Кожуф Врв Зелен Брег', distance: '12.9 km', duration: '5h 20m', altitude: '2,171m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Предизвикувачка патека до Зелен Брег на Кожуф.' },
      { id: 708, name: 'Галичица Врв Магаро', distance: '11.7 km', duration: '4h 50m', altitude: '2,254m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85', description: 'Рута до врвот Магаро со погледи кон Охрид и Преспа.' },
      { id: 709, name: 'Сува Гора Врв', distance: '13.2 km', duration: '5h 30m', altitude: '1,850m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600', description: 'Долга рута низ Сува Гора до највисоките точки.' },
      { id: 710, name: 'Караорман Врв', distance: '12.5 km', duration: '5h 00m', altitude: '1,900m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600', description: 'Предизвикувачка патека низ Караорманските шуми до врвот.' },
      { id: 711, name: 'Славеј Планина Врв', distance: '10.8 km', duration: '4h 30m', altitude: '1,700m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600', description: 'Рута до врвот на Славеј Планина.' },
      { id: 712, name: 'Беласица Врв Тумба', distance: '15.0 km', duration: '6h 20m', altitude: '1,880m', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600', description: 'Екстремна рута до врвот Тумба на Беласица.' }
    ]
  }

}

const currentData = computed(() => {
  // Секогаш враќаме објект со празна низа ако категоријата не е дефинирана за да нема JavaScript грешки
  return exploreDatabase[paramId.value] || { title: 'Колекција', subtitle: 'Altigo', places: [] }
})

const goBackToExplore = () => {
  router.replace({ name: 'Explore' })
}

const openTrail = (id) => {
  router.push({
    name: 'TrailDetail',
    params: { id },
    query: { from: 'explore' }
  })
}
</script>

<style scoped>
.explore-detail-page {
  min-height: 100vh;
  background: #0b1220;
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 3rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 3rem;
  position: relative;
}

.back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 1.5rem;
}

.back-btn:hover {
  background: #f26522;
  color: white;
  border-color: #f26522;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
}

.count-tag {
  display: inline-block;
  background: rgba(242, 101, 34, 0.15);
  color: #f26522;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(242, 101, 34, 0.3);
}

.trails-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.trail-card {
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.trail-card:hover {
  transform: translateY(-5px);
  border-color: #f26522;
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  width: 100%;
}

.trail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.difficulty-tag {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.3rem 0.7rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
.difficulty-tag.easy { background: #22c55e; color: white; }
.difficulty-tag.medium { background: #eab308; color: black; }
.difficulty-tag.hard { background: #ef4444; color: white; }

.card-content {
  padding: 1.5rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  text-align: center;
}

.trail-desc {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  height: 65px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-align: center;
}

.trail-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.03);
  padding: 0.75rem 1rem;
  border-radius: 12px;
}
</style>