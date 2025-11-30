# About SIMDEK-APP

## 💻 SIMDEK: Sistem Informasi Manajemen Desa/Kelurahan

Sistem Informasi Manajemen Desa/Kelurahan (SIMDEK) adalah aplikasi berbasis web yang dirancang untuk meningkatkan transparansi, efisiensi, dan kualitas pelayanan publik di tingkat Desa/Kelurahan.

Aplikasi ini berfungsi sebagai pusat informasi terpadu dan platform manajemen data serta dokumentasi kegiatan pemerintah Desa/Kelurahan, yang dapat diakses oleh masyarakat, perangkat desa, serta pihak pengawas seperti Bupati/Wakil Bupati.


## 🛠️ Persyaratan Sistem
Pastikan sistem Anda memenuhi persyaratan berikut sebelum memulai instalasi:

    1. PHP: Versi 8.1 atau lebih tinggi (Direkomendasikan PHP 8.2)
    2. Web Server: Nginx atau Apache
    3. Database: MySQL 5.7+ atau MariaDB 10.2.7+
    4. Composer: Versi terbaru
    5. Node.js & npm/Yarn: Untuk kompilasi aset front-end (jika menggunakan tool seperti Laravel Mix/Vite)
    6. Vue

## 📦 Instalasi Proyek

Ikuti langkah-langkah di bawah ini untuk menyiapkan proyek SIMDEK:

1. Kloning Repositori

```Bash
git clone git@github.com:arahmandanu/simdek-app.git simdek-app
cd simdek-app
```
2. Instalasi Dependensi PHP

Gunakan Composer untuk menginstal semua dependensi Laravel:
```Bash
composer install
```
3. Konfigurasi Lingkungan

Buat file .env dengan menyalin file .env.example:
```Bash
cp .env.example .env
```
Generate Key Aplikasi:
```Bash
php artisan key:generate
```
Konfigurasi Database: Buka file .env dan sesuaikan pengaturan database Anda:

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=simdek_db
    DB_USERNAME=root
    DB_PASSWORD=

4. Migrasi Database dan Seeder
Jalankan migrasi untuk membuat tabel-tabel di database Anda. Anda mungkin juga ingin menjalankan seeder jika ada data awal:

```Bash
php artisan migrate:fresh --seed
```
5. Instalasi dan Kompilasi Aset Front-end (Jika Diperlukan)
Anda perlu menginstal dan mengkompilasi aset:
Bash
```
npm install
npm run dev
# Atau 'npm run build' untuk production
```

6. Jalankan Server Lokal
Anda dapat menggunakan server pengembangan bawaan Laravel:
```Bash
php artisan serve
```
Aplikasi kini dapat diakses di
```
http://127.0.0.1:8000.
```
### 🚀 Fitur Utama

SIMDEK mencakup berbagai modul untuk mendukung operasional Desa/Kelurahan:

A. 📹 Modul Keterbukaan Informasi dan Promosi
    1. Menampilkan Video penyampaian program unggulan oleh Bupati & Wakil Bupati.
    2. Menampilkan Video Camat & Dokumentasi Kegiatan Desa/Kelurahan.
    3. Menampilkan Slide Profile Kepala Desa/Lurah & Staf.
    4. Menampilkan Slide Profile Ketua BPD & Staf.
    5. Menampilkan Running Text untuk informasi cepat.
    6. Live Zoom (Integrasi tautan).
    7. Terintegrasi ke Web Desa/Kelurahan (Poin 13).

B. 📊 Modul Data & Pelaporan
    Akses Data Desa/Kelurahan oleh Bupati dan Wakil Bupati.
    Menampilkan Data Penerima Bantuan Sosial (Bansos, PKH, BLT).
    Menampilkan Data Penduduk.
    Menampilkan Laporan Realisasi Anggaran.
    Desa & Rencana Program Kerja Desa/Kelurahan.

C. 🛍️ Modul Perekonomian
    Menampilkan Produk Koperasi Merah Putih dan BUMDES.

D. 📝 Modul Pelayanan Surat
Modul ini mencakup pengajuan dan/atau pembuatan surat-surat administratif:

    Surat Keterangan: Domisili, Usaha, SKTM, Dll.
    Surat Pengantar: Nikah, SKCK, Dll.
    Surat Lainnya: Permohonan Bantuan Sosial, Izin Penebangan/Pengangkutan Kayu.
