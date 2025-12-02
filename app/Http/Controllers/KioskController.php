<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KioskController extends Controller
{
    /**
     * Get kiosk configuration (theme, settings)
     */
    public function getConfig()
    {
        $config = $this->loadJsonFile('kiosk/config.json', [
            'theme' => [
                'primaryColor' => '#c2282a',
                'logo' => '/images/logo-gowa.png',
                'headerTitle' => 'SIGMA - Sistem Informasi Desa'
            ],
            'idleTimeout' => [
                'enabled' => true,
                'duration' => 60000 // 60 seconds in milliseconds
            ]
        ]);

        return response()->json($config);
    }

    /**
     * Get multimedia slides
     */
    public function getSlides()
    {
        $slides = $this->loadJsonFile('kiosk/slides.json', [
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
        $services = $this->loadJsonFile('kiosk/services.json', [
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
        $runningText = $this->loadJsonFile('kiosk/running-text.json', [
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
        $analytics = $this->loadJsonFile('kiosk/analytics.json', ['events' => []]);

        // Add new event
        $analytics['events'][] = $validated;

        // Keep only last 1000 events to prevent file from growing too large
        if (count($analytics['events']) > 1000) {
            $analytics['events'] = array_slice($analytics['events'], -1000);
        }

        // Save analytics
        Storage::put('kiosk/analytics.json', json_encode($analytics, JSON_PRETTY_PRINT));

        return response()->json(['success' => true]);
    }

    /**
     * Helper method to load JSON file with fallback
     */
    private function loadJsonFile($path, $default = [])
    {
        if (Storage::exists($path)) {
            $content = Storage::get($path);
            $data = json_decode($content, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                return $data;
            }
        }

        // Return default and create file if it doesn't exist
        Storage::put($path, json_encode($default, JSON_PRETTY_PRINT));
        return $default;
    }
}
