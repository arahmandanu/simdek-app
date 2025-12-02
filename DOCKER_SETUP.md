# Docker Setup Guide - SIMDEK App

Complete step-by-step guide to run this application in Docker environment.

## Prerequisites

- Docker Desktop installed (macOS/Windows) or Docker Engine (Linux)
- Docker Compose V2 (included with Docker Desktop)
- Git installed

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd simdek-app

# 2. Run the setup script
./docker-setup.sh

# 3. Access the application
# Frontend: http://localhost:8000
# Vite Dev Server: http://localhost:5173
# Database: localhost:3306
```

## Manual Setup (Step by Step)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd simdek-app
```

### Step 2: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your settings
# Key variables:
# DB_DATABASE=simdek
# DB_USERNAME=root
# DB_PASSWORD=secret
# APP_URL=http://localhost:8000
```

### Step 3: Build and Start Docker Containers

```bash
# Build and start all containers
docker compose up -d --build

# Check container status
docker compose ps
```

You should see 3 running containers:
- `simdek_app` - PHP/Nginx application server
- `simdek_db` - MySQL database
- `simdek_node` - Node.js for Vite development

### Step 4: Install Dependencies

```bash
# Install PHP dependencies
docker compose exec app composer install

# Install Node dependencies (if not auto-installed)
docker compose exec node npm install
```

### Step 5: Application Setup

```bash
# Generate application key
docker compose exec app php artisan key:generate

# Run database migrations
docker compose exec app php artisan migrate

# Create storage symlink
docker compose exec app php artisan storage:link

# Set proper permissions
docker compose exec app chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
```

### Step 6: Initialize Kiosk Data

```bash
# Create kiosk data directory
docker compose exec app mkdir -p public/kiosk

# Initialize default kiosk data files
docker compose exec app php artisan kiosk:init
# OR manually copy example files
docker compose exec app cp -r storage/app/.gitkeep public/kiosk/
```

The kiosk data files will be created at `public/kiosk/`:
- `config.json` - Kiosk theme and settings
- `slides.json` - Media slider content
- `services.json` - Service menu items
- `running-text.json` - Ticker messages
- `analytics.json` - Usage tracking data

### Step 7: Build Frontend Assets

```bash
# Development mode (with hot reload)
docker compose exec node npm run dev

# OR Production build
docker compose exec node npm run build
```

### Step 8: Access the Application

- **Main Application**: http://localhost:8000
- **Kiosk Interface**: http://localhost:8000/kiosk
- **Vite Dev Server**: http://localhost:5173 (auto-proxied)
- **API Endpoints**: http://localhost:8000/api

## Container Management

### View Logs

```bash
# All containers
docker compose logs -f

# Specific container
docker compose logs -f app
docker compose logs -f node
docker compose logs -f db
```

### Execute Commands in Containers

```bash
# PHP/Laravel commands
docker compose exec app php artisan [command]
docker compose exec app composer [command]

# Node/NPM commands
docker compose exec node npm [command]

# MySQL commands
docker compose exec db mysql -u root -p
```

### Stop Containers

```bash
# Stop all containers
docker compose stop

# Stop and remove containers
docker compose down

# Stop and remove containers with volumes (⚠️ deletes database)
docker compose down -v
```

### Restart Containers

```bash
# Restart all
docker compose restart

# Restart specific container
docker compose restart app
docker compose restart node
```

## Reset Environment (Clean Start)

To completely reset the environment for fresh testing:

```bash
# Run the reset script
./docker-reset.sh

# OR manually:

# 1. Stop and remove all containers and volumes
docker compose down -v

# 2. Remove generated files
rm -rf vendor node_modules public/build public/hot

# 3. Remove kiosk data files
rm -rf public/kiosk/*.json

# 4. Remove environment file
rm .env

# 5. Start fresh setup
cp .env.example .env
docker compose up -d --build
docker compose exec app composer install
docker compose exec node npm install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
docker compose exec app php artisan storage:link
```

## Common Issues & Solutions

### Issue: Port Already in Use

```bash
# Error: port 8000 is already allocated

# Solution 1: Stop the conflicting service
lsof -ti:8000 | xargs kill -9

# Solution 2: Change port in docker-compose.yml
# Change "8000:80" to "8080:80"
```

### Issue: Permission Denied

```bash
# Solution: Fix permissions
docker compose exec app chown -R www-data:www-data /var/www/html/storage
docker compose exec app chmod -R 775 /var/www/html/storage
```

### Issue: Database Connection Failed

```bash
# Check if database container is running
docker compose ps db

# Check database logs
docker compose logs db

# Solution: Wait for database initialization (can take 30-60 seconds)
docker compose exec db mysql -u root -p -e "SELECT 1"
```

### Issue: Node Modules Not Found

```bash
# Reinstall node modules
docker compose exec node rm -rf node_modules
docker compose exec node npm install
```

### Issue: Composer Dependencies Not Installed

```bash
# Reinstall composer dependencies
docker compose exec app rm -rf vendor
docker compose exec app composer install
```

### Issue: Vite Not Hot Reloading

```bash
# Restart node container
docker compose restart node

# Check Vite configuration in vite.config.ts
# Ensure server.host is '0.0.0.0'
```

## Development Workflow

### Making Code Changes

1. Edit files in your local IDE
2. Changes are automatically reflected in containers (volume mount)
3. Frontend changes trigger hot reload (Vite)
4. Backend changes require no restart

### Running Tests

```bash
# PHP Unit tests
docker compose exec app php artisan test

# JavaScript tests
docker compose exec node npm run test
```

### Database Management

```bash
# Run migrations
docker compose exec app php artisan migrate

# Rollback migrations
docker compose exec app php artisan migrate:rollback

# Seed database
docker compose exec app php artisan db:seed

# Fresh migration with seed
docker compose exec app php artisan migrate:fresh --seed
```

### Clearing Caches

```bash
# Clear all caches
docker compose exec app php artisan optimize:clear

# Clear specific caches
docker compose exec app php artisan cache:clear
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear
```

## Production Deployment

For production deployment, use a separate `docker-compose.prod.yml`:

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Start production containers
docker compose -f docker-compose.prod.yml up -d
```

## Kiosk Data Management

### Kiosk Data Location

All kiosk data is now stored in `public/kiosk/` directory for direct access:
- **Config**: `public/kiosk/config.json`
- **Slides**: `public/kiosk/slides.json`
- **Services**: `public/kiosk/services.json`
- **Running Text**: `public/kiosk/running-text.json`
- **Analytics**: `public/kiosk/analytics.json`

### Updating Kiosk Data

```bash
# Edit files directly
nano public/kiosk/services.json

# OR use API endpoints to update programmatically
curl -X POST http://localhost:8000/api/kiosk/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event":"page_view","data":{},"timestamp":1234567890}'
```

### Reset Kiosk Data

```bash
# Remove all kiosk data
docker compose exec app rm -rf public/kiosk/*.json

# Re-initialize with defaults
docker compose exec app php artisan kiosk:init
```

## Useful Docker Commands

```bash
# View container resource usage
docker stats

# Inspect container details
docker inspect simdek_app

# Execute shell in container
docker compose exec app sh
docker compose exec node sh

# Copy files from container
docker cp simdek_app:/var/www/html/storage/logs/laravel.log ./local-logs/

# Copy files to container
docker cp ./local-file.txt simdek_app:/var/www/html/

# Rebuild specific service
docker compose up -d --build app

# View container IP address
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' simdek_app
```

## Monitoring & Debugging

### Application Logs

```bash
# Laravel logs
docker compose exec app tail -f storage/logs/laravel.log

# Nginx access logs
docker compose exec app tail -f /var/log/nginx/access.log

# Nginx error logs
docker compose exec app tail -f /var/log/nginx/error.log

# PHP-FPM logs
docker compose exec app tail -f /var/log/php8/error.log
```

### Database Queries

```bash
# Connect to MySQL
docker compose exec db mysql -u root -p simdek

# Show tables
docker compose exec db mysql -u root -p -e "USE simdek; SHOW TABLES;"

# Export database
docker compose exec db mysqldump -u root -p simdek > backup.sql

# Import database
docker compose exec -T db mysql -u root -p simdek < backup.sql
```

## Environment Variables Reference

Key environment variables in `.env`:

```env
APP_NAME="SIMDEK"
APP_ENV=local
APP_KEY=base64:xxxxx
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=simdek
DB_USERNAME=root
DB_PASSWORD=secret

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file

VITE_APP_NAME="${APP_NAME}"
```

## Support

For issues and questions:
1. Check container logs: `docker compose logs`
2. Verify all containers are running: `docker compose ps`
3. Review this guide's troubleshooting section
4. Check Laravel logs: `storage/logs/laravel.log`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Documentation](https://laravel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
