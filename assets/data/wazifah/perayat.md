# Pola Manual Ayat — KUBRO & SUGRO

File ini sebagai panduan. Anda atur semua nilai `arabic`, `translation`, dan `ayat` secara manual di:
- `assets/data/wazifah/sugro.json`
- `assets/data/wazifah/kubro.json`

## Struktur `ayatPairs` (per section Al-Quran)

```json
{
  "section_number": 2,
  "title": "Al-Fatihah",
  "arabic": "...",
  "translation": "...",
  "repetition": 1,
  "source": "QS Al-Fatihah 1-7",
  "ayatPairs": [
    {
      "ayat": 1,
      "arabic": "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
      "translation": "Dengan menyebut nama Allah..."
    },
    {
      "ayat": 2,
      "arabic": "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ",
      "translation": "Segala puji bagi Allah..."
    }
  ]
}
```

## Catatan Pengaturan

- `ayat` → angka yang akan ditampilkan di layar. Anda bebas atur (bisa 1, 2, 3, dst, atau angka sebenarnya).
- `arabic` → teks Arab per bagian (sudah otomatis terpecah dari `۝` saat pertama kali).
- `translation` → teks Indonesia per bagian. **Saat ini kosong** agar Anda isi sesuai keinginan.
- Untuk section non-Quran (`source`: Do'a Al-Matsurat, Sunnah, dsb), `ayatPairs` tidak diperlukan; adapter akan menggunakan teks tunggal.

## File yang perlu diedit

- `assets/data/wazifah/sugro.json`
- `assets/data/wazifah/kubro.json`

## Label di UI

Label "Ayat X" di screen (`wazifah-sugro.tsx`, `wazifah-kubro.tsx`) sudah otomatis menggunakan index `i + 1` dari array `ayatPairs`. Jadi urutan array = urutan tampilan.
