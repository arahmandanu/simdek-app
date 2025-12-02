#!/bin/bash

# SIMDEK Docker Setup Script
# This script automates the initial setup of the application

set -e

echo "================================================"
echo "  SIMDEK Application - Docker Setup"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose V2."
    exit 1
fi

print_success "Docker and Docker Compose are installed"
echo ""

# Step 1: Environment Setup
echo "Step 1: Setting up environment..."
if [ ! -f .env ]; then
    print_info "Creating .env file from .env.example"
    cp .env.example .env
    print_success ".env file created"
else
    print_warning ".env file already exists, skipping..."
fi
echo ""

# Step 2: Build and Start Containers
echo "Step 2: Building and starting Docker containers..."
print_info "This may take a few minutes on first run..."
docker compose up -d --build

print_success "Containers started"
echo ""

# Wait for containers to be ready
echo "Step 3: Waiting for containers to initialize..."
sleep 5
print_success "Containers ready"
echo ""

# Step 4: Install PHP Dependencies
echo "Step 4: Installing PHP dependencies..."
docker compose exec app composer install --no-interaction --prefer-dist --optimize-autoloader
print_success "Composer dependencies installed"
echo ""

# Step 5: Install Node Dependencies
echo "Step 5: Installing Node dependencies..."
docker compose exec node npm install
print_success "Node dependencies installed"
echo ""

# Step 6: Generate Application Key
echo "Step 6: Generating application key..."
docker compose exec app php artisan key:generate --force
print_success "Application key generated"
echo ""

# Step 7: Run Migrations
echo "Step 7: Running database migrations..."
print_info "Waiting for database to be ready..."
sleep 10

# Wait for MySQL to be ready
MAX_TRIES=30
COUNTER=0
until docker compose exec db mysql -u root -p"${DB_PASSWORD:-secret}" -e "SELECT 1" &> /dev/null; do
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -gt $MAX_TRIES ]; then
        print_error "Database failed to start within expected time"
        exit 1
    fi
    echo "Waiting for database... ($COUNTER/$MAX_TRIES)"
    sleep 2
done

print_success "Database is ready"

docker compose exec app php artisan migrate --force
print_success "Migrations completed"
echo ""

# Step 8: Create Storage Link
echo "Step 8: Creating storage symbolic link..."
docker compose exec app php artisan storage:link
print_success "Storage link created"
echo ""

# Step 9: Set Permissions
echo "Step 9: Setting proper permissions..."
docker compose exec app chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
docker compose exec app chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
print_success "Permissions set"
echo ""

# Step 10: Initialize Kiosk Data
echo "Step 10: Initializing kiosk data..."
docker compose exec app php artisan db:seed --class=KioskDataSeeder
print_success "Kiosk data initialized"
echo ""

# Step 11: Build Frontend Assets
echo "Step 11: Building frontend assets..."
print_info "Starting Vite development server..."
# Note: This runs in background via docker-compose
print_success "Vite dev server started"
echo ""

# Final Status
echo "================================================"
echo "  Setup Complete! 🎉"
echo "================================================"
echo ""
print_success "Application is ready!"
echo ""
echo "Access your application:"
echo "  • Main App:     http://localhost:8000"
echo "  • Kiosk UI:     http://localhost:8000/kiosk"
echo "  • Vite Dev:     http://localhost:5173"
echo "  • Database:     localhost:3306"
echo ""
echo "Useful commands:"
echo "  • View logs:    docker compose logs -f"
echo "  • Stop:         docker compose stop"
echo "  • Restart:      docker compose restart"
echo "  • Shell:        docker compose exec app sh"
echo ""
print_warning "Note: Vite dev server may take a minute to fully start"
echo ""
