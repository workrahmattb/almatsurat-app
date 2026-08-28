# 📚 Panduan Lengkap: Cara Memasukkan Data Al-Quran & Kitab

**Project**: Muslim App - Quran & Kitab Reader  
**Tanggal**: 25 Agustus 2026  
**Untuk**: Developer yang ingin menambah atau mengedit data konten

---

## 🗂️ Arsitektur Data - Konsep Offline-First

Semua data (Al-Quran & Kitab) disimpan sebagai **file JSON di dalam aplikasi**, bukan dari internet/API. Jadi sekali install, semua konten sudah ada di HP dan bisa diakses tanpa internet.

---

## 📖 Bagian 1: Struktur Data Al-Quran

### Hirarki Data Quran

```
Al-Quran (114 Surah)
├─ Surah 1: Al-Fatihah
│  ├─ Ayat 1 (Arab + Terjemahan)
│  ├─ Ayat 2 (Arab + Terjemahan)
│  └─ Ayat 3-7...
├─ Surah 2: Al-Baqarah
│  ├─ Ayat 1
│  ├─ Ayat 2
│  └─ Ayat 3-286...
└─ Surah 3-114...
```

### Lokasi File

```
assets/data/quran/
├── index.ts          ← File utama yang "mengumpulkan" semua surah
├── surah-1.json      ← Data Surah Al-Fatihah
├── surah-2.json      ← Data Surah Al-Baqarah
├── surah-112.json    ← Data Surah Al-Ikhlas
├── surah-113.json    ← Data Surah Al-Falaq
└── surah-114.json    ← Data Surah An-Nas
```

**Status saat ini**: Baru ada 5 surah (1, 2, 112, 113, 114). Masih perlu ditambah 109 surah lagi.

### Struktur 1 File Surah (surah-X.json)

File ini berisi:
- **Metadata surah**: ID, nama Arab, nama Latin, terjemahan nama, jumlah ayat
- **Array ayat**: Setiap ayat punya nomor, teks Arab, dan terjemahan Indonesia

**Contoh: surah-1.json (Al-Fatihah)**

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
      "arabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
    },
    {
      "number": 2,
      "arabic": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      "translation": "Segala puji bagi Allah, Tuhan semesta alam."
    },
    {
      "number": 3,
      "arabic": "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      "translation": "Maha Pengasih, Maha Penyayang."
    }
    // ... ayat 4-7
  ]
}
```

**Penjelasan Field:**
- `id`: Nomor urut surah (1-114)
- `name_arabic`: Nama surah dalam tulisan Arab
- `name_latin`: Nama surah dalam huruf Latin
- `translation_id`: Arti/terjemahan nama surah dalam Bahasa Indonesia
- `total_ayat`: Jumlah ayat dalam surah tersebut
- `ayat`: Array berisi semua ayat
  - `number`: Nomor ayat
  - `arabic`: Teks Arab (gunakan Unicode Arab)
  - `translation`: Terjemahan Bahasa Indonesia

### File index.ts (Pengumpul Data)

File ini bertugas:
1. **Import semua file JSON** surah
2. **Gabungkan jadi 1 array** bernama `quranData`
3. **Export** supaya bisa dipakai di seluruh aplikasi
4. **Provide helper function** untuk mencari surah by ID

**Contoh: assets/data/quran/index.ts**

```typescript
import surah1 from './surah-1.json';
import surah2 from './surah-2.json';
import surah112 from './surah-112.json';
import surah113 from './surah-113.json';
import surah114 from './surah-114.json';
import type { Surah } from '@/types';

// Array berisi semua surah
export const quranData: Surah[] = [
  surah1 as Surah,
  surah2 as Surah,
  surah112 as Surah,
  surah113 as Surah,
  surah114 as Surah,
];

// Helper function untuk cari surah by ID
export function getSurahById(id: number): Surah | undefined {
  return quranData.find((s) => s.id === id);
}
```

---

## 📚 Bagian 2: Struktur Data Kitab

### Hirarki Data Kitab

```
Koleksi Kitab
├─ Bulughul Maram (Ibnu Hajar Al-Asqalani)
│  ├─ Bab 1: Wudhu (isi teks panjang)
│  ├─ Bab 2: Shalat (isi teks panjang)
│  └─ Bab 3: Puasa (isi teks panjang)
├─ Riyadhus Shalihin (Imam An-Nawawi)
│  ├─ Bab 1: Ikhlas (isi teks panjang)
│  └─ Bab 2: Taubat (isi teks panjang)
└─ Kitab lainnya...
```

### Lokasi File

```
assets/data/kitab/
├── index.ts          ← File utama pengumpul
├── kitab-001.json    ← Data Bulughul Maram
└── kitab-002.json    ← Data Kitab kedua
```

**Status saat ini**: Baru ada 2 kitab. Target minimal 5-10 kitab.

### Struktur 1 File Kitab (kitab-XXX.json)

File ini berisi:
- **Metadata kitab**: ID, judul, penulis, deskripsi
- **Array chapters (bab)**: Setiap bab punya nomor, judul, dan konten teks panjang

**Contoh: kitab-001.json (Bulughul Maram)**

```json
{
  "id": "kitab-001",
  "title": "Bulughul Maram",
  "author": "Ibnu Hajar Al-Asqalani",
  "description": "Kitab yang membahas hadis-hadis yang digunakan sebagai hukum (dalil), diambil dari kitab-kitab hadis utama.",
  "chapters": [
    {
      "chapter_number": 1,
      "chapter_title": "Bab Wudhu",
      "content": "Hadis no. 1: Dari Ummu Salamah radhiyallahu 'anha, Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya umatku akan dipanggil pada hari kiamat dalam keadaan ghurran muhajjilin (bercahaya wajah dan anggota badannya karena bekas wudhu)...\"\n\nHadis no. 2: Dari Abu Hurairah radhiyallahu 'anhu, Rasulullah shallallahu 'alaihi wa sallam bersabda: \"Sesungguhnya umatku akan dipanggil pada hari kiamat dalam keadaan ghurran muhajjilin dari bekas wudhu mereka...\""
    },
    {
      "chapter_number": 2,
      "chapter_title": "Bab Shalat",
      "content": "Hadis no. 6: Dari Abu Hurairah radhiyallahu 'anhu..."
    }
    // ... bab 3, 4, dst
  ]
}
```

**Penjelasan Field:**
- `id`: ID unik kitab (format: "kitab-XXX")
- `title`: Judul kitab
- `author`: Nama penulis/pengarang
- `description`: Deskripsi singkat tentang kitab (opsional)
- `chapters`: Array berisi semua bab
  - `chapter_number`: Nomor bab
  - `chapter_title`: Judul bab
  - `content`: Isi bab dalam format teks panjang (bisa multiline dengan `\n`)

**Perbedaan dengan Quran:**
- **Quran**: Data per ayat (pendek-pendek, terstruktur)
- **Kitab**: Data per bab (teks panjang/paragraf, seperti buku)

### File index.ts Kitab

**Contoh: assets/data/kitab/index.ts**

```typescript
import kitab001 from './kitab-001.json';
import kitab002 from './kitab-002.json';
import type { Kitab } from '@/types';

// Array berisi semua kitab
export const kitabData: Kitab[] = [
  kitab001 as Kitab,
  kitab002 as Kitab
];

// Helper function untuk cari kitab by ID
export function getKitabById(id: string): Kitab | undefined {
  return kitabData.find((k) => k.id === id);
}
```

---

## 🔄 Bagian 3: Alur Data dari JSON ke Aplikasi

### Diagram Alur Lengkap

```
┌─────────────────────────────────────────────┐
│  1. SUMBER DATA (File JSON)                 │
│                                             │
│  assets/data/quran/surah-1.json             │
│  assets/data/kitab/kitab-001.json           │
└─────────────────────────────────────────────┘
              ↓ (import)
┌─────────────────────────────────────────────┐
│  2. INDEX FILE (Pengumpul)                  │
│                                             │
│  assets/data/quran/index.ts                 │
│  → Import semua file JSON surah             │
│  → Gabungkan jadi array: quranData[]        │
│  → Export untuk dipakai app                 │
└─────────────────────────────────────────────┘
              ↓ (import di screen)
┌─────────────────────────────────────────────┐
│  3. SCREEN LIST (Daftar Surah/Kitab)       │
│                                             │
│  src/app/(tabs)/quran.tsx                   │
│  → import { quranData } from '@/assets/data'│
│  → Render list 114 surah di layar           │
│  → User tap salah satu surah                │
└─────────────────────────────────────────────┘
              ↓ (navigasi ke detail)
┌─────────────────────────────────────────────┐
│  4. DETAIL SCREEN (Baca Ayat/Bab)          │
│                                             │
│  src/app/surah/[id].tsx                     │
│  → import { getSurahById }                  │
│  → Ambil data 1 surah by ID                 │
│  → Tampilkan semua ayat + terjemahan        │
│  → User bisa bookmark per ayat              │
└─────────────────────────────────────────────┘
              ↓ (user tap bookmark)
┌─────────────────────────────────────────────┐
│  5. STATE MANAGEMENT (Zustand)              │
│                                             │
│  src/stores/bookmark-store.ts               │
│  → Simpan bookmark ke AsyncStorage          │
│  → Data bookmark tersimpan di HP user       │
│  → Bisa diakses kapan saja (offline)        │
└─────────────────────────────────────────────┘
```

### Penjelasan Alur:

1. **File JSON** = Sumber data mentah (static)
2. **index.ts** = Mengumpulkan dan mengexport data
3. **List Screen** = Menampilkan daftar (Home, Quran Tab, Kitab Tab)
4. **Detail Screen** = Menampilkan isi lengkap (Ayat, Bab)
5. **State Management** = Menyimpan interaksi user (Bookmark, Progress)

---

## ➕ Bagian 4: Cara Menambah Data Baru (Step-by-Step)

### Scenario 1: Menambah 1 Surah Baru

**Contoh**: Menambah Surah Yasin (Surah ke-36)

#### **Step 1: Buat File JSON Baru**

1. Masuk ke folder: `assets/data/quran/`
2. Buat file baru: `surah-36.json`
3. Copy struktur dari `surah-1.json` sebagai template
4. Edit isinya:
   - Ubah `id` jadi `36`
   - Ubah `name_arabic` jadi `"يس"`
   - Ubah `name_latin` jadi `"Yasin"`
   - Ubah `translation_id` jadi `"Yasin"`
   - Ubah `total_ayat` jadi `83`
   - Isi array `ayat` dengan 83 ayat (nomor 1-83)

**Contoh isi surah-36.json:**

```json
{
  "id": 36,
  "name_arabic": "يس",
  "name_latin": "Yasin",
  "translation_id": "Yasin",
  "total_ayat": 83,
  "ayat": [
    {
      "number": 1,
      "arabic": "يس",
      "translation": "Yaasiin."
    },
    {
      "number": 2,
      "arabic": "وَٱلْقُرْءَانِ ٱلْحَكِيمِ",
      "translation": "Demi Al-Qur'an yang penuh hikmah,"
    }
    // ... ayat 3-83
  ]
}
```

#### **Step 2: Daftarkan di index.ts**

1. Buka file: `assets/data/quran/index.ts`
2. Tambah import di baris atas:
   ```typescript
   import surah36 from './surah-36.json';
   ```
3. Tambahkan ke array `quranData`:
   ```typescript
   export const quranData: Surah[] = [
     surah1 as Surah,
     surah2 as Surah,
     surah36 as Surah,  // ← Tambah ini
     surah112 as Surah,
     surah113 as Surah,
     surah114 as Surah,
   ];
   ```

#### **Step 3: Restart App & Test**

1. Stop server Expo (Ctrl+C)
2. Jalankan lagi: `npx expo start --clear`
3. Buka app di HP
4. Masuk ke tab "Al-Qur'an"
5. **Surah Yasin sekarang muncul di list!** ✅

---

### Scenario 2: Menambah 1 Kitab Baru

**Contoh**: Menambah kitab "Riyadhus Shalihin"

#### **Step 1: Buat File JSON Baru**

1. Masuk ke folder: `assets/data/kitab/`
2. Buat file baru: `kitab-003.json`
3. Isi dengan struktur kitab

**Contoh isi kitab-003.json:**

```json
{
  "id": "kitab-003",
  "title": "Riyadhus Shalihin",
  "author": "Imam An-Nawawi",
  "description": "Kitab yang berisi hadis-hadis pilihan tentang akhlak, adab, dan amalan shalih.",
  "chapters": [
    {
      "chapter_number": 1,
      "chapter_title": "Bab Ikhlas dan Niat",
      "content": "Hadis 1: Allah Ta'ala berfirman...\n\nHadis 2: Dari Umar bin Khathab..."
    },
    {
      "chapter_number": 2,
      "chapter_title": "Bab Taubat",
      "content": "Hadis 10: Allah Ta'ala berfirman..."
    }
    // ... bab 3-372 (Riyadhus Shalihin punya 372 bab)
  ]
}
```

#### **Step 2: Daftarkan di index.ts**

1. Buka file: `assets/data/kitab/index.ts`
2. Tambah import:
   ```typescript
   import kitab003 from './kitab-003.json';
   ```
3. Tambah ke array:
   ```typescript
   export const kitabData: Kitab[] = [
     kitab001 as Kitab,
     kitab002 as Kitab,
     kitab003 as Kitab,  // ← Tambah ini
   ];
   ```

#### **Step 3: Restart App & Test**

1. Restart server Expo
2. Buka tab "Kitab"
3. **Riyadhus Shalihin sekarang muncul di list!** ✅

---

## 🎯 Bagian 5: Keuntungan & Kekurangan Sistem Ini

### ✅ Keuntungan Sistem JSON Offline

1. **Full Offline**
   - Tidak perlu internet sama sekali
   - Semua konten tersedia 24/7
   - Cocok untuk daerah dengan internet tidak stabil

2. **Cepat & Responsif**
   - Data langsung ada di memori
   - Tidak perlu fetch/loading dari server
   - User experience lebih smooth

3. **Simple & Gratis**
   - Tidak perlu backend server
   - Tidak perlu database management
   - Tidak ada biaya hosting/maintenance
   - No API rate limit

4. **Kontrol Penuh atas Konten**
   - Kamu yang atur & verifikasi setiap konten
   - Tidak depend pada API pihak ketiga yang bisa down/berubah
   - Kualitas & akurasi terjaga

5. **Privacy Friendly**
   - Tidak ada tracking data user
   - Tidak perlu collect user data
   - Mudah lolos review App Store/Play Store

### ⚠️ Kekurangan & Limitasi

1. **Update Konten = Update Aplikasi**
   - Jika ada typo atau mau tambah konten, harus rilis update app
   - User harus download update untuk dapat konten baru
   - Tidak bisa real-time update

2. **Ukuran APK/IPA Lebih Besar**
   - Semua data di-bundle dalam app
   - Quran lengkap + 10 kitab ≈ 15-20 MB
   - Tapi masih acceptable (<50MB)

3. **Input Manual Lebih Lama**
   - Harus copy-paste atau ketik manual setiap ayat/bab
   - Butuh waktu untuk input 114 surah & banyak kitab
   - Tapi: sekali input, permanent!

4. **Tidak Ada Fitur Kolaboratif**
   - Tidak bisa crowdsourced content
   - Satu developer yang maintain

### 💡 Solusi Alternatif (Future Upgrade)

Jika nanti mau upgrade sistem, bisa consider:

1. **Hybrid Approach**:
   - Core content (Quran) tetap offline (bundled)
   - Kitab tambahan bisa download on-demand
   - User pilih mau download kitab mana

2. **Remote Config**:
   - Konten tetap di app
   - Metadata (judul, deskripsi) bisa update via remote config
   - Tidak perlu full app update untuk info update

3. **Backend + Sync** (Advanced):
   - Build simple backend API
   - Content delivery via CDN
   - Offline-first dengan sync saat online

---

## 📊 Bagian 6: Estimasi Data & Ukuran

### Estimasi Ukuran Data

**Al-Quran Lengkap (114 Surah):**
- Total ayat: ~6,236 ayat
- Per ayat: ~100-200 bytes (Arab + terjemahan)
- **Estimasi total: ~3-5 MB**

**Kitab (10 kitab, average 50 bab per kitab):**
- Per bab: ~2-5 KB (tergantung panjang)
- 10 kitab × 50 bab × 3.5 KB = 1,750 KB
- **Estimasi total: ~10-15 MB**

**Total Estimasi Bundle Size:**
- Base app + libraries: ~20 MB
- Data Quran: ~5 MB
- Data Kitab (10 kitab): ~15 MB
- **Total APK: ~40 MB** ✅ (acceptable!)

### Perbandingan dengan Kompetitor

| App | Ukuran APK | Konten |
|-----|------------|--------|
| App Quran populer | 20-30 MB | Quran + Audio |
| **Muslim App (kita)** | ~40 MB | Quran + 10 Kitab |
| App Kitab populer | 50-100 MB | Banyak kitab + fitur |

---

## 🔍 Bagian 7: Quality Control & Validation

### Checklist Sebelum Menambah Data

#### ✅ Untuk Surah Quran:

1. **Format JSON Valid**
   - Gunakan JSON validator online (jsonlint.com)
   - Pastikan tidak ada missing comma/bracket

2. **ID Surah Benar**
   - Surah 1 = Al-Fatihah
   - Surah 36 = Yasin
   - Surah 114 = An-Nas
   - Cek di [quran.com](https://quran.com) untuk verifikasi

3. **Teks Arab Akurat**
   - Copy dari sumber terpercaya (Kemenag RI, quran.com)
   - Pastikan semua harakat lengkap
   - Cek Unicode Arab (bukan font image)

4. **Terjemahan Resmi**
   - Gunakan terjemahan Kemenag RI (paling akurat)
   - Atau Tafsir Kemenag yang sudah standar
   - Hindari terjemahan yang tidak jelas sumbernya

5. **Jumlah Ayat Sesuai**
   - Al-Fatihah = 7 ayat
   - Al-Baqarah = 286 ayat
   - dst...
   - Cross-check dengan mushaf cetak

6. **Encoding UTF-8**
   - Simpan file dengan encoding UTF-8
   - Di VS Code: klik kanan → "Save with Encoding" → UTF-8
   - Agar teks Arab tidak rusak

#### ✅ Untuk Kitab:

1. **Metadata Lengkap**
   - Judul kitab yang benar
   - Nama penulis yang akurat
   - Deskripsi informatif

2. **Konten Akurat**
   - Copy dari sumber terpercaya (PDF kitab asli)
   - Verifikasi nomor hadis jika ada
   - Cek ejaan nama-nama rawi

3. **Struktur Bab Jelas**
   - Nomor bab urut (1, 2, 3...)
   - Judul bab yang deskriptif
   - Isi bab yang lengkap (tidak terpotong)

4. **Format Teks Rapi**
   - Gunakan `\n\n` untuk paragraf baru
   - Pisahkan hadis dengan jelas
   - Gunakan numbering jika perlu (Hadis 1:, Hadis 2:)

### Tools yang Bisa Dipakai

1. **JSON Validator**: [jsonlint.com](https://jsonlint.com)
2. **Quran Reference**: [quran.com](https://quran.com)
3. **Terjemahan Resmi**: [quran.kemenag.go.id](https://quran.kemenag.go.id)
4. **Text Editor**: VS Code (support JSON, UTF-8, syntax highlight)

---

## 🚀 Bagian 8: Tips & Best Practices

### Tips Efisiensi Input Data

1. **Batch Processing**
   - Jangan input 1-1 secara manual
   - Gunakan script Python/Node.js untuk convert dari sumber yang sudah ada
   - Contoh: convert dari CSV/Excel ke JSON

2. **Template File**
   - Buat 1 file template yang sudah benar
   - Copy untuk file baru
   - Tinggal edit isinya saja

3. **Automation Script** (Opsional)
   - Buat script untuk generate JSON dari API Quran.com
   - Buat script untuk validate semua JSON sekaligus
   - Lihat folder `/scripts` (jika ada)

4. **Git Workflow**
   - Commit per surah/kitab yang ditambahkan
   - Gunakan branch terpisah untuk input data
   - Merge ke main setelah di-verify

### Best Practices

1. **Incremental Addition**
   - Tidak perlu langsung input 114 surah sekaligus
   - Tambahkan per batch (10-20 surah)
   - Test setiap batch sebelum lanjut

2. **Version Control**
   - Commit setiap perubahan data ke Git
   - Buat commit message yang jelas: "Add Surah Yasin (36)"
   - Mudah rollback jika ada kesalahan

3. **Testing**
   - Setiap tambah data baru, test di app
   - Pastikan list muncul
   - Pastikan detail bisa dibuka
   - Pastikan bookmark berfungsi

4. **Documentation**
   - Catat sumber data yang dipakai
   - Tulis di README atau SOURCES.md
   - Untuk accountability & future reference

---

## 📞 Troubleshooting

### Problem: File JSON Error saat Build

**Symptom**: App crash atau error "Cannot parse JSON"

**Solution**:
1. Validate JSON di [jsonlint.com](https://jsonlint.com)
2. Cek missing comma, bracket, atau quote
3. Pastikan encoding UTF-8

### Problem: Teks Arab Tidak Muncul / Kotak-kotak

**Symptom**: Teks Arab jadi kotak `□□□`

**Solution**:
1. Pastikan file saved as UTF-8 (bukan ASCII atau Latin-1)
2. Di VS Code: File → Save with Encoding → UTF-8
3. Re-save dan restart app

### Problem: Surah Tidak Muncul di List

**Symptom**: Sudah buat file JSON tapi tidak muncul

**Solution**:
1. Cek apakah sudah di-import di `index.ts`
2. Cek apakah sudah ditambahkan ke array `quranData`
3. Restart Expo server dengan `--clear`: `npx expo start --clear`

### Problem: App Jadi Lambat setelah Tambah Banyak Data

**Symptom**: Loading lama, scroll lag

**Solution**:
1. Gunakan `FlatList` (sudah dipakai, tidak perlu ganti)
2. Lazy load: load data saat dibutuhkan saja
3. Compress JSON (remove whitespace)
4. Consider pagination untuk kitab yang sangat panjang

---

## 📚 Sumber Data Terpercaya

### Untuk Al-Quran

1. **Quran.com** - [https://quran.com](https://quran.com)
   - API tersedia (bisa scrape)
   - Terjemahan multiple bahasa

2. **Kemenag RI** - [https://quran.kemenag.go.id](https://quran.kemenag.go.id)
   - Terjemahan resmi pemerintah Indonesia
   - Paling akurat untuk Bahasa Indonesia

3. **Tanzil.net** - [https://tanzil.net](https://tanzil.net)
   - Download Quran text dalam berbagai format
   - XML, JSON, SQL available

### Untuk Kitab

1. **Al-Maktabah Al-Syamilah** - Database kitab digital terbesar
2. **Archive.org** - PDF kitab klasik scan
3. **Perpustakaan Digital Kemenag RI**
4. **Website resmi penerbit kitab** (Darul Haq, dll)

**⚠️ PENTING**: Selalu verifikasi keakuratan teks dengan mushaf cetak atau sumber terpercaya!

---

## 🎓 Ringkasan

### Cara Kerja Sistem Data:

1. Data disimpan sebagai **JSON files** di `assets/data/`
2. Setiap surah/kitab = **1 file JSON** terpisah
3. File **`index.ts`** mengumpulkan semua file jadi 1 array
4. Screen aplikasi **import array** tersebut dan render ke UI
5. User interaction (bookmark, progress) disimpan di **Zustand + AsyncStorage**

### Cara Menambah Data Baru:

1. **Buat file JSON baru** dengan struktur yang benar
2. **Daftarkan di `index.ts`** (import + add to array)
3. **Restart app** → Done! ✅

### Yang Perlu Diingat:

- ✅ Gunakan encoding **UTF-8** untuk teks Arab
- ✅ Validate JSON sebelum commit
- ✅ Gunakan sumber data **terpercaya**
- ✅ Test setiap data baru yang ditambahkan
- ✅ Commit per batch untuk mudah tracking

---

**Semoga panduan ini membantu! Happy coding! 🚀**

Jika ada pertanyaan atau butuh bantuan, jangan ragu untuk bertanya.
