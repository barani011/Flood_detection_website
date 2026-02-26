#!/bin/bash

# CCTV Dashboard - SMS Backend Quick Start
# Run this file to start the SMS backend service

echo ""
echo "========================================"
echo "CCTV Dashboard - SMS Backend Service"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo ""
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo "Then run this script again."
    echo ""
    exit 1
fi

echo "[OK] Node.js is installed: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    echo ""
    exit 1
fi

echo "[OK] npm is installed: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    echo "Running: npm install"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies!"
        echo ""
        exit 1
    fi
    echo "[OK] Dependencies installed"
    echo ""
fi

# Check if Twilio credentials are configured
if grep -q "YOUR_TWILIO_ACCOUNT_SID" sms-backend.js; then
    echo "[WARNING] Twilio credentials not configured!"
    echo ""
    echo "Before starting the server, please:"
    echo "1. Get Twilio credentials from https://www.twilio.com/console"
    echo "2. Update SMS_CONFIG in detail-script.js with your credentials"
    echo "3. Or edit the SMS_CONFIG in sms-backend.js"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    echo ""
fi

# Start the server
echo "[INFO] Starting SMS Backend Service..."
echo ""
echo "========================================"
echo "Server Configuration:"
echo "========================================"
echo "URL: http://localhost:3000"
echo "SMS Endpoint: http://localhost:3000/api/send-sms"
echo "Health Check: http://localhost:3000/health"
echo "SMS Logs: http://localhost:3000/api/sms-logs"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

#!/usr/bin/env bash
# start-sms-backend.sh - REMOVED
# SMS backend and startup scripts were removed per project request.
echo "SMS backend startup script has been removed."
exit 0

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Server failed to start!"
    echo "Check the errors above and try again."
    echo ""
    exit 1
fi
