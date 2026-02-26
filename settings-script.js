// Settings Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Redirect to login if not logged in
        showAccessDeniedMessage();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    initThemeToggle();
    initSettingsControls();
    loadSettings();
});

// Initialize settings controls
function initSettingsControls() {
    // Handle threshold slider
    const thresholdSlider = document.querySelector('.threshold-slider');
    if (thresholdSlider) {
        thresholdSlider.addEventListener('input', function() {
            document.querySelector('.threshold-slider').parentElement.querySelector('.slider-value').textContent = this.value + '%';
            saveSettings();
        });
    }

    // Handle sensitivity slider
    const sensitivitySlider = document.querySelector('.sensitivity-slider');
    if (sensitivitySlider) {
        sensitivitySlider.addEventListener('input', function() {
            document.querySelector('.sensitivity-slider').parentElement.querySelector('.slider-value').textContent = this.value + '%';
            saveSettings();
        });
    }

    // Handle all toggles
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', saveSettings);
    });

    // Handle all selects
    const selects = document.querySelectorAll('.setting-select');
    selects.forEach(select => {
        select.addEventListener('change', saveSettings);
    });

    // Handle action buttons
    const downloadBtn = document.querySelector('.action-btn.primary');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadReport);
    }

    const resetBtn = document.querySelector('.action-btn.secondary');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefault);
    }

    const logoutBtn = document.querySelector('.action-btn.danger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterSettings(e.target.value);
        });
    }
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        resolution: document.querySelector('select:nth-of-type(1)')?.value || '1080p (Full HD)',
        fps: document.querySelector('select:nth-of-type(2)')?.value || '30 FPS',
        nightVision: document.querySelector('.toggle-switch:nth-of-type(1) input')?.checked || false,
        smsNotifications: document.querySelector('.toggle-switch:nth-of-type(2) input')?.checked || true,
        emailNotifications: document.querySelector('.toggle-switch:nth-of-type(3) input')?.checked || true,
        floodThreshold: document.querySelector('.threshold-slider')?.value || 50,
        detectionSensitivity: document.querySelector('.sensitivity-slider')?.value || 75,
        aiDetection: document.querySelector('.toggle-switch:nth-of-type(4) input')?.checked || true,
        recordingMode: document.querySelector('select:nth-of-type(3)')?.value || 'Always On',
        refreshRate: document.querySelector('select:nth-of-type(4)')?.value || 'Real-time (1 sec)',
        backupConnection: document.querySelector('.toggle-switch:nth-of-type(5) input')?.checked || true,
        language: document.querySelector('select:nth-of-type(5)')?.value || 'English',
        darkMode: document.querySelector('#darkModeToggle')?.checked || true,
    };
    
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('dashboardSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Load selects
        const selects = document.querySelectorAll('.setting-select');
        if (selects[0]) selects[0].value = settings.resolution;
        if (selects[1]) selects[1].value = settings.fps;
        if (selects[2]) selects[2].value = settings.recordingMode;
        if (selects[3]) selects[3].value = settings.refreshRate;
        if (selects[4]) selects[4].value = settings.language;

        // Load toggles
        const toggles = document.querySelectorAll('.toggle-switch input');
        if (toggles[0]) toggles[0].checked = settings.nightVision;
        if (toggles[1]) toggles[1].checked = settings.smsNotifications;
        if (toggles[2]) toggles[2].checked = settings.emailNotifications;
        if (toggles[3]) toggles[3].checked = settings.aiDetection;
        if (toggles[4]) toggles[4].checked = settings.backupConnection;
        if (toggles[5]) document.getElementById('darkModeToggle').checked = settings.darkMode;

        // Load sliders
        const thresholdSlider = document.querySelector('.threshold-slider');
        if (thresholdSlider) {
            thresholdSlider.value = settings.floodThreshold;
            thresholdSlider.parentElement.querySelector('.slider-value').textContent = settings.floodThreshold + '%';
        }

        const sensitivitySlider = document.querySelector('.sensitivity-slider');
        if (sensitivitySlider) {
            sensitivitySlider.value = settings.detectionSensitivity;
            sensitivitySlider.parentElement.querySelector('.slider-value').textContent = settings.detectionSensitivity + '%';
        }

        console.log('Settings loaded:', settings);
    }
}

// Filter settings based on search input
function filterSettings(searchTerm) {
    const sections = document.querySelectorAll('.settings-section');
    const term = searchTerm.toLowerCase();
    let foundAny = false;

    sections.forEach(section => {
        const header = section.querySelector('.section-header h2').textContent.toLowerCase();
        const items = section.querySelectorAll('.setting-item, .action-btn');
        
        let sectionMatches = header.includes(term);
        let visibleItems = 0;

        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(term) || sectionMatches) {
                item.style.display = '';
                visibleItems++;
                foundAny = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide section based on matches
        if (visibleItems > 0 || sectionMatches) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });

    // Show message if no results found
    if (!foundAny && searchTerm.length > 0) {
        const grid = document.querySelector('.settings-grid');
        let noResults = document.querySelector('.no-results');
        
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <p>No settings found matching "<strong>${searchTerm}</strong>"</p>
            `;
            grid.parentElement.appendChild(noResults);
        }
    } else {
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
    }
}

// Download report as PDF/JSON
function downloadReport() {
    const settings = JSON.parse(localStorage.getItem('dashboardSettings') || '{}');
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    // Show notification
    showNotification('Report downloaded successfully!', 'success');
}

// Reset settings to default
function resetToDefault() {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        localStorage.removeItem('dashboardSettings');
        location.reload();
        showNotification('Settings reset to default', 'success');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('dashboardSettings');
        localStorage.removeItem('userSession');
        localStorage.removeItem('isUserLoggedIn');
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Show notification toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add theme toggle functionality (shared from main script)
function initThemeToggle() {
    const themeCheckbox = document.getElementById('themeCheckbox');
    const htmlElement = document.documentElement;
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        themeCheckbox.checked = true;
    }
    
    // Handle theme toggle
    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', function() {
            const theme = this.checked ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
}
// Show access denied message when trying to access settings without login
function showAccessDeniedMessage() {
    const content = document.querySelector('.settings-content') || document.querySelector('main');
    if (content) {
        content.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                color: #fff;
                text-align: center;
            ">
                <div style="font-size: 64px; margin-bottom: 20px; color: #ef4444;">
                    <i class="fas fa-lock"></i>
                </div>
                <h1 style="font-size: 32px; margin-bottom: 10px;">Access Denied</h1>
                <p style="font-size: 18px; color: #888; margin-bottom: 30px;">
                    Settings page is only accessible for logged-in users
                </p>
                <div style="font-size: 16px; color: #00d4ff;">
                    🔄 Redirecting to login page...
                </div>
            </div>
        `;
    }
}