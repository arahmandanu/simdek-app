<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class KioskDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kioskPath = public_path('kiosk');

        // Ensure directory exists
        if (!File::exists($kioskPath)) {
            File::makeDirectory($kioskPath, 0755, true);
        }

        // Seed slides.json
        $slidesData = [
            'slides' => [
                [
                    'id' => 1,
                    'type' => 'image',
                    'url' => '/media/images/slide-1.jpg',
                    'title' => 'Slide 1',
                    'duration' => 10000,
                    'order' => 1,
                    'active' => true,
                ],
                [
                    'id' => 2,
                    'type' => 'image',
                    'url' => '/media/images/slide-2.jpg',
                    'title' => 'Slide 2',
                    'duration' => 10000,
                    'order' => 2,
                    'active' => true,
                ],
                [
                    'id' => 3,
                    'type' => 'video',
                    'url' => '/media/videos/program.mp4',
                    'title' => 'Program Video',
                    'order' => 3,
                    'active' => true,
                ],
                [
                    'id' => 4,
                    'type' => 'pdf',
                    'url' => '/media/documents/Dinas-Sosial-Penerima-Bantuan.pdf',
                    'title' => 'Dinas Sosial - Penerima Bantuan',
                    'duration' => 15000,
                    'order' => 4,
                    'active' => true,
                ],
                [
                    'id' => 5,
                    'type' => 'pdf',
                    'url' => '/media/documents/Jml-Penduduk-Berdasarkan-Agama.pdf',
                    'title' => 'Jumlah Penduduk Berdasarkan Agama',
                    'duration' => 15000,
                    'order' => 5,
                    'active' => true,
                ],
            ],
        ];

        // Seed services.json
        $servicesData = [
            'services' => [
                [
                    'id' => 1,
                    'title' => 'Surat Keterangan Domisili',
                    'title_local' => 'Sura\' Keterangan Domisili',
                    'description' => 'Cetak surat keterangan domisili',
                    'description_local' => 'Pammari\' sura\' keterangan domisili',
                    'icon' => 'mdi-home-city',
                    'color' => '#c2282a',
                    'category' => 'administrasi',
                    'active' => true,
                    'order' => 1,
                ],
                [
                    'id' => 2,
                    'title' => 'Surat Keterangan Usaha',
                    'title_local' => 'Sura\' Keterangan Bisnis',
                    'description' => 'Cetak surat keterangan usaha',
                    'description_local' => 'Pammari\' sura\' keterangan bisnis',
                    'icon' => 'mdi-briefcase',
                    'color' => '#c2282a',
                    'category' => 'administrasi',
                    'active' => true,
                    'order' => 2,
                ],
                [
                    'id' => 3,
                    'title' => 'Surat Keterangan Tidak Mampu (SKTM)',
                    'title_local' => 'Sura\' Keterangan De\'na Sanggup (SKTM)',
                    'description' => 'Cetak surat keterangan tidak mampu',
                    'description_local' => 'Pammari\' sura\' keterangan de\'na sanggup',
                    'icon' => 'mdi-hand-heart',
                    'color' => '#c2282a',
                    'category' => 'administrasi',
                    'active' => true,
                    'order' => 3,
                ],
                [
                    'id' => 4,
                    'title' => 'Surat Pengantar Nikah',
                    'title_local' => 'Sura\' Pengantar Allau\'',
                    'description' => 'Cetak surat pengantar nikah',
                    'description_local' => 'Pammari\' sura\' pengantar allau\'',
                    'icon' => 'mdi-ring',
                    'color' => '#c2282a',
                    'category' => 'administrasi',
                    'active' => true,
                    'order' => 4,
                ],
                [
                    'id' => 5,
                    'title' => 'Surat Pengantar SKCK',
                    'title_local' => 'Sura\' Pengantar SKCK',
                    'description' => 'Cetak surat pengantar SKCK',
                    'description_local' => 'Pammari\' sura\' pengantar SKCK',
                    'icon' => 'mdi-shield-check',
                    'color' => '#c2282a',
                    'category' => 'administrasi',
                    'active' => true,
                    'order' => 5,
                ],
                [
                    'id' => 6,
                    'title' => 'Permohonan Bantuan Sosial',
                    'title_local' => 'Permohonan Bantuan Sosial',
                    'description' => 'Cetak permohonan bantuan sosial',
                    'description_local' => 'Pammari\' permohonan bantuan sosial',
                    'icon' => 'mdi-handshake',
                    'color' => '#c2282a',
                    'category' => 'bantuan',
                    'active' => true,
                    'order' => 6,
                ],
                [
                    'id' => 7,
                    'title' => 'Izin Penebangan/ Pengangkutan Kayu',
                    'title_local' => 'Izin Pappata\'/Pabbawa Kayu',
                    'description' => 'Cetak izin penebangan atau pengangkutan kayu',
                    'description_local' => 'Pammari\' izin pappata\' ri\'aga pabbawa kayu',
                    'icon' => 'mdi-tree',
                    'color' => '#c2282a',
                    'category' => 'perizinan',
                    'active' => true,
                    'order' => 7,
                ],
            ],
        ];

        // Seed config.json
        $configData = [
            'theme' => [
                'primaryColor' => '#c2282a',
                'logo' => '/logo.png',
                'headerTitle' => 'SIMDES - Kabupaten Gowa',
            ],
            'idleTimeout' => [
                'enabled' => true,
                'duration' => 60000,
            ],
        ];

        // Seed running-text.json
        $runningTextData = [
            'messages' => [
                [
                    'id' => 1,
                    'text' => 'Selamat datang di SIMDES Kabupaten Gowa',
                    'textMakassar' => 'Sannang Datang ri SIMDES Kabupaten Gowa',
                    'order' => 1,
                ],
                [
                    'id' => 2,
                    'text' => 'Layanan mandiri 24/7 untuk kemudahan Anda',
                    'textMakassar' => 'Pallayanan 24/7 untuk kamudahan anjo',
                    'order' => 2,
                ],
            ],
        ];

        // Seed analytics.json
        $analyticsData = [
            'events' => [],
        ];

        // Write files
        File::put(
            $kioskPath . '/slides.json',
            json_encode($slidesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        File::put(
            $kioskPath . '/services.json',
            json_encode($servicesData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        File::put(
            $kioskPath . '/config.json',
            json_encode($configData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        File::put(
            $kioskPath . '/running-text.json',
            json_encode($runningTextData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        File::put(
            $kioskPath . '/analytics.json',
            json_encode($analyticsData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        $this->command->info('Kiosk data seeded successfully!');
    }
}
