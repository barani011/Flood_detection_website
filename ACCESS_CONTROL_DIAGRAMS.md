# Access Control System - Visual Diagram

## 📊 User Access Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    START - Fresh Browser                    │
└─────────────────────────────────────────────────────────────┘
                              │
                    localStorage is empty
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│         User Opens Dashboard (index.html)                │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ DOMContentLoaded runs:                              │ │
│  │   1. checkLoginStatus()                             │ │
│  │      └─ Checks: isUserLoggedIn flag               │ │
│  │      └─ Result: NOT FOUND (false)                 │ │
│  │   2. disableSettingsIfNotLoggedIn()               │ │
│  │      └─ Action: Disables settings icon            │ │
│  │      └─ Visual: 40% opacity, grayed out           │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                            │
│  Sidebar Icons:                                            │
│  ┌──────┐   ┌──────┐   ┌──────┐                           │
│  │ 📊   │   │ 📷   │   │ ⚙️   │                           │
│  │ Dashboard│ Detail│   │ Settings│                        │
│  │ ✅      │ ✅    │   │ ❌ DISABLED                       │
│  └──────┘   └──────┘   └──────┘                           │
│                      ↑                                      │
│                 Can't click!                                │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│         User Clicks Profile Icon (👤)                    │
│               Navigates to login.html                     │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│           Login Form Appears                              │
│                                                            │
│  Username: [demo_______]                                  │
│  Password: [••••••••••••]                                 │
│                                                            │
│  ☑️ Remember me                                            │
│                                                            │
│         [  Sign In →  ]                                   │
└──────────────────────────────────────────────────────────┘
                              │
                    User clicks "Sign In"
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│         Form Validation & Authentication                  │
│                                                            │
│  ✓ Username valid                                         │
│  ✓ Password valid                                         │
│  ✓ Credentials match (demo/demo123)                      │
│                                                            │
│  Success!                                                 │
│  saveUserSession() is called:                            │
│  ├─ localStorage.userSession = {...}                    │
│  └─ localStorage.isUserLoggedIn = 'true'  ← KEY LINE!   │
│                                                            │
│  Show loading: "🔄 Signing in..." (2 sec)               │
│  Show success: "✓ Success!"                             │
│  Redirect: window.location.href = 'index.html'          │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│      Dashboard Loads AGAIN (After Login)                 │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ DOMContentLoaded runs AGAIN:                        │ │
│  │   1. checkLoginStatus()                             │ │
│  │      └─ Checks: isUserLoggedIn flag               │ │
│  │      └─ Result: 'true' ✓ Found!                   │ │
│  │   2. disableSettingsIfNotLoggedIn()               │ │
│  │      └─ isLoggedIn = true                         │ │
│  │      └─ Action: ENABLES settings icon             │ │
│  │      └─ Visual: 100% opacity, bright              │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                            │
│  Sidebar Icons:                                            │
│  ┌──────┐   ┌──────┐   ┌──────┐                           │
│  │ 📊   │   │ 📷   │   │ ⚙️   │                           │
│  │ Dashboard│ Detail│   │ Settings│                        │
│  │ ✅      │ ✅    │   │ ✅ ENABLED!                      │
│  └──────┘   └──────┘   └──────┘                           │
│                      ↑                                      │
│                 Now clickable!                              │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│       User Clicks Settings Icon (⚙️ ENABLED)            │
│            Navigates to settings.html                     │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│        Settings Page Loads (settings.html)               │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ DOMContentLoaded runs:                              │ │
│  │                                                     │ │
│  │ Check: isUserLoggedIn = 'true'? ✓ YES              │ │
│  │                                                     │ │
│  │ Action:                                             │ │
│  │ ├─ Load theme toggle ✓                             │ │
│  │ ├─ Initialize settings controls ✓                 │ │
│  │ └─ Load saved settings ✓                           │ │
│  │                                                     │ │
│  │ Result: FULL SETTINGS PAGE DISPLAYED              │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                            │
│  ⚙️ ADMIN PANEL - Full Access                             │
│  ┌──────────────────────────────────────────────────────┐│
│  │ 📷 Camera Settings                                  ││
│  │ 🔔 Alert Settings                                  ││
│  │ 🎯 Detection Settings                              ││
│  │ 📡 Network Settings                                ││
│  │ ⚙️  System Settings                                 ││
│  │ 🛠️  Actions                                         ││
│  │    ├─ Download Report                              ││
│  │    ├─ Reset to Default                             ││
│  │    └─ LOGOUT ← IMPORTANT                           ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
                              │
                   User clicks "LOGOUT"
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│           Logout Confirmation Dialog                      │
│                                                            │
│  "Are you sure you want to logout?"                       │
│                                                            │
│               [ Cancel ]  [ Logout ]                       │
└──────────────────────────────────────────────────────────┘
                              │
                         User confirms
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│         Logout Process Starts                             │
│                                                            │
│  logoutUser() is called:                                 │
│  ├─ localStorage.removeItem('dashboardSettings')        │
│  ├─ localStorage.removeItem('userSession')              │
│  ├─ localStorage.removeItem('isUserLoggedIn') ← KEY!    │
│  │                                                       │
│  ├─ Show: "✓ Logged out successfully!"                  │
│  └─ Redirect: window.location.href = 'login.html'       │
│                                                            │
│  Result: localStorage.isUserLoggedIn = DELETED          │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│      User Back to Login Page                             │
│            (Can login again or browse dashboard)         │
└──────────────────────────────────────────────────────────┘
                              │
                              ↓
┌──────────────────────────────────────────────────────────┐
│         User Opens Dashboard Again                        │
│                                                            │
│  DOMContentLoaded runs:                                  │
│    1. checkLoginStatus()                                 │
│       └─ Checks: isUserLoggedIn flag                   │
│       └─ Result: NOT FOUND (deleted!)                  │
│    2. disableSettingsIfNotLoggedIn()                   │
│       └─ Action: Disables settings icon AGAIN          │
│       └─ Visual: 40% opacity, grayed out               │
│                                                            │
│  Sidebar Icons:                                           │
│  ┌──────┐   ┌──────┐   ┌──────┐                          │
│  │ 📊   │   │ 📷   │   │ ⚙️   │                          │
│  │ Dashboard│ Detail│   │ Settings│                       │
│  │ ✅      │ ✅    │   │ ❌ DISABLED AGAIN                │
│  └──────┘   └──────┘   └──────┘                          │
│                      ↑                                     │
│                 Can't click!                               │
│                                                            │
│  CYCLE COMPLETES - Ready to login again!                │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 State Machine Diagram

```
        ┌──────────────────────┐
        │   LOGGED OUT STATE   │
        │                      │
        │  Settings: DISABLED  │
        │  Icon: Grayed Out    │
        │  isUserLoggedIn: NA  │
        └──────────────────────┘
                    ▲
                    │
           (Click logout button)
                    │
                    │
        ┌──────────────────────┐
        │                      │
        │  (Authentication)    │
        │                      │
        └──────────────────────┘
                    │
                    │
           (Enter credentials + Click Sign In)
                    │
                    ▼
        ┌──────────────────────┐
        │   LOGGED IN STATE    │
        │                      │
        │  Settings: ENABLED   │
        │  Icon: Bright        │
        │  isUserLoggedIn: ✓   │
        └──────────────────────┘
                    ▲
                    │
    (Click settings icon,  (Stay logged in)
    full access to admin)   │
                    │
                    └──────────┘
```

---

## 🔑 Key State Variables

```
┌─────────────────────────────────────────┐
│     localStorage State Tracking          │
├─────────────────────────────────────────┤
│                                         │
│  isUserLoggedIn = 'true'                │
│  ├─ Set on: Successful login            │
│  ├─ Checked on: Page load               │
│  └─ Removed on: Logout                  │
│                                         │
│  userSession = {...}                    │
│  ├─ Set on: Successful login            │
│  ├─ Contains: username, loginTime       │
│  └─ Removed on: Logout                  │
│                                         │
│  rememberUsername = 'demo'              │
│  ├─ Set on: Login with "Remember me"   │
│  └─ Used to: Pre-fill username          │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🛡️ Protection Points

```
┌─────────────────────────────────────────┐
│   Access Control Checkpoints             │
├─────────────────────────────────────────┤
│                                         │
│  1️⃣  Dashboard Load (script.js)         │
│     └─ Disable/enable settings icon     │
│                                         │
│  2️⃣  Detail Page Load (detail-script.js)│
│     └─ Disable/enable settings icon     │
│                                         │
│  3️⃣  Settings Page Load (settings-js)  │
│     └─ Check login, redirect if fail    │
│                                         │
│  4️⃣  Settings Icon Click               │
│     └─ Disabled when not logged in      │
│                                         │
│  5️⃣  Direct URL Access                 │
│     └─ Redirect to login if not logged  │
│                                         │
│  6️⃣  Logout Button                     │
│     └─ Clear all session data           │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📊 Feature Matrix

```
┌──────────────────┬──────────────┬──────────────┐
│ Feature          │  Not Logged  │  Logged In   │
├──────────────────┼──────────────┼──────────────┤
│ Dashboard Access │      ✅      │      ✅      │
│ Detail Access    │      ✅      │      ✅      │
│ Settings Icon    │   ❌ Gray    │    ✅ Bright │
│ Settings Click   │      ❌      │      ✅      │
│ Settings URL     │   Redirect   │      ✅      │
│ Profile Icon     │      ✅      │      ✅      │
│ Login Page       │      ✅      │    (skip)    │
│ Logout Option    │      ❌      │      ✅      │
└──────────────────┴──────────────┴──────────────┘
```

---

**Visual flow shows complete access control system!** 🔐
