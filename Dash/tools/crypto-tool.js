// Crypto Tool JavaScript - UKH Cyber Tools

class CryptoTool {
    constructor() {
        this.commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'monkey', 'sunshine', 'princess', 'flower', 'password1', 'iloveyou', 'abc123', 'ninja', 'azerty', 'trustno1', '000000', 'password123', 'qwerty123', '1q2w3e4r'];
        this.attackInterval = null;
        this.init();
    }

    init() {
        this.initializeHashButtons();
        this.initializeEncryption();
        this.initializeFileHash();
        this.initializeHashComparison();
        this.initializeHashCracker();
        this.initializeDictionaryType();
    }

    initializeHashButtons() {
        // Handled by onclick in HTML
    }

    generateHash(algorithm) {
        const input = document.getElementById('hashInput').value;
        if (!input) {
            alert('Please enter text to hash');
            return;
        }

        let hash;
        switch(algorithm) {
            case 'md5':
                hash = CryptoJS.MD5(input).toString();
                break;
            case 'sha1':
                hash = CryptoJS.SHA1(input).toString();
                break;
            case 'sha256':
                hash = CryptoJS.SHA256(input).toString();
                break;
            case 'sha512':
                hash = CryptoJS.SHA512(input).toString();
                break;
            default:
                return;
        }

        document.getElementById('hashResult').innerHTML = `
            <strong>${algorithm.toUpperCase()} Hash:</strong><br>${hash}
        `;
        document.querySelector('#hashResult .copy-button').style.display = 'block';
    }

    initializeFileHash() {
        // Handled by onchange in HTML
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const buttons = document.querySelectorAll('#fileMd5Btn, #fileSha1Btn, #fileSha256Btn');
        buttons.forEach(btn => btn.disabled = false);

        document.getElementById('fileHashResult').innerHTML = `Selected file: ${file.name}<br>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    }

    calculateFileHash(algorithm) {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file first');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size exceeds 10MB limit');
            return;
        }

        const resultDisplay = document.getElementById('fileHashResult');
        resultDisplay.innerHTML = `Calculating ${algorithm.toUpperCase()} hash...`;

        const reader = new FileReader();
        reader.onload = (e) => {
            const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
            let hash;
            switch(algorithm) {
                case 'md5':
                    hash = CryptoJS.MD5(wordArray).toString();
                    break;
                case 'sha1':
                    hash = CryptoJS.SHA1(wordArray).toString();
                    break;
                case 'sha256':
                    hash = CryptoJS.SHA256(wordArray).toString();
                    break;
            }
            resultDisplay.innerHTML = `
                <strong>${algorithm.toUpperCase()} Hash for ${file.name}:</strong><br>${hash}
            `;
            document.querySelector('#fileHashResult .copy-button').style.display = 'block';
        };
        reader.readAsArrayBuffer(file);
    }

    initializeEncryption() {
        // Handled by onclick in HTML
    }

    generateRandomKey() {
        const keyLength = 32;
        const array = new Uint8Array(keyLength);
        window.crypto.getRandomValues(array);
        const key = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('encryptionKey').value = key;
    }

    encryptText() {
        const input = document.getElementById('encryptInput').value;
        const key = document.getElementById('encryptionKey').value;
        const algorithm = document.getElementById('encryptionAlgorithm').value;

        if (!input || !key) {
            alert('Please enter text and encryption key');
            return;
        }

        let result;
        switch(algorithm) {
            case 'aes':
                result = CryptoJS.AES.encrypt(input, key).toString();
                break;
            case 'des':
                result = CryptoJS.DES.encrypt(input, key).toString();
                break;
            case 'caesar':
                result = this.caesarCipher(input, parseInt(key) || 3, 'encrypt');
                break;
            case 'base64':
                result = btoa(input);
                break;
        }

        document.getElementById('encryptionResult').innerHTML = result;
        document.querySelector('#encryptionResult .copy-button').style.display = 'block';
    }

    decryptText() {
        const input = document.getElementById('encryptInput').value;
        const key = document.getElementById('encryptionKey').value;
        const algorithm = document.getElementById('encryptionAlgorithm').value;

        if (!input || !key) {
            alert('Please enter text and encryption key');
            return;
        }

        let result;
        try {
            switch(algorithm) {
                case 'aes':
                    result = CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
                    break;
                case 'des':
                    result = CryptoJS.DES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
                    break;
                case 'caesar':
                    result = this.caesarCipher(input, parseInt(key) || 3, 'decrypt');
                    break;
                case 'base64':
                    result = atob(input);
                    break;
            }
            if (!result) throw new Error('Decryption failed');
        } catch (error) {
            result = 'Decryption failed. Invalid key or corrupted data.';
        }

        document.getElementById('encryptionResult').innerHTML = result;
        document.querySelector('#encryptionResult .copy-button').style.display = 'block';
    }

    caesarCipher(str, shift, mode) {
        shift = mode === 'decrypt' ? -shift : shift;
        return str.replace(/[a-zA-Z]/g, function(char) {
            const base = char <= 'Z' ? 65 : 97;
            return String.fromCharCode((char.charCodeAt(0) - base + shift + 26) % 26 + base);
        });
    }

    initializeHashComparison() {
        // Handled by onclick in HTML
    }

    compareHashes() {
        const hash1 = document.getElementById('hash1').value.trim();
        const hash2 = document.getElementById('hash2').value.trim();

        if (!hash1 || !hash2) {
            alert('Please enter both hashes to compare');
            return;
        }

        const resultDiv = document.getElementById('comparisonResult');
        const isMatch = hash1 === hash2;
        
        resultDiv.className = `comparison-result ${isMatch ? 'match' : 'no-match'}`;
        resultDiv.innerHTML = isMatch ? '✅ Hashes Match!' : '❌ Hashes Do Not Match';
    }

    clearComparison() {
        document.getElementById('hash1').value = '';
        document.getElementById('hash2').value = '';
        document.getElementById('comparisonResult').innerHTML = '';
    }

    initializeHashCracker() {
        // Handled by onclick in HTML
    }

    analyzeHash() {
        const hash = document.getElementById('crackHash').value.trim();
        const hashType = document.getElementById('crackHashType').value;

        if (!hash) {
            alert('Please enter a hash to analyze');
            return;
        }

        const resultDiv = document.getElementById('crackResult');
        let analysis = '<strong>Hash Analysis:</strong><br>';

        // Detect hash type if auto
        let detectedType = hashType;
        if (hashType === 'auto') {
            if (hash.length === 32) detectedType = 'md5';
            else if (hash.length === 40) detectedType = 'sha1';
            else if (hash.length === 64) detectedType = 'sha256';
            analysis += `Detected Type: ${detectedType.toUpperCase()}<br>`;
        } else {
            analysis += `Type: ${detectedType.toUpperCase()}<br>`;
        }

        analysis += `Length: ${hash.length}<br>`;
        analysis += `Characters: ${/^[a-f0-9]+$/i.test(hash) ? 'Hexadecimal' : 'Invalid hash format'}<br>`;

        resultDiv.innerHTML = analysis;
    }

    startDictionaryAttack() {
        const hash = document.getElementById('crackHash').value.trim();
        const hashType = document.getElementById('crackHashType').value;
        const dictionaryType = document.getElementById('dictionaryType').value;

        if (!hash) {
            alert('Please enter a hash to crack');
            return;
        }

        let wordlist = [];
        switch(dictionaryType) {
            case 'common':
                wordlist = this.commonPasswords;
                break;
            case 'numbers':
                for (let i = 0; i < 10000; i++) {
                    wordlist.push(i.toString().padStart(4, '0'));
                }
                break;
            case 'custom':
                const custom = document.getElementById('customWordlist').value.trim();
                if (!custom) {
                    alert('Please enter a custom wordlist');
                    return;
                }
                wordlist = custom.split('\n').map(w => w.trim()).filter(w => w);
                break;
        }

        const resultDiv = document.getElementById('crackResult');
        resultDiv.innerHTML = 'Starting dictionary attack...<br>Attempts: 0';

        let attempts = 0;
        let found = false;

        this.attackInterval = setInterval(() => {
            if (attempts >= wordlist.length) {
                this.stopAttack();
                resultDiv.innerHTML += '<br>Password not found in dictionary.';
                return;
            }

            const word = wordlist[attempts];
            let computedHash;
            switch(hashType === 'auto' ? 'md5' : hashType) {  // Default to MD5 for auto
                case 'md5':
                    computedHash = CryptoJS.MD5(word).toString();
                    break;
                case 'sha1':
                    computedHash = CryptoJS.SHA1(word).toString();
                    break;
                case 'sha256':
                    computedHash = CryptoJS.SHA256(word).toString();
                    break;
            }

            attempts++;
            resultDiv.innerHTML = `Starting dictionary attack...<br>Attempts: ${attempts}<br>Current try: ${word}`;

            if (computedHash === hash) {
                found = true;
                resultDiv.innerHTML = `<strong>✅ Password Found!</strong><br>Password: ${word}<br>Attempts: ${attempts}`;
                this.stopAttack();
            }
        }, 10);  // Fast interval for demo, adjust as needed
    }

    stopAttack() {
        if (this.attackInterval) {
            clearInterval(this.attackInterval);
            this.attackInterval = null;
        }
    }

    initializeDictionaryType() {
        const dictionarySelect = document.getElementById('dictionaryType');
        dictionarySelect.addEventListener('change', (e) => {
            document.getElementById('customWordlistGroup').style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }

    trackIP() {
        const ip = document.getElementById('ip-input').value.trim();
        if (!ip) {
            alert('Please enter an IP address');
            return;
        }

        const resultDiv = document.getElementById('ip-result');
        resultDiv.innerHTML = 'Tracking IP...';

        // Use free IP API (ipapi.co)
        fetch(`https://ipapi.co/${ip}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.innerHTML = 'Invalid IP address or API error.';
                    return;
                }
                resultDiv.innerHTML = `
                    <strong>IP:</strong> ${data.ip}<br>
                    <strong>City:</strong> ${data.city || 'N/A'}<br>
                    <strong>Region:</strong> ${data.region || 'N/A'}<br>
                    <strong>Country:</strong> ${data.country_name || 'N/A'}<br>
                    <strong>Latitude:</strong> ${data.latitude || 'N/A'}<br>
                    <strong>Longitude:</strong> ${data.longitude || 'N/A'}<br>
                    <strong>ISP:</strong> ${data.org || 'N/A'}<br>
                    <strong>Timezone:</strong> ${data.timezone || 'N/A'}
                `;
            })
            .catch(error => {
                resultDiv.innerHTML = 'Error tracking IP: ' + error.message;
            });
    }
}

// Global functions
function generateHash(algorithm) {
    cryptoTool.generateHash(algorithm);
}

function handleFileSelect(event) {
    cryptoTool.handleFileSelect(event);
}

function calculateFileHash(algorithm) {
    cryptoTool.calculateFileHash(algorithm);
}

function generateRandomKey() {
    cryptoTool.generateRandomKey();
}

function encryptText() {
    cryptoTool.encryptText();
}

function decryptText() {
    cryptoTool.decryptText();
}

function compareHashes() {
    cryptoTool.compareHashes();
}

function clearComparison() {
    cryptoTool.clearComparison();
}

function analyzeHash() {
    cryptoTool.analyzeHash();
}

function startDictionaryAttack() {
    cryptoTool.startDictionaryAttack();
}

function stopAttack() {
    cryptoTool.stopAttack();
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            const btn = document.querySelector(`#${elementId} .copy-button`);
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        })
        .catch(() => alert('Failed to copy'));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoTool = new CryptoTool();
});
