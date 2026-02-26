// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initCameraClickHandlers();
    initSmsAlert();
    checkLoginStatus();
    disableSettingsIfNotLoggedIn();
});

// ============ EMAIL (Web3Forms) CONFIGURATION ============
// Set `accessKey` when you have your Web3Forms API key
const WEB3FORMS_CONFIG = {
    accessKey: '', // your Web3Forms access_key goes here
    endpoint: 'https://api.web3forms.com/submit',
    fromName: 'CCTV Alert System',
    subject: 'CRITICAL FLOOD ALERT'
};

// ============ BROWSER NOTIFICATION CONFIGURATION ============
const NOTIFICATION_CONFIG = {
    enabled: true,
    title: '🚨 FLOOD ALERT 🚨',
    icon: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/triangle-exclamation.svg'
};

// ============ ALERT CONTENT CONFIGURATION ============
const ALERT_CONTENT = {
    FLOOD: {
        danger: "⚠️ CRITICAL FLOOD EMERGENCY - Water levels have exceeded safe limits. Evacuation is mandatory. Do not attempt to cross flooded areas.",
        restriction: [
            "🚫 All vehicle movement is strictly PROHIBITED",
            "💧 Water depth is dangerous - risk of vehicle submersion",
            "⚡ High currents can sweep away vehicles and passengers",
            "🚨 ONLY emergency and rescue vehicles are authorized",
            "📞 Call emergency services (112/108) for evacuation assistance"
        ]
    },
    NORMAL: {
        danger: "✓ Area Status - NORMAL. Water levels are within safe limits. All areas are accessible and safe for normal operations.",
        restriction: [
            "✓ All vehicles are permitted to operate",
            "✓ Roads are clear and safe for traffic",
            "✓ No flooding hazards detected",
            "✓ Normal traffic regulations apply",
            "✓ No emergency restrictions in place"
        ]
    }
};

// ============ UPDATE NOTICES BASED ON FLOOD STATUS ============
function updateAlertNotices(status) {
    const contentKey = status === 'FLOOD' ? 'FLOOD' : 'NORMAL';
    const content = ALERT_CONTENT[contentKey];
    
    // Update danger notice
    const dangerContent = document.getElementById('dangerContent');
    if (dangerContent) {
        dangerContent.textContent = content.danger;
    }
    
    // Update vehicle restriction list
    const vehicleContent = document.getElementById('vehicleContent');
    if (vehicleContent) {
        vehicleContent.innerHTML = content.restriction
            .map(item => `<li>${item}</li>`)
            .join('');
    }
    
    // Update card styling
    const dangerCard = document.getElementById('dangerNotice');
    const vehicleCard = document.getElementById('vehicleRestriction');
    
    if (dangerCard && vehicleCard) {
        if (status === 'FLOOD') {
            dangerCard.classList.remove('normal');
            dangerCard.classList.add('danger');
            vehicleCard.classList.add('restriction');
        } else {
            dangerCard.classList.remove('danger');
            dangerCard.classList.add('normal');
            vehicleCard.classList.remove('restriction');
        }
    }
}

// ============ UPDATE CAMERA LIST STATUSES (LIVE) ============
async function updateAllCameraStatuses() {
    const cameras = [
        { num: 1, id: 'cam1-status' },
        { num: 2, id: 'cam2-status' },
        { num: 3, id: 'cam3-status' },
        { num: 4, id: 'cam4-status' },
        { num: 5, id: 'cam5-status' },
        { num: 6, id: 'cam6-status' },
        { num: 7, id: 'cam7-status' }
    ];
    const aggregate = {};
    
    for (const cam of cameras) {
        try {
            const res = await fetch(`http://172.17.177.79:5000/status/cam${cam.num}`, { cache: "no-store" });
            if (!res.ok) throw new Error("HTTP " + res.status);
            
            const data = await res.json();
            const status = (data.status || "NORMAL").toUpperCase();
            const floodPct = Number(data.flood_pct ?? 0);
            const normalPct = Number(data.normal_pct ?? (100 - floodPct));
            
            // Update the camera status badge
            const statusEl = document.getElementById(cam.id);
            if (statusEl) {
                let level = "low";
                if (floodPct >= 40) level = "high";
                
                if (status === "FLOOD") {
                    statusEl.className = `flood-indicator ${level}`;
                    statusEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Flood ${floodPct}%`;
                } else {
                    statusEl.className = "flood-indicator normal";
                    statusEl.innerHTML = `<i class="fas fa-check-circle"></i> Normal ${normalPct}%`;
                }
            }
            // also keep the data-flood attribute in sync so click-handler uses up-to-date value
            const camItemEl = document.querySelector(`.camera-item[data-camera="${cam.num}"]`);
            if (camItemEl) {
                camItemEl.setAttribute('data-flood', floodPct);
            }
            // Persist latest status to localStorage so other pages (homepage) can react
            const out = {
                status: status,
                flood_pct: floodPct,
                normal_pct: normalPct,
                fetched_at: new Date().toISOString()
            };
            try {
                localStorage.setItem(`cam${cam.num}_status`, JSON.stringify(out));
                aggregate[`cam${cam.num}`] = out;
            } catch (e) {
                console.warn('Could not write cam status to localStorage', e);
            }
        } catch (err) {
            console.log(`Status error for cam${cam.num}:`, err);
        }
    }

    // Also write an aggregate object for convenience
    try {
        localStorage.setItem('cam_statuses', JSON.stringify(aggregate));
    } catch (e) {
        // ignore storage write errors
    }
}

// ============ UPDATE MAIN FEED INFO (LIVE) ============
function updateMainFeedInfo(floodPct) {
    // Update flood level text
    const floodLevelEl = document.getElementById('mainFloodLevel');
    if (floodLevelEl) {
        let level = 'Normal';
        if (floodPct >= 40) level = 'High';
        
        floodLevelEl.textContent = level;
        floodLevelEl.className = floodPct >= 40 ? 'meta-value high-text' : 'meta-value';
    }
    
    // Update last updated time
    const lastUpdatedEl = document.getElementById('mainLastUpdated');
    if (lastUpdatedEl) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        lastUpdatedEl.textContent = `${hours}:${minutes}`;
    }
}

// ============ THEME TOGGLE ============
function initThemeToggle() {
    const themeCheckbox = document.getElementById('themeCheckbox');
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', function() {
            const body = document.body;
            if (this.checked) {
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeCheckbox) themeCheckbox.checked = true;
    }
}

// SMS Alert Functionality - DIRECT SEND (No Modal)
function initSmsAlert() {
    console.log('⏳ Initializing Alert System...');
    
    const smsAlertBtn = document.getElementById('smsAlertBtn');

    if (!smsAlertBtn) {
        console.error('❌ Alert button not found!');
        return;
    }

    // Click Alert Button - Send Email Directly (Web3Forms)
    smsAlertBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('✓ Alert button clicked');
        sendMailDirectly();
    });

    console.log('✓ Alert initialized successfully');
}

// ============ SEND EMAIL DIRECTLY (Web3Forms) ============
async function sendMailDirectly() {
    console.log('✉️ sendMailDirectly() called');

    // Get location and flood level from page
    const feedInfo = document.querySelector('.feed-info-panel h3');
    const floodBadge = document.querySelector('.flood-status-badge');

    const locationValue = feedInfo?.textContent || 'Tirunelveli - Town, street no: 02';
    const floodLevelValue = floodBadge?.textContent?.trim() || 'Flood 92%';

    // Show loading toast
    showToast('📤 Sending email alert...', 'loading');

    // Immediate browser notification
    sendBrowserNotification(locationValue, floodLevelValue);

    // Prepare payload
    const payload = {
        access_key: WEB3FORMS_CONFIG.accessKey,
        subject: WEB3FORMS_CONFIG.subject,
        name: WEB3FORMS_CONFIG.fromName,
        message: generateAlertMessage(locationValue, floodLevelValue),
        location: locationValue,
        floodLevel: floodLevelValue,
        timestamp: new Date().toISOString()
    };

    try {
        const resp = await sendMailViaWeb3forms(payload);
        if (resp && (resp.success || resp.message === 'success')) {
            const successMsg = '✅ Email alert submitted via Web3Forms';
            showToast(successMsg, 'success');
            showInPageAlert(successMsg, 'success');
            console.log('✅ Web3Forms response:', resp);
        } else {
            const warnMsg = '⚠️ Email submission failed (check API key)';
            showToast(warnMsg, 'warning');
            showInPageAlert(warnMsg, 'warning');
            console.warn('⚠️ Web3Forms response:', resp);
        }
    } catch (err) {
        const errMsg = '❌ Failed to submit email alert: ' + (err.message || err);
        showToast(errMsg, 'error');
        showInPageAlert(errMsg, 'error');
        console.error(err);
    }
}

// ============ SEND EMAIL VIA WEB3FORMS ============
async function sendMailViaWeb3forms(payload) {
    if (!WEB3FORMS_CONFIG.accessKey) {
        // Return helpful message so UI can guide user to add the key
        return { success: false, message: 'missing_access_key' };
    }
    try {
        // Ensure access_key is included
        payload.access_key = WEB3FORMS_CONFIG.accessKey;
        const resp = await fetch(WEB3FORMS_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await resp.json();
        console.log('📤 Web3Forms response:', data);
        return data;
    } catch (err) {
        console.error('🔴 Web3Forms connection error:', err);
        throw err;
    }
}
function generateAlertMessage(location, floodLevel) {
    return `🚨 CRITICAL ALERT 🚨\n\n` +
        `⚠️ FLOOD EMERGENCY DETECTED\n\n` +
        `📍 Location: ${location}\n` +
        `📊 Severity: ${floodLevel}\n` +
        `🕐 Time: ${new Date().toLocaleTimeString()}\n\n` +
        `⚡ IMMEDIATE ACTION REQUIRED ⚡\n` +
        `Please evacuate immediately and move to higher ground.\n` +
        `Contact emergency services if needed.`;
}

// ============ SEND ALERT (SMS removed) ============
// sendSmsAlert() removed — SMS modal-based sending has been deprecated.
// Use `sendMailDirectly()` or frontend alert button which now uses Web3Forms.

// ============ BROWSER NOTIFICATION SYSTEM ============
function sendBrowserNotification(location, floodLevel) {
    console.log('🔔 Sending browser notification...');
    
    // Check if browser supports notifications
    if (!('Notification' in window)) {
        console.warn('⚠️ Browser does not support notifications');
        return;
    }

    // Request permission if not granted
    if (Notification.permission === 'granted') {
        showNotification(location, floodLevel);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification(location, floodLevel);
            }
        });
    }
}

function showNotification(location, floodLevel) {
    const options = {
        icon: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/exclamation-triangle.svg',
        tag: 'flood-alert',
        requireInteraction: true,
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="75" font-size="75" fill="red">🚨</text></svg>'
    };

    const notification = new Notification('🚨 CRITICAL FLOOD ALERT 🚨', {
        ...options,
        body: `📍 ${location}\n📊 Status: ${floodLevel}\n⚡ EVACUATE IMMEDIATELY!`,
        tag: 'flood-alert-' + Date.now()
    });

    notification.onclick = () => {
        console.log('✓ Notification clicked');
        window.focus();
        notification.close();
    };

    console.log('✅ Browser notification sent');
}

// ============ SHOW TOAST NOTIFICATION ============
function showToast(message, type = 'success') {
    console.log(`📢 Showing ${type} toast:`, message);
    
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const messageId = type === 'success' ? 'toastMessage' : 'errorMessage';
    
    const toast = document.getElementById(toastId);
    const messageElement = document.getElementById(messageId);

    if (!toast || !messageElement) {
        console.error(`❌ Toast elements not found (${toastId})`);
        alert(message);
        return;
    }

    messageElement.textContent = message;
    
    // Ensure toast is visible
    toast.classList.remove('show');
    // Force reflow to restart animation
    void toast.offsetWidth;
    toast.classList.add('show');
    
    console.log('✓ Toast displayed');

    setTimeout(() => {
        toast.classList.remove('show');
        console.log('✓ Toast hidden');
    }, 5000);
}

// ============ IN-PAGE ALERT (fallback) ============
function showInPageAlert(message, type = 'success') {
    const alertEl = document.getElementById('inPageAlert');
    const msgEl = document.getElementById('inPageAlertMessage');
    if (!alertEl || !msgEl) return;

    msgEl.textContent = message;
    // Style based on type
    if (type === 'success') {
        alertEl.style.background = 'rgba(68,204,255,0.12)';
        alertEl.style.color = '#0a5566';
        alertEl.style.border = '1px solid #44ccff';
    } else if (type === 'warning') {
        alertEl.style.background = 'rgba(255,199,0,0.12)';
        alertEl.style.color = '#5a3e00';
        alertEl.style.border = '1px solid #ffbf00';
    } else {
        alertEl.style.background = 'rgba(255,77,77,0.08)';
        alertEl.style.color = '#6b0b0b';
        alertEl.style.border = '1px solid #ff4d4d';
    }

    alertEl.style.display = 'block';
    // auto-hide after 6 seconds
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 6000);
}


// ============ CAMERA CLICK HANDLERS ============
function initCameraClickHandlers() {
    const cameraItems = document.querySelectorAll('.camera-item');
    const mainFeedImage = document.getElementById('mainFeedImage');
    const mainFeedTitle = document.getElementById('mainFeedTitle');
    
    cameraItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Remove active class from all
            cameraItems.forEach(cam => cam.classList.remove('active'));
            // Add to clicked item
            this.classList.add('active');
            
            // Get camera data from attributes
            const cameraNum = this.getAttribute('data-camera');
            const cameraTitle = this.getAttribute('data-title');
            const cameraFlood = this.getAttribute('data-flood');
            
            // Update main feed image
            if (mainFeedImage) {
                mainFeedImage.src = `http://172.17.177.79:5000/video_feed/cam${cameraNum}`;
            }
            
            // Update main feed title
            if (mainFeedTitle) {
                mainFeedTitle.textContent = cameraTitle;
            }
            
            // Determine status based on flood percentage
            const floodPct = parseInt(cameraFlood);
            const status = floodPct >= 40 ? 'FLOOD' : 'NORMAL';
            
            // Update flood status badge
            const floodStatusBadge = document.querySelector('.flood-status-badge');
            if (floodStatusBadge && cameraFlood) {
                let level = "low";
                if (floodPct >= 40) level = "high";
                
                if (status === 'FLOOD') {
                    floodStatusBadge.className = "flood-status-badge " + level;
                    floodStatusBadge.innerHTML = `<i class="fas fa-exclamation-triangle"></i> FLOOD ${floodPct}%`;
                } else {
                    floodStatusBadge.className = "flood-status-badge normal";
                    floodStatusBadge.innerHTML = `<i class="fas fa-check-circle"></i> NORMAL ${100 - floodPct}%`;
                }
            }
            
            // Update main feed info (flood level and last updated)
            updateMainFeedInfo(floodPct);
            
            // Update alert notices based on status
            updateAlertNotices(status);
            
            // Update current camera for status polling
            if (window.setCurrentCamera) {
                window.setCurrentCamera(cameraNum);
            }
        });
    });
}

// ============ SEARCH FUNCTIONALITY ============
document.querySelector('.search-container input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim()) {
        console.log('Searching for:', this.value);
        this.value = '';
    }
});

// Check if user is logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    if (isLoggedIn) {
        console.log('✅ User is logged in');
    }
}

// Disable settings icon if not logged in
function disableSettingsIfNotLoggedIn() {
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    const settingsIcon = document.querySelector('.nav-item:nth-child(3)');
    
    if (settingsIcon) {
        if (!isLoggedIn) {
            // Not logged in - disable settings
            settingsIcon.style.opacity = '0.4';
            settingsIcon.style.cursor = 'not-allowed';
            settingsIcon.style.pointerEvents = 'none';
            settingsIcon.title = 'Login required to access settings';
            settingsIcon.classList.add('disabled');
        } else {
            // Logged in - enable settings
            settingsIcon.style.opacity = '1';
            settingsIcon.style.cursor = 'pointer';
            settingsIcon.style.pointerEvents = 'auto';
            settingsIcon.title = 'Settings';
            settingsIcon.classList.remove('disabled');
        }
    }
}
