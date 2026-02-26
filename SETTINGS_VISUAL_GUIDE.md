# Settings Page Visual Guide

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    SETTINGS & CONFIGURATION                    │
│                     [Search] [Theme] [Profile]                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐
│  📷 CAMERA SETTINGS      │  │  🔔 ALERT SETTINGS      │
├──────────────────────────┤  ├──────────────────────────┤
│ Resolution: [1080p ▼]    │  │ Flood Threshold: [===50%]│
│ FPS: [30 FPS ▼]          │  │ SMS Notifications: [ON]  │
│ Night Vision: [Toggle]   │  │ Email Alerts: [ON]       │
└──────────────────────────┘  └──────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐
│  🎯 DETECTION SETTINGS   │  │  📡 NETWORK SETTINGS    │
├──────────────────────────┤  ├──────────────────────────┤
│ Sensitivity: [===75%]    │  │ Refresh Rate: [Real-time]│
│ AI Detection: [ON]       │  │ Backup Connection: [ON]  │
│ Recording: [Always On▼]  │  │ Status: ● Connected     │
└──────────────────────────┘  └──────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐
│  ⚙️ SYSTEM SETTINGS      │  │  🛠️ ACTIONS             │
├──────────────────────────┤  ├──────────────────────────┤
│ Language: [English ▼]    │  │ [📥 Download Report]    │
│ Dark Mode: [ON]          │  │ [🔄 Reset to Default]   │
│                          │  │ [🚪 Logout]             │
└──────────────────────────┘  └──────────────────────────┘
```

## Interactive Elements

### Dropdowns
- Resolution (1080p, 720p, 480p)
- FPS (30, 24, 15)
- Recording Mode (Always On, Alert Only, Manual)
- Refresh Rate (Real-time to 30 sec)
- Language (English, Tamil, Hindi)

### Toggle Switches
- Night Vision (ON/OFF)
- SMS Notifications (ON/OFF)
- Email Notifications (ON/OFF)
- AI Detection (ON/OFF)
- Backup Connection (ON/OFF)
- Dark Mode (ON/OFF)

### Sliders
- Flood Alert Threshold (0-100%)
- Detection Sensitivity (0-100%)
- Real-time value display

### Status Badges
- Connection Status with animated pulse indicator
- Connected/Disconnected states

### Action Buttons
- Download Report (Cyan) - Exports settings as JSON
- Reset to Default (Purple) - Restores all defaults
- Logout (Red) - Signs out and returns to main page

## Color Coding

```
📷 Camera Settings    → Teal/Cyan accent
🔔 Alert Settings     → Blue accent
🎯 Detection Settings → Teal/Cyan accent
📡 Network Settings   → Blue accent
⚙️ System Settings    → Teal/Cyan accent
🛠️ Actions           → Red (logout), Cyan (download), Purple (reset)
```

## Responsive Behavior

### Desktop (1200px+)
- 2-column grid layout
- Full-width interactive controls
- Spacious padding and gaps

### Tablet (768px - 1200px)
- 1-2 column layout adapts
- Slightly reduced padding
- Controls remain fully functional

### Mobile (<768px)
- 1-column full-width layout
- Stacked controls
- Touch-friendly spacing
- Full-width buttons

## Search & Filter Feature

```
Search box in header allows users to:
- Type setting name: "resolution" → Shows camera settings
- Type feature name: "notification" → Shows alert settings
- Type keyword: "network" → Shows network settings
- Displays "No results" when no matches found
```

## Notification Toast (Appears on Actions)

```
┌─────────────────────────────────────┐
│ ✓ Report downloaded successfully!  │
└─────────────────────────────────────┘

Appears bottom-right, auto-dismisses after 3 seconds
Color coded: Green (success), Blue (info), Red (error)
```

## Settings Persistence

All settings are saved to browser's localStorage:
```json
{
  "resolution": "1080p (Full HD)",
  "fps": "30 FPS",
  "nightVision": false,
  "smsNotifications": true,
  "emailNotifications": true,
  "floodThreshold": 50,
  "detectionSensitivity": 75,
  "aiDetection": true,
  "recordingMode": "Always On",
  "refreshRate": "Real-time (1 sec)",
  "backupConnection": true,
  "language": "English",
  "darkMode": true
}
```

## Navigation

```
Dashboard (Main)  ←→  Settings Page  ←→  Detail Page (CCTV Feeds)
   [Grid Icon]           [Gear Icon]        [Camera Icon]
   (Currently Active)     (Settings)         (Detail View)
```

All three pages are interconnected via the sidebar navigation icons.

## Accessibility Features

✓ Proper ARIA labels on form elements
✓ Keyboard navigable (Tab through all controls)
✓ Clear visual feedback on interactions
✓ High contrast colors for readability
✓ Icons with text labels for clarity
✓ Descriptive placeholder text
✓ Search functionality for discoverability

## Performance Features

✓ Lightweight (no external dependencies)
✓ Fast localStorage access
✓ Smooth CSS transitions
✓ Optimized for mobile browsers
✓ No unnecessary re-renders
✓ Lazy-loaded content

---

**Ready to use! Click the gear icon on any page to access Settings.**
