// ============================================
// MAIN APP - EVENT LISTENERS & STATE
// ============================================

let currentCity = 'Medan';
let currentUnit = 'metric'; // 'metric' (°C) atau 'imperial' (°F)
let searchHistory = JSON.parse(localStorage.getItem('weather_history')) || [];

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const unitToggleBtn = document.getElementById('unit-toggle-btn');

// Simpan Riwayat Pencarian ke LocalStorage (Maksimal 5 kota)
const saveToHistory = (city) => {
  const formattedCity = city.trim();
  if (!formattedCity) return;

  // Filter kota duplikat (case insensitive)
  searchHistory = searchHistory.filter(
    (item) => item.toLowerCase() !== formattedCity.toLowerCase()
  );

  // Tambah kota baru ke awal array
  searchHistory.unshift(formattedCity);

  // Batasi hanya 5 kota terakhir
  if (searchHistory.length > 5) {
    searchHistory.pop();
  }

  localStorage.setItem('weather_history', JSON.stringify(searchHistory));
  renderHistory(searchHistory, handleCitySearch);
};
const locationBtn = document.getElementById('location-btn');
let currentCoords = null; // Menyimpan koordinat jika pencarian berbasis GPS

// Handler Eksekusi Pencarian Berdasarkan Koordinat
const handleCoordsSearch = async (lat, lon) => {
  currentCoords = { lat, lon };
  showLoading();

  try {
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherByCoords(lat, lon, currentUnit),
      fetchForecastByCoords(lat, lon, currentUnit)
    ]);

    currentCity = weatherData.name;
    renderWeather(weatherData, currentUnit);
    renderForecast(forecastData, currentUnit);
    saveToHistory(weatherData.name);
  } catch (error) {
    showError(error.message);
  }
};

// Event Listener: Tombol Deteksi Lokasi Otomatis
locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Fitur Geolocation tidak didukung oleh browser Anda.');
    return;
  }

  showLoading();

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      handleCoordsSearch(latitude, longitude);
    },
    (error) => {
      let errorMsg = 'Gagal mengakses lokasi Anda.';
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg = 'Izin akses lokasi ditolak. Silakan izinkan akses lokasi di browser.';
      }
      showError(errorMsg);
    }
  );
});
// Perbarui Handler Eksekusi Pencarian Kota (Reset status koordinat)
const handleCitySearch = async (city) => {
  if (!city) return;
  currentCity = city;
  currentCoords = null;
  showLoading();

  try {
    const [weatherData, forecastData] = await Promise.all([
      fetchWeatherData(currentCity, currentUnit),
      fetchForecastData(currentCity, currentUnit)
    ]);

    renderWeather(weatherData, currentUnit);
    renderForecast(forecastData, currentUnit);
    saveToHistory(weatherData.name);
  } catch (error) {
    showError(error.message);
  }
};

// Event Listener: Form Submit
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = cityInput.value.trim();
  if (query) {
    handleCitySearch(query);
    cityInput.value = '';
  }
});

// Perbarui Event Listener: Toggle Unit Suhu (Cek apakah pencarian via koordinat atau kota)
unitToggleBtn.addEventListener('click', () => {
  currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
  unitToggleBtn.textContent = currentUnit === 'metric' ? 'Ubah ke °F' : 'Ubah ke °C';

  if (currentCoords) {
    handleCoordsSearch(currentCoords.lat, currentCoords.lon);
  } else {
    handleCitySearch(currentCity);
  }
});

// Inisialisasi Aplikasi Pertama Kali (Default City: Medan)
document.addEventListener('DOMContentLoaded', () => {
  renderHistory(searchHistory, handleCitySearch);
  handleCitySearch(currentCity);
});
