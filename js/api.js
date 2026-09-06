// ============================================
// API MODULE - FETCH & ERROR HANDLING
// ============================================

const API_KEY = '7c147cbc7723582a81895d13c584fb31';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Helper Fetch Generik dengan Penanganan Status HTTP Eksplisit
 */
const fetchFromAPI = async (endpoint, queryParams) => {
  try {
    const url = `${BASE_URL}/${endpoint}?${queryParams}&appid=${API_KEY}&lang=id`;
    const response = await fetch(url);

    if (response.status === 404) {
      throw new Error('Data lokasi tidak ditemukan. Periksa kembali ejaan nama kota.');
    }

    if (response.status === 401) {
      throw new Error('API Key tidak valid atau batas kuota terlampaui.');
    }

    if (!response.ok) {
      throw new Error('Gagal mengambil data dari server cuaca.');
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Koneksi internet terputus. Periksa jaringan Anda.');
    }
    throw error;
  }
};

const fetchWeatherData = (city, units = 'metric') => 
  fetchFromAPI('weather', `q=${encodeURIComponent(city)}&units=${units}`);

const fetchWeatherByCoords = (lat, lon, units = 'metric') => 
  fetchFromAPI('weather', `lat=${lat}&lon=${lon}&units=${units}`);

const fetchForecastData = (city, units = 'metric') => 
  fetchFromAPI('forecast', `q=${encodeURIComponent(city)}&units=${units}`);

const fetchForecastByCoords = (lat, lon, units = 'metric') => 
  fetchFromAPI('forecast', `lat=${lat}&lon=${lon}&units=${units}`);