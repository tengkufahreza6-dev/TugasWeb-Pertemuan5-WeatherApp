// ============================================
// UI MODULE - DOM MANIPULATION, MAP & RENDER
// ============================================

let map = null;
let mapMarker = null;

const elements = {
  weatherCard: document.getElementById('weather-card'),
  loadingSpinner: document.getElementById('loading-spinner'),
  errorMessage: document.getElementById('error-message'),
  errorText: document.getElementById('error-text'),
  cityName: document.getElementById('city-name'),
  weatherDate: document.getElementById('weather-date'),
  weatherIcon: document.getElementById('weather-icon'),
  temperature: document.getElementById('temperature'),
  tempUnit: document.getElementById('temp-unit'),
  weatherDescription: document.getElementById('weather-description'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  feelsLike: document.getElementById('feels-like'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  sunTimes: document.getElementById('sun-times'),
  historyContainer: document.getElementById('history-container'),
  historyTags: document.getElementById('history-tags')
};

const showLoading = () => {
  elements.weatherCard.classList.add('hidden');
  elements.errorMessage.classList.add('hidden');
  elements.loadingSpinner.classList.remove('hidden');
};

const showError = (message) => {
  elements.weatherCard.classList.add('hidden');
  elements.loadingSpinner.classList.add('hidden');
  elements.errorText.textContent = message;
  elements.errorMessage.classList.remove('hidden');
};

const formatDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('id-ID', options);
};

const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const updateDynamicBackground = (weatherMain) => {
  const body = document.body;
  body.className = '';

  const condition = weatherMain.toLowerCase();

  if (condition.includes('clear')) {
    body.classList.add('theme-clear');
  } else if (condition.includes('cloud')) {
    body.classList.add('theme-clouds');
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    body.classList.add('theme-rain');
  } else if (condition.includes('thunderstorm')) {
    body.classList.add('theme-thunderstorm');
  } else if (condition.includes('snow')) {
    body.classList.add('theme-snow');
  } else if (['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado'].includes(condition)) {
    body.classList.add('theme-atmosphere');
  }
};

// Inisialisasi & Update Peta Interaktif Leaflet.js
const renderMap = (lat, lon, cityName) => {
  if (!map) {
    map = L.map('map', { zoomControl: false }).setView([lat, lon], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    mapMarker = L.marker([lat, lon]).addTo(map);
  } else {
    map.setView([lat, lon], 11);
    mapMarker.setLatLng([lat, lon]);
  }
  
  mapMarker.bindPopup(`<b>${cityName}</b>`).openPopup();

  // Memastikan peta di-render sempurna tanpa pecahan ubin (tile rendering fix)
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
};

// Render Data Cuaca Utama & Parameter Tambahan
const renderWeather = (data, unit) => {
  const { name, sys, main, weather, wind, coord, visibility } = data;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'm/s' : 'mph';

  elements.cityName.textContent = `${name}, ${sys.country}`;
  elements.weatherDate.textContent = formatDate();
  
  elements.weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  elements.weatherIcon.alt = weather[0].description;
  elements.weatherIcon.className = '';

  elements.temperature.textContent = Math.round(main.temp);
  elements.tempUnit.textContent = unitSymbol;
  elements.weatherDescription.textContent = weather[0].description;
  elements.humidity.textContent = `${main.humidity}%`;
  elements.windSpeed.textContent = `${wind.speed} ${windUnit}`;
  elements.feelsLike.textContent = `${Math.round(main.feels_like)}${unitSymbol}`;

  // Parameter Tambahan Baru
  elements.pressure.textContent = `${main.pressure} hPa`;
  elements.visibility.textContent = `${(visibility / 1000).toFixed(1)} km`;
  elements.sunTimes.textContent = `${formatTime(sys.sunrise)} / ${formatTime(sys.sunset)}`;

  updateDynamicBackground(weather[0].main);
  renderMap(coord.lat, coord.lon, `${name}, ${sys.country}`);

  elements.loadingSpinner.classList.add('hidden');
  elements.errorMessage.classList.add('hidden');
  elements.weatherCard.classList.remove('hidden');
};

const renderHistory = (historyList, onSelectCity) => {
  if (!historyList || historyList.length === 0) {
    elements.historyContainer.classList.add('hidden');
    return;
  }

  const tagsHtml = historyList
    .map((city) => `<button class="history-tag" data-city="${city}">${city}</button>`)
    .join('');

  elements.historyTags.innerHTML = tagsHtml;
  elements.historyContainer.classList.remove('hidden');

  elements.historyTags.querySelectorAll('.history-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      onSelectCity(btn.dataset.city);
    });
  });
};

const renderForecast = (forecastData, unit) => {
  const forecastContainer = document.getElementById('forecast-container');
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  const dailyData = forecastData.list.filter((item) => item.dt_txt.includes('12:00:00'));

  const forecastHtml = dailyData
    .map((item) => {
      const date = new Date(item.dt * 1000);
      const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0].icon;

      return `
        <div class="forecast-card">
          <span class="forecast-day">${dayName}</span>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Icon">
          <span class="forecast-temp">${temp}${unitSymbol}</span>
        </div>
      `;
    })
    .join('');

  forecastContainer.innerHTML = forecastHtml;
};