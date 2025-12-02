#!/bin/bash

# SIMDEK Kiosk Data Setup Script
# This script initializes default kiosk data

set -e

echo "================================================"
echo "  SIMDEK - Kiosk Data Initialization"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Run the seeder
print_info "Seeding kiosk data..."
php artisan db:seed --class=KioskDataSeeder

print_success "Kiosk data initialized successfully!"
echo ""
echo "The following files have been populated:"
echo "  • public/kiosk/slides.json (5 slides)"
echo "  • public/kiosk/services.json (7 services)"
echo "  • public/kiosk/config.json"
echo "  • public/kiosk/running-text.json"
echo "  • public/kiosk/analytics.json"
echo ""
