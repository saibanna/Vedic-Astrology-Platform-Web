#!/bin/bash

# Vedic Astrology Platform - Frontend Hostinger VPS Deployment Script
# This script builds the React frontend and deploys it to the Hostinger VPS.

# Color variables
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;m' # No Color

# Default Configuration
VPS_IP="76.13.244.69" # From Hostinger Dashboard
VPS_USER="root"
TARGET_DIR="/opt/vap-backend/frontend" # Nginx Docker volume mount folder

echo -e "${GREEN}=====================================================${NC}"
echo -e "${GREEN}   Deploying VedaAstro Frontend to Hostinger         ${NC}"
echo -e "${GREEN}=====================================================${NC}"

# 1. Ask for VPS details
read -p "Enter VPS IP Address [Default: $VPS_IP]: " input_ip
VPS_IP=${input_ip:-$VPS_IP}

read -p "Enter VPS SSH User [Default: $VPS_USER]: " input_user
VPS_USER=${input_user:-$VPS_USER}

read -p "Enter Target HTML Directory on VPS [Default: $TARGET_DIR]: " input_dir
TARGET_DIR=${input_dir:-$TARGET_DIR}

echo -e "\n${YELLOW}[1/3] Compiling React + TypeScript build...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Vite build failed! Please check TypeScript compilation errors.${NC}"
    exit 1
fi
echo -e "${GREEN}Vite build successful!${NC}"

# 2. Check if VPS is reachable
echo -e "\n${YELLOW}[2/3] Testing connection to VPS ($VPS_USER@$VPS_IP)...${NC}"
ssh -o ConnectTimeout=5 -o BatchMode=no $VPS_USER@$VPS_IP "echo 'Connected successfully!'"
if [ $? -ne 0 ]; then
    echo -e "${RED}Cannot connect to VPS. Please verify your SSH settings.${NC}"
    exit 1
fi

# 3. Create target directory and copy files
echo -e "\n${YELLOW}[3/3] Preparing directories and copying build to VPS...${NC}"
ssh $VPS_USER@$VPS_IP "mkdir -p $TARGET_DIR"

# Clean old files (optional, but good to avoid stale cache assets)
echo "Cleaning old files in $TARGET_DIR..."
ssh $VPS_USER@$VPS_IP "rm -rf $TARGET_DIR/*"

# Copy build assets
echo "Uploading compiled assets..."
scp -r dist/* $VPS_USER@$VPS_IP:$TARGET_DIR/

# Copy nginx config file (just in case they didn't run deploy-hostinger.sh first)
echo "Uploading nginx-container.conf..."
scp ../Vedic-Astrology-Platform-Backend/nginx-container.conf $VPS_USER@$VPS_IP:/opt/vap-backend/nginx-container.conf

# Re-create/restart Nginx container to apply configurations
echo "Restarting Nginx container on VPS..."
ssh $VPS_USER@$VPS_IP "cd /opt/vap-backend && docker compose up -d"

echo -e "${GREEN}Files copied successfully!${NC}"

# 4. Show Nginx configuration instructions
echo -e "\n${GREEN}=====================================================${NC}"
echo -e "${GREEN}   Frontend Deployment Finished Successfully!        ${NC}"
echo -e "${GREEN}=====================================================${NC}"
echo -e "Your frontend is uploaded to VPS and served via Docker Nginx."
echo -e "\nYou can now browse the platform directly at:"
echo -e "  👉 http://$VPS_IP"
echo -e "${GREEN}=====================================================${NC}"
