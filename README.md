# Tugas Rutin 5 — Weather App (Vanilla JS ES6+)

Aplikasi pemantau cuaca interaktif berbasis **Vanilla JavaScript ES6+** yang terintegrasi dengan **OpenWeatherMap API** dan **Leaflet.js Map API**. Dibuat dengan arsitektur modul bersih (*clean code*), penanganan *error* yang tangguh, serta antarmuka responsif *Dark Glassmorphism*.

## 🌐 Live Demo

- **GitHub Pages:** [Link Github Pages](https://tengkufahreza6-dev.github.io/TugasWeb-Pertemuan5-WeatherApp/)

---

## 📌 Pemenuhan Requirements & Rubrik

1. **Sintaks ES6+ Modern:** Menggunakan `const`, *arrow functions*, *template literals*, dan struktur modular (`api.js`, `ui.js`, `app.js`).
2. **Asynchronous Fetching:** Menggunakan `async/await` dengan `Fetch API` untuk menangani permintaan HTTP asynchronous.
3. **Komponen Informasi Cuaca Komprehensif:** 
   - **Metriks Utama:** Nama kota, tanggal, derajat suhu, deskripsi cuaca, ikon cuaca resmi, kelembaban, kecepatan angin, dan suhu terasa.
   - **Metriks Atmosferik Tambahan (Baru ⭐):** Tekanan udara (*Pressure* dalam hPa), Jarak pandang (*Visibility* dalam km), dan Waktu matahari terbit/terbenam (*Sunrise / Sunset*).
4. **Error Handling Lengkap:**
   - *Status 404:* Menangani kondisi pencarian nama kota yang tidak ditemukan.
   - *Status 401:* Menangani validasi API Key / kuota.
   - *Network Error:* Menangani kondisi koneksi internet terputus secara dinamis.
5. **Loading State:** Indikator animasi *spinner* saat proses pengambilan data berlangsung.
6. **Array Methods:** Menggunakan `.filter()` untuk menyaring jam prakiraan cuaca dan `.map()` untuk merender kartu *forecast* serta tombol riwayat pencarian.
7. **UI Responsif:** Layout Dashboard 2-kolom untuk tampilan Desktop dan otomatis menyesuaikan (*mobile-friendly*) untuk layar ponsel.
8. **Fitur Bonus (Lengkap & Ter-upgrade):**
   - **Peta Interaktif Spasial (Baru ⭐):** Integrasi **Leaflet.js** & **OpenStreetMap** untuk menampilkan lokasi koordinat kota secara visual lengkap dengan *marker* interaktif dan efek *pan/zoom*.
   - **Riwayat Pencarian:** Tersimpan otomatis di `localStorage` (maksimal 5 pencarian terakhir).
   - **Toggle Unit Suhu:** Mengubah unit derajat antara Celsius (°C) dan Fahrenheit (°F).
   - **5-Day Weather Forecast:** Prakiraan cuaca 5 hari ke depan.
   - **Geolocation GPS:** Fitur deteksi posisi otomatis berdasarkan koordinat pengguna via `navigator.geolocation`.
   - **Dynamic HD Background:** Latar belakang gambar HD dinamis (Unsplash) yang berganti otomatis sesuai kondisi cuaca (*Clear, Clouds, Rain, Thunderstorm, Snow, Atmosphere*).

---

## 🛠️ Arsitektur Proyek

```text
TugasWeb-Pertemuan5-WeatherApp/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    ├── api.js       (Modul Fetch API & Error Handling)
    ├── ui.js        (Modul Manipulasi DOM, Leaflet Map & Dynamic Rendering)
    └── app.js       (Main App, State Management & Event Listeners)
```

## 👤 Informasi Mahasiswa
- Nama: Tengku Fahreza (42525500050)
- Class: PSIK 25B
- Program Studi: S1 Ilmu Komputer
- Mata Kuliah: Pemrograman Web
- Instansi: Universitas Negeri Medan (UNIMED)