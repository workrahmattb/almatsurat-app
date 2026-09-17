# Memory — Al-Ma'tsurat (Quran & Kitab Reader)

Catatan konteks & riwayat pekerjaan. Update file ini setiap ada pekerjaan besar selesai.

## Ringkasan Project

- **Stack:** React Native 0.86 + Expo SDK 57, Expo Router v6 (file-based routing), Zustand + AsyncStorage (offline-first), TypeScript strict, `@expo/vector-icons` (Ionicons).
- **Konten:** semua data bundled sebagai JSON di `assets/data/` (Quran, Kitab, Wazifah).
- **Alur utama:**
  1. **Home** (`src/app/index.tsx`) → header + tombol Settings (kanan atas), card "Lanjutkan Membaca", menu Wazifah Sugro & Kubro (kiri-kanan).
  2. **Wazifah** (`wazifah-sugro.tsx`, `wazifah-kubro.tsx`) → horizontal swipe per section (FlatList paging), konten per-ayat via `perayat-adapter.ts`, progress tersimpan otomatis.
  3. **Surah** (`surah/[id].tsx`) → baca ayat + terjemahan, bookmark per ayat, progress otomatis.
  4. **Bookmark & Settings** → daftar favorit & ukuran font.

## Riwayat Pekerjaan

### 1. Perbaikan semua error TypeScript (`npx tsc --noEmit` → 0 error)
- `assets/data/wazifah/index.ts`: tipe `WazifahSection` ditambah `header_bismillah?: boolean` dan `ayatPairs?: { ayat; arabic; translation }[]` (field ini ada di JSON tapi tidak dikenal TS).
- `src/stores/settings-store.ts`: ditambah `themeMode: 'light' | 'dark' | 'system'` (default `'system'`) + `setThemeMode`.
- `src/constants/theme.ts`: export tipe `ThemePalette`.
- `wazifah-sugro.tsx` & `wazifah-kubro.tsx`: `onViewableItemsChanged` pakai `ViewToken<WazifahSection>[]`, prop `colors` bertipe `ThemePalette`.
- **Dihapus 12 file template Expo starter yang tidak dipakai** (0 referensi dari screen mana pun): `app-tabs.*`, `animated-icon.*`, `themed-text/view`, `collapsible`, `web-badge`, `hint-row`, `external-link`, `use-theme.ts`.

### 2. Tulis ulang screen yang salah render (sisa template lama)
- `src/app/surah/[id].tsx`: tadinya render konten wazifah → sekarang **surah reader** (header nama Arab + Latin + arti, FlatList ayat + terjemahan, bookmark per ayat ❤️/🤍, progress tipe `surah`).
- `src/app/kitab/[id].tsx`: tadinya render konten wazifah → sekarang **daftar bab kitab** (header judul + penulis + deskripsi, list bab → navigasi ke `kitab/[id]/[chapter]`, progress tipe `kitab`).

### 3. Upgrade Expo SDK 54 → 57 (penuh)
- **Masalah awal:** `expo` sudah `^57.0.20` tapi `expo-router@6.0.24` (tag sdk-54) → CLI SDK 57 butuh `expo-router/internal/routing` yang tidak ada di versi lama → `expo start` crash `MODULE_NOT_FOUND`.
- **Solusi:** `npx expo install --fix` — semua dependency disinkronkan ke SDK 57: `expo-router@~57.0.19`, `react-native@0.86.3`, `react@19.2.3`, `reanimated@4.5.1`, dll. Plugin config SDK 57 otomatis ditambahkan ke `app.json`.
- **Syarat:** Node ≥ 22.13 (user di Node 24, aman).

### 4. Modernisasi UI (shadow + rounded, tanpa ubah alur)
- Token desain baru di `src/constants/theme.ts`: `Radius` (sm 10 / md 14 / lg 20 / xl 28 / pill 999) & `Shadows` (soft / card / elevated — iOS shadow* + Android elevation).
- Diterapkan ke semua screen: Home, Wazifah Sugro/Kubro, Surah reader, Kitab list & chapter, Bookmark, Settings.
- Fix bonus: warna bismillah yang tadinya `#000000` keras sekarang ikut tema (kebaca di dark mode).

### 5. Layout Home
- Menu Wazifah Sugro & Kubro: dari atas-bawah → **kiri-kanan** (`flexDirection: 'row'` + kartu `flex: 1`).
- Background light mode: `#f6faf7` → **`#eef1f4`** (abu-abu muda) supaya shadow kartu terlihat. Berlaku konsisten di semua screen karena semuanya pakai `colors.background`.

### 6. Redesign Total UI berdasarkan Apple HIG
- **Review menggunakan Apple Design Skill** (`.agents/skills/apple-design/`): audit 5 lens (accessibility, platform conventions, visual design, interaction, content).
- **Temuan kritis:** tidak ada tab bar (seharusnya ada), emoji icons (bukan vector), hardcoded colors di dark mode.
- **Keputusan desain:** "Digital Mushaf" — warm cream backgrounds, deep emerald accents, elegant Islamic aesthetic.

#### Token System Baru (`src/constants/theme.ts`):
- **Warna:** Light cream `#FAFAF5`, dark `#1C1C1E`, accent sage teal `#2D6A5A`/`#4A9A82`, secondary warm brown `#8B7355`/`#A89070`.
- **Typography:** Scale Apple HIG (Large Title 34pt → Caption 11pt), font `KFGQPC-Uthmanic-HAFS` tetap untuk Arabic.
- **Spacing:** Scale konsisten (half 2 → twelve 48).
- **Radius:** Lebih kecil (sm 8, md 12, lg 16, xl 20, pill 999).

#### Perubahan Struktur:
- **Bottom navbar dihapus** — navigasi via kartu di home screen.
- **Tombol Settings** dipindah ke pojok kanan atas home screen (icon gear Ionicons).
- **Stack navigator** seperti semula (bukan Tabs).
- **Wazifah screens** kembali ke root level (`wazifah-sugro.tsx`, `wazifah-kubro.tsx`).

#### Icons:
- Semua emoji diganti `@expo/vector-icons` (Ionicons): home, book, library, heart, settings, chevron-forward, dll.
- Package `@expo/vector-icons` diinstall via `npx expo install`.

#### Screens Updated:
- **Home:** Tombol Settings kanan atas, "Continue Reading" card dengan icon, menu Wazifah (Sugro/Kubro).
- **Wazifah:** Header cream, card header sage teal, ayat number badge, Bismillah divider, translation rata kiri kanan.
- **Surah:** Header nama Arab sebagai hero, ayat cards dengan bookmark heart icon.
- **Bookmark:** Empty state dengan heart-outline icon, list items dengan book icons.
- **Settings:** Grouped sections dengan icons, font size selectors.

### 7. Hapus fitur Kitab & Navigation
- **Kitab dihapus:** Folder `src/app/kitab/` dihapus total (termasuk `[id].tsx`, `[id]/[chapter].tsx`, `_layout.tsx`, `index.tsx`).
- **Navigasi dihapus:** Section "Navigasi" (Kitab & Favorit) dihapus dari Home screen.
- **Referensi kitab dihapus:** Route kitab dihapus dari `_layout.tsx`, navigasi kitab dihapus dari `bookmark.tsx` dan `index.tsx`.

### 8. Update warna Wazifah
- **Warna lama:** Accent hijau terang `#0A7B4F` (Sugro), Gold terang `#C9A96E` (Kubro).
- **Warna baru:** Sage teal `#2D6A5A` (Sugro & Kubro), lebih soft dan elegan.
- **Dark mode:** `#4A9A82` (teal) untuk kedua screen.
- **Kubro disamakan:** Semua `accentSecondary` diganti `accent` agar sama dengan Sugro.

### 9. Perbaikan layout & typography
- **Translation text:** Ditambah `textAlign: 'justify'` (rata kiri kanan) di Wazifah Sugro & Kubro.
- **Bottom navbar:** Dihapus total, navigasi via kartu di Home screen.
- **Tombol Settings:** Dipindah ke pojok kanan atas Home screen.

## Status Sekarang

- `npx tsc --noEmit` → **exit 0** (nol error).
- UI: warm cream + sage teal, vector icons, no bottom navbar, no Kitab.
- Font Arabic `KFGQPC-Uthmanic-HAFS` tetap dipertahankan.
- Translation text rata kiri kanan (justify).

## Catatan / Isu Terbuka

- **Fitur Kitab belum ada:** Perlu dibuat ulang jika diperlukan.
- **README.md & PRD outdated:** masih menyebut SDK 54, tema "glassmorphism", dan screen `(tabs)/quran.tsx` yang tidak ada. Perlu diupdate.
- `split-adapter.ts` tidak terpakai (screen pakai `perayat-adapter`).
- Tipe `Bookmark` menyimpan `'wazifah'` tapi store hanya terima `'ayat' | 'chapter'` (minor).