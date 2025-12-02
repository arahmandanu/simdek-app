<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KioskController extends Controller
{
    /**
     * Base path for kiosk data files
     */
    private $kioskPath;

    public function __construct()
    {
        $this->kioskPath = public_path('kiosk');
    }

    /**
     * Get kiosk configuration (theme, settings)
     */
    public function getConfig()
    {
        $config = $this->loadJsonFile('config.json', [
            'theme' => [
                'primaryColor' => '#c2282a',
                'logo' => '/logo.png',
                'headerTitle' => 'SIGMA - Sistem Informasi Desa'
            ],
            'idleTimeout' => [
                'enabled' => true,
                'duration' => 15000 // 15 seconds in milliseconds
            ]
        ]);

        return response()->json($config);
    }

    /**
     * Get multimedia slides
     */
    public function getSlides()
    {
        $slides = $this->loadJsonFile('slides.json', [
            'slides' => [
                [
                    'id' => 1,
                    'type' => 'image',
                    'url' => '/images/slides/welcome.jpg',
                    'duration' => 10000,
                    'order' => 1
                ]
            ]
        ]);

        return response()->json($slides);
    }

    /**
     * Get services menu
     */
    public function getServices()
    {
        $services = $this->loadJsonFile('services.json', [
            'services' => [
                [
                    'id' => 1,
                    'title' => 'Informasi Desa',
                    'titleMakassar' => 'Panrita Kampong',
                    'icon' => 'mdi-information',
                    'action' => 'navigate',
                    'route' => '/info',
                    'order' => 1
                ]
            ]
        ]);

        return response()->json($services);
    }

    /**
     * Get running text messages
     */
    public function getRunningText()
    {
        $runningText = $this->loadJsonFile('running-text.json', [
            'messages' => [
                [
                    'id' => 1,
                    'text' => 'Selamat datang di SIGMA Frontliner Kiosk',
                    'textMakassar' => 'Marampungak ri SIGMA Frontliner Kiosk',
                    'order' => 1
                ]
            ]
        ]);

        return response()->json($runningText);
    }

    /**
     * Track analytics/usage
     */
    public function trackAnalytics(Request $request)
    {
        $validated = $request->validate([
            'event' => 'required|string',
            'data' => 'nullable|array',
            'timestamp' => 'required|integer'
        ]);

        // Load existing analytics
        $analytics = $this->loadJsonFile('analytics.json', ['events' => []]);

        // Add new event
        $analytics['events'][] = $validated;

        // Keep only last 1000 events to prevent file from growing too large
        if (count($analytics['events']) > 1000) {
            $analytics['events'] = array_slice($analytics['events'], -1000);
        }

        // Save analytics
        $this->saveJsonFile('analytics.json', $analytics);

        return response()->json(['success' => true]);
    }

    /**
     * Helper method to load JSON file with fallback
     */
    private function loadJsonFile($filename, $default = [])
    {
        $filepath = $this->kioskPath . '/' . $filename;

        if (file_exists($filepath)) {
            $content = file_get_contents($filepath);
            $data = json_decode($content, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                return $data;
            }
        }

        // Return default and create file if it doesn't exist
        $this->saveJsonFile($filename, $default);
        return $default;
    }

    /**
     * Helper method to save JSON file
     */
    private function saveJsonFile($filename, $data)
    {
        // Ensure kiosk directory exists
        if (!is_dir($this->kioskPath)) {
            mkdir($this->kioskPath, 0755, true);
        }

        $filepath = $this->kioskPath . '/' . $filename;
        file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}
