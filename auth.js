// Matrix Rain Effect
const canvas = document.getElementById('matrix-rain');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';

const alphabet = katakana + latin + nums;

const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let rainDrops = [];

function initRainDrops() {
    columns = Math.floor(canvas.width / fontSize);
    rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }
}

initRainDrops();

const draw = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#0F0';
    context.font = 'bold ' + fontSize + 'px Orbitron';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

setInterval(draw, 30);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initRainDrops();
});

// Form Toggle
document.querySelectorAll('.link-glow').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        document.querySelectorAll('.auth-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');
    });
});

// Initially show login form
document.getElementById('login').classList.add('active');

// Simple Authentication System for Static Hosting
class SimpleAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('ukh_users') || '{}');
        this.currentUser = JSON.parse(localStorage.getItem('ukh_current_user') || 'null');
        this.initializeAuth();
    }

    initializeAuth() {
        // Check if user is already logged in
        if (this.currentUser) {
            this.showWelcomeMessage();
        }

        // Handle login
        document.getElementById('login-button').addEventListener('click', () => {
            this.handleLogin();
        });

        // Handle signup
        document.getElementById('signup-button').addEventListener('click', () => {
            this.handleSignup();
        });
    }

    handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Check if user exists and password matches
        if (this.users[email] && this.users[email].password === this.hashPassword(password)) {
            this.currentUser = {
                email: email,
                name: this.users[email].name,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('ukh_current_user', JSON.stringify(this.currentUser));
            this.showMessage('Login successful! Redirecting...', 'success');
            
            // Automatically refresh and redirect to main site
            setTimeout(() => {
                window.location.href = 'index.html';
                window.location.reload();
            }, 1000);
        } else {
            this.showMessage('Invalid email or password', 'error');
        }
    }

    handleSignup() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        if (!name || !email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        // Check if user already exists
        if (this.users[email]) {
            this.showMessage('User with this email already exists', 'error');
            return;
        }

        // Create new user
        this.users[email] = {
            name: name,
            password: this.hashPassword(password),
            signupTime: new Date().toISOString()
        };

        localStorage.setItem('ukh_users', JSON.stringify(this.users));

        // Auto login after signup
        this.currentUser = {
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('ukh_current_user', JSON.stringify(this.currentUser));

        this.showMessage('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    showWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00; padding: 1rem; border-radius: 5px; z-index: 1000;">
                <p style="color: #00ff00; margin: 0;">Welcome back, ${this.currentUser.name}!</p>
                <button onclick="auth.logout()" style="background: #ff0000; color: #fff; border: none; padding: 0.5rem; margin-top: 0.5rem; border-radius: 3px; cursor: pointer;">Logout</button>
            </div>
        `;
        document.body.appendChild(welcomeDiv);
    }

    logout() {
        localStorage.removeItem('ukh_current_user');
        this.currentUser = null;
        this.showMessage('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    hashPassword(password) {
        // Simple hash function (in production, use proper hashing)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'auth-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 5px;
            color: #fff;
            font-weight: bold;
            z-index: 1001;
            animation: slideDown 0.3s ease;
            ${type === 'success' ? 'background: rgba(0, 255, 0, 0.2); border: 1px solid #00ff00;' : 'background: rgba(255, 0, 0, 0.2); border: 1px solid #ff0000;'}
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// Add slide down animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize authentication system
const auth = new SimpleAuth();

// Make auth available globally for logout function
window.auth = auth;
