// Constants
const ENTROPY_PER_WORD = 12.9; // EFF wordlist entropy per word
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
const TEST_PRO_KEY = 'QUANTUMGUARD-TEST-PRO-2024';

// Pro status variables
let isProActive = false;
let proFeatures = {};

// Helper Functions
function calculateQuantumResistance(entropy) {
    return entropy / 2; // Quantum resistance is typically half of classical entropy
}

function getEntropyDescription(bits) {
    if (bits < 50) return "Weak";
    if (bits < 80) return "Moderate";
    if (bits < 100) return "Strong";
    if (bits < 128) return "Very Strong";
    if (bits < 150) return "Excellent";
    return "Maximum Security";
}

function getEntropyColor(bits) {
    if (bits < 50) return "text-red-500";
    if (bits < 80) return "text-yellow-500";
    if (bits < 100) return "text-green-500";
    if (bits < 128) return "text-blue-500";
    if (bits < 150) return "text-teal-400";
    return "text-purple-400";
}

function getQuantumResistanceLabel(bits) {
    if (bits < 40) return "Quantum Vulnerable";
    if (bits < 64) return "Quantum Moderate";
    if (bits < 80) return "Quantum Robust";
    if (bits < 100) return "Quantum Excellent";
    return "Quantum Maximum";
}

// Pro Features Functions
async function checkProStatus() {
    try {
        const result = await chrome.storage.local.get(['quantumGuardPro', 'quantumGuardProFeatures']);
        isProActive = result.quantumGuardPro === true;
        proFeatures = result.quantumGuardProFeatures || {};
        
        updateProUI();
        return isProActive;
    } catch (error) {
        console.error('Error checking Pro status:', error);
        return false;
    }
}

function updateProUI() {
    // Update Pro status indicator
    const proIndicator = document.getElementById('pro-indicator');
    const proButton = document.getElementById('pro-button');
    
    if (isProActive) {
        if (proIndicator) {
            proIndicator.textContent = '✅ Pro Active';
            proIndicator.className = 'pro-indicator pro-active';
        }
        if (proButton) {
            proButton.textContent = 'Manage Pro';
        }
    } else {
        if (proIndicator) {
            proIndicator.textContent = '⚡ Upgrade to Pro';
            proIndicator.className = 'pro-indicator pro-inactive';
        }
        if (proButton) {
            proButton.textContent = 'Get Pro';
        }
    }
    
    // Show/hide Pro features
    toggleProFeatures();
}

function toggleProFeatures() {
    // Advanced wordlist options
    const advancedWordlistSection = document.getElementById('advanced-wordlist-section');
    if (advancedWordlistSection) {
        advancedWordlistSection.style.display = (isProActive && proFeatures.expandedWordlists) ? 'block' : 'none';
    }
    
    // Pattern generation
    const patternSection = document.getElementById('pattern-section');
    if (patternSection) {
        patternSection.style.display = (isProActive && proFeatures.patternGeneration) ? 'block' : 'none';
    }
    
    // Advanced options
    const advancedSection = document.getElementById('advanced-section');
    if (advancedSection) {
        advancedSection.style.display = (isProActive && proFeatures.advancedRandomStrings) ? 'block' : 'none';
    }
}

function openProSettings() {
    chrome.runtime.openOptionsPage();
}

// DOM Elements
const tabTriggers = document.querySelectorAll('.tab-trigger');
const tabContents = document.querySelectorAll('.tab-content');

// Passphrase Elements
const numWordsSlider = document.getElementById('num-words');
const numWordsInput = document.getElementById('num-words-input');
const numWordsValue = document.getElementById('num-words-value');
const separatorSelect = document.getElementById('separator');
const uppercaseCheckbox = document.getElementById('uppercase');
const generatePassphraseBtn = document.getElementById('generate-passphrase');
const passphraseResult = document.getElementById('passphrase-result');
const passphraseOutput = document.getElementById('passphrase-output');
const copyPassphraseBtn = document.getElementById('copy-passphrase');
const passphraseEntropy = document.getElementById('passphrase-entropy');
const passphraseEntropyLabel = document.getElementById('passphrase-entropy-label');
const passphraseQuantum = document.getElementById('passphrase-quantum');
const passphraseQuantumLabel = document.getElementById('passphrase-quantum-label');

// Password Elements
const lengthSlider = document.getElementById('length');
const lengthInput = document.getElementById('length-input');
const lengthValue = document.getElementById('length-value');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const generatePasswordBtn = document.getElementById('generate-password');
const passwordResult = document.getElementById('password-result');
const passwordOutput = document.getElementById('password-output');
const copyPasswordBtn = document.getElementById('copy-password');
const passwordEntropy = document.getElementById('password-entropy');
const passwordEntropyLabel = document.getElementById('password-entropy-label');
const passwordQuantum = document.getElementById('password-quantum');
const passwordQuantumLabel = document.getElementById('password-quantum-label');

// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.querySelector('.material-icons').textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    } else {
        const systemTheme = prefersDark.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemTheme);
        themeToggle.querySelector('.material-icons').textContent = systemTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }
}

// Theme toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.querySelector('.material-icons').textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
});

// Tab Switching
tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const tabId = trigger.dataset.tab;
        tabTriggers.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        trigger.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Passphrase Generation
function generatePassphrase() {
    const wordCount = parseInt(numWordsInput.value);
    const separator = separatorSelect.value;
    const capitalize = uppercaseCheckbox.checked;
    
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * effWordList.length);
        let word = effWordList[randomIndex];
        if (capitalize) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);
    }
    
    const passphrase = words.join(separator);
    passphraseOutput.value = passphrase;
    
    // Calculate entropy
    const entropy = ENTROPY_PER_WORD * wordCount;
    const quantumResistance = calculateQuantumResistance(entropy);
    
    // Update stats
    passphraseEntropy.textContent = `${entropy.toFixed(1)} bits`;
    passphraseEntropyLabel.textContent = getEntropyDescription(entropy);
    passphraseEntropy.className = `stat-value ${getEntropyColor(entropy)}`;
    
    passphraseQuantum.textContent = `${quantumResistance.toFixed(1)} bits`;
    passphraseQuantumLabel.textContent = getQuantumResistanceLabel(quantumResistance);
    passphraseQuantum.className = `stat-value ${getEntropyColor(quantumResistance)}`;
    
    // Show result
    passphraseResult.classList.remove('hidden');
    copyPassphraseBtn.style.display = 'block';
}

// Password Generation
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = "";
    
    if (uppercaseCheckbox.checked) charset += UPPERCASE_CHARS;
    if (lowercaseCheckbox.checked) charset += LOWERCASE_CHARS;
    if (numbersCheckbox.checked) charset += NUMBER_CHARS;
    if (symbolsCheckbox.checked) charset += SYMBOL_CHARS;
    
    if (charset.length === 0) {
        alert("Please select at least one character type");
        return;
    }
    
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    passwordOutput.value = password;
    
    // Calculate entropy
    const entropy = length * Math.log2(charset.length);
    const quantumResistance = calculateQuantumResistance(entropy);
    
    // Update stats
    passwordEntropy.textContent = `${entropy.toFixed(1)} bits`;
    passwordEntropyLabel.textContent = getEntropyDescription(entropy);
    passwordEntropy.className = `stat-value ${getEntropyColor(entropy)}`;
    
    passwordQuantum.textContent = `${quantumResistance.toFixed(1)} bits`;
    passwordQuantumLabel.textContent = getQuantumResistanceLabel(quantumResistance);
    passwordQuantum.className = `stat-value ${getEntropyColor(quantumResistance)}`;
    
    // Show result
    passwordResult.classList.remove('hidden');
    copyPasswordBtn.style.display = 'block';
}

// Copy to clipboard functions
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<span class="material-icons">check</span>';
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    });
}

// Event Listeners
generatePassphraseBtn.addEventListener('click', generatePassphrase);
generatePasswordBtn.addEventListener('click', generatePassword);

copyPassphraseBtn.addEventListener('click', () => {
    copyToClipboard(passphraseOutput.value, copyPassphraseBtn);
});

copyPasswordBtn.addEventListener('click', () => {
    copyToClipboard(passwordOutput.value, copyPasswordBtn);
});

// Add event listeners for sliders
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    
    // Check Pro status on load
    await checkProStatus();
    
    // Setup Pro button
    const proButton = document.getElementById('pro-button');
    if (proButton) {
        proButton.addEventListener('click', openProSettings);
    }
    
    // Add slider event listeners
    numWordsSlider.addEventListener('input', function() {
        const value = this.value;
        numWordsInput.value = value;
        numWordsValue.textContent = value;
        generatePassphrase();
    });

    numWordsInput.addEventListener('change', function() {
        const value = Math.min(Math.max(parseInt(this.value) || 4, 4), 30);
        this.value = value;
        numWordsSlider.value = value;
        numWordsValue.textContent = value;
        generatePassphrase();
    });

    lengthSlider.addEventListener('input', function() {
        const value = this.value;
        lengthInput.value = value;
        lengthValue.textContent = value;
        generatePassword();
    });

    lengthInput.addEventListener('change', function() {
        const value = Math.min(Math.max(parseInt(this.value) || 8, 8), 64);
        this.value = value;
        lengthSlider.value = value;
        lengthValue.textContent = value;
        generatePassword();
    });

    // Generate initial passphrase
    generatePassphrase();
});

// Listen for Pro status changes from options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PRO_STATUS_CHANGED') {
        checkProStatus();
    }
}); 