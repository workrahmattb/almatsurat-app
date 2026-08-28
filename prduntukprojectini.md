# Product Requirements Document (PRD)

## Aplikasi Muslim — Quran & Kitab Reader

**Versi:** 1.0
**Tanggal:** 24 Agustus 2026
**Platform:** React Native (iOS & Android)
**Status:** Draft

---

## 1. Ringkasan Produk

Aplikasi mobile berbasis React Native yang menampilkan konten **Al-Quran (beserta terjemahan)** dan **Kitab-kitab Islam** dalam format digital yang mudah dibaca, dengan konten yang diinput secara manual oleh pengembang (bukan melalui API eksternal). Aplikasi dirancang untuk dapat digunakan **sepenuhnya offline** setelah instalasi, dan akan dipublikasikan gratis ke Google Play Store dan Apple App Store.

---

## 2. Latar Belakang & Tujuan

Banyak aplikasi Islami yang bergantung pada koneksi internet atau API pihak ketiga yang tidak stabil. Aplikasi ini bertujuan menyediakan pengalaman membaca Quran dan kitab yang:

- Ringan dan cepat diakses tanpa internet
- Kontennya terkurasi langsung oleh pembuat aplikasi (kualitas & akurasi terjaga)
- Nyaman digunakan untuk bacaan harian, kajian, atau referensi

**Tujuan utama:**

1. Menyediakan aplikasi baca Quran + terjemahan yang stabil secara offline.
2. Menyediakan aplikasi baca kitab-kitab Islam (teks panjang, terbagi per bab/pasal).
3. Memudahkan pengguna menandai dan melanjutkan bacaan (bookmark & riwayat).
4. Merilis aplikasi ke Play Store secara gratis pada tahap awal.

---

## 3. Target Pengguna

- Muslim yang ingin membaca Quran & terjemahan sehari-hari tanpa koneksi internet stabil.
- Santri, pelajar, atau jamaah pengajian yang membutuhkan akses kitab tertentu secara digital.
- Pengguna yang menginginkan aplikasi ringan tanpa iklan/tracking berlebihan (di tahap awal).

---

## 4. Ruang Lingkup (Scope)

### 4.1 In-Scope (MVP — Versi 1.0)

- Baca Al-Quran + terjemahan (per surah/ayat)
- Baca Kitab (konten teks panjang, terstruktur per bab/pasal)
- Bookmark ayat & bagian kitab
- Riwayat/posisi bacaan terakhir (auto-resume)
- Mode offline penuh (semua konten tersimpan lokal)
- Publikasi ke Google Play Store & App Store

### 4.2 Out-of-Scope (Ditunda ke versi selanjutnya)

- Audio murottal / pembacaan kitab
- Pencarian ayat/isi kitab (full-text search)
- Sinkronisasi akun/cloud backup
- Fitur sosial (share progress, komunitas)
- Sistem admin panel/backend untuk kelola konten

> Catatan: pencarian dan audio sengaja ditunda, tapi struktur data di bawah sudah dirancang agar mudah ditambahkan nanti tanpa migrasi besar.

---

## 5. Fitur Utama & User Stories

### 5.1 Baca Al-Quran + Terjemahan

- Sebagai pengguna, saya ingin melihat daftar 114 surah agar saya bisa memilih surah yang ingin dibaca.
- Sebagai pengguna, saya ingin membaca teks Arab beserta terjemahan Bahasa Indonesia per ayat.
- Sebagai pengguna, saya ingin mengatur ukuran font Arab/terjemahan agar nyaman dibaca.

### 5.2 Baca Kitab

- Sebagai pengguna, saya ingin melihat daftar kitab yang tersedia di aplikasi.
- Sebagai pengguna, saya ingin membuka kitab dan menavigasi per bab/pasal.
- Sebagai pengguna, saya ingin scroll membaca teks panjang dengan nyaman (pagination atau infinite scroll per bab).

### 5.3 Bookmark & Riwayat

- Sebagai pengguna, saya ingin menandai ayat/bagian kitab tertentu sebagai favorit.
- Sebagai pengguna, saya ingin aplikasi otomatis mengingat posisi bacaan terakhir saya per surah/kitab.
- Sebagai pengguna, saya ingin melihat daftar semua bookmark saya dalam satu halaman.

### 5.4 Mode Offline

- Sebagai pengguna, saya ingin seluruh konten Quran & kitab bisa diakses tanpa internet setelah aplikasi terinstal.

---

## 6. Struktur Data Konten (Input Manual JSON)

Karena konten diinput manual oleh Anda, disarankan struktur data seperti berikut, disimpan sebagai file JSON lokal di dalam project (folder `/assets/data/`) lalu di-load ke local storage (SQLite/MMKV) saat pertama kali aplikasi dibuka, agar query (bookmark, resume) tetap cepat.

**quran.json** (contoh struktur per surah):

```json
{
  "id": 1,
  "name_arabic": "الفاتحة",
  "name_latin": "Al-Fatihah",
  "translation_id": "Pembukaan",
  "total_ayat": 7,
  "ayat": [
    {
      "number": 1,
      "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
    }
  ]
}
```

**kitab.json** (contoh struktur per kitab):

```json
{
  "id": "kitab-001",
  "title": "Nama Kitab",
  "author": "Nama Penulis",
  "chapters": [
    {
      "chapter_number": 1,
      "chapter_title": "Judul Bab",
      "content": "Isi teks bab dalam format paragraf/HTML sederhana..."
    }
  ]
}
```

**Rekomendasi tabel lokal (SQLite) setelah data di-load:**
| Tabel | Fungsi |
|---|---|
| `surah`, `ayat` | Data Quran |
| `kitab`, `kitab_chapter` | Data Kitab |
| `bookmarks` | Menyimpan bookmark (tipe: ayat/kitab, referensi id) |
| `reading_progress` | Menyimpan posisi terakhir per surah/kitab |

---

## 7. Arsitektur & Tech Stack

| Layer             | Rekomendasi                                                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework         | React Native (sudah berjalan)                                                                                                                             |
| Navigasi          | React Navigation (Stack + Bottom Tab)                                                                                                                     |
| State Management  | Zustand atau Redux Toolkit (ringan untuk skala app ini)                                                                                                   |
| Penyimpanan Lokal | SQLite (`expo-sqlite` / `react-native-sqlite-storage`) untuk data terstruktur + query cepat; alternatif ringan: MMKV untuk key-value (bookmark, progress) |
| Data Konten Awal  | Bundled JSON di dalam app, di-seed ke SQLite saat first launch                                                                                            |
| Font Arab         | Font khusus Quran (mis. `me_quran`, `LPMQ`, atau font Uthmani) di-embed ke app                                                                            |
| Styling           | StyleSheet biasa atau NativeWind (Tailwind untuk RN)                                                                                                      |
| Build & Deploy    | EAS Build (jika pakai Expo) atau native build untuk Play Store/App Store                                                                                  |

---

## 8. Alur Pengguna Utama (User Flow)

1. **Buka Aplikasi** → Landing/Home menampilkan 2 menu utama: "Al-Quran" dan "Kitab", plus shortcut "Lanjutkan Membaca" jika ada progress tersimpan.
2. **Alur Quran:** Home → Daftar Surah → Detail Surah (ayat + terjemahan) → Tap ayat untuk bookmark → Posisi otomatis tersimpan saat keluar halaman.
3. **Alur Kitab:** Home → Daftar Kitab → Daftar Bab dalam Kitab → Baca isi bab → Bookmark bab/posisi → Progress tersimpan otomatis.
4. **Alur Bookmark:** Tab "Favorit/Bookmark" → List semua ayat & bab yang ditandai → Tap untuk lompat langsung ke lokasi tersebut.

---

## 9. Daftar Layar (Screens)

| Screen                    | Deskripsi                               |
| ------------------------- | --------------------------------------- |
| Home                      | Menu utama, shortcut lanjut baca        |
| Daftar Surah              | List 114 surah Quran                    |
| Detail Surah              | Isi ayat + terjemahan                   |
| Daftar Kitab              | List kitab tersedia                     |
| Detail Kitab (Daftar Bab) | List bab dalam satu kitab               |
| Isi Bab Kitab             | Konten teks bab                         |
| Bookmark/Favorit          | Kumpulan semua bookmark                 |
| Pengaturan                | Ukuran font, tema (opsional: dark mode) |

---

## 10. Kebutuhan Non-Fungsional

- **Offline-first:** Semua fitur inti (baca, bookmark, resume) harus berfungsi tanpa internet.
- **Performa:** Waktu load daftar surah/kitab < 1 detik; scrolling teks panjang harus tetap smooth (pertimbangkan `FlatList`/`FlashList` untuk render performa, bukan `ScrollView` biasa untuk teks sangat panjang).
- **Ukuran aplikasi:** Perlu diperhatikan karena teks Quran lengkap + beberapa kitab bisa membuat ukuran APK/IPA membengkak — pertimbangkan kompresi JSON atau load bertahap per surah jika ukuran jadi masalah.
- **Aksesibilitas:** Ukuran font dapat disesuaikan, kontras warna cukup untuk kenyamanan baca (termasuk potensi dark mode).
- **Kompatibilitas:** Android 8+ dan iOS 13+ (disesuaikan dengan target minimum React Native saat ini).

---

## 11. Proses Manajemen Konten (Manual)

Karena Anda akan menginput konten manual dalam bentuk JSON:

1. Siapkan template JSON standar (lihat bagian 6) untuk Quran dan Kitab.
2. Validasi struktur JSON (bisa pakai schema validator sederhana) sebelum di-bundle ke app, agar tidak ada error saat parsing.
3. Simpan file JSON di folder `/assets/data/quran/` dan `/assets/data/kitab/`.
4. Buat script seeding (dijalankan sekali di first launch) yang membaca JSON dan mengisi database SQLite lokal.
5. Untuk update konten di versi mendatang: perlu rilis versi baru aplikasi (karena belum ada backend), atau pertimbangkan fitur "download konten tambahan" di roadmap lanjutan.

---

## 12. Rencana Publikasi

- **Target:** Google Play Store & Apple App Store, gratis (tanpa iklan/pembelian di versi awal).
- **Kebutuhan sebelum submit:**
  - Ikon aplikasi & splash screen
  - Screenshot untuk store listing (minimal 2-3 per platform)
  - Deskripsi aplikasi & kebijakan privasi (wajib meski app sederhana, terutama untuk Play Store)
  - Akun Google Play Console (~$25 sekali bayar) & Apple Developer Program (~$99/tahun jika rilis ke App Store)
- **Pengujian sebelum rilis:** Uji di device Android & iOS fisik, uji mode offline (matikan internet lalu pastikan semua fitur inti tetap jalan).

---

## 13. Metrik Keberhasilan (Success Metrics)

- Aplikasi berhasil live di Play Store (App Store menyusul jika target waktu memungkinkan).
- Waktu buka aplikasi ke konten siap baca < 2 detik pada perangkat kelas menengah.
- Tidak ada crash pada alur baca Quran/Kitab utama (crash-free rate target > 99%).
- Fitur bookmark & resume berfungsi 100% tanpa internet.

---

## 14. Roadmap Setelah MVP

| Prioritas | Fitur                                                        |
| --------- | ------------------------------------------------------------ |
| Tinggi    | Full-text search ayat & isi kitab                            |
| Tinggi    | Audio murottal per ayat/surah                                |
| Sedang    | Dark mode & kustomisasi tema                                 |
| Sedang    | Tafsir ayat (opsional, tambahan konten)                      |
| Rendah    | Backend/admin panel agar update konten tanpa update aplikasi |
| Rendah    | Fitur berbagi ayat/kutipan kitab ke media sosial             |

---

## 15. Risiko & Mitigasi

| Risiko                                                              | Mitigasi                                                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Ukuran aplikasi membengkak karena konten offline besar              | Kompresi data, load per surah/kitab bertahap, evaluasi format data (JSON vs SQLite bundled) |
| Kesalahan input manual pada teks Quran (sensitif karena kitab suci) | Buat proses verifikasi/cross-check teks dengan sumber terpercaya sebelum rilis              |
| Update konten butuh rilis app baru (tanpa backend)                  | Rencanakan versi 2.0 dengan mekanisme update konten terpisah dari update aplikasi           |
| Proses review Apple App Store untuk app religi bisa lebih ketat     | Siapkan kebijakan privasi jelas dan pastikan tidak ada konten yang melanggar guideline      |

---

## 16. Ringkasan Prioritas MVP

**Fitur wajib rilis v1.0:**

1. Baca Quran + terjemahan
2. Baca Kitab
3. Bookmark
4. Riwayat/resume bacaan terakhir
5. Full offline
6. Rilis ke Play Store (App Store menyusul)

**Ditunda:** pencarian, audio, backend/admin, fitur sosial.

---

_Dokumen ini dapat diperbarui seiring perkembangan project. Disarankan untuk memvalidasi struktur data (bagian 6) sebelum mulai development, karena perubahan struktur data di tengah jalan akan memakan waktu migrasi paling banyak._
