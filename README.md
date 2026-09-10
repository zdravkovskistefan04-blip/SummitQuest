# Summit Quest COMPLETE

Ова е целосна верзија за проектот:

- Login page
- Home Dashboard
- Trails page
- Smart Map / Active Trail
- Daily Quests
- Achievements / Badges
- Community
- Trail Matching
- Vibe-Check Reviews
- Eco Reports
- Profile
- C# backend без база
- Vue frontend

## Backend

```bash
cd backend/SummitQuest.Api
dotnet run --urls http://localhost:5080
```

## Frontend

Во втор terminal:

```bash
cd frontend/summit-quest-vue
npm.cmd install
npm.cmd run dev
```

Отвори:

```text
http://localhost:5173
```

## Страници

```text
/              Login
/home          Home Dashboard
/trails        Trails
/map/1         Smart Map / Active Trek
/quests        Daily Quests
/achievements  Badges
/community     Trail Matching + Vibe-Check
/eco           Eco Reports
/profile       User Profile
```

## Без база

Податоците се во backend во `Program.cs`, како C# in-memory lists.

## Real 3D world map

New page:

```text
/globe
```

This page uses CesiumJS from CDN for a real 3D planet map.

To enable real global terrain:

1. Create a free Cesium ion account.
2. Copy your access token.
3. Open:

```text
frontend/summit-quest-vue/src/services/cesiumConfig.js
```

4. Replace:

```text
PASTE_YOUR_CESIUM_ION_TOKEN_HERE
```

with your real token.

Then run frontend again:

```bash
npm.cmd run dev
```

## Fixed real map

The `/globe` page now uses OpenStreetMap + Leaflet from CDN.

It does NOT need a Cesium token.

Open:

```text
http://localhost:5173/globe
```

Click:
- Shar Mountain
- Pelister
- Everest
- 3D / 2D
- Hide route / Show route

## Google Maps route planner

New working page:

```text
/route-planner
```

Features:
- Google Maps inside the app
- Search start location
- Search destination
- Click map to choose start/end
- Generate walking route
- Draw route on map
- Distance, time, XP and difficulty calculation
- START TREK button

Before using it, add your Google Maps API key in a local `.env` file:

```text
frontend/summit-quest-vue/.env
```

Add:

```text
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Keep `.env` private and do not commit it. A starter file is available at
`frontend/summit-quest-vue/.env.example`.

Enable these Google APIs:
- Maps JavaScript API
- Directions API
- Places API
- Geocoding API

Then restart frontend:

```bash
npm.cmd run dev
```

## Mountain photos and live weather

Trail photos are matched to real North Macedonian locations (Vodno, Pelister,
Shar Mountain, Korab, Galičica, Matka and Mavrovo) from Wikimedia Commons.
The dashboard and route planner load current conditions for Vodno from the
Open-Meteo API and show the measured temperature, condition, wind and update
time instead of a hard-coded forecast.
