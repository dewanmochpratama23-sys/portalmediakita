# 📰 MediaKita — Platform Berita Kolaboratif & Living Assistance

Platform media berita digital independen berbasis komunitas (*Community-Driven News Platform*) yang dilengkapi baris informasi harian praktis (*Living Assistance Widgets*) serta sistem kemitraan bagi hasil royalti 70% untuk jurnalis warga dan kontributor tulisan.

Desain mengusung estetika **Editorial Jurnalisme Otentik (Non-AI Generated)** dengan tipografi surat kabar modern, palet warna *Warm Newsprint* (`#FAF8F5`), *Deep Charcoal* (`#1C1917`), dan aksen *Editorial Crimson* (`#991B1B`).

---

## 🚀 Fitur Utama dalam Kode Ini

1. **Halaman Utama (Frontend Portal Berita):**
   - *Masthead* surat kabar formal dengan tipografi serif elegan dan tanggal edisi harian.
   - **Living Assistance Bar:** Widget real-time harga emas Antam (UBPP Logam Mulia), prakiraan cuaca BMKG, indeks kualitas udara (AQI), skor live BRI Liga 1, dan radar peristiwa lokal.
   - *Laporan Utama (Lead Story)* dengan fotografi jurnalistik, dateline em-dash, dan byline kredensial.
   - *Sidebar Dispatch:* Kolom Opini Warga, formulir ajakan kontributor, dan slot pariwara UMKM lokal.
   - Grid berita rubrik khusus (Kebijakan Publik, Ekonomi Rakyat, Riset & Sains, Seni & Budaya).
   - Mode baca penuh artikel interaktif.

2. **Dashboard Penulis & Kontributor:**
   - Profil penulis dengan verifikasi identitas pers warga.
   - 4 Metrik Kunci: Total naskah, akumulasi pembaca (views), estimasi royalti 70%, dan skor kepatuhan orisinalitas.
   - Tabel manajemen artikel dengan indikator status (*Terbit*, *Menunggu Kurasi*, *Draf Pribadi*).
   - Tombol klaim pencairan bagi hasil royalti.

3. **Meja Penulisan Naskah (Rich Editor):**
   - Editor penulisan dengan rubrik kategori, kata kunci, target wilayah, foto sampul, toolbar kutipan/heading, dan pakta integritas anti-plagiarisme.

4. **Panel Redaksi (Moderasi Kurator):**
   - Antrean moderasi naskah masuk. Editor dapat membaca naskah, memberikan catatan revisi, atau menerbitkan (*Publish*) langsung ke halaman depan portal.

---

## 🛠️ Panduan Menjalankan Proyek Secara Lokal

Pastikan Anda telah menginstal **Node.js** (v18 ke atas) di komputer Anda.

### 1. Masuk ke direktori proyek
```bash
cd mediakita-portal
```

### 2. Instal dependensi
```bash
npm.cmd install
```

### 3. Jalankan server lokal
```bash
npm.cmd run dev
```
Buka browser di alamat: `http://localhost:3000`

---

## 🗄️ Menghubungkan Database Supabase (Gratis)

1. Buka [Supabase](https://supabase.com) dan buat proyek baru (Paket Gratis / Free Tier).
2. Masuk ke menu **SQL Editor**, buka file `supabase/schema.sql` di proyek ini, salin seluruh kodenya, dan klik **Run**.
3. Buat file `.env.local` di root folder proyek ini:
   ```env
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=kunci-anon-anda
   ```
4. Proyek akan otomatis tersinkronisasi ke PostgreSQL Supabase!

---

## 🌐 Cara Deploy Gratis ke Vercel

1. Unggah folder proyek ini ke repositori GitHub Anda.
2. Buka [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Impor repositori GitHub Anda dan klik **Deploy**.
4. Website berita kolaboratif Anda akan langsung aktif secara global dengan CDN Vercel!
