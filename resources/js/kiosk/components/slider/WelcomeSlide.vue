<template>
    <div class="welcome-slide-wrapper">
        <div class="welcome-container">
            <p class="welcome-subtitle">Dengan Segala Hormat Kami Sambut</p>
            <h2 class="guest-title">Ibu Bupati</h2>
            <h1 class="guest-name-bupati">Dr. Hj. Sitti Husniah Talenrang, S.E., M.M.</h1>

            <h2 class="guest-title-combine">&</h2>

            <h2 class="guest-title">Bapak Wakil Bupati</h2>
            <h1 class="guest-name">Ir. H. Darmawangsyah Muin, ST., M.Si.</h1>

            <h1 class="welcome-title">Selamat Datang</h1>
            <p class="welcome-message">
                Merupakan suatu kehormatan bagi kami atas kehadiran Bapak/Ibu. Kami siap mendukung visi dan misi pembangunan daerah demi kemajuan Kabupaten tercinta.
            </p>

        </div>
    </div>
</template>

<script setup lang="ts">
// Sekarang WelcomeSlide murni hanya untuk tampilan
</script>

<style scoped>
        .welcome-slide-wrapper {
            position: relative; /* Tetap relative */
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            /* Pertahankan centering untuk jaga-jaga, tapi kita akan fokus pada .welcome-container */
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* ========================================= */
        /* WELCOME CONTAINER STYLING */
        /* ========================================= */
        .welcome-container {
           /* MENGAKTIFKAN CENTERING MUTLAK */
            position: absolute; /* Lepaskan dari alur normal */
            top: 50%;           /* Pindah 50% dari atas */
            left: 50%;          /* Pindah 50% dari kiri */

            /* PENTING: Geser kembali 50% dari lebar dan tinggi elemen itu sendiri */
            transform: translate(-50%, -50%);
            width: 100%;
            /* Lebar dan Tinggi Maksimum */
            max-height: 90vh;
            text-align: center;
            background-color: #ffffff;

            /* Pertahankan Flexbox untuk menata elemen teks di dalamnya */
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .welcome-subtitle {
            /* Warna biru tua yang resmi */
            font-size: 3vw;
            color: #4a148c; /* Ungu/Maroon tua yang resmi */
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-weight: 400;
        }

        .guest-title {
            /* GELAR KEHORMATAN */
            font-size: 4.0vw;
            color: #333333;
            margin-top: 5px;
            margin-bottom: 20px;
            font-weight: 700;
        }

        .guest-title-combine {
            /* GELAR KEHORMATAN */
            font-size: 4.0vw;
            color: #333333;
            font-weight: 700;
        }

        .guest-name-bupati {
            /* NAMA/INSTITUSI */
            font-size: 5.5vw;
            color: #1a237e; /* Biru tua/Navy yang sangat formal */
            margin-top: 0px;
            padding-bottom: 15px;
            display: inline-block;
            font-weight: 900;
        }

        .guest-name {
            /* NAMA/INSTITUSI */
            font-size: 5.5vw;
            color: #1a237e; /* Biru tua/Navy yang sangat formal */
            margin-top: 0px;
            margin-bottom: 50px;
            padding-bottom: 15px;
            display: inline-block;
            font-weight: 900;
        }

        .welcome-title {
            border-top: 6px solid #4a148c; /* Garis pemisah resmi */
            /* Kata Selamat Datang */
            font-family: 'Georgia', serif;
            font-size: 6.5vw;
            color: #4a148c;
            margin-bottom: 20px;
            font-weight: 900;
        }

        .welcome-message {
            font-size: 2.8vw;
            color: #424242;
            line-height: 1.5;
            margin-bottom: 60px;
            max-width: 85%;
        }

        /* Gaya Tombol Aksi */
        .start-button {
            background-color: #1a237e; /* Warna biru navy resmi */
            color: white;
            padding: 20px 50px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 2.5vw;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: background-color 0.3s ease;
        }

        .start-button:hover {
            background-color: #0d1a61;
        }
</style>
