// Login Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    checkIfLoggedIn();
});

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');
    const usernameInput = document.getElementById('username');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function(e) {
            e.preventDefault();
            togglePasswordVisibility(passwordInput, togglePassword);
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Load saved username if remember me was checked
    loadSavedUsername();

    // Remember me checkbox
    if (rememberMe) {
        rememberMe.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('rememberUsername', usernameInput.value || '');
            } else {
                localStorage.removeItem('rememberUsername');
            }
        });
    }

    // Focus effects
    document.querySelectorAll('.form-group input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            clearError(this.id);
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSocialLogin(this);
        });
    });

    // Forgot password
    document.querySelector('.forgot-password')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Password reset link sent to your email!', 'info');
    });

    // Sign up link
    document.querySelector('.signup-link a')?.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('Sign up feature coming soon!', 'info');
    });
}

// Toggle password visibility
function togglePasswordVisibility(passwordInput, toggleBtn) {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    toggleBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
}

// Load saved username
function loadSavedUsername() {
    const savedUsername = localStorage.getItem('rememberUsername');
    const usernameInput = document.getElementById('username');
    const rememberMe = document.getElementById('rememberMe');

    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberMe.checked = true;
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.querySelector('.login-btn');

    // Validate inputs
    if (!validateLogin(username, password)) {
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    loginBtn.innerHTML = '<i class="fas fa-spinner"></i><span>Signing in...</span>';

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check credentials (demo authentication)
        if (authenticateUser(username, password)) {
            // Save user session
            saveUserSession(username, rememberMe);

            // Show success
            loginBtn.classList.remove('loading');
            loginBtn.classList.add('success');
            loginBtn.innerHTML = '<i class="fas fa-check"></i><span>Success!</span>';

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Show error
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
        showFormError('Invalid username or password. Try demo/demo123');
        
        // Reset button
        setTimeout(() => {
            loginBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
        }, 2000);
    }
}

// Validate login inputs
function validateLogin(username, password) {
    let isValid = true;

    // Clear previous errors
    clearError('username');
    clearError('password');

    // Validate username
    if (!username) {
        showFieldError('username', 'Username or email is required');
        isValid = false;
    } else if (username.includes('@') && !isValidEmail(username)) {
        showFieldError('username', 'Please enter a valid email');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showFieldError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.style.borderColor = '#ef4444';
    }
}

// Clear field error
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        inputElement.style.borderColor = '';
    }
}

// Show form error
function showFormError(message) {
    const formError = document.getElementById('formError');
    if (formError) {
        formError.textContent = message;
        formError.classList.add('show');
        setTimeout(() => {
            formError.classList.remove('show');
        }, 5000);
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Demo authentication (replace with real API call)
function authenticateUser(username, password) {
    // Demo credentials for testing
    const demoUsers = [
        { username: 'demo', password: 'demo123' },
        { username: 'admin@flood.com', password: 'admin123' },
        { username: 'operator', password: 'operator123' }
    ];

    return demoUsers.some(user => 
        (user.username === username || user.username.split('@')[0] === username) && 
        user.password === password
    );
}

// Save user session
function saveUserSession(username, rememberMe) {
    const sessionData = {
        username: username,
        loginTime: new Date().toISOString(),
        isLoggedIn: true
    };

    localStorage.setItem('userSession', JSON.stringify(sessionData));
    localStorage.setItem('isUserLoggedIn', 'true');

    if (rememberMe) {
        localStorage.setItem('rememberUsername', username);
    }
}

// Check if user is already logged in
function checkIfLoggedIn() {
    const userSession = localStorage.getItem('userSession');
    
    if (userSession) {
        const session = JSON.parse(userSession);
        if (session.isLoggedIn) {
            // Optionally redirect to dashboard if already logged in
            // window.location.href = 'index.html';
        }
    }
}

// Handle social login
function handleSocialLogin(button) {
    const provider = button.querySelector('i').className.includes('google') ? 'Google' : 'Microsoft';
    
    button.disabled = true;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner"></i>Connecting...';

    // Simulate social login
    setTimeout(() => {
        showNotification(`${provider} login would open authentication`, 'info');
        button.disabled = false;
        button.innerHTML = originalText;
    }, 1500);
}

// Show notification toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add notification styles
    addNotificationStyles();

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles dynamically if not in CSS
function addNotificationStyles() {
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #1a1a1a 0%, #161616 100%);
                border: 1px solid #2a2a2a;
                color: #fff;
                padding: 16px 24px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 14px;
                font-weight: 500;
                max-width: 350px;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1000;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            }

            .notification.show {
                opacity: 1;
                transform: translateY(0);
            }

            .notification i {
                font-size: 18px;
                flex-shrink: 0;
            }

            .notification-success {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1));
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #22c55e;
            }

            .notification-success i {
                color: #22c55e;
            }

            .notification-info {
                background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
                border: 1px solid rgba(59, 130, 246, 0.3);
                color: #3b82f6;
            }

            .notification-info i {
                color: #3b82f6;
            }

            .notification-error {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
                border: 1px solid rgba(239, 68, 68, 0.3);
                color: #ef4444;
            }

            .notification-error i {
                color: #ef4444;
            }

            @media (max-width: 480px) {
                .notification {
                    bottom: 20px;
                    right: 20px;
                    left: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press Enter to submit
    if (e.key === 'Enter' && document.getElementById('loginForm')) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'BUTTON') {
            document.querySelector('.login-btn').click();
        }
    }

    // Esc to clear form
    if (e.key === 'Escape') {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
});

// Global function to check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('isUserLoggedIn') === 'true';
}

// Global function to logout user
function logoutUser() {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isUserLoggedIn');
    window.location.href = 'index.html';
}

// Demo Credentials Helper
console.log('%c🔐 Demo Credentials:', 'color: #00d4ff; font-size: 14px; font-weight: bold;');
console.log('%cUsername: demo | Password: demo123', 'color: #22c55e; font-size: 12px;');
console.log('%cUsername: admin@flood.com | Password: admin123', 'color: #22c55e; font-size: 12px;');
console.log('%cUsername: operator | Password: operator123', 'color: #22c55e; font-size: 12px;');
