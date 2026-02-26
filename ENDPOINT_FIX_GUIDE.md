# 🔧 SMS Endpoint Discovery & Fix Guide

## Current Issue
The SMS alert system is configured but the API endpoint is **incorrect** and returns a **404 error**.

**Error**: `Response Status: 404 - API doesn't exists`

---

## What's the Problem?

The RapidAPI SMS gateway endpoint path is wrong:
- **Current endpoint**: `/send` ❌ Returns 404
- **Correct endpoint**: Unknown (could be `/api/send`, `/sms`, `/messages`, etc.)

---

## Solution: Find the Correct Endpoint

### Step 1: Open the Diagnostic Tool 🧪

1. Open this file in your browser: **`SMS_DIAGNOSTICS.html`**
2. The page loads with a header "SMS Alert System Diagnostics"
3. You'll see buttons to test the connection

### Step 2: Run the Endpoint Discovery Test ⚡

**Option A - Recommended: Test Connection Only**
- Click the button: **"Test RapidAPI Connection"**
- This tests multiple endpoint paths without sending actual SMS
- **Faster** and **won't use SMS credits**

**Option B - Full Test with SMS Send**
- Click the button: **"Send Test SMS Alert"**
- Tests endpoints AND attempts to send actual test SMS
- Will send a message to `+918807625857`
- Takes longer but is more thorough

### Step 3: Read the Console Output 📊

The test will display:
- A list of all endpoint paths tested
- HTTP status code for each endpoint
- Which endpoint **✅ works** and which **❌ don't work**

Look for output like this:
```
═════════════════════════════════════════
📊 SUMMARY OF ALL ENDPOINTS
═════════════════════════════════════════

✅ /api/send: HTTP 200
✅ /sms: HTTP 200
❌ /send: HTTP 404
❌ /messages: HTTP 404
```

**Note:** The first endpoint that shows **✅ status 200** or **✅ status 202** is your working endpoint!

### Step 4: Update the Configuration 📝

Once you've found the working endpoint (e.g., `/api/send`):

1. **Open file**: `detail-script.js`
2. **Find this section** (around line 9-17):
   ```javascript
   const SMS_CONFIG = {
       apiKey: 'f62f25af49msha608edfaeb90048p120766jsn23cf2b4f963d',
       apiHost: 'sms-gateway-api2.p.rapidapi.com',
       recipientNumber: '+918807625857',
       senderName: 'CCTV_ALERT',
       endpoint: '/send'     // ← CHANGE THIS LINE
   };
   ```

3. **Replace** `'/send'` with your working endpoint
   - **Example**: If test showed `/api/send` works, change to `endpoint: '/api/send'`
   - Save the file

### Step 5: Test SMS Sending ✅

1. Open your CCTV dashboard: `index.html` → Click "Detail"
2. Click the **SMS Alert Button** (yellow alert icon)
3. Click **"Send Alert"**
4. Check if alert is sent ✅

---

## Possible Endpoints to Test

The diagnostic will automatically test these paths:

| Endpoint | Status |
|----------|--------|
| `/send` | Currently failing (404) ❌ |
| `/api/send` | Testing... |
| `/sms/send` | Testing... |
| `/sms` | Testing... |
| `/messages/send` | Testing... |
| `/messages` | Testing... |
| `/api/sms/send` | Testing... |

---

## Troubleshooting

### ❌ "No working endpoint found" message

This means all tested paths failed. Try these:

1. **Check RapidAPI Dashboard**
   - Login to https://rapidapi.com
   - Find your SMS Gateway API
   - Check the "Endpoints" tab
   - Copy the exact endpoint path

2. **Look for endpoint format**
   - RapidAPI shows API calls like: `GET /sms` or `POST /api/send`
   - Use the path that appears after the domain

3. **Alternative: Check API Documentation**
   - Some APIs use query parameters instead of POST body
   - Check if message format needs to be different

### ⚠️ "API key expired or invalid"

1. Go to RapidAPI dashboard
2. Check if subscription is still active
3. Get a fresh API key
4. Update `SMS_CONFIG.apiKey` in `detail-script.js`

### 🔄 "Rate limit exceeded"

- Wait 1-2 minutes and try again
- Endpoint discovery tests the API multiple times
- Check your RapidAPI plan limits

---

## Configuration Files

After finding the correct endpoint, update these files:

### 1. **detail-script.js** (REQUIRED)
   ```javascript
   endpoint: '/correct/endpoint/path'
   ```

### 2. **SMS_DIAGNOSTICS.html** (Optional - for reference)
   - The endpoints being tested are hardcoded in the `testRapidAPIConnection()` function
   - If you find a working endpoint, you might add it to the list for future reference

---

## What Changed

Here's what I've already updated:

✅ **detail-script.js** (Updated)
- Added `endpoint` field to `SMS_CONFIG`
- Updated `sendSmsViaRapidAPI()` to use `SMS_CONFIG.endpoint`
- Added detailed console logging to track requests

✅ **SMS_DIAGNOSTICS.html** (Updated)
- Enhanced endpoint discovery test with 7 different path variations
- Added clear console output showing which endpoints work
- Shows exact endpoint you need to use

✅ **detail-styles.css** (No changes needed)
✅ **detail.html** (No changes needed)

---

## Quick Reference

| Action | File | Line |
|--------|------|------|
| Update endpoint | `detail-script.js` | ~15 |
| Run test | `SMS_DIAGNOSTICS.html` | Open in browser |
| Check logs | Browser Console (F12) | All output |

---

## Next Steps

1. ✅ Open `SMS_DIAGNOSTICS.html` in browser
2. ✅ Click "Test RapidAPI Connection"
3. ✅ Check console output for working endpoint
4. ✅ Update `detail-script.js` with correct endpoint
5. ✅ Test SMS sending in dashboard
6. ✅ Verify message arrives at `+918807625857`

---

## Need Help?

If you get stuck:

1. **Check the console** - F12 in browser, look at Console tab
2. **Look at endpoint paths** - Which ones show ✅ and which show ❌?
3. **Verify RapidAPI credentials** - Are API key and host correct?
4. **Check SMS credits** - Do you have SMS credits remaining?

Good luck! 🚀
