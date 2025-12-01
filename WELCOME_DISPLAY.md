# Welcome Display System - Government Purpose

A fullscreen welcome display application designed for large monitors at government office entrances.

## Features

### 🎯 Top Navigation Bar (80px height)

- **Logo & Title**: Government agency branding on the left
- **Navigation Menu**:
  - Home
  - Cetak Surat (Print Letters)
- Primary color theme with white text
- Clean, professional design

### 🖼️ Fullscreen Display Body

- **Auto-rotating Image Carousel**: Changes every 5 seconds
- **Full height/width**: Optimized for large displays
- **Welcome Overlay**:
  - "Selamat Datang" (Welcome)
  - "Sistem Informasi Pelayanan Publik Terpadu"
- **Smooth Transitions**: Professional fade effects
- **Mock Images**: Currently using Unsplash placeholders

### 📢 Running Text Footer (60px height)

- **Continuous scrolling text**: Smooth animation
- **Government Information**:
  - Welcome message
  - Service hours (Monday-Friday, 08:00-16:00 WIB)
  - Document preparation reminder
  - Service quality messages
  - Community building messages
- **Auto-loops**: Seamless continuous display

## Components Structure

```
App.vue
├── TopNavBar.vue (Navigation)
├── FullscreenDisplay.vue (Main content)
└── RunningTextFooter.vue (Bottom ticker)
```

## Fullscreen Mode

For kiosk/display mode, press **F11** in the browser to enter fullscreen.

Alternatively, add this JavaScript to auto-fullscreen:

```javascript
// Add to app.ts for auto-fullscreen
if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}
```

## Customization

### Change Logo

Edit `TopNavBar.vue`:

```vue
<v-icon size="40" color="primary">mdi-shield-crown</v-icon>
```

Replace with your government logo or custom icon.

### Update Running Text

Edit `RunningTextFooter.vue`:

```typescript
const runningTexts = ref([
  'Your custom message 1',
  'Your custom message 2',
  // Add more messages
]);
```

### Change Images

Edit `FullscreenDisplay.vue`:

```typescript
const images = ref(['/path/to/your/image1.jpg', '/path/to/your/image2.jpg']);
```

Place images in `public/images/` folder.

### Adjust Colors

The app uses Vuetify's primary color. Change in `app.ts`:

```typescript
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2', // Change to your color
        },
      },
    },
  },
});
```

## Display Recommendations

### Monitor Settings

- **Resolution**: 1920x1080 or higher
- **Aspect Ratio**: 16:9
- **Orientation**: Landscape
- **Brightness**: 70-80% for indoor use

### Browser Settings

- Use Chrome/Edge in kiosk mode
- Disable screensaver
- Enable auto-start on boot
- Clear cache regularly

### Image Guidelines

- **Format**: JPG or PNG
- **Resolution**: 1920x1080 minimum
- **File Size**: < 2MB for smooth loading
- **Content**: Professional, government-appropriate images

## Kiosk Mode Setup

### Windows

```bash
chrome.exe --kiosk --app=http://localhost:8000
```

### Linux

```bash
chromium-browser --kiosk --app=http://localhost:8000
```

### Auto-start (Windows)

Create a shortcut in:

```
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp
```

## Mock Data

Currently using:

- Unsplash placeholder images
- Indonesian government terminology
- Standard office hours (08:00-16:00)

Replace with actual government assets before production deployment.

## Accessibility

- High contrast text
- Large, readable fonts
- Clear visual hierarchy
- Professional government branding
- Multilingual support ready (currently Indonesian)

## Production Checklist

- [ ] Replace mock images with official photos
- [ ] Update logo with government emblem
- [ ] Customize running text messages
- [ ] Set correct office hours
- [ ] Configure fullscreen auto-start
- [ ] Test on target display hardware
- [ ] Set up auto-refresh schedule
- [ ] Configure offline fallback
- [ ] Add emergency contact information
- [ ] Test with actual government staff

## Support

For large monitor display issues:

1. Check browser zoom level (should be 100%)
2. Verify display resolution settings
3. Test fullscreen mode (F11)
4. Clear browser cache
5. Restart application container
