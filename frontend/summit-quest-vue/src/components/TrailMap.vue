<!--
<template>
  <div class="trail-detail-container">
    <div class="detail-layout">

      <div class="info-side">
        <button @click="goBack" class="back-link">← Назад кон сите патеки</button>

        <h1 class="trail-title">{{ currentTrail.name }}</h1>

        <div class="trail-hero-wrapper">
          <img :src="currentTrail.image" :alt="currentTrail.name" class="trail-hero-image" @error="handleImageError" />
          <div class="difficulty-badge" :class="currentTrail.difficulty.toLowerCase()">
            {{ currentTrail.difficulty }}
          </div>
        </div>

        <div class="specs-grid">
          <div class="spec-card">
            <span class="spec-icon">📏</span>
            <div>
              <p class="spec-label">Должина</p>
              <p class="spec-value">{{ currentTrail.distance }}</p>
            </div>
          </div>
          <div class="spec-card">
            <span class="spec-icon">⏱️</span>
            <div>
              <p class="spec-label">Времетраење</p>
              <p class="spec-value">{{ currentTrail.duration }}</p>
            </div>
          </div>
          <div class="spec-card">
            <span class="spec-icon">⛰️</span>
            <div>
              <p class="spec-label">Највисока точка</p>
              <p class="spec-value">{{ currentTrail.altitude }}</p>
            </div>
          </div>
        </div>

        <div class="description-section">
          <h3>За оваа авантура</h3>
          <p class="description-text">{{ currentTrail.description }}</p>
        </div>

        <div class="route-planner-box">
          <h4>🗺️ Altigo Планер на Рути</h4>
          <p>Сакаш да ја промениш патеката? Кликни за да креираш сопствена рута.</p>
          <button class="plan-btn" @click="planCustomRoute">Креирај сопствена рута</button>
        </div>
      </div>

      <div class="map-side">
        <div class="map-wrapper">
          <div class="map-header">
            <h3>Интерактивна Навигација</h3>
            <span class="live-indicator">● GPS Активен</span>
          </div>
          <div id="map" class="map-box"></div>
          <div class="arrival-panel">
            <div class="arrival-heading">Како да стигнеш до почетокот</div>
            <div class="arrival-modes">
              <button :class="{ active: arrivalMode === 'walk' }" @click="arrivalMode = 'walk'">Пешки</button>
              <button :class="{ active: arrivalMode === 'car' }" @click="arrivalMode = 'car'">Со кола</button>
            </div>
            <div v-if="arrivalDistance !== null" class="arrival-details">
              <span>{{ formatDistance(arrivalDistance) }}</span>
              <span>{{ formatArrivalTime(arrivalDistance, arrivalMode) }}</span>
            </div>
            <p v-else class="arrival-status">Вклучи GPS за да ја прикажеме рутата од твојата локација.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import L from 'leaflet'

const route = useRoute()
const router = useRouter()

// Статичка листа на патеки за сигурност
const trailsDatabase = [
  {
    id: 1,
    name: 'Патека Водно',
    distance: '5.2 km',
    duration: '2h 15m',
    altitude: '1,066m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Прекрасна панорамска патека на Водно, веднаш над Скопје. Патеката води низ густа шума и нуди спектакуларен поглед на градот, завршувајќи кај препознатливиот Милениумски Крст.',
    coords: [[41.962, 21.427], [41.967, 21.415], [41.964, 21.396]]
  },
  {
    id: 2,
    name: 'Баба Планина',
    distance: '8.1 km',
    duration: '4h 30m',
    altitude: '2,601m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Возбудлива и предизвикувачка патека на планината Баба кај Битола. Оваа патека ве води низ Националниот парк Пелистер.',
    coords: [[41.015, 21.195], [41.008, 21.172], [41.003, 21.155]]
  },
  {
    id: 3,
    name: 'Шар Планина',
    distance: '12.4 km',
    duration: '5h 15m',
    altitude: '2,747m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Алпски пејзажи кои го одземаат здивот на Шар Планина.',
    coords: [[42.012, 20.892], [42.031, 20.875], [42.062, 20.861]]
  },
  {
    id: 4,
    name: 'Кањон Матка',
    distance: '6.7 km',
    duration: '3h 00m',
    altitude: '650m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која се протега по самиот раб на прекрасниот кањон Матка.',
    coords: [[41.938, 21.297], [41.931, 21.295], [41.918, 21.291]]
  },
  {
    id: 5,
    name: 'Национален парк Галичица',
    distance: '9.3 km',
    duration: '4h 15m',
    altitude: '2,254m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85',
    description: 'Патека лоцирана на прекрасната планина Галичица. Единствено место каде што додека пешачите можете да уживате во погледот кон двете езера истовремено - Охридското и Преспанското.',
    coords: [[40.992, 20.865], [40.978, 20.841], [40.963, 20.825]]
  },
  {
    id: 6,
    name: 'Pelister Big Lake',
    distance: '14.2 km',
    duration: '6h 30m',
    altitude: '2,218m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Предизвикувачка рута која води до Големото Езеро на Пелистер (Пелистерски Очи). Патеката е каменеста и бара добра физичка подготвеност, но погледот на ледничкото езеро вреди за секој чекор.',
    coords: [[41.011, 21.192], [40.985, 21.198], [40.971, 21.203]]
  },
  {
    id: 7,
    name: 'Treska River Path',
    distance: '4.8 km',
    duration: '1h 45m',
    altitude: '350m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Релаксирачка и рамна патека идеална за семејни прошетки покрај течението на реката Треска. Нуди чист воздух, мирно опкружување и сенки под густите дрвја.',
    coords: [[41.951, 21.321], [41.942, 21.311], [41.935, 21.302]]
  },
  {
    id: 8,
    name: 'Mavrovo Lake Loop',
    distance: '11.5 km',
    duration: '3h 30m',
    altitude: '1,230m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Прекрасна кружна патека околу Мавровското Езеро. Погодна е за пешачење и за планински велосипедизам, со поглед кон познатата потопена црква Св. Никола.',
    coords: [[41.652, 20.731], [41.671, 20.712], [41.691, 20.742]]
  },
  {
    id: 9,
    name: 'Патека покрај езерото Козјак',
    distance: '7.6 km',
    duration: '2h 45m',
    altitude: '850m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која води до видиковците над вештачкото езеро Козјак. Ова место нуди неверојатен сценографски поглед на најголемиот кањон во Македонија кој наликува на вистински фјорд.',
    coords: [[41.879, 21.189], [41.861, 21.192], [41.845, 21.171]]
  },
  {
    id: 10,
    name: 'Demir Kapija Gorge',
    distance: '6.2 km',
    duration: '2h 15m',
    altitude: '450m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Патека низ Демиркаписката Клисура, позната по карпестите предели и богатата историја. Патеката нуди одлични глетки на реката Вардар и околните масивни карпи кои се рај за алпинистите.',
    coords: [[41.405, 22.251], [41.398, 22.272], [41.385, 22.291]]
  },
  {
    id: 11,
    name: 'Smolikas Ridge',
    distance: '10.7 km',
    duration: '4h 45m',
    altitude: '2,100m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    description: 'Интензивна високопланинска патека по гребенот на Смолика. Се карактеризира со стрмни нагорнини, отворени панорами и силен ветар, наменета за искусни планинари.',
    coords: [[41.251, 20.612], [41.235, 20.595], [41.211, 20.581]]
  },
  {
    id: 12,
    name: 'Патека до врвот Кораб',
    distance: '15.3 km',
    duration: '7h 30m',
    altitude: '2,764m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Официјалната патека до Голем Кораб - највисокиот врв во Македонија. Патеката почнува од караулата Стрезимир и нуди незаборавно искуство низ недопрени планински предели на границата.',
    coords: [[41.791, 20.591], [41.785, 20.551], [41.790, 20.538]]
  },
  {
    id: 13,
    name: 'Tikvesh Lake Path',
    distance: '8.9 km',
    duration: '3h 15m',
    altitude: '410m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Пријатна патека лоцирана покрај Тиквешкото Езеро кај Кавадарци. Патеката поминува близу до стари цркви во карпи и нуди убав амбиент за љубителите на природата и птиците.',
    coords: [[41.382, 21.954], [41.361, 21.942], [41.341, 21.931]]
  },
  {
    id: 14,
    name: 'Патека до Маркови Кули',
    distance: '5.5 km',
    duration: '2h 00m',
    altitude: '920m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која ве води директно до Марковите Кули над Прилеп. Патеката е препознатлива по уникатните гранитни карпести формации формирани низ милиони години и средновековната тврдина на врвот.',
    coords: [[41.365, 21.539], [41.368, 21.542], [41.373, 21.535]]
  },
  {
    id: 15,
    name: 'Kuklica Stone Dolls',
    distance: '3.8 km',
    duration: '1h 15m',
    altitude: '510m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Кратка едукативна и туристичка патека во близина на Кратово. Ве води низ феноменот „Камени Кукли“, природни камени столбови за кои постои позната народна легенда за скаменетата свадба.',
    coords: [[42.122, 22.053], [42.124, 22.055], [42.126, 22.058]]
  },
  {
    id: 16,
    name: 'Stogovo Mountain Path',
    distance: '13.1 km',
    duration: '6h 00m',
    altitude: '2,273m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80',
    description: 'Осамена и диви планинска патека на Стогово. Нуди огромни тревни пространства, тишина и прекрасен поглед кон Дебарското Езеро и кањонот на Радика од висина.',
    coords: [[41.512, 20.635], [41.531, 20.654], [41.552, 20.672]]
  },
  {
    id: 17,
    name: 'Jablanica Ridge Trail',
    distance: '9.8 km',
    duration: '4h 30m',
    altitude: '2,257m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Патека долж сртот на Јабланица над Струга и Вевчани. Оваа патека изобилува со извори, леднички локви и панорамски погледи кои стигнуваат дури до албанските планини.',
    coords: [[41.241, 20.512], [41.252, 20.491], [41.265, 20.472]]
  },
  {
    id: 18,
    name: 'Kratovo Canyon Walk',
    distance: '4.2 km',
    duration: '1h 30m',
    altitude: '620m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    description: 'Кратка прошетка низ автентичниот кањон на Табачка Река во Кратово. Поминува под старите камени мостови и средновековни кули на градот изграден во вулкански кратер.',
    coords: [[42.078, 22.174], [42.081, 22.181], [42.083, 22.185]]
  },
  {
    id: 19,
    name: 'Prespa Lake Shore',
    distance: '7.4 km',
    duration: '2h 30m',
    altitude: '853m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Еколошка патека лоцирана на самиот брег на Преспанското Езеро. Патеката е одлична за набљудување на птици (особено пеликаните во Стење и Коњско) и релаксација покрај песочните плажи.',
    coords: [[40.942, 20.912], [40.925, 20.931], [40.911, 20.948]]
  },
  {
    id: 20,
    name: 'Osogovo Mountain Trail',
    distance: '12.9 km',
    duration: '5h 00m',
    altitude: '2,085m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која води низ заоблените падини на Осоговските Планини кај Кочани и Крива Паланка. Патеката минува низ букови шуми и високи планински пасишта идеални за долги тури.',
    coords: [[42.082, 22.465], [42.095, 22.491], [42.115, 22.512]]
  },
  {
    id: 21,
    name: 'Kukja na Golema Reka',
    distance: '6.0 km',
    duration: '2h 00m',
    altitude: '780m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Шумска еколошка патека лоцирана во недопрената природа во близина на Голема Река. Идеална за бегство од градскиот метеж, собирање шумски плодови и уживање во жуборот на водата.',
    coords: [[41.154, 21.121], [41.142, 21.135], [41.131, 21.151]]
  },




  // Waterfall Wonders со coords
    {
      id: 101,
      name: 'Колешински Водопад',
      distance: '1.2 km',
      duration: '40m',
      altitude: '610m',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1432406186174-2b24f4a6d777?w=600',
      description: 'Сместен на реката Баба во пазувите на Беласица, опкружен со густа јаворова шума.',
      coords: [[41.414, 22.889], [41.415, 22.892], [41.416, 22.895]]
    },
    {
      id: 102,
      name: 'Смоларски Водопад',
      distance: '2.0 km',
      duration: '1h 10m',
      altitude: '630m',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600',
      description: 'Највисокиот постојан водопад во државата (39.5 метри), со уредена патека и панорамски мост.',
      coords: [[41.397, 22.889], [41.398, 22.891], [41.399, 22.893]]
    },
    {
      id: 103,
      name: 'Дуфски Водопад',
      distance: '3.5 km',
      duration: '1h 30m',
      altitude: '1,020m',
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
      description: 'Спектакуларен водопад кај с. Ростуше, сместен во тесен и мистичен карпест кањон.',
      coords: [[41.61, 20.6], [41.612, 20.602], [41.614, 20.604]]
    },
    {
      id: 104,
      name: 'Белавички Водопади',
      distance: '5.0 km',
      duration: '2h 00m',
      altitude: '1,100m',
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600',
      description: 'Скриено природно богатство на Осоговските планини во близина на Кочани со неколку каскади.',
      coords: [[41.92, 22.4], [41.923, 22.402], [41.925, 22.405]]
    },
    {
      id: 105,
      name: 'Габровски Водопади',
      distance: '1.8 km',
      duration: '50m',
      altitude: '550m',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1508459855340-fb63ba59186b?w=600',
      description: 'Три помали, но исклучително шармантни водопади лоцирани веднаш над селото Габрово.',
      coords: [[41.55, 22.2], [41.552, 22.202], [41.554, 22.205]]
    },
    {
      id: 106,
      name: 'Бабунски Водопад',
      distance: '12.5 km',
      duration: '4h 30m',
      altitude: '1,350m',
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
      description: 'Се наоѓа под самиот врв Солунска Глава. Патеката до него е долга и исполнета со планински убавини.',
      coords: [[41.73, 21.45], [41.735, 21.46], [41.74, 21.47]]
    },
    {
      id: 107,
      name: 'Корабски Водопад (Пропаст)',
      distance: '18.0 km',
      duration: '8h 00m',
      altitude: '2,120m',
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600',
      description: 'Највисокиот водопад на Балканот кој се појавува во пролет со топењето на снеговите на Кораб.',
      coords: [[41.79, 20.55], [41.795, 20.56], [41.80, 20.57]]
    },
    {
      id: 108,
      name: 'Пештерски Водопад Длабока Река',
      distance: '14.2 km',
      duration: '6h 30m',
      altitude: '1,800m',
      difficulty: 'Hard',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600',
      description: 'Екстремно скриен водопад во дивината на кањонот на Длабока Река, опкружен со алпски терен.',
      coords: [[41.65, 20.7], [41.652, 20.705], [41.655, 20.71]]
    },
    {
      id: 109,
      name: 'Станечки Водопад',
      distance: '4.0 km',
      duration: '1h 45m',
      altitude: '1,150m',
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
      description: 'Убав водопад на Осоговијата во близина на Крива Паланка, лоциран покрај густа букова шума.',
      coords: [[42.2, 22.3], [42.202, 22.305], [42.205, 22.31]]
    },
    {
      id: 110,
      name: 'Калимански Водопади',
      distance: '3.2 km',
      duration: '1h 15m',
      altitude: '780m',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
      description: 'Мали водопади со кристално чиста изворска вода во близина на вештачкото езеро Калиманци.',
      coords: [[41.9, 22.5], [41.902, 22.502], [41.905, 22.505]]
    },
    {
      id: 111,
      name: 'Водопади на Брегалница',
      distance: '6.8 km',
      duration: '2h 30m',
      altitude: '1,250m',
      difficulty: 'Medium',
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
      description: 'Скриени каскади во горниот тек на реката Брегалница, во недопрените делови на Малешевијата.',
      coords: [[41.65, 22.6], [41.652, 22.605], [41.655, 22.61]]
    },
    {
      id: 112,
      name: 'Зрзески Водопад',
      distance: '2.5 km',
      duration: '1h 00m',
      altitude: '950m',
      difficulty: 'Easy',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
      description: 'Се наоѓа во карпите веднаш под манастирот Зрзе, карактеристичен по бигорот и свежината.',
      coords: [[41.52, 21.4], [41.523, 21.405], [41.525, 21.41]]
    },


      // Alpine Peaks со coords
      {
        id: 201,
        name: 'Титов Врв (Шар Планина)',
        distance: '21.0 km',
        duration: '8h 00m',
        altitude: '2,747m',
        difficulty: 'Hard',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
        description: 'Освојување на највисокиот врв на Шара по Вакуфска патека. Ве очекува каменит терен и прекрасни видиковци.',
        coords: [[42.15, 20.85], [42.16, 20.86], [42.17, 20.87]]
      },
          {
            id: 202,
            name: 'Врв Пелистер (Баба Планина)',
            distance: '16.5 km',
            duration: '6h 30m',
            altitude: '2,601m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
            description: 'Искачување по техничката патека „Дива Коза“ преку камените грамади (морени) до самиот врв.',
            coords: [[40.99, 21.20], [41.00, 21.21], [41.01, 21.22]]
          },
          {
            id: 203,
            name: 'Солунска Глава (Јакупица)',
            distance: '24.0 km',
            duration: '9h 30m',
            altitude: '2,540m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Патека позната како „папокот на Македонија“. Комплексна тура до грандиозната јужна карпа.',
            coords: [[41.73, 21.45], [41.74, 21.46], [41.75, 21.47]]
          },
          {
            id: 204,
            name: 'Голем Кораб',
            distance: '13.5 km',
            duration: '5h 30m',
            altitude: '2,764m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600',
            description: 'Освојување на највисоката точка во Македонија. Патеката започнува од караулата Стрезимир.',
            coords: [[41.79, 20.55], [41.80, 20.56], [41.81, 20.57]]
          },
          {
            id: 205,
            name: 'Врв Руен (Осоговски Планини)',
            distance: '18.2 km',
            duration: '5h 45m',
            altitude: '2,252m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Долга патека со постепен, благ наклон, која нуди поглед кон цела Источна Македонија и Бугарија.',
            coords: [[42.15, 22.45], [42.16, 22.46], [42.17, 22.47]]
          },
          {
            id: 206,
            name: 'Врв Љуботен (Шар Планина)',
            distance: '11.0 km',
            duration: '5h 00m',
            altitude: '2,498m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600',
            description: 'Карактеристичен шилест врв во форма на пирамида. Стрмно качување по камени сртови.',
            coords: [[42.12, 20.95], [42.13, 20.96], [42.14, 20.97]]
          },
          {
            id: 207,
            name: 'Врв Магаро (Галичица)',
            distance: '8.5 km',
            duration: '3h 30m',
            altitude: '2,255m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
            description: 'Врв лоциран помеѓу двете најголеми езера (Охридското и Преспанското). Глетката од горе е незаменлива.',
            coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
          },
          {
            id: 208,
            name: 'Врв Кожуф (Зеленбрег)',
            distance: '12.0 km',
            duration: '4h 45m',
            altitude: '2,166m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600',
            description: 'Патека по широки тревнати пасишта кои во зима се претвораат во суров алпски предел.',
            coords: [[41.15, 22.00], [41.16, 22.01], [41.17, 22.02]]
          },
          {
            id: 209,
            name: 'Врв Меденица (Бистра)',
            distance: '9.0 km',
            duration: '3h 15m',
            altitude: '2,163m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=600',
            description: 'Највисокиот врв на Бистра, лоциран над с. Галичник. Се одликува со прекрасни карстни полиња.',
            coords: [[41.60, 20.65], [41.61, 20.66], [41.62, 20.67]]
          },
          {
            id: 210,
            name: 'Врв Кајмакчалан (Ниџе)',
            distance: '15.4 km',
            duration: '6h 00m',
            altitude: '2,521m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600',
            description: 'Историски значаен врв на македонско-грчката граница со преубава мала црква и капела на самиот врв.',
            coords: [[40.95, 21.80], [40.96, 21.81], [40.97, 21.82]]
          },
          {
            id: 211,
            name: 'Врв Крчин (Дебарски регион)',
            distance: '14.0 km',
            duration: '6h 30m',
            altitude: '2,341m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            description: 'Остра и стрмна гранитна патека со преубав отворен поглед кон долината на реката Радика.',
            coords: [[41.55, 20.55], [41.56, 20.56], [41.57, 20.57]]
          },
          {
            id: 212,
            name: 'Врв Црн Камен (Јабланица)',
            distance: '13.2 km',
            duration: '5h 15m',
            altitude: '2,257m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
            description: 'Стрмно искачување до највисоката карпа на Јабланица, во близина на прекрасните Вевчански локви.',
            coords: [[41.25, 20.55], [41.26, 20.56], [41.27, 20.57]]
          },


      // Family Trails со coords
      {
        id: 301,
        name: 'Парк Шума Гази Баба',
        distance: '3.0 km',
        duration: '1h 00m',
        altitude: '280m',
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
        description: 'Комплетно уредена зелена оаза во Скопје со чисти патеки, детски игралишта и клупи за одмор.',
        coords: [[41.98, 21.47], [41.981, 21.472], [41.982, 21.474]]
      },
          {
            id: 302,
            name: 'Вевчански Извори',
            distance: '1.5 km',
            duration: '45m',
            altitude: '830m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
            description: 'Преубави дрвени мостчиња и патеки над разиграните извори на вода. Идеално за мали деца.',
            coords: [[41.24, 20.59], [41.242, 20.592], [41.244, 20.594]]
          },
          {
            id: 303,
            name: 'Крушевско Езеро Патека',
            distance: '4.0 km',
            duration: '1h 20m',
            altitude: '1,150m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Рамна и асфалтирана патека околу вештачкото езеро во Крушево, одлична за пикник и игра.',
            coords: [[41.37, 21.25], [41.372, 21.252], [41.374, 21.254]]
          },
          {
            id: 304,
            name: 'Крајбрежје на Дојран',
            distance: '5.2 km',
            duration: '1h 30m',
            altitude: '145m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            description: 'Рамна рамномерна патека покрај брегот на езерото, соодветна за детски колички и тротинети.',
            coords: [[41.18, 22.72], [41.182, 22.724], [41.184, 22.728]]
          },
          {
            id: 305,
            name: 'Локалитет Смрдлива Вода',
            distance: '2.5 km',
            duration: '1h 00m',
            altitude: '720m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
            description: 'Излетничко место на Кожуф планина со кратка патека низ шумата и чист воздух.',
            coords: [[41.09, 22.02], [41.092, 22.024], [41.094, 22.028]]
          },
          {
            id: 306,
            name: 'Беровско Езеро - Кружна патека',
            distance: '6.0 km',
            duration: '2h 00m',
            altitude: '980m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600',
            description: 'Пријатна, широка патека околу езерото опкружена со борови дрвја и ливади.',
            coords: [[41.70, 22.85], [41.702, 22.852], [41.704, 22.854]]
          },
          {
            id: 307,
            name: 'Парк Свети Наум (Охрид)',
            distance: '2.0 km',
            duration: '50m',
            altitude: '695m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Прошетка покрај изворите на Црн Дрим, со убаво уредени тревници и ресторани покрај вода.',
            coords: [[40.91, 20.74], [40.912, 20.742], [40.914, 20.744]]
          },
          {
            id: 308,
            name: 'Кањон Матка - До манастирот',
            distance: '3.5 km',
            duration: '1h 10m',
            altitude: '320m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
            description: 'Рамна и обезбедена пешачка патека која се движи по самата карпа покрај езерото Матка.',
            coords: [[41.94, 21.29], [41.942, 21.292], [41.944, 21.294]]
          },
          {
            id: 309,
            name: 'Лесновски Манастир Патека',
            distance: '1.8 km',
            duration: '40m',
            altitude: '880m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Кратка прошетка низ автентичниот карпест кратер на изгаснат вулкан до самиот манастир.',
            coords: [[42.01, 22.18], [42.012, 22.182], [42.014, 22.184]]
          },
          {
            id: 310,
            name: 'Еко патека Куклица',
            distance: '1.2 km',
            duration: '30m',
            altitude: '420m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
            description: 'Интересна и едукативна прошетка низ камените кукли (Камена Свадба) во близина на Кратово.',
            coords: [[42.08, 22.18], [42.082, 22.182], [42.084, 22.184]]
          },
          {
            id: 311,
            name: 'Пониква - Детска патека',
            distance: '3.0 km',
            duration: '1h 00m',
            altitude: '1,560m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600',
            description: 'Лесна планинска патека на Осогово наменета за деца, со многу места за одмор и забава.',
            coords: [[41.95, 22.45], [41.952, 22.452], [41.954, 22.454]]
          },
          {
            id: 312,
            name: 'Пелистерски Патеки за деца',
            distance: '2.2 km',
            duration: '55m',
            altitude: '1,100m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600',
            description: 'Специјално дизајнирана детска патека „Историска патека“ со едукативни табли низ шумата.',
            coords: [[41.01, 21.20], [41.012, 21.202], [41.014, 21.204]]
          },

      // Hidden Valley Trails со coords
      {
        id: 401,
        name: 'Радика Долина',
        distance: '6.7 km',
        duration: '2h 30m',
        altitude: '1,200m',
        difficulty: 'Medium',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
        description: 'Патека низ мистичната долина на реката Радика.',
        coords: [[41.61, 20.60], [41.62, 20.62], [41.63, 20.64]]
      },
          {
            id: 402,
            name: 'Мавровска Долина',
            distance: '8.2 km',
            duration: '3h 10m',
            altitude: '1,450m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Прошетка низ Мавровската долина со погледи кон езерото.',
            coords: [[41.70, 20.75], [41.71, 20.76], [41.72, 20.77]]
          },
          {
            id: 403,
            name: 'Демир Капија Долина',
            distance: '5.5 km',
            duration: '2h 00m',
            altitude: '900m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
            description: 'Долина со уникатни карпести формации и вински лозја.',
            coords: [[41.41, 22.25], [41.42, 22.26], [41.43, 22.27]]
          },
          {
            id: 404,
            name: 'Треска Долина',
            distance: '4.8 km',
            duration: '1h 40m',
            altitude: '850m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Патека покрај реката Треска со мирна атмосфера.',
            coords: [[41.95, 21.30], [41.96, 21.31], [41.97, 21.32]]
          },
          {
            id: 405,
            name: 'Кратовска Долина',
            distance: '6.2 km',
            duration: '2h 15m',
            altitude: '950m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
            description: 'Долина со камени мостови и средновековни кули.',
            coords: [[42.08, 22.18], [42.09, 22.19], [42.10, 22.20]]
          },
          {
            id: 406,
            name: 'Преспанска Долина',
            distance: '7.4 km',
            duration: '2h 50m',
            altitude: '1,000m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            description: 'Патека низ долината покрај Преспанското Езеро.',
            coords: [[40.90, 21.05], [40.91, 21.06], [40.92, 21.07]]
          },
          {
            id: 407,
            name: 'Козјачка Долина',
            distance: '5.9 km',
            duration: '2h 10m',
            altitude: '1,100m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
            description: 'Долина со погледи кон Козјачкото Езеро.',
            coords: [[41.95, 21.95], [41.96, 21.96], [41.97, 21.97]]
          },
          {
            id: 408,
            name: 'Смилевска Долина',
            distance: '3.8 km',
            duration: '1h 20m',
            altitude: '780m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Кратка патека низ зелената долина кај Смилево.',
            coords: [[41.28, 21.20], [41.29, 21.21], [41.30, 21.22]]
          },
          {
            id: 409,
            name: 'Кумановска Долина',
            distance: '9.1 km',
            duration: '3h 30m',
            altitude: '1,300m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Долга патека низ долината кај Куманово.',
            coords: [[42.14, 21.72], [42.15, 21.73], [42.16, 21.74]]
          },
          {
            id: 410,
            name: 'Кичевска Долина',
            distance: '7.0 km',
            duration: '2h 40m',
            altitude: '1,050m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
            description: 'Патека низ долината кај Кичево.',
            coords: [[41.51, 20.95], [41.52, 20.96], [41.53, 20.97]]
          },
          {
            id: 411,
            name: 'Галичичка Долина',
            distance: '8.5 km',
            duration: '3h 20m',
            altitude: '1,500m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Алпска долина во срцето на Галичица.',
            coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
          },
          {
            id: 412,
            name: 'Поречка Долина',
            distance: '7.6 km',
            duration: '2h 50m',
            altitude: '1,120m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Патека низ живописната Поречка долина, со мали водопади и традиционални камени куќи.',
            coords: [[41.74, 21.05], [41.75, 21.06], [41.76, 21.07]]
          },

      // Sunset Views со coords
      {
        id: 501,
        name: 'Охрид Зајдисонце',
        distance: '4.2 km',
        duration: '1h 30m',
        altitude: '750m',
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
        description: 'Патека покрај Охридското Езеро со спектакуларен зајдисонце.',
        coords: [[41.11, 20.80], [41.12, 20.81], [41.13, 20.82]]
      },
          {
            id: 502,
            name: 'Преспа Зајдисонце',
            distance: '5.0 km',
            duration: '2h 00m',
            altitude: '800m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
            description: 'Прошетка покрај Преспанското Езеро со мирни бои на зајдисонце.',
            coords: [[40.90, 21.05], [40.91, 21.06], [40.92, 21.07]]
          },
          {
            id: 503,
            name: 'Козјак Зајдисонце',
            distance: '6.1 km',
            duration: '2h 20m',
            altitude: '1,100m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            description: 'Патека со погледи кон Козјак и зајдисонце над планините.',
            coords: [[41.95, 21.95], [41.96, 21.96], [41.97, 21.97]]
          },
          {
            id: 504,
            name: 'Водно Зајдисонце',
            distance: '3.5 km',
            duration: '1h 10m',
            altitude: '1,066m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Кратка патека на Водно со поглед кон Скопје при зајдисонце.',
            coords: [[41.95, 21.43], [41.96, 21.44], [41.97, 21.45]]
          },
          {
            id: 505,
            name: 'Галичица Зајдисонце',
            distance: '7.8 km',
            duration: '3h 00m',
            altitude: '1,600m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
            description: 'Патека со погледи кон Охрид и Преспа при зајдисонце.',
            coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
          },
          {
            id: 506,
            name: 'Кратово Зајдисонце',
            distance: '4.0 km',
            duration: '1h 20m',
            altitude: '900m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Патека со погледи кон средновековните кули на Кратово.',
            coords: [[42.08, 22.18], [42.09, 22.19], [42.10, 22.20]]
          },
          {
            id: 507,
            name: 'Берово Зајдисонце',
            distance: '5.6 km',
            duration: '2h 10m',
            altitude: '1,050m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
            description: 'Патека со погледи кон Беровското Езеро при зајдисонце.',
            coords: [[41.70, 22.85], [41.71, 22.86], [41.72, 22.87]]
          },
          {
            id: 508,
            name: 'Крушево Зајдисонце',
            distance: '6.3 km',
            duration: '2h 30m',
            altitude: '1,350m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
            description: 'Патека со погледи кон највисокиот град во Македонија.',
            coords: [[41.37, 21.25], [41.38, 21.26], [41.39, 21.27]]
          },
          {
            id: 509,
            name: 'Струга Зајдисонце',
            distance: '4.7 km',
            duration: '1h 40m',
            altitude: '780m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
            description: 'Патека покрај реката Црн Дрим со зајдисонце над езерото.',
            coords: [[41.18, 20.68], [41.19, 20.69], [41.20, 20.70]]
          },
          {
            id: 510,
            name: 'Куманово Зајдисонце',
            distance: '5.9 km',
            duration: '2h 15m',
            altitude: '950m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Патека со погледи кон полињата кај Куманово при зајдисонце.',
            coords: [[42.14, 21.72], [42.15, 21.73], [42.16, 21.74]]
          },
          {
            id: 511,
            name: 'Штип Зајдисонце',
            distance: '3.8 km',
            duration: '1h 20m',
            altitude: '820m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Кратка патека со погледи кон Штип и околните ридови.',
            coords: [[41.74, 22.20], [41.75, 22.21], [41.76, 22.22]]
          },
          {
            id: 512,
            name: 'Гостивар Зајдисонце',
            distance: '6.5 km',
            duration: '2h 40m',
            altitude: '1,200m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Патека со погледи кон Полошката котлина и зајдисонце над Шар Планина.',
            coords: [[41.80, 20.90], [41.81, 20.91], [41.82, 20.92]]
          },

      // Forest Walks со coords
      {
        id: 601,
        name: 'Водно Шумска Патека',
        distance: '3.5 km',
        duration: '1h 20m',
        altitude: '950m',
        difficulty: 'Easy',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
        description: 'Кратка прошетка низ шумите на Водно.',
        coords: [[41.95, 21.43], [41.96, 21.44], [41.97, 21.45]]
      },
          {
            id: 602,
            name: 'Пелистер Шумска Патека',
            distance: '7.8 km',
            duration: '3h 40m',
            altitude: '1,600m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Патека низ густи шуми во Националниот парк Пелистер.',
            coords: [[40.99, 21.20], [41.00, 21.21], [41.01, 21.22]]
          },
          {
            id: 603,
            name: 'Шар Планина Шумска Патека',
            distance: '9.2 km',
            duration: '4h 10m',
            altitude: '1,800m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
            description: 'Долга патека низ алпски шуми на Шар Планина.',
            coords: [[42.12, 20.95], [42.13, 20.96], [42.14, 20.97]]
          },
          {
            id: 604,
            name: 'Маврово Шумска Патека',
            distance: '6.4 km',
            duration: '2h 30m',
            altitude: '1,200m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Патека низ шумите околу Мавровското Езеро.',
            coords: [[41.70, 20.75], [41.71, 20.76], [41.72, 20.77]]
          },
          {
            id: 605,
            name: 'Галичица Шумска Патека',
            distance: '5.7 km',
            duration: '2h 15m',
            altitude: '1,300m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
            description: 'Прошетка низ густи шуми на Галичица.',
            coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
          },
          {
            id: 606,
            name: 'Осогово Шумска Патека',
            distance: '8.1 km',
            duration: '3h 20m',
            altitude: '1,500m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            description: 'Патека низ шумите на Осоговските Планини.',
            coords: [[42.15, 22.45], [42.16, 22.46], [42.17, 22.47]]
          },
          {
            id: 607,
            name: 'Јабланица Шумска Патека',
            distance: '4.9 km',
            duration: '1h 50m',
            altitude: '1,100m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
            description: 'Кратка патека низ шумите на Јабланица.',
            coords: [[41.25, 20.55], [41.26, 20.56], [41.27, 20.57]]
          },
          {
            id: 608,
            name: 'Стогово Шумска Патека',
            distance: '7.3 km',
            duration: '3h 00m',
            altitude: '1,400m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
            description: 'Патека низ густи шуми на Стогово.',
            coords: [[41.55, 20.55], [41.56, 20.56], [41.57, 20.57]]
          },
          {
            id: 609,
            name: 'Кожуф Шумска Патека',
            distance: '6.0 km',
            duration: '2h 20m',
            altitude: '1,250m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Патека низ шумите на Кожуф Планина.',
            coords: [[41.15, 22.00], [41.16, 22.01], [41.17, 22.02]]
          },
          {
            id: 610,
            name: 'Славеј Планина Шумска Патека',
            distance: '5.2 km',
            duration: '2h 00m',
            altitude: '1,050m',
            difficulty: 'Easy',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Прошетка низ шумите на Славеј Планина.',
            coords: [[41.40, 21.90], [41.41, 21.91], [41.42, 21.92]]
          },
          {
            id: 611,
            name: 'Караорман Шумска Патека',
            distance: '8.7 km',
            duration: '3h 30m',
            altitude: '1,600m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
            description: 'Долга патека низ густи шуми на Караорман.',
            coords: [[41.55, 20.65], [41.56, 20.66], [41.57, 20.67]]
          },
          {
            id: 612,
            name: 'Сува Гора Шумска Патека',
            distance: '7.5 km',
            duration: '3h 10m',
            altitude: '1,350m',
            difficulty: 'Medium',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Патека низ шумите на Сува Гора.',
            coords: [[41.74, 21.05], [41.75, 21.06], [41.76, 21.07]]
          },

      // Expert Challenges со coords
      {
        id: 701,
        name: 'Короб Врв',
        distance: '15.3 km',
        duration: '6h 30m',
        altitude: '2,764m',
        difficulty: 'Hard',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
        description: 'Највисокиот врв во Македонија – предизвик за искусни планинари.',
        coords: [[41.79, 20.55], [41.80, 20.56], [41.81, 20.57]]
      },
          {
            id: 702,
            name: 'Пелистер Големо Езеро',
            distance: '14.2 km',
            duration: '6h 00m',
            altitude: '2,200m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Екстремна рута до Големото Езеро на Пелистер.',
            coords: [[40.99, 21.20], [41.00, 21.21], [41.01, 21.22]]
          },
          {
            id: 703,
            name: 'Шар Планина Алпски Врвови',
            distance: '18.0 km',
            duration: '7h 30m',
            altitude: '2,747m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Долга и предизвикувачка рута низ алпските врвови на Шар Планина.',
            coords: [[42.12, 20.95], [42.13, 20.96], [42.14, 20.97]]
          },
          {
            id: 704,
            name: 'Јабланица Врв',
            distance: '13.5 km',
            duration: '5h 40m',
            altitude: '2,200m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
            description: 'Предизвикувачка рута до врвот на Јабланица.',
            coords: [[41.25, 20.55], [41.26, 20.56], [41.27, 20.57]]
          },
          {
            id: 705,
            name: 'Осогово Врв Руен',
            distance: '16.2 km',
            duration: '6h 50m',
            altitude: '2,252m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
            description: 'Долга рута до највисокиот врв на Осогово – Руен.',
            coords: [[42.15, 22.45], [42.16, 22.46], [42.17, 22.47]]
          },
          {
            id: 706,
            name: 'Стогово Врв',
            distance: '14.8 km',
            duration: '6h 10m',
            altitude: '2,320m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            description: 'Алпска рута до врвот на Стогово.',
            coords: [[41.55, 20.55], [41.56, 20.56], [41.57, 20.57]]
          },
          {
            id: 707,
            name: 'Кожуф Врв Зелен Брег',
            distance: '12.9 km',
            duration: '5h 20m',
            altitude: '2,171m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Предизвикувачка патека до Зелен Брег на Кожуф.',
            coords: [[41.15, 22.00], [41.16, 22.01], [41.17, 22.02]]
          },
          {
            id: 708,
            name: 'Галичица Врв Магаро',
            distance: '11.7 km',
            duration: '4h 50m',
            altitude: '2,254m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
            description: 'Рута до врвот Магаро со погледи кон Охрид и Преспа.',
            coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
          },
          {
            id: 709,
            name: 'Сува Гора Врв',
            distance: '13.2 km',
            duration: '5h 30m',
            altitude: '1,850m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
            description: 'Долга рута низ Сува Гора до највисоките точки.',
            coords: [[41.74, 21.05], [41.75, 21.06], [41.76, 21.07]]
          },
          {
            id: 710,
            name: 'Караорман Врв',
            distance: '12.5 km',
            duration: '5h 00m',
            altitude: '1,900m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
            description: 'Предизвикувачка патека низ Караорманските шуми до врвот.',
            coords: [[41.55, 20.65], [41.56, 20.66], [41.57, 20.67]]
          },
          {
            id: 711,
            name: 'Славеј Планина Врв',
            distance: '10.8 km',
            duration: '4h 30m',
            altitude: '1,700m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            description: 'Рута до врвот на Славеј Планина.',
            coords: [[41.40, 21.90], [41.41, 21.91], [41.42, 21.92]]
          },
          {
            id: 712,
            name: 'Беласица Врв Тумба',
            distance: '15.0 km',
            duration: '6h 20m',
            altitude: '1,880m',
            difficulty: 'Hard',
            image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
            description: 'Екстремна рута до врвот Тумба на Беласица.',
            coords: [[41.36, 22.90], [41.37, 22.91], [41.38, 22.92]]
          }
]

// Преземање на ID од рутата со Fallback за ID: 1 ако нешто тргне наопаку
const localizedTrailNames = {
  1: 'Патека Водно',
  2: 'Баба Планина',
  3: 'Шар Планина',
  4: 'Кањон Матка',
  5: 'Национален парк Галичица',
  6: 'Пелистер Големо Езеро',
  7: 'Патека покрај реката Треска',
  8: 'Кружна патека околу Мавровското Езеро'
}

const synchronizedTrails = trailsDatabase.map(trail => {
  const name = localizedTrailNames[trail.id] || trail.name
  return {
    ...trail,
    name,
    image: getMountainImage(name, trail.image, trail.id)
  }
})

const idFromRoute = parseInt(route.params.id) || 1
const foundTrail = synchronizedTrails.find(t => t.id === idFromRoute) || synchronizedTrails[0]
const currentTrail = ref(foundTrail)
const arrivalMode = ref('walk')
const arrivalDistance = ref(null)
let activeMap
let locationMarker
let positionWatchId
let routeToStartLayer
let lastArrivalRequest = 0
let routeToStartLayer
let routeToStartLayer
let activeMap
let locationMarker
let positionWatchId
const fallbackImage = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85'
const handleImageError = (event) => {
  if (event.target.src !== fallbackImage) event.target.src = fallbackImage
}

onMounted(async () => {
  // Чекаме Vue комплетно да го изренда HTML-от и дивовите во DOM
  await nextTick()

  const mapContainer = document.getElementById('map')
  if (!mapContainer) {
    console.error("Грешка: Не е пронајден '#map' елементот во DOM-от!")
    return
  }

  try {
    // Иницијализација на мапата со почетна точка
    activeMap = L.map('map').setView(currentTrail.value.coords[0], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(activeMap)

    // Почетен маркер
    L.marker(currentTrail.value.coords[0])
        .addTo(activeMap)

    // Нашата Altigo портокалова линија
    L.polyline(currentTrail.value.coords, {
      color: '#f26522',
      weight: 6,
      opacity: 0.9
    }).addTo(activeMap)
    routeToStartLayer = L.polyline([], {
      color: '#60a5fa',
      weight: 4,
      opacity: 0.95,
      dashArray: '7 11'
    }).addTo(activeMap)
    routeToStartLayer = L.polyline([], {
      color: '#60a5fa',
      weight: 4,
      opacity: 0.95,
      dashArray: '7 11'
    }).addTo(activeMap)
    routeToStartLayer = L.polyline([], {
      color: '#60a5fa',
      weight: 4,
      opacity: 0.95,
      dashArray: '7 11'
    }).addTo(activeMap)

    // Автоматско прилагодување на зумот
    const bounds = L.polyline(currentTrail.value.coords).getBounds()
    activeMap.fitBounds(bounds, { padding: [40, 40] })

    locationMarker = L.circleMarker(currentTrail.value.coords[0], {
      radius: 5,
      color: '#ffffff',
      weight: 2,
      fillColor: '#2563eb',
      fillOpacity: 1
    }).addTo(activeMap)
    // Keep a visible blue position marker at the trail start until GPS resolves.
    locationMarker.setStyle({ opacity: 1, fillOpacity: 1 })
    if (navigator.geolocation) {
      positionWatchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const position = [coords.latitude, coords.longitude]
          locationMarker.setLatLng(position).setStyle({ opacity: 1, fillOpacity: 1 })
          loadArrivalRoute(position)
        },
        () => locationMarker.setStyle({ opacity: 1, fillOpacity: 1 }),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      )
    }

  } catch (error) {
    console.error("Грешка при иницијализација на Leaflet:", error)
  }
})

onBeforeUnmount(() => {
  if (positionWatchId !== undefined) navigator.geolocation?.clearWatch(positionWatchId)
  if (activeMap) activeMap.remove()
})

async function loadArrivalRoute(position) {
  const now = Date.now()
  if (now - lastArrivalRequest < 10000) return
  lastArrivalRequest = now

  const profile = arrivalMode.value === 'car' ? 'driving' : 'foot'
  const [targetLatitude, targetLongitude] = currentTrail.value.coords[0]
  const fallbackDistance = haversineDistance(position, currentTrail.value.coords[0])
  arrivalDistance.value = fallbackDistance
  routeToStartLayer?.setLatLngs([position, currentTrail.value.coords[0]]).bringToFront()

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${profile}/${position[1]},${position[0]};${targetLongitude},${targetLatitude}?overview=full&geometries=geojson`
    )
    if (!response.ok) throw new Error(`OSRM одговори со ${response.status}`)
    const data = await response.json()
    const selectedRoute = data.routes?.[0]
    if (!selectedRoute) throw new Error('OSRM не врати рута')

    arrivalDistance.value = selectedRoute.distance / 1000
    routeToStartLayer?.setLatLngs(
      selectedRoute.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude])
    ).bringToFront()
  } catch (error) {
    console.warn('Неуспешно вчитување на рутата до почетокот:', error)
  }
}

function haversineDistance(first, second) {
  const earthRadius = 6371
  const latDistance = (second[0] - first[0]) * Math.PI / 180
  const lngDistance = (second[1] - first[1]) * Math.PI / 180
  const latitude = first[0] * Math.PI / 180
  const secondLatitude = second[0] * Math.PI / 180
  const value = Math.sin(latDistance / 2) ** 2 +
    Math.cos(latitude) * Math.cos(secondLatitude) * Math.sin(lngDistance / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

function formatDistance(distance) {
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
}

function formatArrivalTime(distance, mode) {
  const speed = mode === 'car' ? 45 : 3.5
  const minutes = Math.max(1, Math.round((distance / speed) * 60))
  return minutes < 60 ? `${minutes} мин` : `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`
}

const goBack = () => {
  router.push(route.query.from === 'explore' ? { name: 'Explore' } : { name: 'Trails' })
}

const planCustomRoute = () => {
  router.push({
    path: '/route-planner',
    query: { trail: String(currentTrail.value.id) }
  })
}
</script>

<style>
.trail-detail-container {
  min-height: 100vh;
  background: #0b1220 !important;
  color: #ffffff !important;
  font-family: 'Inter', sans-serif;
}

.detail-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Лева страна */
.info-side {
  width: 45%;
  min-width: 450px;
  padding: 2.5rem;
  box-sizing: border-box;
  background: #0b1220;
}

.back-link {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.trail-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  color: white;
}

.trail-hero-wrapper {
  position: relative;
  width: 100%;
  height: 280px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.trail-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.difficulty-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
}
.difficulty-badge.easy { background: #22c55e; color: white; }
.difficulty-badge.medium { background: #eab308; color: black; }
.difficulty-badge.hard { background: #ef4444; color: white; }

.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.spec-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.8rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spec-icon { font-size: 1.3rem; }
.spec-label { color: #94a3b8; font-size: 0.75rem; margin: 0; }
.spec-value { font-weight: 700; font-size: 0.95rem; margin: 0; color: white; }

.description-section h3 { margin-top: 0; font-size: 1.2rem; }
.description-text { color: #94a3b8; line-height: 1.6; font-size: 0.95rem; margin-bottom: 2rem; }

.route-planner-box {
  background: rgba(242, 101, 34, 0.08);
  border: 1px solid rgba(242, 101, 34, 0.2);
  padding: 1.2rem;
  border-radius: 14px;
}
.route-planner-box h4 { color: #f26522; margin: 0 0 0.5rem 0; }
.route-planner-box p { font-size: 0.85rem; color: #cbd5e1; margin-bottom: 1rem; }
.plan-btn { background: #f26522; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: 600; cursor: pointer; }

/* Десна страна - ОБВРЗНО ФИКСНА ВИСИНА ЗА МАТА */
.map-side {
  flex: 1;
  padding: 2rem;
  background: #070d19;
  display: flex;
  align-items: center;
}

.map-wrapper {
  width: 100%;
  height: 85vh;
  display: flex;
  flex-direction: column;
  background: #1e293b;
  border-radius: 20px;
  overflow: hidden;
}

.map-header {
  padding: 1rem;
  background: #111827;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}
.map-header h3 { margin: 0; font-size: 1rem; }
.live-indicator { color: #4ade80; font-size: 0.8rem; }

/* КЛУЧНИОТ ФИКС ЗА LEAFLET БАГОТ */
.map-box {
  width: 100% !important;
  height: 100% !important;
  min-height: 400px;
  flex: 1;
}
</style>-->





<template>
  <div class="trail-detail-container">
    <div class="detail-layout">

      <!-- ЛЕВА СТРАНА: ИНФОРМАЦИИ ЗА ПАТЕКАТА -->
      <aside class="info-side glass">
        <button @click="goBack" class="back-link">
          <span class="arrow">←</span> Назад кон сите патеки
        </button>

        <h1 class="trail-title">{{ currentTrail?.name || 'Вчитавање на патека...' }}</h1>

        <!-- ХЕРО СЛИКА СО БЕЏ ЗА ТЕЖИНА -->
        <div class="trail-hero-wrapper">
          <img
              :src="getMountainImage(currentTrail?.name, currentTrail?.image)"
              :alt="currentTrail?.name"
              class="trail-hero-image"
          />
          <div v-if="currentTrail" class="difficulty-badge" :class="currentTrail.difficulty.toLowerCase()">
            {{ currentTrail.difficulty }}
          </div>
        </div>

        <!-- МЕТРИКА / СПЕЦИФИКАЦИИ -->
        <div class="specs-grid">
          <div class="spec-card">
            <span class="spec-icon" aria-hidden="true">⌁</span>
            <div class="spec-meta">
              <p class="spec-label">Должина</p>
              <p class="spec-value">{{ currentTrail?.distance || 'N/A' }}</p>
            </div>
          </div>

          <div class="spec-card">
            <span class="spec-icon" aria-hidden="true">◷</span>
            <div class="spec-meta">
              <p class="spec-label">Времетраење</p>
              <p class="spec-value">{{ currentTrail?.duration || '2h 15m' }}</p>
            </div>
          </div>

          <div class="spec-card">
            <span class="spec-icon" aria-hidden="true">△</span>
            <div class="spec-meta">
              <p class="spec-label">Највисока точка</p>
              <p class="spec-value">{{ currentTrail?.altitude || '1,066m' }}</p>
            </div>
          </div>
        </div>

        <!-- ОПИС -->
        <section class="description-section">
          <h3>За оваа авантура</h3>
          <p class="description-text">
            {{ currentTrail?.description || 'Прекрасна панорамска патека, идеална за рекреација, истражување и уживање во чистиот планински воздух.' }}
          </p>
        </section>

        <!-- ПЛАНЕР КАРТИЧКА -->
        <div class="route-planner-box">
          <div class="planner-icon">🎯</div>
          <div class="planner-content">
            <h4>Altigo Паметен Планер</h4>
            <p>Сакаш да ја прилагодиш оваа рута или да додадеш сопствени точки?</p>
            <button class="plan-btn" @click="planCustomRoute">Креирај сопствена рута</button>
          </div>
        </div>
      </aside>

      <!-- ДЕСНА СТРАНА: ИНInteractive ЛЕАФЛЕТ МАПА -->
      <main class="map-side">
        <div class="map-wrapper glass">
          <div class="map-header">
            <div class="map-title-group">
              <span class="map-icon">🗺️</span>
              <h3>ГПС Сателитска Навигација</h3>
            </div>
            <span class="live-indicator">
              <span class="pulse-dot"></span> На Живо (GPS)
            </span>
          </div>
          <div id="map" class="map-box"></div>
          <div class="arrival-panel">
            <div class="arrival-heading">Како да стигнеш до почетокот</div>
            <div class="arrival-modes">
              <button :class="{ active: arrivalMode === 'walk' }" @click="setArrivalMode('walk')">Пешки</button>
              <button :class="{ active: arrivalMode === 'car' }" @click="setArrivalMode('car')">Со кола</button>
            </div>
            <div v-if="arrivalDistance !== null" class="arrival-details">
              <span>{{ formatDistance(arrivalDistance) }}</span>
              <span>{{ formatArrivalTime(arrivalDistance, arrivalMode) }}</span>
            </div>
            <p v-else class="arrival-status">Вклучи GPS за да ја прикажеме рутата од твојата локација.</p>
          </div>
        </div>
      </main>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref, nextTick } from 'vue'
import L from 'leaflet'
import { getMountainImage } from '../services/mountainImages'
import { saveData } from '../services/storage'

const route = useRoute()
const router = useRouter()

// Пример база на податоци (овде патеката мора да содржи coords)
const trailsDatabase = [
  {
    id: 1,
    name: 'Патека Водно',
    distance: '5.2 km',
    duration: '2h 15m',
    altitude: '1,066m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Прекрасна панорамска патека на Водно, веднаш над Скопје. Патеката води низ густа шума и нуди спектакуларен поглед на градот, завршувајќи кај препознатливиот Милениумски Крст.',
    coords: [[41.962, 21.427], [41.967, 21.415], [41.964, 21.396]]
  },
  {
    id: 2,
    name: 'Baba Mountain',
    distance: '8.1 km',
    duration: '4h 30m',
    altitude: '2,601m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Возбудлива и предизвикувачка патека на планината Баба кај Битола. Оваа патека ве води низ Националниот парк Пелистер.',
    coords: [[41.015, 21.195], [41.008, 21.172], [41.003, 21.155]]
  },
  {
    id: 3,
    name: 'Shar Mountain Trail',
    distance: '12.4 km',
    duration: '5h 15m',
    altitude: '2,747m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Алпски пејзажи кои го одземаат здивот на Шар Планина.',
    coords: [[42.012, 20.892], [42.031, 20.875], [42.062, 20.861]]
  },
  {
    id: 4,
    name: 'Matka Canyon',
    distance: '6.7 km',
    duration: '3h 00m',
    altitude: '650m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која се протега по самиот раб на прекрасниот кањон Матка.',
    coords: [[41.938, 21.297], [41.931, 21.295], [41.918, 21.291]]
  },
  {
    id: 5,
    name: 'Galichica National Park',
    distance: '9.3 km',
    duration: '4h 15m',
    altitude: '2,254m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=85',
    description: 'Патека лоцирана на прекрасната планина Галичица. Единствено место каде што додека пешачите можете да уживате во погледот кон двете езера истовремено - Охридското и Преспанското.',
    coords: [[40.992, 20.865], [40.978, 20.841], [40.963, 20.825]]
  },
  {
    id: 6,
    name: 'Pelister Big Lake',
    distance: '14.2 km',
    duration: '6h 30m',
    altitude: '2,218m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Предизвикувачка рута која води до Големото Езеро на Пелистер (Пелистерски Очи). Патеката е каменеста и бара добра физичка подготвеност, но погледот на ледничкото езеро вреди за секој чекор.',
    coords: [[41.011, 21.192], [40.985, 21.198], [40.971, 21.203]]
  },
  {
    id: 7,
    name: 'Treska River Path',
    distance: '4.8 km',
    duration: '1h 45m',
    altitude: '350m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Релаксирачка и рамна патека идеална за семејни прошетки покрај течението на реката Треска. Нуди чист воздух, мирно опкружување и сенки под густите дрвја.',
    coords: [[41.951, 21.321], [41.942, 21.311], [41.935, 21.302]]
  },
  {
    id: 8,
    name: 'Mavrovo Lake Loop',
    distance: '11.5 km',
    duration: '3h 30m',
    altitude: '1,230m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Прекрасна кружна патека околу Мавровското Езеро. Погодна е за пешачење и за планински велосипедизам, со поглед кон познатата потопена црква Св. Никола.',
    coords: [[41.652, 20.731], [41.671, 20.712], [41.691, 20.742]]
  },
  {
    id: 9,
    name: 'Kozjak Reservoir Trail',
    distance: '7.6 km',
    duration: '2h 45m',
    altitude: '850m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која води до видиковците над вештачкото езеро Козјак. Ова место нуди неверојатен сценографски поглед на најголемиот кањон во Македонија кој наликува на вистински фјорд.',
    coords: [[41.879, 21.189], [41.861, 21.192], [41.845, 21.171]]
  },
  {
    id: 10,
    name: 'Клисура Демир Капија',
    distance: '6.2 km',
    duration: '2h 15m',
    altitude: '450m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Патека низ Демиркаписката Клисура, позната по карпестите предели и богатата историја. Патеката нуди одлични глетки на реката Вардар и околните масивни карпи кои се рај за алпинистите.',
    coords: [[41.405, 22.251], [41.398, 22.272], [41.385, 22.291]]
  },
  {
    id: 11,
    name: 'Smolikas Ridge',
    distance: '10.7 km',
    duration: '4h 45m',
    altitude: '2,100m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    description: 'Интензивна високопланинска патека по гребенот на Смолика. Се карактеризира со стрмни нагорнини, отворени панорами и силен ветар, наменета за искусни планинари.',
    coords: [[41.251, 20.612], [41.235, 20.595], [41.211, 20.581]]
  },
  {
    id: 12,
    name: 'Korab Summit Trail',
    distance: '15.3 km',
    duration: '7h 30m',
    altitude: '2,764m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Официјалната патека до Голем Кораб - највисокиот врв во Македонија. Патеката почнува од караулата Стрезимир и нуди незаборавно искуство низ недопрени планински предели на границата.',
    coords: [[41.791, 20.591], [41.785, 20.551], [41.790, 20.538]]
  },
  {
    id: 13,
    name: 'Tikvesh Lake Path',
    distance: '8.9 km',
    duration: '3h 15m',
    altitude: '410m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Пријатна патека лоцирана покрај Тиквешкото Езеро кај Кавадарци. Патеката поминува близу до стари цркви во карпи и нуди убав амбиент за љубителите на природата и птиците.',
    coords: [[41.382, 21.954], [41.361, 21.942], [41.341, 21.931]]
  },
  {
    id: 14,
    name: 'Marko’s Tower Trail',
    distance: '5.5 km',
    duration: '2h 00m',
    altitude: '920m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која ве води директно до Марковите Кули над Прилеп. Патеката е препознатлива по уникатните гранитни карпести формации формирани низ милиони години и средновековната тврдина на врвот.',
    coords: [[41.365, 21.539], [41.368, 21.542], [41.373, 21.535]]
  },
  {
    id: 15,
    name: 'Kuklica Stone Dolls',
    distance: '3.8 km',
    duration: '1h 15m',
    altitude: '510m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: 'Кратка едукативна и туристичка патека во близина на Кратово. Ве води низ феноменот „Камени Кукли“, природни камени столбови за кои постои позната народна легенда за скаменетата свадба.',
    coords: [[42.122, 22.053], [42.124, 22.055], [42.126, 22.058]]
  },
  {
    id: 16,
    name: 'Stogovo Mountain Path',
    distance: '13.1 km',
    duration: '6h 00m',
    altitude: '2,273m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=600&q=80',
    description: 'Осамена и диви планинска патека на Стогово. Нуди огромни тревни пространства, тишина и прекрасен поглед кон Дебарското Езеро и кањонот на Радика од висина.',
    coords: [[41.512, 20.635], [41.531, 20.654], [41.552, 20.672]]
  },
  {
    id: 17,
    name: 'Jablanica Ridge Trail',
    distance: '9.8 km',
    duration: '4h 30m',
    altitude: '2,257m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Патека долж сртот на Јабланица над Струга и Вевчани. Оваа патека изобилува со извори, леднички локви и панорамски погледи кои стигнуваат дури до албанските планини.',
    coords: [[41.241, 20.512], [41.252, 20.491], [41.265, 20.472]]
  },
  {
    id: 18,
    name: 'Kratovo Canyon Walk',
    distance: '4.2 km',
    duration: '1h 30m',
    altitude: '620m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
    description: 'Кратка прошетка низ автентичниот кањон на Табачка Река во Кратово. Поминува под старите камени мостови и средновековни кули на градот изграден во вулкански кратер.',
    coords: [[42.078, 22.174], [42.081, 22.181], [42.083, 22.185]]
  },
  {
    id: 19,
    name: 'Prespa Lake Shore',
    distance: '7.4 km',
    duration: '2h 30m',
    altitude: '853m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    description: 'Еколошка патека лоцирана на самиот брег на Преспанското Езеро. Патеката е одлична за набљудување на птици (особено пеликаните во Стење и Коњско) и релаксација покрај песочните плажи.',
    coords: [[40.942, 20.912], [40.925, 20.931], [40.911, 20.948]]
  },
  {
    id: 20,
    name: 'Osogovo Mountain Trail',
    distance: '12.9 km',
    duration: '5h 00m',
    altitude: '2,085m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: 'Патека која води низ заоблените падини на Осоговските Планини кај Кочани и Крива Паланка. Патеката минува низ букови шуми и високи планински пасишта идеални за долги тури.',
    coords: [[42.082, 22.465], [42.095, 22.491], [42.115, 22.512]]
  },
  {
    id: 21,
    name: 'Kukja na Golema Reka',
    distance: '6.0 km',
    duration: '2h 00m',
    altitude: '780m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: 'Шумска еколошка патека лоцирана во недопрената природа во близина на Голема Река. Идеална за бегство од градскиот метеж, собирање шумски плодови и уживање во жуборот на водата.',
    coords: [[41.154, 21.121], [41.142, 21.135], [41.131, 21.151]]
  },




  // Waterfall Wonders со coords
  {
    id: 101,
    name: 'Колешински Водопад',
    distance: '1.2 km',
    duration: '40m',
    altitude: '610m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1432406186174-2b24f4a6d777?w=600',
    description: 'Сместен на реката Баба во пазувите на Беласица, опкружен со густа јаворова шума.',
    coords: [[41.414, 22.889], [41.415, 22.892], [41.416, 22.895]]
  },
  {
    id: 102,
    name: 'Смоларски Водопад',
    distance: '2.0 km',
    duration: '1h 10m',
    altitude: '630m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=600',
    description: 'Највисокиот постојан водопад во државата (39.5 метри), со уредена патека и панорамски мост.',
    coords: [[41.397, 22.889], [41.398, 22.891], [41.399, 22.893]]
  },
  {
    id: 103,
    name: 'Дуфски Водопад',
    distance: '3.5 km',
    duration: '1h 30m',
    altitude: '1,020m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    description: 'Спектакуларен водопад кај с. Ростуше, сместен во тесен и мистичен карпест кањон.',
    coords: [[41.61, 20.6], [41.612, 20.602], [41.614, 20.604]]
  },
  {
    id: 104,
    name: 'Белавички Водопади',
    distance: '5.0 km',
    duration: '2h 00m',
    altitude: '1,100m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600',
    description: 'Скриено природно богатство на Осоговските планини во близина на Кочани со неколку каскади.',
    coords: [[41.92, 22.4], [41.923, 22.402], [41.925, 22.405]]
  },
  {
    id: 105,
    name: 'Габровски Водопади',
    distance: '1.8 km',
    duration: '50m',
    altitude: '550m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1508459855340-fb63ba59186b?w=600',
    description: 'Три помали, но исклучително шармантни водопади лоцирани веднаш над селото Габрово.',
    coords: [[41.55, 22.2], [41.552, 22.202], [41.554, 22.205]]
  },
  {
    id: 106,
    name: 'Бабунски Водопад',
    distance: '12.5 km',
    duration: '4h 30m',
    altitude: '1,350m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    description: 'Се наоѓа под самиот врв Солунска Глава. Патеката до него е долга и исполнета со планински убавини.',
    coords: [[41.73, 21.45], [41.735, 21.46], [41.74, 21.47]]
  },
  {
    id: 107,
    name: 'Корабски Водопад (Пропаст)',
    distance: '18.0 km',
    duration: '8h 00m',
    altitude: '2,120m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600',
    description: 'Највисокиот водопад на Балканот кој се појавува во пролет со топењето на снеговите на Кораб.',
    coords: [[41.79, 20.55], [41.795, 20.56], [41.80, 20.57]]
  },
  {
    id: 108,
    name: 'Пештерски Водопад Длабока Река',
    distance: '14.2 km',
    duration: '6h 30m',
    altitude: '1,800m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600',
    description: 'Екстремно скриен водопад во дивината на кањонот на Длабока Река, опкружен со алпски терен.',
    coords: [[41.65, 20.7], [41.652, 20.705], [41.655, 20.71]]
  },
  {
    id: 109,
    name: 'Станечки Водопад',
    distance: '4.0 km',
    duration: '1h 45m',
    altitude: '1,150m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Убав водопад на Осоговијата во близина на Крива Паланка, лоциран покрај густа букова шума.',
    coords: [[42.2, 22.3], [42.202, 22.305], [42.205, 22.31]]
  },
  {
    id: 110,
    name: 'Калимански Водопади',
    distance: '3.2 km',
    duration: '1h 15m',
    altitude: '780m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Мали водопади со кристално чиста изворска вода во близина на вештачкото езеро Калиманци.',
    coords: [[41.9, 22.5], [41.902, 22.502], [41.905, 22.505]]
  },
  {
    id: 111,
    name: 'Водопади на Брегалница',
    distance: '6.8 km',
    duration: '2h 30m',
    altitude: '1,250m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
    description: 'Скриени каскади во горниот тек на реката Брегалница, во недопрените делови на Малешевијата.',
    coords: [[41.65, 22.6], [41.652, 22.605], [41.655, 22.61]]
  },
  {
    id: 112,
    name: 'Зрзески Водопад',
    distance: '2.5 km',
    duration: '1h 00m',
    altitude: '950m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Се наоѓа во карпите веднаш под манастирот Зрзе, карактеристичен по бигорот и свежината.',
    coords: [[41.52, 21.4], [41.523, 21.405], [41.525, 21.41]]
  },


  // Alpine Peaks со coords
  {
    id: 201,
    name: 'Титов Врв (Шар Планина)',
    distance: '21.0 km',
    duration: '8h 00m',
    altitude: '2,747m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Освојување на највисокиот врв на Шара по Вакуфска патека. Ве очекува каменит терен и прекрасни видиковци.',
    coords: [[42.15, 20.85], [42.16, 20.86], [42.17, 20.87]]
  },
  {
    id: 202,
    name: 'Врв Пелистер (Баба Планина)',
    distance: '16.5 km',
    duration: '6h 30m',
    altitude: '2,601m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    description: 'Искачување по техничката патека „Дива Коза“ преку камените грамади (морени) до самиот врв.',
    coords: [[40.99, 21.20], [41.00, 21.21], [41.01, 21.22]]
  },
  {
    id: 203,
    name: 'Солунска Глава (Јакупица)',
    distance: '24.0 km',
    duration: '9h 30m',
    altitude: '2,540m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Патека позната како „папокот на Македонија“. Комплексна тура до грандиозната јужна карпа.',
    coords: [[41.73, 21.45], [41.74, 21.46], [41.75, 21.47]]
  },
  {
    id: 204,
    name: 'Голем Кораб',
    distance: '13.5 km',
    duration: '5h 30m',
    altitude: '2,764m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600',
    description: 'Освојување на највисоката точка во Македонија. Патеката започнува од караулата Стрезимир.',
    coords: [[41.79, 20.55], [41.80, 20.56], [41.81, 20.57]]
  },
  {
    id: 205,
    name: 'Врв Руен (Осоговски Планини)',
    distance: '18.2 km',
    duration: '5h 45m',
    altitude: '2,252m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Долга патека со постепен, благ наклон, која нуди поглед кон цела Источна Македонија и Бугарија.',
    coords: [[42.15, 22.45], [42.16, 22.46], [42.17, 22.47]]
  },
  {
    id: 206,
    name: 'Врв Љуботен (Шар Планина)',
    distance: '11.0 km',
    duration: '5h 00m',
    altitude: '2,498m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1472214222541-d510753a4707?w=600',
    description: 'Карактеристичен шилест врв во форма на пирамида. Стрмно качување по камени сртови.',
    coords: [[42.12, 20.95], [42.13, 20.96], [42.14, 20.97]]
  },
  {
    id: 207,
    name: 'Врв Магаро (Галичица)',
    distance: '8.5 km',
    duration: '3h 30m',
    altitude: '2,255m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
    description: 'Врв лоциран помеѓу двете најголеми езера (Охридското и Преспанското). Глетката од горе е незаменлива.',
    coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
  },
  {
    id: 208,
    name: 'Врв Кожуф (Зеленбрег)',
    distance: '12.0 km',
    duration: '4h 45m',
    altitude: '2,166m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600',
    description: 'Патека по широки тревнати пасишта кои во зима се претвораат во суров алпски предел.',
    coords: [[41.15, 22.00], [41.16, 22.01], [41.17, 22.02]]
  },
  {
    id: 209,
    name: 'Врв Меденица (Бистра)',
    distance: '9.0 km',
    duration: '3h 15m',
    altitude: '2,163m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=600',
    description: 'Највисокиот врв на Бистра, лоциран над с. Галичник. Се одликува со прекрасни карстни полиња.',
    coords: [[41.60, 20.65], [41.61, 20.66], [41.62, 20.67]]
  },
  {
    id: 210,
    name: 'Врв Кајмакчалан (Ниџе)',
    distance: '15.4 km',
    duration: '6h 00m',
    altitude: '2,521m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600',
    description: 'Историски значаен врв на македонско-грчката граница со преубава мала црква и капела на самиот врв.',
    coords: [[40.95, 21.80], [40.96, 21.81], [40.97, 21.82]]
  },
  {
    id: 211,
    name: 'Врв Крчин (Дебарски регион)',
    distance: '14.0 km',
    duration: '6h 30m',
    altitude: '2,341m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Остра и стрмна гранитна патека со преубав отворен поглед кон долината на реката Радика.',
    coords: [[41.55, 20.55], [41.56, 20.56], [41.57, 20.57]]
  },
  {
    id: 212,
    name: 'Врв Црн Камен (Јабланица)',
    distance: '13.2 km',
    duration: '5h 15m',
    altitude: '2,257m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600',
    description: 'Стрмно искачување до највисоката карпа на Јабланица, во близина на прекрасните Вевчански локви.',
    coords: [[41.25, 20.55], [41.26, 20.56], [41.27, 20.57]]
  },


  // Family Trails со coords
  {
    id: 301,
    name: 'Парк Шума Гази Баба',
    distance: '3.0 km',
    duration: '1h 00m',
    altitude: '280m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85',
    description: 'Комплетно уредена зелена оаза во Скопје со чисти патеки, детски игралишта и клупи за одмор.',
    coords: [[41.98, 21.47], [41.981, 21.472], [41.982, 21.474]]
  },
  {
    id: 302,
    name: 'Вевчански Извори',
    distance: '1.5 km',
    duration: '45m',
    altitude: '830m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    description: 'Преубави дрвени мостчиња и патеки над разиграните извори на вода. Идеално за мали деца.',
    coords: [[41.24, 20.59], [41.242, 20.592], [41.244, 20.594]]
  },
  {
    id: 303,
    name: 'Крушевско Езеро Патека',
    distance: '4.0 km',
    duration: '1h 20m',
    altitude: '1,150m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Рамна и асфалтирана патека околу вештачкото езеро во Крушево, одлична за пикник и игра.',
    coords: [[41.37, 21.25], [41.372, 21.252], [41.374, 21.254]]
  },
  {
    id: 304,
    name: 'Крајбрежје на Дојран',
    distance: '5.2 km',
    duration: '1h 30m',
    altitude: '145m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Рамна рамномерна патека покрај брегот на езерото, соодветна за детски колички и тротинети.',
    coords: [[41.18, 22.72], [41.182, 22.724], [41.184, 22.728]]
  },
  {
    id: 305,
    name: 'Локалитет Смрдлива Вода',
    distance: '2.5 km',
    duration: '1h 00m',
    altitude: '720m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    description: 'Излетничко место на Кожуф планина со кратка патека низ шумата и чист воздух.',
    coords: [[41.09, 22.02], [41.092, 22.024], [41.094, 22.028]]
  },
  {
    id: 306,
    name: 'Беровско Езеро - Кружна патека',
    distance: '6.0 km',
    duration: '2h 00m',
    altitude: '980m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600',
    description: 'Пријатна, широка патека околу езерото опкружена со борови дрвја и ливади.',
    coords: [[41.70, 22.85], [41.702, 22.852], [41.704, 22.854]]
  },
  {
    id: 307,
    name: 'Парк Свети Наум (Охрид)',
    distance: '2.0 km',
    duration: '50m',
    altitude: '695m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Прошетка покрај изворите на Црн Дрим, со убаво уредени тревници и ресторани покрај вода.',
    coords: [[40.91, 20.74], [40.912, 20.742], [40.914, 20.744]]
  },
  {
    id: 308,
    name: 'Кањон Матка - До манастирот',
    distance: '3.5 km',
    duration: '1h 10m',
    altitude: '320m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
    description: 'Рамна и обезбедена пешачка патека која се движи по самата карпа покрај езерото Матка.',
    coords: [[41.94, 21.29], [41.942, 21.292], [41.944, 21.294]]
  },
  {
    id: 309,
    name: 'Лесновски Манастир Патека',
    distance: '1.8 km',
    duration: '40m',
    altitude: '880m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Кратка прошетка низ автентичниот карпест кратер на изгаснат вулкан до самиот манастир.',
    coords: [[42.01, 22.18], [42.012, 22.182], [42.014, 22.184]]
  },
  {
    id: 310,
    name: 'Еко патека Куклица',
    distance: '1.2 km',
    duration: '30m',
    altitude: '420m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    description: 'Интересна и едукативна прошетка низ камените кукли (Камена Свадба) во близина на Кратово.',
    coords: [[42.08, 22.18], [42.082, 22.182], [42.084, 22.184]]
  },
  {
    id: 311,
    name: 'Пониква - Детска патека',
    distance: '3.0 km',
    duration: '1h 00m',
    altitude: '1,560m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600',
    description: 'Лесна планинска патека на Осогово наменета за деца, со многу места за одмор и забава.',
    coords: [[41.95, 22.45], [41.952, 22.452], [41.954, 22.454]]
  },
  {
    id: 312,
    name: 'Пелистерски Патеки за деца',
    distance: '2.2 km',
    duration: '55m',
    altitude: '1,100m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600',
    description: 'Специјално дизајнирана детска патека „Историска патека“ со едукативни табли низ шумата.',
    coords: [[41.01, 21.20], [41.012, 21.202], [41.014, 21.204]]
  },

  // Hidden Valley Trails со coords
  {
    id: 401,
    name: 'Радика Долина',
    distance: '6.7 km',
    duration: '2h 30m',
    altitude: '1,200m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Патека низ мистичната долина на реката Радика.',
    coords: [[41.61, 20.60], [41.62, 20.62], [41.63, 20.64]]
  },
  {
    id: 402,
    name: 'Мавровска Долина',
    distance: '8.2 km',
    duration: '3h 10m',
    altitude: '1,450m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Прошетка низ Мавровската долина со погледи кон езерото.',
    coords: [[41.70, 20.75], [41.71, 20.76], [41.72, 20.77]]
  },
  {
    id: 403,
    name: 'Демир Капија Долина',
    distance: '5.5 km',
    duration: '2h 00m',
    altitude: '900m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    description: 'Долина со уникатни карпести формации и вински лозја.',
    coords: [[41.41, 22.25], [41.42, 22.26], [41.43, 22.27]]
  },
  {
    id: 404,
    name: 'Треска Долина',
    distance: '4.8 km',
    duration: '1h 40m',
    altitude: '850m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Патека покрај реката Треска со мирна атмосфера.',
    coords: [[41.95, 21.30], [41.96, 21.31], [41.97, 21.32]]
  },
  {
    id: 405,
    name: 'Кратовска Долина',
    distance: '6.2 km',
    duration: '2h 15m',
    altitude: '950m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
    description: 'Долина со камени мостови и средновековни кули.',
    coords: [[42.08, 22.18], [42.09, 22.19], [42.10, 22.20]]
  },
  {
    id: 406,
    name: 'Преспанска Долина',
    distance: '7.4 km',
    duration: '2h 50m',
    altitude: '1,000m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Патека низ долината покрај Преспанското Езеро.',
    coords: [[40.90, 21.05], [40.91, 21.06], [40.92, 21.07]]
  },
  {
    id: 407,
    name: 'Козјачка Долина',
    distance: '5.9 km',
    duration: '2h 10m',
    altitude: '1,100m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
    description: 'Долина со погледи кон Козјачкото Езеро.',
    coords: [[41.95, 21.95], [41.96, 21.96], [41.97, 21.97]]
  },
  {
    id: 408,
    name: 'Смилевска Долина',
    distance: '3.8 km',
    duration: '1h 20m',
    altitude: '780m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Кратка патека низ зелената долина кај Смилево.',
    coords: [[41.28, 21.20], [41.29, 21.21], [41.30, 21.22]]
  },
  {
    id: 409,
    name: 'Кумановска Долина',
    distance: '9.1 km',
    duration: '3h 30m',
    altitude: '1,300m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Долга патека низ долината кај Куманово.',
    coords: [[42.14, 21.72], [42.15, 21.73], [42.16, 21.74]]
  },
  {
    id: 410,
    name: 'Кичевска Долина',
    distance: '7.0 km',
    duration: '2h 40m',
    altitude: '1,050m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Патека низ долината кај Кичево.',
    coords: [[41.51, 20.95], [41.52, 20.96], [41.53, 20.97]]
  },
  {
    id: 411,
    name: 'Галичичка Долина',
    distance: '8.5 km',
    duration: '3h 20m',
    altitude: '1,500m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Алпска долина во срцето на Галичица.',
    coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
  },
  {
    id: 412,
    name: 'Поречка Долина',
    distance: '7.6 km',
    duration: '2h 50m',
    altitude: '1,120m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Патека низ живописната Поречка долина, со мали водопади и традиционални камени куќи.',
    coords: [[41.74, 21.05], [41.75, 21.06], [41.76, 21.07]]
  },

  // Sunset Views со coords
  {
    id: 501,
    name: 'Охрид Зајдисонце',
    distance: '4.2 km',
    duration: '1h 30m',
    altitude: '750m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Патека покрај Охридското Езеро со спектакуларен зајдисонце.',
    coords: [[41.11, 20.80], [41.12, 20.81], [41.13, 20.82]]
  },
  {
    id: 502,
    name: 'Преспа Зајдисонце',
    distance: '5.0 km',
    duration: '2h 00m',
    altitude: '800m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
    description: 'Прошетка покрај Преспанското Езеро со мирни бои на зајдисонце.',
    coords: [[40.90, 21.05], [40.91, 21.06], [40.92, 21.07]]
  },
  {
    id: 503,
    name: 'Козјак Зајдисонце',
    distance: '6.1 km',
    duration: '2h 20m',
    altitude: '1,100m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Патека со погледи кон Козјак и зајдисонце над планините.',
    coords: [[41.95, 21.95], [41.96, 21.96], [41.97, 21.97]]
  },
  {
    id: 504,
    name: 'Водно Зајдисонце',
    distance: '3.5 km',
    duration: '1h 10m',
    altitude: '1,066m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Кратка патека на Водно со поглед кон Скопје при зајдисонце.',
    coords: [[41.95, 21.43], [41.96, 21.44], [41.97, 21.45]]
  },
  {
    id: 505,
    name: 'Галичица Зајдисонце',
    distance: '7.8 km',
    duration: '3h 00m',
    altitude: '1,600m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Патека со погледи кон Охрид и Преспа при зајдисонце.',
    coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
  },
  {
    id: 506,
    name: 'Кратово Зајдисонце',
    distance: '4.0 km',
    duration: '1h 20m',
    altitude: '900m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Патека со погледи кон средновековните кули на Кратово.',
    coords: [[42.08, 22.18], [42.09, 22.19], [42.10, 22.20]]
  },
  {
    id: 507,
    name: 'Берово Зајдисонце',
    distance: '5.6 km',
    duration: '2h 10m',
    altitude: '1,050m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
    description: 'Патека со погледи кон Беровското Езеро при зајдисонце.',
    coords: [[41.70, 22.85], [41.71, 22.86], [41.72, 22.87]]
  },
  {
    id: 508,
    name: 'Крушево Зајдисонце',
    distance: '6.3 km',
    duration: '2h 30m',
    altitude: '1,350m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    description: 'Патека со погледи кон највисокиот град во Македонија.',
    coords: [[41.37, 21.25], [41.38, 21.26], [41.39, 21.27]]
  },
  {
    id: 509,
    name: 'Струга Зајдисонце',
    distance: '4.7 km',
    duration: '1h 40m',
    altitude: '780m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
    description: 'Патека покрај реката Црн Дрим со зајдисонце над езерото.',
    coords: [[41.18, 20.68], [41.19, 20.69], [41.20, 20.70]]
  },
  {
    id: 510,
    name: 'Куманово Зајдисонце',
    distance: '5.9 km',
    duration: '2h 15m',
    altitude: '950m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Патека со погледи кон полињата кај Куманово при зајдисонце.',
    coords: [[42.14, 21.72], [42.15, 21.73], [42.16, 21.74]]
  },
  {
    id: 511,
    name: 'Штип Зајдисонце',
    distance: '3.8 km',
    duration: '1h 20m',
    altitude: '820m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Кратка патека со погледи кон Штип и околните ридови.',
    coords: [[41.74, 22.20], [41.75, 22.21], [41.76, 22.22]]
  },
  {
    id: 512,
    name: 'Гостивар Зајдисонце',
    distance: '6.5 km',
    duration: '2h 40m',
    altitude: '1,200m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Патека со погледи кон Полошката котлина и зајдисонце над Шар Планина.',
    coords: [[41.80, 20.90], [41.81, 20.91], [41.82, 20.92]]
  },

  // Forest Walks со coords
  {
    id: 601,
    name: 'Водно Шумска Патека',
    distance: '3.5 km',
    duration: '1h 20m',
    altitude: '950m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Кратка прошетка низ шумите на Водно.',
    coords: [[41.95, 21.43], [41.96, 21.44], [41.97, 21.45]]
  },
  {
    id: 602,
    name: 'Пелистер Шумска Патека',
    distance: '7.8 km',
    duration: '3h 40m',
    altitude: '1,600m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Патека низ густи шуми во Националниот парк Пелистер.',
    coords: [[40.99, 21.20], [41.00, 21.21], [41.01, 21.22]]
  },
  {
    id: 603,
    name: 'Шар Планина Шумска Патека',
    distance: '9.2 km',
    duration: '4h 10m',
    altitude: '1,800m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Долга патека низ алпски шуми на Шар Планина.',
    coords: [[42.12, 20.95], [42.13, 20.96], [42.14, 20.97]]
  },
  {
    id: 604,
    name: 'Маврово Шумска Патека',
    distance: '6.4 km',
    duration: '2h 30m',
    altitude: '1,200m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Патека низ шумите околу Мавровското Езеро.',
    coords: [[41.70, 20.75], [41.71, 20.76], [41.72, 20.77]]
  },
  {
    id: 605,
    name: 'Галичица Шумска Патека',
    distance: '5.7 km',
    duration: '2h 15m',
    altitude: '1,300m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
    description: 'Прошетка низ густи шуми на Галичица.',
    coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
  },
  {
    id: 606,
    name: 'Осогово Шумска Патека',
    distance: '8.1 km',
    duration: '3h 20m',
    altitude: '1,500m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Патека низ шумите на Осоговските Планини.',
    coords: [[42.15, 22.45], [42.16, 22.46], [42.17, 22.47]]
  },
  {
    id: 607,
    name: 'Јабланица Шумска Патека',
    distance: '4.9 km',
    duration: '1h 50m',
    altitude: '1,100m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
    description: 'Кратка патека низ шумите на Јабланица.',
    coords: [[41.25, 20.55], [41.26, 20.56], [41.27, 20.57]]
  },
  {
    id: 608,
    name: 'Стогово Шумска Патека',
    distance: '7.3 km',
    duration: '3h 00m',
    altitude: '1,400m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    description: 'Патека низ густи шуми на Стогово.',
    coords: [[41.55, 20.55], [41.56, 20.56], [41.57, 20.57]]
  },
  {
    id: 609,
    name: 'Кожуф Шумска Патека',
    distance: '6.0 km',
    duration: '2h 20m',
    altitude: '1,250m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Патека низ шумите на Кожуф Планина.',
    coords: [[41.15, 22.00], [41.16, 22.01], [41.17, 22.02]]
  },
  {
    id: 610,
    name: 'Славеј Планина Шумска Патека',
    distance: '5.2 km',
    duration: '2h 00m',
    altitude: '1,050m',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Прошетка низ шумите на Славеј Планина.',
    coords: [[41.40, 21.90], [41.41, 21.91], [41.42, 21.92]]
  },
  {
    id: 611,
    name: 'Караорман Шумска Патека',
    distance: '8.7 km',
    duration: '3h 30m',
    altitude: '1,600m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Долга патека низ густи шуми на Караорман.',
    coords: [[41.55, 20.65], [41.56, 20.66], [41.57, 20.67]]
  },
  {
    id: 612,
    name: 'Сува Гора Шумска Патека',
    distance: '7.5 km',
    duration: '3h 10m',
    altitude: '1,350m',
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Патека низ шумите на Сува Гора.',
    coords: [[41.74, 21.05], [41.75, 21.06], [41.76, 21.07]]
  },

  // Expert Challenges со coords
  {
    id: 701,
    name: 'Короб Врв',
    distance: '15.3 km',
    duration: '6h 30m',
    altitude: '2,764m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
    description: 'Највисокиот врв во Македонија – предизвик за искусни планинари.',
    coords: [[41.79, 20.55], [41.80, 20.56], [41.81, 20.57]]
  },
  {
    id: 702,
    name: 'Пелистер Големо Езеро',
    distance: '14.2 km',
    duration: '6h 00m',
    altitude: '2,200m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Екстремна рута до Големото Езеро на Пелистер.',
    coords: [[40.99, 21.20], [41.00, 21.21], [41.01, 21.22]]
  },
  {
    id: 703,
    name: 'Шар Планина Алпски Врвови',
    distance: '18.0 km',
    duration: '7h 30m',
    altitude: '2,747m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Долга и предизвикувачка рута низ алпските врвови на Шар Планина.',
    coords: [[42.12, 20.95], [42.13, 20.96], [42.14, 20.97]]
  },
  {
    id: 704,
    name: 'Јабланица Врв',
    distance: '13.5 km',
    duration: '5h 40m',
    altitude: '2,200m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
    description: 'Предизвикувачка рута до врвот на Јабланица.',
    coords: [[41.25, 20.55], [41.26, 20.56], [41.27, 20.57]]
  },
  {
    id: 705,
    name: 'Осогово Врв Руен',
    distance: '16.2 km',
    duration: '6h 50m',
    altitude: '2,252m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
    description: 'Долга рута до највисокиот врв на Осогово – Руен.',
    coords: [[42.15, 22.45], [42.16, 22.46], [42.17, 22.47]]
  },
  {
    id: 706,
    name: 'Стогово Врв',
    distance: '14.8 km',
    duration: '6h 10m',
    altitude: '2,320m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'Алпска рута до врвот на Стогово.',
    coords: [[41.55, 20.55], [41.56, 20.56], [41.57, 20.57]]
  },
  {
    id: 707,
    name: 'Кожуф Врв Зелен Брег',
    distance: '12.9 km',
    duration: '5h 20m',
    altitude: '2,171m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Предизвикувачка патека до Зелен Брег на Кожуф.',
    coords: [[41.15, 22.00], [41.16, 22.01], [41.17, 22.02]]
  },
  {
    id: 708,
    name: 'Галичица Врв Магаро',
    distance: '11.7 km',
    duration: '4h 50m',
    altitude: '2,254m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600',
    description: 'Рута до врвот Магаро со погледи кон Охрид и Преспа.',
    coords: [[40.95, 20.85], [40.96, 20.86], [40.97, 20.87]]
  },
  {
    id: 709,
    name: 'Сува Гора Врв',
    distance: '13.2 km',
    duration: '5h 30m',
    altitude: '1,850m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    description: 'Долга рута низ Сува Гора до највисоките точки.',
    coords: [[41.74, 21.05], [41.75, 21.06], [41.76, 21.07]]
  },
  {
    id: 710,
    name: 'Караорман Врв',
    distance: '12.5 km',
    duration: '5h 00m',
    altitude: '1,900m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600',
    description: 'Предизвикувачка патека низ Караорманските шуми до врвот.',
    coords: [[41.55, 20.65], [41.56, 20.66], [41.57, 20.67]]
  },
  {
    id: 711,
    name: 'Славеј Планина Врв',
    distance: '10.8 km',
    duration: '4h 30m',
    altitude: '1,700m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'Рута до врвот на Славеј Планина.',
    coords: [[41.40, 21.90], [41.41, 21.91], [41.42, 21.92]]
  },
  {
    id: 712,
    name: 'Беласица Врв Тумба',
    distance: '15.0 km',
    duration: '6h 20m',
    altitude: '1,880m',
    difficulty: 'Hard',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
    description: 'Екстремна рута до врвот Тумба на Беласица.',
    coords: [[41.36, 22.90], [41.37, 22.91], [41.38, 22.92]]
  }
]

const idFromRoute = parseInt(route.params.id) || 1
const foundTrail = trailsDatabase.find(t => t.id === idFromRoute) || trailsDatabase[0]
const currentTrail = ref(foundTrail)
const arrivalMode = ref('walk')
const arrivalDistance = ref(null)
let activeMap
let locationMarker
let positionWatchId
let routeToStartLayer
let currentPosition = null
let lastArrivalRequest = 0

onMounted(async () => {
  await nextTick()

  const mapContainer = document.getElementById('map')
  if (!mapContainer) {
    console.error("Грешка: Не е пронајден '#map' елементот во DOM-от!")
    return
  }

  try {
    activeMap = L.map('map').setView(currentTrail.value.coords[0], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(activeMap)

    L.marker(currentTrail.value.coords[0])
        .addTo(activeMap)

    L.polyline(currentTrail.value.coords, {
      color: '#f26522',
      weight: 6,
      opacity: 0.9
    }).addTo(activeMap)
    routeToStartLayer = L.polyline([], {
      color: '#60a5fa',
      weight: 4,
      opacity: 0.95,
      dashArray: '7 11'
    }).addTo(activeMap)

    const bounds = L.polyline(currentTrail.value.coords).getBounds()
    activeMap.fitBounds(bounds, { padding: [40, 40] })

    locationMarker = L.circleMarker(currentTrail.value.coords[0], {
      radius: 5,
      color: '#ffffff',
      weight: 2,
      fillColor: '#2563eb',
      fillOpacity: 1
    }).addTo(activeMap)
    // Keep a visible blue position marker at the trail start until GPS resolves.
    locationMarker.setStyle({ opacity: 1, fillOpacity: 1 })
    if (navigator.geolocation) {
      positionWatchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const position = [coords.latitude, coords.longitude]
          currentPosition = position
          locationMarker.setLatLng(position).setStyle({ opacity: 1, fillOpacity: 1 })
          loadArrivalRoute(position)
        },
        () => locationMarker.setStyle({ opacity: 1, fillOpacity: 1 }),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      )
    }

  } catch (error) {
    console.error("Грешка при иницијализација на Leaflet:", error)
  }
})

onBeforeUnmount(() => {
  if (positionWatchId !== undefined) navigator.geolocation?.clearWatch(positionWatchId)
  if (activeMap) activeMap.remove()
})

const goBack = () => {
  router.push('/trails')
}

const planCustomRoute = () => {
  saveData('routePlannerTrail', currentTrail.value)
  router.push({
    path: '/route-planner',
    query: { trail: String(currentTrail.value.id) }
  })
}

function setArrivalMode(mode) {
  arrivalMode.value = mode
  if (currentPosition) loadArrivalRoute(currentPosition, true)
}

async function loadArrivalRoute(position, force = false) {
  const now = Date.now()
  if (!force && now - lastArrivalRequest < 10000) return
  lastArrivalRequest = now

  const profile = arrivalMode.value === 'car' ? 'driving' : 'foot'
  const [targetLatitude, targetLongitude] = currentTrail.value.coords[0]
  arrivalDistance.value = haversineDistance(position, currentTrail.value.coords[0])
  routeToStartLayer.setLatLngs([position, currentTrail.value.coords[0]]).bringToFront()

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${profile}/${position[1]},${position[0]};${targetLongitude},${targetLatitude}?overview=full&geometries=geojson`
    )
    if (!response.ok) throw new Error(`OSRM одговори со ${response.status}`)
    const data = await response.json()
    const selectedRoute = data.routes?.[0]
    if (!selectedRoute) throw new Error('OSRM не врати рута')

    arrivalDistance.value = selectedRoute.distance / 1000
    routeToStartLayer.setLatLngs(
      selectedRoute.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude])
    ).bringToFront()
  } catch (error) {
    console.warn('Неуспешно вчитување на рутата до почетокот:', error)
  }
}

function haversineDistance(first, second) {
  const earthRadius = 6371
  const latDistance = (second[0] - first[0]) * Math.PI / 180
  const lngDistance = (second[1] - first[1]) * Math.PI / 180
  const latitude = first[0] * Math.PI / 180
  const secondLatitude = second[0] * Math.PI / 180
  const value = Math.sin(latDistance / 2) ** 2 +
    Math.cos(latitude) * Math.cos(secondLatitude) * Math.sin(lngDistance / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

function formatDistance(distance) {
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
}

function formatArrivalTime(distance, mode) {
  const speed = mode === 'car' ? 45 : 3.5
  const minutes = Math.max(1, Math.round((distance / speed) * 60))
  return minutes < 60 ? `${minutes} мин` : `${Math.floor(minutes / 60)} ч ${minutes % 60} мин`
}
</script>

<style scoped>
/* ОСНОВЕН КОНТЕЈНЕР */
.trail-detail-container {
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at top left, #0f172a, #050814) !important;
  color: #ffffff !important;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.detail-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* НЕОН GLASSMORPHISM ЕФЕКТ */
.glass {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ЛЕВА СТРАНА (ИНФОРМАЦИИ) */
.info-side {
  width: 40%;
  min-width: 460px;
  max-width: 550px;
  padding: 2.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  z-index: 10;
}

.back-link {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  transition: color 0.2s;
}

.back-link:hover {
  color: #f26522;
}

.trail-title {
  font-size: 2.4rem;
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.trail-hero-wrapper {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.trail-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.trail-hero-wrapper:hover .trail-hero-image {
  transform: scale(1.03);
}

.difficulty-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.difficulty-badge.easy { background: #22c55e; color: white; }
.difficulty-badge.medium { background: #eab308; color: black; }
.difficulty-badge.hard { background: #ef4444; color: white; }

/* КАРТИЧКИ ЗА СПЕЦИФИКАЦИИ */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin-bottom: 2rem;
}

.spec-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 1rem 0.75rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: border-color 0.2s;
}

.spec-card:hover {
  border-color: rgba(242, 101, 34, 0.3);
}

.spec-icon {
  font-size: 1.4rem;
}

.spec-meta {
  display: flex;
  flex-direction: column;
}

.spec-label {
  color: #64748b;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

.spec-value {
  font-weight: 800;
  font-size: 1rem;
  margin: 0;
  color: #f8fafc;
}

/* ОПИС */
.description-section h3 {
  margin-top: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 0.75rem;
}

.description-text {
  color: #94a3b8;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

/* ПЛАНЕР НА РУТИ */
.route-planner-box {
  background: linear-gradient(135deg, rgba(242, 101, 34, 0.12), rgba(242, 101, 34, 0.02));
  border: 1px solid rgba(242, 101, 34, 0.25);
  padding: 1.25rem;
  border-radius: 16px;
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.planner-icon {
  font-size: 1.8rem;
}

.planner-content h4 {
  color: #f26522;
  margin: 0 0 0.35rem 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.planner-content p {
  font-size: 0.85rem;
  color: #cbd5e1;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.plan-btn {
  background: #f26522;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(242, 101, 34, 0.25);
}

.plan-btn:hover {
  background: #ff7637;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(242, 101, 34, 0.4);
}

/* ДЕСНА СТРАНА (МАПА) */
.map-side {
  flex: 1;
  padding: 2.5rem;
  background: #060b13;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-wrapper {
  width: 100%;
  height: 88vh;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.map-header {
  padding: 1.2rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.map-icon { font-size: 1.1rem; }
.map-header h3 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #f8fafc; }

/* ПУЛСИРАЧКИ GPS ИНДИКАТОР */
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background-color: #4ade80;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(74, 222, 128, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

/* FIX ЗА MAP BOX */
.map-box {
  width: 100% !important;
  height: 100% !important;
  flex: 1;
}

.arrival-panel {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 500;
  width: min(260px, calc(100% - 2rem));
  padding: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  background: rgba(8, 15, 28, 0.94);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
}

.arrival-heading {
  color: #f8fafc;
  font-size: 0.82rem;
  font-weight: 800;
}

.arrival-modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  margin-top: 0.65rem;
}

.arrival-modes button {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  cursor: pointer;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 700;
}

.arrival-modes button.active {
  border-color: #f26522;
  background: #f26522;
  color: white;
}

.arrival-details {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.65rem;
  color: #e2e8f0;
  font-size: 0.78rem;
  font-weight: 700;
}

.arrival-status {
  margin: 0.65rem 0 0;
  color: #94a3b8;
  font-size: 0.75rem;
  line-height: 1.35;
}

/* Стилизирање на скролерот на левата страна */
.info-side::-webkit-scrollbar {
  width: 6px;
}
.info-side::-webkit-scrollbar-track {
  background: transparent;
}
.info-side::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.info-side::-webkit-scrollbar-thumb:hover {
  background: rgba(242, 101, 34, 0.4);
}
</style>