# SummitQuest

SummitQuest е веб-апликација наменета за корисници кои сакаат да истражуваат планинарски патеки, да планираат рути и да го следат своето искуство преку интерактивни мапи, предизвици и систем на достигнувања.

Проектот е поделен на два главни дела: Vue frontend и ASP.NET Core backend.

## Главни функционалности

Апликацијата овозможува:

- регистрација и најава на корисници;
- кориснички профил;
- преглед и истражување на планинарски патеки;
- детални информации за избрана патека;
- интерактивна мапа и следење на активна патека;
- планирање рута;
- дневни предизвици;
- достигнувања и беџови;
- community функционалности;
- trail matching;
- Vibe Check оценки и рецензии;
- Eco Reports;
- приказ на временски услови;
- фотографии и информации поврзани со планинарски локации.

## Технологии

### Frontend

Frontend делот е изработен со:

- Vue.js
- Vite
- Vue Router
- Axios
- Leaflet
- HTML
- CSS
- JavaScript

### Backend

Backend делот е изработен со:

- C#
- ASP.NET Core
- .NET 8
- REST API

## Мапи и надворешни сервиси

Во проектот се користат повеќе сервиси поврзани со мапи и локации.

**Leaflet и OpenStreetMap** се користат за интерактивен приказ на мапи и географски локации.

**Google Maps** се користи во делот за планирање рута, со можности за избор на почетна и крајна локација, пресметување рута и приказ на информации за растојание и време.

**Open-Meteo API** се користи за приказ на тековни временски услови.

За дел од локациите се користат и фотографии од **Wikimedia Commons**.

## Структура на проектот

```text
SummitQuest
│
├── backend
│   └── SummitQuest.Api
│       ├── Models
│       ├── Properties
│       ├── Program.cs
│       └── SummitQuest.Api.csproj
│
├── frontend
│   └── summit-quest-vue
│       ├── src
│       │   ├── assets
│       │   ├── components
│       │   ├── img
│       │   ├── router
│       │   ├── services
│       │   ├── views
│       │   ├── App.vue
│       │   └── main.js
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── Dokumentacija
├── README.md
└── .gitignore
```

## Frontend

Frontend апликацијата се наоѓа во:

```text
frontend/summit-quest-vue
```

За стартување:

```bash
cd frontend/summit-quest-vue
npm install
npm run dev
```

Потоа апликацијата може да се отвори преку адресата што ќе ја прикаже Vite во терминалот, вообичаено:

```text
http://localhost:5173
```

## Backend

Backend API се наоѓа во:

```text
backend/SummitQuest.Api
```

За стартување:

```bash
cd backend/SummitQuest.Api
dotnet run --urls http://localhost:5080
```

## Главни страници

Во апликацијата се достапни следните рути:

```text
/login                 Најава
/signup                Регистрација
/forgot-password       Заборавена лозинка
/home                  Почетна страница
/explore               Истражување содржини
/trails                Планинарски патеки
/trail/:id             Детали за патека
/map                    Мапа
/map/:id                Активна патека
/route-planner          Планирање рута
/quests                 Предизвици
/achievements           Достигнувања
/community              Community
/social                 Social
/eco                    Eco Reports
/profile                Кориснички профил
/globe                  Интерактивна мапа
/collection/:id         Детали за колекција
/category/:id           Детали за категорија
```

## Google Maps конфигурација

За функционалностите што користат Google Maps потребен е API key.

Во:

```text
frontend/summit-quest-vue
```

се креира локален `.env` фајл со:

```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Во проектот е вклучен `.env.example` како пример за потребната конфигурација.

## Документација

Подеталната техничка документација на проектот е сместена во папката:

```text
Dokumentacija
```

## Стартување на целиот проект

Потребни се два терминали.

Во првиот терминал:

```bash
cd backend/SummitQuest.Api
dotnet run --urls http://localhost:5080
```

Во вториот терминал:

```bash
cd frontend/summit-quest-vue
npm install
npm run dev
```

Потоа frontend апликацијата може да се отвори во browser преку локалната Vite адреса.
