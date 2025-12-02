#!/bin/bash

# SIMDEK Docker Reset Script
# This script completely resets the environment for fresh testing

set -e

echo "================================================"
echo "  SIMDEK Application - Environment Reset"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Warning prompt
print_warning "WARNING: This will completely reset the environment!"
print_warning "All data, containers, and generated files will be removed."
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_info "Reset cancelled."
    exit 0
fi

echo "Starting reset process..."
echo ""

# Step 1: Stop and remove containers
echo "Step 1: Stopping and removing Docker containers..."
docker compose down -v 2>/dev/null || true
print_success "Containers and volumes removed"
echo ""

# Step 2: Remove generated files
echo "Step 2: Removing generated files..."

if [ -d "vendor" ]; then
    print_info "Removing vendor directory..."
    rm -rf vendor
    print_success "vendor removed"
fi

if [ -d "node_modules" ]; then
    print_info "Removing node_modules directory..."
    rm -rf node_modules
    print_success "node_modules removed"
fi

if [ -d "public/build" ]; then
    print_info "Removing public/build directory..."
    rm -rf public/build
    print_success "public/build removed"
fi

if [ -f "public/hot" ]; then
    print_info "Removing public/hot file..."
    rm -f public/hot
    print_success "public/hot removed"
fi

if [ -d "bootstrap/cache/*.php" ]; then
    print_info "Clearing bootstrap cache..."
    rm -f bootstrap/cache/*.php
    print_success "Bootstrap cache cleared"
fi

echo ""

# Step 3: Remove kiosk data files
echo "Step 3: Removing kiosk data files..."
if [ -d "public/kiosk" ]; then
    print_info "Removing public/kiosk/*.json files..."
    rm -f public/kiosk/*.json 2>/dev/null || true
    print_success "Kiosk data files removed"
fi

if [ -d "storage/app/kiosk" ]; then
    print_info "Removing storage/app/kiosk/*.json files..."
    rm -f storage/app/kiosk/*.json 2>/dev/null || true
    print_success "Storage kiosk data files removed"
fi
echo ""

# Step 4: Clean storage logs
echo "Step 4: Cleaning storage logs..."
if [ -d "storage/logs" ]; then
    print_info "Removing log files..."
    rm -f storage/logs/*.log 2>/dev/null || true
    print_success "Log files removed"
fi
echo ""

# Step 5: Remove environment file (optional)
echo "Step 5: Environment file handling..."
if [ -f ".env" ]; then
    read -p "Remove .env file? (yes/no, default: no): " -r
    echo
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        rm .env
        print_success ".env file removed"
    else
        print_info ".env file kept"
    fi
else
    print_info "No .env file found"
fi
echo ""

# Step 6: Remove Docker images (optional)
echo "Step 6: Docker images handling..."
read -p "Remove Docker images? (yes/no, default: no): " -r
echo
if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    print_info "Removing Docker images..."
    docker compose down --rmi all 2>/dev/null || true
    print_success "Docker images removed"
else
    print_info "Docker images kept"
fi
echo ""

# Final Summary
echo "================================================"
echo "  Reset Complete! ✨"
echo "================================================"
echo ""
print_success "Environment has been reset to clean state"
echo ""
echo "What was removed:"
print_success "• Docker containers and volumes"
print_success "• PHP dependencies (vendor/)"
print_success "• Node dependencies (node_modules/)"
print_success "• Compiled assets (public/build, public/hot)"
print_success "• Kiosk data files"
print_success "• Log files"
echo ""
echo "To start fresh, run:"
echo "  ./docker-setup.sh"
echo ""
print_warning "Remember to configure your .env file if you removed it!"
echo ""
