# Wayne Industries Executive Command Hub
### CSI 3150 W26 — Final Project | Option 1: Smart Productivity Hub

**Name:** Stefan Josevski

**Live App URL:** *(wayne-hub-henna.vercel.app)*

**GitHub Repository URL:** *(https://github.com/StefanJosevski/wayne-hub)*

---

## 1. Technical Report & User Manual

### 1.1 Project Overview

The Wayne Industries Executive Command Hub is a personalized executive dashboard styled as Bruce Wayne's real-time command center. It aggregates live weather intelligence, a live news feed, a persistent to-do list, and daily quotes into a unified dark-mode interface with a Gotham City aesthetic. The app solves the problem of scattered information by centralizing live data streams, personal task management, and external API feeds into a single, filterable command panel.

---

### 1.2 Component Architecture

- **App.js** — Root component. Holds global state for `darkMode` (persisted to localStorage), `bgUrl` (persisted to localStorage), `coords` (geolocation), `searchQuery` (global search), and `activeSection` (nav tab). Passes `searchQuery` and `coords` down as props.

- **Clock.js** — Uses `useEffect` with `setInterval` (1000ms) to maintain a live-updating time and date display. Implements a **cleanup function** (`return () => clearInterval(interval)`) to prevent memory leaks when the component unmounts.

- **WeatherWidget.js** — Receives `coords` from App.js. Uses `useEffect` to watch for geolocation coordinates and auto-fetch weather. Fetches from the OpenWeatherMap API (`/data/2.5/weather`) by city name or lat/lon coordinates. Displays temperature, description, humidity, wind speed, and visibility. Full error and loading state management.

- **NewsWidget.js** — Fetches top headlines from NewsAPI (`/v2/top-headlines`) by category (Technology, Business, Science, General). Receives `searchQuery` from App.js and filters articles in real-time. Implements loading spinners and error messages.

- **TodoWidget.js** — Receives `searchQuery` for real-time filtering. Reads initial state from `localStorage` (`JSON.parse(localStorage.getItem('wayne-hub-todos'))`). Uses `useEffect` to sync to localStorage on every state change. Supports adding, completing, deleting, and filtering tasks (All / Active / Done).

- **QuoteWidget.js** — Fetches a random quote from ZenQuotes API (via allorigins proxy for CORS). Falls back to local curated quotes if the API is unavailable.

- **SearchBar.js** — Controlled input component. Lifts `searchQuery` state up to App.js via `setSearchQuery` prop, enabling cross-widget filtering.

---

### 1.3 Detailed Functionality

**Feature 1 — The Active Clock (setInterval + cleanup):**
Clock.js runs a `setInterval(() => setTime(new Date()), 1000)` inside `useEffect`. The effect returns a cleanup function `() => clearInterval(interval)` that fires when the component unmounts, preventing memory leaks. The clock updates every second and displays hours, minutes, seconds, and full date.

**Feature 2 — Dual API Integration:**
- **WeatherWidget** fetches from `https://api.openweathermap.org/data/2.5/weather`. From the JSON response, it extracts `main.temp`, `main.feels_like`, `main.humidity`, `wind.speed`, `visibility`, `weather[0].description`, and `name` (city).
- **NewsWidget** fetches from `https://newsapi.org/v2/top-headlines`. It extracts `articles[].title`, `articles[].source.name`, `articles[].publishedAt`, and `articles[].url`.
- **QuoteWidget** fetches from `https://zenquotes.io/api/random` (no key required). Extracts `[0].q` (quote) and `[0].a` (author).

**Feature 3 — State Persistence (localStorage):**
- `darkMode` is saved on every change: `localStorage.setItem('wayne-darkmode', JSON.stringify(darkMode))`. Retrieved on first render via the `useState` initializer function.
- `bgUrl` (custom background) is saved: `localStorage.setItem('wayne-bg', bgUrl)`.
- `todos` are saved on every change: `localStorage.setItem('wayne-hub-todos', JSON.stringify(todos))`. Retrieved with `JSON.parse(localStorage.getItem('wayne-hub-todos'))` in the initializer.

**Feature 4 — Global Real-Time Search:**
A single `searchQuery` string is stored in App.js state and passed as a prop to both `NewsWidget` and `TodoWidget`. Each component independently filters its data using `.filter()` with `.toLowerCase().includes(searchQuery.toLowerCase())`. Filtering is instant with no debounce — every keystroke updates results.

**Feature 5 — Geolocation (Advanced):**
App.js calls `navigator.geolocation.getCurrentPosition()` on mount and stores coordinates in state. The `coords` object (`{ lat, lon }`) is passed to WeatherWidget, which auto-fetches weather via the coordinates endpoint when coords are available and the geo button is clicked.

**Feature 6 — Custom Background (Advanced):**
A URL input in the search row allows the user to override the dashboard background with any image URL. The URL is applied as an inline `backgroundImage` style and persisted to localStorage.

---

### 1.4 User Manual

**Step 1 — Starting the App:**
Open the live URL. The dashboard loads with a dark Gotham-themed interface. Allow location access if prompted to enable automatic weather detection.

**Step 2 — Weather Intel:**
In the "Atmospheric Intel" panel, type a city name and click "SCAN" (or press Enter). Click the green ◎ button to auto-detect your location. Weather data including temperature, humidity, and wind speed will populate.

**Step 3 — News Feed:**
The "Intel Feed" panel loads top headlines automatically. Click TECH / FINANCE / SCIENCE / GENERAL to switch categories. Use the ↻ button to refresh. Type in the global search bar to filter headlines in real time.

**Step 4 — Directives (To-Do List):**
Type a task in the "DIRECTIVES" panel and press Enter or click +. Click the checkbox to mark complete. Click ✕ to delete. Use ALL / ACTIVE / DONE filters to view subsets. Data persists on page refresh.

**Step 5 — Customization:**
- Click ◐ NIGHT / ☀ DAY to toggle light/dark mode (persisted).
- Paste an image URL in the background input and click APPLY to set a custom background (persisted). Click RESET to clear.
- Use the top nav (ALL SYSTEMS / INTEL FEED / OPERATIONS) to show/hide widget groups.

---

## 2. Technical Challenges & Solutions

**Challenge — CORS with ZenQuotes API:**
ZenQuotes does not allow direct browser requests due to CORS policy. A direct `fetch('https://zenquotes.io/...')` would fail with a CORS error. The solution was to route the request through `api.allorigins.win`, a free CORS proxy: `fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'))`. The response is a JSON wrapper, so `JSON.parse(wrapper.contents)` extracts the actual data. A fallback array of curated quotes was also added so the widget never fails completely.

**Challenge — useEffect dependency arrays:**
Early versions of WeatherWidget triggered infinite re-fetch loops because `fetchWeatherByCoords` was defined inside the component and listed as a dependency. This caused the effect to re-run every render since the function reference changed. The fix was to either move fetch logic into the effect directly or use `useCallback`. Understanding that functions re-create on every render unless memoized was a key React insight.

---

## 3. Demo Video Link

**URL:** *()*

---

## Setup Instructions (Local Development)

```bash
# 1. Clone the repo
git clone https://github.com/StefanJosevski/wayne-hub.git
cd wayne-hub

# 2. Install dependencies
npm install

# 3. Add your API keys in:
#    src/components/WeatherWidget.js 
#    src/components/NewsWidget.js     
# 4. Start the development server
npm start
```

**API Keys needed (free tier):**
- OpenWeatherMap: https://openweathermap.org/api
- NewsAPI: https://newsapi.org/

**Deploying to Vercel:**
1. Push code to GitHub
2. Visit vercel.com → New Project → Import your repo
3. Vercel auto-detects Create React App and deploys
4. My URL: `https://wayne-hub-henna.vercel.app/`

---

## Folder Structure

```
wayne-hub/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Clock.js          ← Live clock with setInterval cleanup
│   │   ├── WeatherWidget.js  ← OpenWeatherMap API + Geolocation
│   │   ├── NewsWidget.js     ← NewsAPI + real-time search filter
│   │   ├── TodoWidget.js     ← localStorage persistence + filters
│   │   ├── QuoteWidget.js    ← ZenQuotes API with fallback
│   │   └── SearchBar.js      ← Controlled search input
│   ├── App.js                ← Root: global state, layout, dark mode
│   ├── App.css               ← Wayne Industries design system
│   └── index.js              ← ReactDOM entry point
├── package.json
└── README.md
```
