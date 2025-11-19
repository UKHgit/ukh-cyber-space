// Particle.js Configurations with Cyan Particles Only
const cyanConfig = {
    particles: {
        number: { value: 100 },
        shape: { type: 'circle' },
        opacity: { value: 0.7, random: true },
        size: { value: 1.5, random: true },
        move: { enable: true, speed: 3 },
        color: { value: '#00f3ff' },
        line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.8, width: 1 }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { 
            onhover: { enable: true, mode: 'attract' },
            onclick: { enable: true, mode: 'push' },
            ontouch: { enable: true, mode: 'attract' }
        },
        modes: {
            attract: { distance: 200, duration: 0.4, speed: 3 },
            push: { particles_nb: 4 }
        }
    }
};

// Home section with red lines only
particlesJS('particles-home', {
    particles: {
        number: { value: 200 },
        shape: { type: 'circle' },
        opacity: { value: 0.7, random: true },
        size: { value: 1.5, random: true },
        move: { enable: true, speed: 3 },
        color: { value: '#00f3ff' },
        line_linked: { enable: true, distance: 150, color: '#ff1a1a', opacity: 0.6, width: 1 }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { 
            onhover: { enable: true, mode: 'attract' },
            onclick: { enable: true, mode: 'push' },
            ontouch: { enable: true, mode: 'attract' }
        },
        modes: {
            attract: { distance: 200, duration: 0.4, speed: 3 },
            push: { particles_nb: 4 }
        }
    }
});

particlesJS('particles-nav', cyanConfig);
particlesJS('particles-about', cyanConfig);
particlesJS('particles-services', cyanConfig);
particlesJS('particles-cyber-lab', cyanConfig);
particlesJS('particles-blog', cyanConfig);
particlesJS('particles-contact', cyanConfig);

// Enhanced Cursor Attraction System with Cyber Effects
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
let mouseTimeout;
let cyberTrail = [];

// Create cyber cursor trail effect
function createCyberTrail() {
    const trail = document.createElement('div');
    trail.className = 'cyber-trail';
    trail.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #00f3ff 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(trail);
    return trail;
}

// Track mouse movement globally with cyber effects
document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    isMouseMoving = true;
    
    // Create cyber trail effect
    if (cyberTrail.length < 15) {
        const trail = createCyberTrail();
        cyberTrail.push(trail);
    }
    
    // Update trail positions
    cyberTrail.forEach((trail, index) => {
        const delay = index * 20;
        setTimeout(() => {
            trail.style.left = (mouseX - 2) + 'px';
            trail.style.top = (mouseY - 2) + 'px';
            trail.style.opacity = (1 - index / cyberTrail.length) * 0.6;
        }, delay);
    });
    
    // Clear existing timeout
    clearTimeout(mouseTimeout);
    
    // Set timeout to detect when mouse stops moving
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
        // Fade out trails when mouse stops
        cyberTrail.forEach(trail => {
            trail.style.opacity = '0';
        });
    }, 150);
    
    // Apply enhanced attraction to nearby particles only
    enhanceParticleAttraction();
});

function enhanceParticleAttraction() {
    // Get all particle canvas elements
    const particleCanvases = document.querySelectorAll('.particles canvas');
    
    particleCanvases.forEach(canvas => {
        if (canvas && window.pJSDom) {
            // Find the corresponding particles.js instance
            const canvasId = canvas.parentElement.id;
            const pJS = window.pJSDom.find(item => item.pJS.canvas.el.parentElement.id === canvasId);
            
            if (pJS && pJS.pJS.particles && pJS.pJS.particles.array) {
                const particles = pJS.pJS.particles.array;
                const canvasRect = canvas.getBoundingClientRect();
                
                // Calculate relative mouse position within the canvas
                const relativeMouseX = mouseX - canvasRect.left;
                const relativeMouseY = mouseY - canvasRect.top;
                
                // Apply attraction force only to nearby particles
                particles.forEach(particle => {
                    if (isMouseMoving) {
                        const dx = relativeMouseX - particle.x;
                        const dy = relativeMouseY - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        // Only attract particles within 150px range (closer range for more focused effect)
                        if (distance < 150 && distance > 0) {
                            const force = (150 - distance) / 150;
                            const attraction = force * 1.2; // Stronger attraction for nearby particles
                            
                            particle.vx += (dx / distance) * attraction;
                            particle.vy += (dy / distance) * attraction;
                            
                            // Limit velocity
                            const maxVelocity = 3;
                            const currentVelocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                            if (currentVelocity > maxVelocity) {
                                particle.vx = (particle.vx / currentVelocity) * maxVelocity;
                                particle.vy = (particle.vy / currentVelocity) * maxVelocity;
                            }
                        }
                    }
                });
            }
        }
    });
}

// Cyber Matrix Rain Effect - Optimized for both mobile and desktop
function createMatrixRain() {
    const matrixContainer = document.createElement('div');
    matrixContainer.id = 'matrix-rain';
    matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(matrixContainer);
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Adjust number of columns based on screen size for performance
    const isMobile = window.innerWidth <= 768;
    const columnCount = isMobile ? 25 : 50; // Fewer columns on mobile
    const fontSize = isMobile ? '12px' : '14px';
    const textLength = isMobile ? 15 : 20; // Shorter text on mobile
    
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.style.cssText = `
            position: absolute;
            top: -100px;
            left: ${Math.random() * 100}vw;
            color: #00ff00;
            font-family: monospace;
            font-size: ${fontSize};
            opacity: 0.3;
            animation: matrixFall ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            will-change: transform;
        `;
        
        let text = '';
        for (let j = 0; j < textLength; j++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        matrixContainer.appendChild(column);
    }
}

// Add CSS for matrix rain animation
const matrixStyle = document.createElement('style');
matrixStyle.textContent = `
    @keyframes matrixFall {
        0% { transform: translateY(-100vh); opacity: 0; }
        10% { opacity: 0.3; }
        90% { opacity: 0.3; }
        100% { transform: translateY(100vh); opacity: 0; }
    }
    
    .cyber-pulse {
        animation: cyberPulse 2s infinite;
    }
    
    @keyframes cyberPulse {
        0%, 100% { 
            box-shadow: 0 0 5px #00f3ff, 0 0 10px #00f3ff, 0 0 15px #00f3ff;
            transform: scale(1);
        }
        50% { 
            box-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff;
            transform: scale(1.02);
        }
    }
    
    .glitch-text {
        position: relative;
        animation: glitchText 3s infinite;
    }
    
    @keyframes glitchText {
        0%, 90%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
`;
document.head.appendChild(matrixStyle);

// Initialize matrix rain effect - works on both mobile and desktop
setTimeout(() => {
    createMatrixRain();
}, 1500);

// Add mouse leave event to reset particle behavior
document.addEventListener('mouseleave', function() {
    isMouseMoving = false;
    clearTimeout(mouseTimeout);
    // Clean up trails
    cyberTrail.forEach(trail => {
        trail.style.opacity = '0';
        setTimeout(() => trail.remove(), 300);
    });
    cyberTrail = [];
});


// GSAP Animations
gsap.from('#home h1', { 
    duration: 1.5, 
    y: -100, 
    opacity: 0, 
    ease: 'power2.out',
    scrollTrigger: {
        trigger: '#home',
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
    }
});
gsap.from('.about-image', { 
    duration: 1, 
    x: -100, 
    opacity: 0, 
    ease: 'power2.out', 
    scrollTrigger: { 
        trigger: '#about', 
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
    } 
});
gsap.from('.about-text p', { 
    duration: 1, 
    x: 100, 
    opacity: 0, 
    delay: 0.5, 
    ease: 'power2.out', 
    scrollTrigger: { 
        trigger: '#about', 
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
    } 
});
gsap.from('.about-card', { 
    duration: 1, 
    x: -50, 
    opacity: 0, 
    stagger: 0.3, 
    scrollTrigger: { 
        trigger: '#about', 
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
    } 
});
gsap.from('.service-card', { 
    duration: 1, 
    x: -50, 
    opacity: 0, 
    stagger: 0.3, 
    scrollTrigger: { 
        trigger: '#services', 
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
    } 
});
gsap.from('.lab-item', { 
    duration: 1, 
    scale: 0.8, 
    opacity: 0, 
    stagger: 0.3, 
    scrollTrigger: { 
        trigger: '#cyber-lab', 
        start: 'top 80%',
        toggleActions: 'play pause resume reverse'
    } 
});

// Welcome Screen Control
window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('welcome-screen').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('welcome-screen').style.display = 'none';
        }, 1000);
    }, 3000);
    
    // Check authentication status
    checkAuthStatus();
});

// Authentication Status Check
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('ukh_current_user') || 'null');
    const loginLink = document.querySelector('nav a[href="auth.html"]');
    const userBox = document.getElementById('user-box');
    const userNameDisplay = document.getElementById('user-name-display');
    const userNameHover = document.getElementById('user-name-hover');
    const userButton = document.getElementById('user-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (currentUser) {
        // User is logged in, show user box and update navigation
        if (userBox && userNameDisplay && userNameHover) {
            userBox.style.display = 'block';
            const firstName = currentUser.name.split(' ')[0];
            userNameDisplay.textContent = `\u00A0${firstName}\u00A0`;
            userNameHover.textContent = `\u00A0${firstName}\u00A0`;
            userButton.setAttribute('data-text', firstName);
            
            // Add click event to user button to redirect to dashboard
            userButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'Dash/dashboard.html';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userBox.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
        
        if (loginLink) {
            loginLink.textContent = 'Dashboard';
            loginLink.href = 'Dash/dashboard.html';
            loginLink.style.color = '#00f3ff';
        }
        
        // Show welcome notification
        showWelcomeNotification(currentUser.name);
    } else {
        // User is not logged in, hide user box
        if (userBox) {
            userBox.style.display = 'none';
        }
        
        if (loginLink) {
            loginLink.textContent = 'Login';
            loginLink.href = 'auth.html';
            loginLink.style.color = '#ff1a1a';
        }
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('ukh_current_user');
        showMessage('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Show welcome notification
function showWelcomeNotification(name) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #00ff00;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1000;
        color: #00ff00;
        font-family: 'Orbitron', monospace;
        animation: slideInRight 0.5s ease;
    `;
    notification.innerHTML = `
        <p style="margin: 0;">Welcome back, ${name}! 🚀</p>
        <button onclick="this.parentElement.remove()" style="background: transparent; border: 1px solid #00ff00; color: #00ff00; padding: 0.25rem 0.5rem; margin-top: 0.5rem; border-radius: 3px; cursor: pointer; font-size: 0.8rem;">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }, 5000);
}

// Show message function for main page
function showMessage(message, type) {
    const existingMessage = document.querySelector('.main-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'main-message';
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

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Add slide animations
const authStyle = document.createElement('style');
authStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(authStyle);

// Simulated Terminal in Cyber Lab
const terminal = document.getElementById('terminal');
const commands = [
    'Initializing security protocols...',
    'Scanning for vulnerabilities...',
    'Threat detected: Mitigating...',
    'System secured.'
];
let index = 0;
setInterval(() => {
    terminal.innerHTML += `<p>${commands[index]}</p>`;
    index = (index + 1) % commands.length;
    terminal.scrollTop = terminal.scrollHeight;
}, 2000);

// Animate Skill Bars and Add Text Glow Effect
document.addEventListener('DOMContentLoaded', function() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });

    // Touch Events for Mobile Card Effects
    const cards = document.querySelectorAll('.about-card, .service-card, .lab-item');
    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('active');
            this.style.transform = 'scale(1.05) rotate(1deg) translateX(0)';
            this.style.boxShadow = '0 0 20px #00f3ff';
            this.style.border = '3px solid #00f3ff';
            this.style.animation = 'wobble 1s ease-in-out, pulseGlow 1.5s infinite alternate';
        });
        card.addEventListener('touchend', function() {
            this.classList.remove('active');
            this.style.transform = '';
            this.style.boxShadow = '0 0 10px rgba(0, 243, 255, 0.2)';
            this.style.border = '3px solid transparent';
            this.style.animation = '';
            resetGlow(this);
        });
    });

    // Text Glow Effect on Cursor Proximity
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, input, textarea, button');
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        textElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const distance = Math.sqrt(
                Math.pow(mouseX - (rect.left + rect.width / 2), 2) +
                Math.pow(mouseY - (rect.top + rect.height / 2), 2)
            );

            // Glow if cursor is within 100px of the text element
            if (distance < 100) {
                element.classList.add('glow-text');
            } else {
                element.classList.remove('glow-text');
            }
        });
    });
});

// Mouse Hover Tracking Animation for Cards
function trackGlow(event, card) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    card.style.boxShadow = `0 0 20px ${calculateGradient(x, y)}`;
}

function resetGlow(card) {
    card.style.boxShadow = '0 0 20px linear-gradient(90deg, #03a9f4, #f441a5)';
}

function calculateGradient(x, y) {
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    return `linear-gradient(${angle + 90}deg, #03a9f4, #f441a5)`;
}