# 📁 File Directory - Complete Reference

## Dashboard Files

### 🎯 Core HTML Files

#### `index.html` (Main Dashboard)
- **Purpose**: Main CCTV flood detection dashboard
- **Status**: Fully functional
- **Contains**:
  - Sidebar navigation
  - Weather forecast integration
  - Location cards in 2x2 grid
  - Water level chart
  - YouTube video feed with red gradient
  - Theme toggle (dark/light mode)
- **Dependencies**: styles.css, script.js, Font Awesome, Chart.js

#### `detail.html` (Camera Detail Page)
- **Purpose**: Detailed view for individual camera feeds with alerts
- **Status**: Ready with SMS functionality
- **Contains**:
  - Camera feed viewer
  - Location info panel
  - Flood status badges
  - **SMS Alert button** (NEW)
  - **SMS Modal form** (NEW)
  - Alert cards (Danger, Restriction, Emergency)
  - Camera list sidebar
  - **Toast notifications** (NEW)
- **Dependencies**: detail-styles.css, detail-script.js, Font Awesome

---

### 🎨 CSS Styling Files

#### `styles.css` (Main Dashboard Styles)
- **Purpose**: Complete styling for main dashboard
- **Size**: Full stylesheet with dark/light mode support
- **Contains**:
  - Layout grids and flexbox
  - Color themes (dark & light)
  - Hover effects and animations
  - Responsive breakpoints
  - Navigation styling
  - Chart styling
  - Weather cards styling
  - Video feed styling with red gradients

#### `detail-styles.css` (Detail Page Styles)
- **Purpose**: Styling for camera detail page including SMS modal
- **Status**: Complete with new SMS components
- **Contains**:
  - Feed container layout
  - Info panel styling
  - Alert cards styling
  - Camera list styling
  - **Modal backdrop with blur**
  - **Form input styling with focus states**
  - **Button animations and hover effects**
  - **Toast notification animations**
  - Dark & light mode variants for all new components

---

### 💻 JavaScript Files

#### `script.js` (Main Dashboard JavaScript)
- **Purpose**: Interactivity for main dashboard
- **Status**: Fully functional
- **Contains**:
  - Chart.js water level visualization
  - OpenWeatherMap API integration
  - City search functionality
  - Weather forecast rendering
  - Theme toggle functionality
  - localStorage persistence
  - Weather icon mapping

#### `detail-script.js` (Detail Page JavaScript)
- **Purpose**: Interactivity for camera detail page
- **Status**: UPDATED with complete SMS functionality
- **Size**: 275 lines (expanded from 60 lines)
- **NEW Functions**:
  - `initSmsAlert()` - Modal and button setup
  - `sendSmsAlert()` - Handle SMS submission
  - `sendViaTwilio()` - Direct Twilio API integration
  - `showToast()` - Notification display
- **Existing Functions**:
  - `initThemeToggle()` - Dark/light mode
  - `initCameraClickHandlers()` - Camera switching
- **Contains**:
  - **SMS_CONFIG object** with Twilio credentials placeholder
  - Phone number validation (regex)
  - Message preparation logic
  - Loading state management
  - Error handling and fallbacks
  - Toast notification logic
  - Event listener setup

#### `video-config.js` (Video Configuration)
- **Purpose**: YouTube video embedding configuration
- **Status**: Unchanged
- **Contains**: Video ID and player configuration

---

## 🆕 New SMS Backend Files

### Backend Service

#### `sms-backend.js` (Node.js/Express Server)
- **Purpose**: Backend service for sending SMS via Twilio
- **Status**: Ready to use (requires Twilio credentials)
- **Size**: ~150 lines
- **Endpoints**:
  - `POST /api/send-sms` - Send SMS alert
  - `GET /health` - Health check
  - `GET /api/sms-logs` - View sent SMS (optional)
- **Features**:
  - Phone number validation
  - Twilio API integration
  - Error handling
  - Request logging
  - CORS enabled
- **Dependencies**: express, twilio, cors, body-parser
- **To Run**: `node sms-backend.js`
- **Port**: 3000 (default)

---

## 📦 Package & Configuration Files

#### `package.json` (NPM Dependencies)
- **Purpose**: Node.js project configuration
- **Status**: Ready for npm install
- **Contains**:
  - Project metadata
  - Dependencies list:
    - express (web server)
    - twilio (SMS API)
    - cors (cross-origin)
    - body-parser (JSON parsing)
    - dotenv (environment variables)
  - devDependencies:
    - nodemon (auto-reload)
  - Scripts:
    - `start` - Run production server
    - `dev` - Run with nodemon

#### `.env.example` (Environment Variables Template)
- **Purpose**: Template for sensitive configuration
- **Status**: Example file (copy to .env to use)
- **Contains**:
  - TWILIO_ACCOUNT_SID
  - TWILIO_AUTH_TOKEN
  - TWILIO_PHONE_NUMBER
  - PORT configuration
  - NODE_ENV setting
  - CORS settings
  - Logging level

---

## 🚀 Startup Scripts

#### `start-sms-backend.bat` (Windows Startup)
- **Purpose**: Easy startup for SMS backend on Windows
- **Status**: Ready to use
- **Does**:
  - Checks Node.js installation
  - Installs npm dependencies if needed
  - Verifies Twilio configuration
  - Displays startup information
  - Starts the server on port 3000

#### `start-sms-backend.sh` (Linux/Mac Startup)
- **Purpose**: Easy startup for SMS backend on Linux/Mac
- **Status**: Ready to use
- **Does**:
  - Checks Node.js and npm installation
  - Installs npm dependencies if needed
  - Verifies Twilio configuration
  - Displays startup information
  - Starts the server on port 3000

---

## 📚 Documentation Files

### Quick Start Guides

#### `README_SMS.md` (Quick Start - 2 Minutes)
- **Purpose**: Fastest way to get SMS working
- **Audience**: Users who want quick setup
- **Contains**:
  - 3-step quick start
  - Twilio sign-up instructions
  - Configuration options (A & B)
  - Testing instructions
  - Common issues & solutions
  - Cost information
- **Read Time**: 2-3 minutes

#### `SMS_ALERTS_SUMMARY.md` (Implementation Summary)
- **Purpose**: Complete overview of what's been implemented
- **Audience**: Users who want full understanding
- **Contains**:
  - Files created/modified list
  - Quick start for all platforms
  - Feature list with checkmarks
  - File structure diagram
  - Setup requirements
  - Testing checklist
  - Troubleshooting table
- **Read Time**: 5-10 minutes

#### `SMS_QUICK_REFERENCE.md` (One-Page Reference)
- **Purpose**: Quick answers to common questions
- **Audience**: Users who need quick lookup
- **Contains**:
  - What's new (bullet points)
  - File changes summary
  - How to get working (3 options)
  - Phone format guide
  - Error solutions table
  - Integration points
  - Support resources
- **Read Time**: 2-3 minutes
- **Best For**: Quick lookup while working

### Detailed Guides

#### `SMS_SETUP.md` (Complete Setup Guide)
- **Purpose**: Step-by-step setup instructions
- **Audience**: Users setting up SMS for first time
- **Length**: ~200 lines
- **Contains**:
  - Option 1: Backend service (recommended)
  - Option 2: Frontend only
  - Twilio account setup
  - Backend installation
  - Alternative SMS providers (AWS SNS, Firebase, Vonage)
  - Testing without Twilio
  - Troubleshooting guide
  - Cost estimation
  - Security best practices
  - Support links
- **Read Time**: 15-20 minutes

#### `SMS_IMPLEMENTATION_GUIDE.md` (Technical Documentation)
- **Purpose**: Complete technical reference
- **Audience**: Developers and technical users
- **Length**: ~500 lines
- **Contains**:
  - System architecture diagram
  - Component breakdown:
    - Frontend (HTML, forms, modals)
    - JavaScript (functions, validation)
    - Backend (endpoints, integration)
    - Styling (modal, forms, toasts)
  - Detailed workflow explanation
  - Phone validation logic
  - Twilio integration details
  - Complete user journey (10 steps)
  - Verification checklist
  - Error scenarios & solutions
  - Performance metrics
  - Security recommendations
  - Cost tracking
- **Read Time**: 30-40 minutes
- **Best For**: Understanding how it all works

#### `SMS_VISUAL_GUIDE.md` (Visual Documentation)
- **Purpose**: ASCII diagrams showing system flow
- **Audience**: Visual learners
- **Contains**:
  - User flow diagram (step-by-step)
  - Component interaction diagram
  - Data flow diagram
  - Configuration decision tree
- **Read Time**: 5-10 minutes
- **Best For**: Understanding big picture

---

## 📊 File Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                   CCTV Dashboard                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Main Dashboard                 Detail Page                 │
│  ├─ index.html                  ├─ detail.html              │
│  ├─ styles.css                  ├─ detail-styles.css        │
│  ├─ script.js                   ├─ detail-script.js (NEW)   │
│  └─ Dependencies:               └─ Dependencies:            │
│     • Font Awesome 6.4.0           • Font Awesome 6.4.0     │
│     • Chart.js                     • Font Awesome            │
│     • Google Fonts (Inter)         • Google Fonts (Inter)    │
│     • OpenWeatherMap API                                     │
│                                                              │
│  Optional Backend                                            │
│  ├─ sms-backend.js (Node.js)                                │
│  ├─ package.json                                            │
│  └─ Dependencies:                                            │
│     • express 4.18.2                                        │
│     • twilio 4.0.0                                          │
│     • cors 2.8.5                                            │
│     • body-parser 1.20.2                                    │
│                                                              │
│  Documentation (Read Only)                                   │
│  ├─ README_SMS.md                                           │
│  ├─ SMS_ALERTS_SUMMARY.md                                   │
│  ├─ SMS_QUICK_REFERENCE.md                                  │
│  ├─ SMS_SETUP.md                                            │
│  ├─ SMS_IMPLEMENTATION_GUIDE.md                             │
│  ├─ SMS_VISUAL_GUIDE.md                                     │
│  └─ This file (FILE_DIRECTORY.md)                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Quick File Lookup

### I want to... | Read this file
---|---
Get SMS working quickly | `README_SMS.md`
Understand what changed | `SMS_ALERTS_SUMMARY.md`
Quick lookup during work | `SMS_QUICK_REFERENCE.md`
Full setup instructions | `SMS_SETUP.md`
Technical deep dive | `SMS_IMPLEMENTATION_GUIDE.md`
Visual explanation | `SMS_VISUAL_GUIDE.md`
Edit backend code | `sms-backend.js`
Edit frontend SMS logic | `detail-script.js`
See dependencies | `package.json`
Start the backend | `start-sms-backend.bat` or `.sh`

---

## 📈 File Statistics

| File | Type | Size | Purpose |
|------|------|------|---------|
| index.html | HTML | ~2KB | Main dashboard |
| detail.html | HTML | ~2.5KB | Detail page with SMS modal |
| styles.css | CSS | ~8KB | Main dashboard styles |
| detail-styles.css | CSS | ~12KB | Detail page + SMS styling |
| script.js | JS | ~4KB | Main dashboard logic |
| detail-script.js | JS | ~9KB | Detail page + SMS logic |
| video-config.js | JS | ~1KB | Video configuration |
| sms-backend.js | JS | ~6KB | Backend SMS service |
| package.json | JSON | ~500B | NPM configuration |
| .env.example | Text | ~300B | Environment template |
| Documentation | Markdown | ~15KB | Setup & reference guides |
| **TOTAL** | **Mixed** | **~60KB** | **Complete system** |

---

## ✅ File Status Summary

### Fully Functional ✓
- ✓ index.html - Main dashboard complete
- ✓ styles.css - All styling done
- ✓ script.js - Weather & charts working
- ✓ detail-styles.css - Modal styling complete
- ✓ sms-backend.js - Backend ready

### Updated with SMS ✓
- ✓ detail.html - SMS modal added
- ✓ detail-script.js - SMS functions added

### New Files ✓
- ✓ sms-backend.js - Backend service
- ✓ package.json - Dependencies
- ✓ Documentation files - All guides

### Ready to Use
- ✓ All HTML files
- ✓ All CSS files
- ✓ All JavaScript files
- ✓ All documentation

### Requires Configuration
- ⚙️ sms-backend.js - Add Twilio credentials
- ⚙️ detail-script.js - Add Twilio credentials
- ⚙️ .env - Create from .env.example

---

## 🚀 What's Next?

1. **Read**: `README_SMS.md` (2-minute guide)
2. **Get**: Twilio credentials (free sign-up)
3. **Update**: SMS_CONFIG with credentials
4. **Test**: Click SMS Alerts button → Send test SMS
5. **Monitor**: Check Twilio dashboard for usage

---

**For questions, see the specific guide files above!**
