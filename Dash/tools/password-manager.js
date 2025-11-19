// Password Manager JavaScript - UKH Cyber Tools

class PasswordManager {
    constructor() {
        this.passwords = JSON.parse(localStorage.getItem('ukh_passwords') || '[]');
        this.init();
    }

    init() {
        this.initializeGenerator();
        this.initializeAnalyzer();
        this.initializeStorage();
        this.populatePasswordList();
    }

    initializeGenerator() {
        const lengthSlider = document.getElementById('passwordLength');
        const lengthValue = document.getElementById('lengthValue');
        
        lengthSlider.addEventListener('input', () => {
            lengthValue.textContent = lengthSlider.value;
        });
    }

    generatePassword() {
        const length = parseInt(document.getElementById('passwordLength').value);
        const includeUppercase = document.getElementById('includeUppercase').checked;
        const includeLowercase = document.getElementById('includeLowercase').checked;
        const includeNumbers = document.getElementById('includeNumbers').checked;
        const includeSymbols = document.getElementById('includeSymbols').checked;
        const excludeSimilar = document.getElementById('excludeSimilar').checked;
        const excludeAmbiguous = document.getElementById('excludeAmbiguous').checked;

        let charset = '';
        if (includeUppercase) charset += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeLowercase) charset += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
        if (includeNumbers) charset += excludeSimilar ? '23456789' : '0123456789';
        if (includeSymbols) charset += excludeAmbiguous ? '!@#$%^&*()_+-=[]|;:,./?' : '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (charset === '') {
            alert('Please select at least one character type');
            return;
        }

        let password = '';
        const crypto = window.crypto || window.msCrypto;
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        document.getElementById('generatedPassword').style.display = 'block';
        document.getElementById('passwordResult').textContent = password;
        
        const strength = this.analyzeStrength(password);
        const strengthMeter = document.getElementById('strengthMeter');
        const strengthText = document.getElementById('strengthText');
        
        strengthMeter.style.width = `${strength.score * 25}%`;
        strengthMeter.className = `strength-fill strength-${strength.level}`;
        strengthText.textContent = `Strength: ${strength.level.toUpperCase()} - ${strength.feedback}`;
    }

    analyzeStrength(password) {
        let score = 0;
        if (password.length >= 12) score += 2;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        let level = 'weak';
        let feedback = 'Use a longer password with mixed characters';
        
        if (score >= 6) {
            level = 'strong';
            feedback = 'Excellent password strength';
        } else if (score >= 4) {
            level = 'medium';
            feedback = 'Good, but consider adding more variety';
        }

        return { score, level, feedback };
    }

    initializeAnalyzer() {
        // Analyzer is triggered by button
    }

    analyzePassword() {
        const password = document.getElementById('analyzePassword').value;
        if (!password) {
            alert('Please enter a password to analyze');
            return;
        }

        const strength = this.analyzeStrength(password);
        const analysisDetails = document.getElementById('analysisDetails');
        
        analysisDetails.innerHTML = `
            <p><strong>Length:</strong> ${password.length}</p>
            <p><strong>Has Uppercase:</strong> ${/[A-Z]/.test(password) ? 'Yes' : 'No'}</p>
            <p><strong>Has Lowercase:</strong> ${/[a-z]/.test(password) ? 'Yes' : 'No'}</p>
            <p><strong>Has Numbers:</strong> ${/[0-9]/.test(password) ? 'Yes' : 'No'}</p>
            <p><strong>Has Symbols:</strong> ${/[^A-Za-z0-9]/.test(password) ? 'Yes' : 'No'}</p>
            <p><strong>Estimated Crack Time:</strong> ${this.estimateCrackTime(strength.score)}</p>
        `;

        document.getElementById('analysisResult').style.display = 'block';
        const meter = document.getElementById('analyzeStrengthMeter');
        meter.style.width = `${strength.score * 25}%`;
        meter.className = `strength-fill strength-${strength.level}`;
    }

    estimateCrackTime(score) {
        const times = [
            'Instant',
            'Seconds',
            'Minutes',
            'Hours',
            'Days',
            'Months',
            'Years',
            'Centuries'
        ];
        return times[score] || 'Instant';
    }

    togglePasswordVisibility(id) {
        const input = document.getElementById(id);
        input.type = input.type === 'password' ? 'text' : 'password';
    }

    initializeStorage() {
        // Storage initialization
    }

    savePassword() {
        const service = document.getElementById('serviceName').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('servicePassword').value.trim();
        const notes = document.getElementById('serviceNotes').value.trim();

        if (!service || !username || !password) {
            alert('Please fill in service name, username, and password');
            return;
        }

        const newPassword = {
            id: Date.now(),
            service,
            username,
            password, // In production, encrypt this
            notes,
            created: new Date().toLocaleString()
        };

        this.passwords.push(newPassword);
        localStorage.setItem('ukh_passwords', JSON.stringify(this.passwords));
        this.populatePasswordList();
        this.clearForm();
    }

    clearForm() {
        document.getElementById('serviceName').value = '';
        document.getElementById('username').value = '';
        document.getElementById('servicePassword').value = '';
        document.getElementById('serviceNotes').value = '';
    }

    populatePasswordList() {
        const list = document.getElementById('passwordList');
        list.innerHTML = '';

        if (this.passwords.length === 0) {
            list.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No passwords saved yet. Add your first password above.</div>';
            return;
        }

        this.passwords.forEach(pwd => {
            const item = document.createElement('div');
            item.className = 'password-item';
            item.innerHTML = `
                <div class="password-info">
                    <div class="password-title">${pwd.service}</div>
                    <div class="password-details">
                        <strong>Username:</strong> ${pwd.username}<br>
                        <strong>Password:</strong> <span class="hidden-password">********</span> <span class="revealed-password" style="display: none;">${pwd.password}</span><br>
                        <strong>Notes:</strong> ${pwd.notes || 'None'}<br>
                        <strong>Created:</strong> ${pwd.created}
                    </div>
                </div>
                <div class="password-actions">
                    <button class="action-button" onclick="passwordManager.toggleReveal(${pwd.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-button" onclick="passwordManager.copyPassword('${pwd.password}')">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-button" onclick="passwordManager.deletePassword(${pwd.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    toggleReveal(id) {
        const item = [...document.querySelectorAll('.password-item')].find(el => 
            el.querySelector('.action-button[onclick*="toggleReveal(' + id + ')"]')
        );
        const hidden = item.querySelector('.hidden-password');
        const revealed = item.querySelector('.revealed-password');
        
        if (hidden.style.display === 'none') {
            hidden.style.display = 'inline';
            revealed.style.display = 'none';
        } else {
            hidden.style.display = 'none';
            revealed.style.display = 'inline';
        }
    }

    copyPassword(password) {
        navigator.clipboard.writeText(password)
            .then(() => alert('Password copied to clipboard'))
            .catch(() => alert('Failed to copy password'));
    }

    deletePassword(id) {
        if (confirm('Are you sure you want to delete this password?')) {
            this.passwords = this.passwords.filter(pwd => pwd.id !== id);
            localStorage.setItem('ukh_passwords', JSON.stringify(this.passwords));
            this.populatePasswordList();
        }
    }

    exportPasswords() {
        const data = JSON.stringify(this.passwords, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ukh_passwords.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Global functions
function generatePassword() {
    passwordManager.generatePassword();
}

function analyzePassword() {
    passwordManager.analyzePassword();
}

function togglePasswordVisibility(id) {
    passwordManager.togglePasswordVisibility(id);
}

function savePassword() {
    passwordManager.savePassword();
}

function clearForm() {
    passwordManager.clearForm();
}

function exportPasswords() {
    passwordManager.exportPasswords();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.passwordManager = new PasswordManager();
});
