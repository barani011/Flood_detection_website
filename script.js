// Initialize chart when page loads
document.addEventListener('DOMContentLoaded', function() {
    createFloodChart();
    initThemeToggle();
    initWeatherSearch();
    loadDefaultWeather();
    checkLoginStatus();
    disableSettingsIfNotLoggedIn();
});

// Weather API Configuration
const WEATHER_API_KEY = '2cc69f91c3da9d5c60dc1bbd6e0fe633';

// Get weather icon based on description
function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return 'fas fa-cloud-rain';
    if (desc.includes('cloud')) return 'fas fa-cloud';
    if (desc.includes('clear') || desc.includes('sunny')) return 'fas fa-sun';
    if (desc.includes('wind')) return 'fas fa-wind';
    if (desc.includes('snow')) return 'fas fa-snowflake';
    if (desc.includes('storm') || desc.includes('thunder')) return 'fas fa-bolt';
    if (desc.includes('drizzle')) return 'fas fa-cloud-rain';
    return 'fas fa-cloud-sun';
}

// Fetch weather data
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Weather fetch failed');
        return await response.json();
    } catch (error) {
        console.error('Weather error:', error);
        return null;
    }
}

// Render weather cards with forecast data
function renderWeatherCards(weatherData) {
    if (!weatherData || !weatherData.list) return;

    const cards = document.querySelectorAll('.weather-card');
    const dailyForecasts = {};

    // Group by day
    weatherData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                temps: [],
                description: item.weather[0].main,
                icon: item.weather[0].main
            };
        }
        dailyForecasts[dateKey].temps.push(item.main.temp);
    });

    // Get next 4 days (including today)
    const dates = Object.keys(dailyForecasts).sort().slice(0, 4);
    const dayNames = ['Today', 'Tomorrow', 'Day 3', 'Day 4'];

    const chartLabels = [];
    const chartMax = [];
    const chartMin = [];

    dates.forEach((date, index) => {
        if (cards[index]) {
            const forecast = dailyForecasts[date];
            const minTemp = Math.round(Math.min(...forecast.temps));
            const maxTemp = Math.round(Math.max(...forecast.temps));
            const icon = getWeatherIcon(forecast.description);

            // populate cards
            cards[index].innerHTML = `
                <i class="${icon}"></i>
                <p class="temp">${maxTemp}° <span>${minTemp}°</span></p>
                <p class="day">${dayNames[index]}</p>
            `;
            if (index === 0) cards[index].classList.add('active'); else cards[index].classList.remove('active');

            // collect chart points (one point per card/day)
            chartLabels.push(dayNames[index]);
            chartMax.push(maxTemp);
            chartMin.push(minTemp);
        }
    });

    // Update the chart to reflect the daily forecast (max and min temps)
    if (chartLabels.length && chartMax.length) {
        updateFloodChart(chartLabels, chartMax, chartMin);
    }
}

// Load default weather for Tirunelveli
async function loadDefaultWeather() {
    const tirunelveliLat = 8.7139;
    const tirunelveliLon = 77.7567;
    
    const weatherData = await fetchWeatherData(tirunelveliLat, tirunelveliLon);
    if (weatherData) {
        renderWeatherCards(weatherData);
    }
}

// Initialize weather search
function initWeatherSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const locationName = this.value.trim();
                try {
                    // Get location coordinates from city name
                    const geoResponse = await fetch(
                        `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${WEATHER_API_KEY}`
                    );
                    const geoData = await geoResponse.json();

                    if (geoData.length > 0) {
                        const location = geoData[0];
                        console.log(`Fetching weather for ${location.name}...`);
                        
                        // Fetch weather for the location
                        const weatherData = await fetchWeatherData(location.lat, location.lon);
                        if (weatherData) {
                            renderWeatherCards(weatherData);
                        }
                    } else {
                        alert('Location not found. Please try another city.');
                    }
                    
                    this.value = '';
                } catch (error) {
                    console.error('Search error:', error);
                    alert('Error loading weather data');
                }
            }
        });
    }
}

// Create flood level chart
function createFloodChart() {
    const canvas = document.getElementById('floodChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 400);
    gradient.addColorStop(0, 'rgba(0, 212, 255, 0.22)');
    gradient.addColorStop(1, 'rgba(0, 212, 255, 0.03)');

    // keep a reference to the chart so we can update it later
    window.floodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            datasets: [{
                label: 'Max Temp',
                data: [45, 35, 65, 48, 92, 65, 82],
                borderColor: '#00d4ff',
                borderWidth: 4,
                tension: 0.55,
                cubicInterpolationMode: 'monotone',
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#0b0b0b',
                pointBorderColor: '#00d4ff',
                pointBorderWidth: 3,
                fill: true,
                backgroundColor: gradient,
                clip: 20
            }, {
                label: 'Min Temp',
                data: [35, 25, 45, 35, 55, 45, 55],
                borderColor: 'rgba(255,255,255,0.12)',
                borderWidth: 2,
                borderDash: [6, 6],
                tension: 0.4,
                pointRadius: 0,
                fill: false,
                segment: {
                    borderColor: 'rgba(255,255,255,0.12)'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#0b0b0b',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    callbacks: {
                        title: function(items) {
                            return items && items[0] ? items[0].label : '';
                        },
                        label: function(context) {
                            const label = context.dataset && context.dataset.label ? context.dataset.label : '';
                            const val = context.parsed && context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                            return label ? `${label}: ${val}°` : `${val}°`;
                        }
                    }
                }
            },
            elements: {
                line: {
                    borderJoinStyle: 'round',
                    borderCapStyle: 'round'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 40,
                    grid: {
                        color: 'rgba(255,255,255,0.03)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.35)',
                        stepSize: 10
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)',
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}

// Update flood chart with new labels and data (safe if chart not present)
function updateFloodChart(labels, maxData, minData) {
    try {
        if (!window.floodChart) return;
        if (!Array.isArray(labels) || !Array.isArray(maxData)) return;

        window.floodChart.data.labels = labels;

        // Update primary dataset (max temps)
        if (!window.floodChart.data.datasets || !window.floodChart.data.datasets[0]) {
            window.floodChart.data.datasets = [{ label: 'Max Temp', data: maxData }];
        } else {
            window.floodChart.data.datasets[0].data = maxData;
        }

        // Optionally update second dataset (min temps) as a dashed line
        if (Array.isArray(minData)) {
            if (!window.floodChart.data.datasets[1]) {
                window.floodChart.data.datasets[1] = {
                    label: 'Min Temp',
                    data: minData,
                    borderColor: 'rgba(255,255,255,0.35)',
                    borderWidth: 2,
                    borderDash: [6,6],
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                };
            } else {
                window.floodChart.data.datasets[1].data = minData;
            }
        }

        window.floodChart.update();
    } catch (err) {
        console.warn('updateFloodChart error', err);
    }
}

// Theme toggle
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

// Check if user is logged in (from login-script.js)
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
