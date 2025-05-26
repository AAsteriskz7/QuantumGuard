// Constants
const EFF_WORDLIST_SIZE = 7776; // Size of the EFF wordlist
const CHARACTER_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Helper functions
function calculateQuantumResistance(entropy) {
    return Math.floor(entropy / 2);
}

function getEntropyDescription(entropy) {
    if (entropy < 80) return { text: 'Weak', color: 'text-red' };
    if (entropy < 120) return { text: 'Moderate', color: 'text-yellow' };
    if (entropy < 160) return { text: 'Strong', color: 'text-green' };
    return { text: 'Very Strong', color: 'text-blue' };
}

function getQuantumResistanceLabel(resistance) {
    if (resistance < 40) return { text: 'Vulnerable', color: 'text-red' };
    if (resistance < 60) return { text: 'At Risk', color: 'text-yellow' };
    if (resistance < 80) return { text: 'Resistant', color: 'text-green' };
    return { text: 'Highly Resistant', color: 'text-blue' };
}

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const passphraseTab = document.getElementById('passphrase-tab');
const passwordTab = document.getElementById('password-tab');
const passphraseContent = document.getElementById('passphrase-content');
const passwordContent = document.getElementById('password-content');

// Passphrase elements
const numWordsSlider = document.getElementById('num-words-slider');
const numWordsValue = document.getElementById('num-words-value');
const wordSeparator = document.getElementById('word-separator');
const capitalizeWords = document.getElementById('capitalize-words');
const generatePassphraseBtn = document.getElementById('generate-passphrase');
const passphraseResult = document.getElementById('passphrase-result');
const passphraseResultBox = document.getElementById('passphrase-result-box');
const passphraseCopyBtn = document.getElementById('passphrase-copy');
const passphraseEntropy = document.getElementById('passphrase-entropy');
const passphraseQuantum = document.getElementById('passphrase-quantum');

// Password elements
const passwordLengthSlider = document.getElementById('password-length-slider');
const passwordLengthValue = document.getElementById('password-length-value');
const useUppercase = document.getElementById('use-uppercase');
const useLowercase = document.getElementById('use-lowercase');
const useNumbers = document.getElementById('use-numbers');
const useSymbols = document.getElementById('use-symbols');
const generatePasswordBtn = document.getElementById('generate-password');
const passwordResult = document.getElementById('password-result');
const passwordResultBox = document.getElementById('password-result-box');
const passwordCopyBtn = document.getElementById('password-copy');
const passwordEntropy = document.getElementById('password-entropy');
const passwordQuantum = document.getElementById('password-quantum');

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Tab switching
passphraseTab.addEventListener('click', () => {
    passphraseTab.classList.add('active');
    passwordTab.classList.remove('active');
    passphraseContent.classList.add('active');
    passwordContent.classList.remove('active');
});

passwordTab.addEventListener('click', () => {
    passwordTab.classList.add('active');
    passphraseTab.classList.remove('active');
    passwordContent.classList.add('active');
    passphraseContent.classList.remove('active');
});

// Passphrase generation
function generatePassphrase() {
    const numWords = parseInt(numWordsSlider.value);
    const separator = wordSeparator.value;
    const shouldCapitalize = capitalizeWords.checked;
    
    // Generate random words
    const words = [];
    for (let i = 0; i < numWords; i++) {
        const randomIndex = Math.floor(Math.random() * EFF_WORDLIST_SIZE);
        let word = effWordList[randomIndex];
        if (shouldCapitalize) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);
    }
    
    const passphrase = words.join(separator);
    passphraseResult.value = passphrase;
    passphraseResultBox.classList.remove('hidden');
    
    // Calculate entropy and quantum resistance
    const entropy = Math.log2(Math.pow(EFF_WORDLIST_SIZE, numWords));
    const quantumResistance = calculateQuantumResistance(entropy);
    
    // Update stats
    const entropyDesc = getEntropyDescription(entropy);
    const quantumDesc = getQuantumResistanceLabel(quantumResistance);
    
    passphraseEntropy.innerHTML = `
        <div class="stat-value ${entropyDesc.color}">${Math.round(entropy)} bits</div>
        <div class="stat-label">${entropyDesc.text}</div>
    `;
    
    passphraseQuantum.innerHTML = `
        <div class="stat-value ${quantumDesc.color}">${quantumResistance} bits</div>
        <div class="stat-label">${quantumDesc.text}</div>
    `;
}

// Password generation
function generatePassword() {
    const length = parseInt(passwordLengthSlider.value);
    let charset = '';
    
    if (useUppercase.checked) charset += CHARACTER_SETS.uppercase;
    if (useLowercase.checked) charset += CHARACTER_SETS.lowercase;
    if (useNumbers.checked) charset += CHARACTER_SETS.numbers;
    if (useSymbols.checked) charset += CHARACTER_SETS.symbols;
    
    // Ensure at least one character set is selected
    if (!charset) {
        charset = CHARACTER_SETS.lowercase;
        useLowercase.checked = true;
    }
    
    // Generate password
    let password = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    
    passwordResult.value = password;
    passwordResultBox.classList.remove('hidden');
    
    // Calculate entropy and quantum resistance
    const entropy = Math.log2(Math.pow(charset.length, length));
    const quantumResistance = calculateQuantumResistance(entropy);
    
    // Update stats
    const entropyDesc = getEntropyDescription(entropy);
    const quantumDesc = getQuantumResistanceLabel(quantumResistance);
    
    passwordEntropy.innerHTML = `
        <div class="stat-value ${entropyDesc.color}">${Math.round(entropy)} bits</div>
        <div class="stat-label">${entropyDesc.text}</div>
    `;
    
    passwordQuantum.innerHTML = `
        <div class="stat-value ${quantumDesc.color}">${quantumResistance} bits</div>
        <div class="stat-label">${quantumDesc.text}</div>
    `;
}

// Event listeners
generatePassphraseBtn.addEventListener('click', generatePassphrase);
generatePasswordBtn.addEventListener('click', generatePassword);

// Copy to clipboard functionality
passphraseCopyBtn.addEventListener('click', () => {
    passphraseResult.select();
    document.execCommand('copy');
    passphraseCopyBtn.innerHTML = '✓';
    setTimeout(() => {
        passphraseCopyBtn.innerHTML = '📋';
    }, 2000);
});

passwordCopyBtn.addEventListener('click', () => {
    passwordResult.select();
    document.execCommand('copy');
    passwordCopyBtn.innerHTML = '✓';
    setTimeout(() => {
        passwordCopyBtn.innerHTML = '📋';
    }, 2000);
});

// Slider value updates
numWordsSlider.addEventListener('input', () => {
    numWordsValue.value = numWordsSlider.value;
});

passwordLengthSlider.addEventListener('input', () => {
    passwordLengthValue.value = passwordLengthSlider.value;
});

// Initialize slider values
numWordsValue.value = numWordsSlider.value;
passwordLengthValue.value = passwordLengthSlider.value; 