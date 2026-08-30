# 🕌 Al-Ma'tsurat — Quran & Kitab Reader

Aplikasi mobile offline-first untuk membaca **Al-Quran** (teks Arab + terjemahan Indonesia) dan **Kitab-kitab Islam** klasik, dibangun dengan **React Native + Expo** dengan desain **Futuristic Glassmorphism** yang elegan dan responsif.

![Platform](https://img.shields.io/badge/platform-Android%20%7C%20iOS%20%7C%20Web-blue)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-black)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 💖 Donasi untuk Pengembangan Aplikasi

Jika aplikasi ini bermanfaat, kamu bisa mendukung pengembangannya melalui donasi:

👉 **[Donasi via Saweria](https://saweria.co/rahmattb)**

Setiap kontribusi akan digunakan untuk:
- Menambah data Al-Quran lengkap (114 surah)
- Menambah koleksi kitab Islam klasik
- Pengembangan fitur audio murottal dan tafsir
- Perbaikan UI/UX dan performa aplikasi

Terima kasih atas dukungannya! 🌙

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📖 **Al-Quran Lengkap** | 114 Surah dengan teks Arab (Uthmanic Hafs), terjemahan Bahasa Indonesia, dan penomoran ayat |
| 📚 **Koleksi Kitab Islam** | Kitab klasik terstruktur per bab (Bulughul Maram, Riyadhus Shalihin, dll) |
| 🔖 **Bookmark Cerdas** | Tandai ayat atau bab — tersimpan otomatis dengan timestamp |
| 📍 **Reading Progress** | Lanjutkan membaca dari posisi terakhir (surah/kitab/bab) |
| ✈️ **100% Offline** | Semua konten bundled — tidak perlu koneksi internet |
| 🎨 **Tema Adaptif** | Light / Dark / System — transisi mulus |
| 🔤 **Font Fleksibel** | Ukuran font Arab (20–40px) & Terjemahan (12–22px) independen |
| ✨ **Futuristic Glassmorphism UI** | Deep dark gradient + neon accents + glass cards + soft glows |

---

## 🎨 Preview UI

> **Tema:** Glassmorphism dengan palet *deep dark gradient* (`#06080F` base) + neon accents (ungu `#9333EA`, cyan `#0EA5E9`, amber `#F59E0B`).  
> **Kartu:** Translucent glass (`rgba(255,255,255,0.05)`), border glow (`rgba(255,255,255,0.1)`), shadow elevation 6.  
> **Font Arab:** **KFGQPC Uthmanic HAFS** (standar Mushaf Madinah) — tidak diubah.

| Home | Wazifah Reader | Settings |
|:---:|:---:|:---:|
| Hero banner + floating cards + glowing stats | Gradient header + glass section cards | Pill-style toggles dengan accent border |

---

## 🚀 Quick Start

### Prasyarat
- Node.js ≥ 18
- Expo CLI (`npm i -g expo-cli`)
- Android Studio / Xcode (untuk emulator) **atau** device fisik dengan **Expo Go**

### Instalasi & Jalankan

```bash
# 1. Clone repo
git clone https://github.com/<username>/al-matsurat.git
cd al-matsurat

# 2. Install dependencies
npm install

# 3. Start development server
npm start          # atau: npx expo start

# 4. Scan QR code dengan Expo Go (Android/iOS)
#    Atau tekan 'a' untuk Android emulator, 'i' untuk iOS simulator, 'w' untuk web
```

> ⚠️ **Catatan SDK**: Project ini menggunakan **Expo SDK 54** agar kompatibel dengan **Expo Go** versi stabil. Jika mau SDK 57+, gunakan *Development Build* (EAS Build).

---

## 📁 Struktur Project

```
al-matsurat/
├── app.json                 # Expo config
├── package.json
├── tsconfig.json
├── src/
│   ├── app/                 # Expo Router screens (file-based routing)
│   │   ├── _layout.tsx      # Root stack + theme provider
│   │   ├── index.tsx        # Home — Hero + Continue Reading + Menu + Stats
│   │   ├── wazifah-sugro.tsx
│   │   ├── wazifah-kubro.tsx
│   │   ├── bookmark.tsx     # Favorit (ayat & bab)
│   │   ├── settings.tsx     # Tema + Font size + Preview
│   │   ├── surah/
│   │   │   └── [id].tsx     # Detail surah (ayat + terjemahan + bookmark)
│   │   └── kitab/
│   │       ├── [id].tsx     # Daftar bab kitab
│   │       └── [id]/
│   │           └── [chapter].tsx  # Isi bab + navigasi prev/next
│   ├── stores/              # Zustand stores (persisted via AsyncStorage)
│   │   ├── bookmark-store.ts
│   │   ├── progress-store.ts
│   │   ├── settings-store.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── constants/
│   │   └── theme.ts         # 🎨 Futuristic theme (colors, spacing, fonts)
│   ├── hooks/
│   │   └── use-color-scheme.ts
│   └── assets/data/         # Data accessors
│       ├── quran.ts
│       ├── kitab.ts
│       └── wazifah.ts
├── assets/
│   ├── data/
│   │   ├── quran/           # 114 surah JSON (surah-1.json ... surah-114.json)
│   │   ├── kitab/           # Kitab JSON (kitab-001.json ...)
│   │   └── wazifah/         # Wazifah JSON (sugro.json, kubro.json)
│   ├── fonts/
│   │   └── KFGQPC-Uthmanic-HAFS.otf
│   └── images/              # Icon, splash, adaptive icons
└── .github/                 # CI/CD (optional)
```

---

## 💾 Data Structure

### Quran (`assets/data/quran/surah-{n}.json`)

```json
{
  "id": 1,
  "name_arabic": "الفاتحة",
  "name_latin": "Al-Fatihah",
  "translation_id": "Pembukaan",
  "revelation_type": "Mekah",
  "total_ayat": 7,
  "ayat": [
    {
      "number": 1,
      "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
    }
  ]
}
```

### Kitab (`assets/data/kitab/kitab-XXX.json`)

```json
{
  "id": "kitab-001",
  "title": "Bulughul Maram",
  "author": "Ibnu Hajar Al-Asqalani",
  "description": "Kitab hadis terkemuka...",
  "chapters": [
    {
      "chapter_number": 1,
      "chapter_title": "Bab Wudhu",
      "content": "Teks lengkap bab dalam Bahasa Indonesia..."
    }
  ]
}
```

### Wazifah (`assets/data/wazifah/{sugro,kubro}.json`)

```json
{
  "id": "sugro",
  "title": "Wazifah Sugro",
  "description": "Dzikir ringkas untuk kesibukan sehari-hari",
  "sections": [
    {
      "section_number": 1,
      "title": "Istighfar",
      "source": "HR. Muslim",
      "repetition": 3,
      "arabic": "أَسْتَغْفِرُ اللهَ...",
      "transliteration": "Astaghfirullah...",
      "translation": "Aku memohon ampunan kepada Allah..."
    }
  ]
}
```

---

## 🔧 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | React Native 0.81 + Expo SDK 54 |
| **Routing** | Expo Router v6 (file-based, typed routes) |
| **State** | Zustand v5 + AsyncStorage persistence |
| **Styling** | StyleSheet API (native, zero-runtime) |
| **Fonts** | `expo-font` — KFGQPC Uthmanic HAFS (Arab) |
| **Language** | TypeScript 5 (strict mode) |
| **Build** | EAS Build (production) |

---

## 📝 State Management (Zustand)

### `useBookmarkStore`
```ts
bookmarks: Bookmark[]
addBookmark(b: Bookmark)
removeBookmark(id: string)
isBookmarked(type, surah_id?, ayat_number?, kitab_id?, chapter_number?): boolean
getBookmarkId(...): string | null
```

### `useProgressStore`
```ts
progress: ReadingProgress[]
updateProgress(p: ReadingProgress)
getProgress(type, reference_id): ReadingProgress | undefined
getLatestProgress(): ReadingProgress | null
```

### `useSettingsStore`
```ts
arabicFontSize: number      // 20–40 (default: 28)
translationFontSize: number // 12–22 (default: 16)
themeMode: 'light' | 'dark' | 'system'
setArabicFontSize(n: number)
setTranslationFontSize(n: number)
setThemeMode(mode: ThemeMode)
```

---

## 🎯 Roadmap

### v1.1 — Data Completion
- [ ] Lengkapi 114 surah Al-Quran (saat ini 5 surah sample)
- [ ] Tambah 8–10 kitab klasik (Bulughul Maram, Riyadhus Shalihin, Arbain Nawawi, dll)

### v1.2 — Search & Discovery
- [ ] Full-text search ayat (Arab/Latin/Translation)
- [ ] Full-text search isi kitab
- [ ] Filter surah: Mekah/Madinah, juz, halaman

### v1.3 — Media & Sharing
- [ ] Audio murottal per ayat (offline bundle / streaming)
- [ ] Share card ayat ke media sosial (generate image)
- [ ] Tafsir ringkas per ayat (opsional)

### v1.4 — Polish & Publish
- [ ] App icon & splash screen custom
- [ ] Store screenshots & metadata
- [ ] Privacy Policy (offline-first, no analytics)
- [ ] EAS Build → APK / IPA → Play Store & App Store

---

## 📦 Production Build

```bash
# Install EAS CLI
npm i -g eas-cli

# Login ke Expo
eas login

# Konfigurasi project (sekali saja)
eas build:configure

# Build Android (APK/AAB)
eas build --platform android --profile production

# Build iOS (IPA)
eas build --platform ios --profile production

# Submit ke store
eas submit --platform android
eas submit --platform ios
```

---

## 🤝 Contributing

Kontribusi terbuka untuk:
- **Data**: Tambah surah/kitab/wazifah (PR ke `assets/data/`)
- **UI/UX**: Perbaikan aksesibilitas, animasi, performa
- **Fitur**: Search, audio, tafsir, dsb.
- **Dokumentasi**: Terjemahan README, panduan kontribusi

> **Style guide**: Ikuti pola kode existing (TypeScript strict, StyleSheet native, Zustand pattern).  
> **Commit**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).

---

## 📄 License

**MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan pribadi maupun komersial.

```
MIT License

Copyright (c) 2026 Rahmat Tanri

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **KFGQPC Uthmanic HAFS Font** — King Fahd Glorious Quran Printing Complex
- **Tanzil.net** — Quran text & translation reference
- **Expo Team** — Framework yang memungkinkan dev cepat & cross-platform
- **Zustand** — State management minimalis & powerful
- **Komunitas Open Source Islam** — Konten kitab & referensi

---

## 📞 Contact & Support

- **Author**: Rahmat Tanri
- **GitHub**: [@workrahmattb](https://github.com/workrahmattb)
- **Issues**: [GitHub Issues](https://github.com/workrahmattb/al-matsurat/issues) untuk bug report & feature request

---

> **Dibangun dengan ❤️, ☕, dan banyak doa** — semoga bermanfaat untuk umat.  
> **Bismillahirrahmanirrahim** · **Al-Ma'tsurat** · *Futuristic. Solid. Offline.*