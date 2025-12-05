<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="theme-color" content="#c2282a">
    <title>SIGMA Frontliner Kiosk</title>

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png">

    <!-- PWA Meta Tags -->
    <link rel="manifest" href="{{ asset('/manifest.json') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <base href="{{ url('/') }}">
    @vite(['resources/sass/app.scss', 'resources/js/kiosk/main.ts'])
</head>

<body>
    <div id="kiosk-app"></div>
</body>

</html>
