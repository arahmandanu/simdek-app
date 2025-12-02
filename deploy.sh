#!/bin/bash

# SIMDES Kiosk Deployment Script
# This script builds and prepares the kiosk application for production deployment

set -e  # Exit on error

echo "🚀 Starting SIMDES Kiosk Deployment..."

# Check if running in correct directory
if [ ! -f "artisan" ]; then
    echo "❌ Error: artisan file not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Install Node dependencies
echo ""
echo "📦 Installing Node dependencies..."
npm ci --production=false

# Step 2: Install Composer dependencies
echo ""
echo "📦 Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev

# Step 3: Run type checking
echo ""
echo "🔍 Running TypeScript type checking..."
npm run type-check

# Step 4: Run linting
echo ""
echo "🔍 Running ESLint..."
npm run lint:check

# Step 5: Run tests
echo ""
echo "🧪 Running tests..."
npm run test

# Step 6: Build frontend assets
echo ""
echo "🏗️  Building frontend assets..."
npm run build

# Step 7: Optimize Laravel
echo ""
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 8: Clear old caches
echo ""
echo "🧹 Clearing old caches..."
php artisan cache:clear

# Step 9: Create storage directories
echo ""
echo "📁 Setting up storage directories..."
mkdir -p storage/app/kiosk
mkdir -p storage/framework/cache
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs

# Step 10: Set permissions
echo ""
echo "🔒 Setting permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Step 11: Create default kiosk data files if they don't exist
echo ""
echo "📄 Checking kiosk data files..."
if [ ! -f "storage/app/kiosk/config.json" ]; then
    echo "Creating default config.json..."
    cat > storage/app/kiosk/config.json << 'EOF'
{
  "theme": {
    "primaryColor": "#c2282a",
    "logo": "/images/logo-gowa.png",
    "headerTitle": "SIGMA Frontliner Kiosk"
  },
  "settings": {
    "idleTimeout": 60,
    "language": "id"
  }
}
EOF
fi

if [ ! -f "storage/app/kiosk/slides.json" ]; then
    echo "Creating default slides.json..."
    cat > storage/app/kiosk/slides.json << 'EOF'
{
  "slides": []
}
EOF
fi

if [ ! -f "storage/app/kiosk/services.json" ]; then
    echo "Creating default services.json..."
    cat > storage/app/kiosk/services.json << 'EOF'
{
  "services": []
}
EOF
fi

if [ ! -f "storage/app/kiosk/running-text.json" ]; then
    echo "Creating default running-text.json..."
    cat > storage/app/kiosk/running-text.json << 'EOF'
{
  "messages": [
    {
      "id": 1,
      "message_id": "Selamat datang di SIGMA Frontliner Kiosk",
      "message_makassar": "Sokkang borong ri SIGMA Frontliner Kiosk",
      "order": 1,
      "active": true
    }
  ]
}
EOF
fi

if [ ! -f "storage/app/kiosk/analytics.json" ]; then
    echo "Creating default analytics.json..."
    cat > storage/app/kiosk/analytics.json << 'EOF'
{
  "events": []
}
EOF
fi

# Step 12: Generate application key if needed
echo ""
echo "🔑 Checking application key..."
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    echo "Generating application key..."
    php artisan key:generate
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with production settings"
echo "2. Configure web server (Nginx/Apache)"
echo "3. Set up SSL certificate"
echo "4. Configure supervisor for queue workers (if needed)"
echo "5. Set up cron for scheduled tasks"
echo ""
echo "🌐 Access kiosk at: http://your-domain.com/kiosk"
