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

    // Mnemonic generation
    const mnemonicSection = document.getElementById('mnemonic-section');
    if (mnemonicSection) {
        mnemonicSection.style.display = (isProActive && proFeatures.mnemonicPhrases) ? 'block' : 'none';
    }
    
    // Advanced options
    const advancedSection = document.getElementById('advanced-section');
    if (advancedSection) {
        advancedSection.style.display = (isProActive && proFeatures.advancedRandomStrings) ? 'block' : 'none';
    }

    // Update Pro feature sections styling
    if (isProActive) {
        document.querySelectorAll('.pro-feature-section').forEach(section => {
            if (section.style.display === 'block') {
                section.classList.add('active');
            }
        });
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
    
    // Select wordlist based on Pro settings
    let selectedWordlist = effWordList; // Default
    const wordlistSelect = document.getElementById('wordlist-select');
    
    if (isProActive && wordlistSelect && window.WORDLISTS) {
        const selectedType = wordlistSelect.value;
        switch (selectedType) {
            case 'tech':
                selectedWordlist = window.WORDLISTS.tech;
                break;
            case 'nature':
                selectedWordlist = window.WORDLISTS.nature;
                break;
            case 'eff':
            default:
                selectedWordlist = effWordList;
                break;
        }
    }
    
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * selectedWordlist.length);
        let word = selectedWordlist[randomIndex];
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
    
    // Check for Pro custom character set
    const customCharsInput = document.getElementById('custom-chars');
    const excludeSimilar = document.getElementById('exclude-similar');
    const excludeAmbiguous = document.getElementById('exclude-ambiguous');
    
    if (isProActive && customCharsInput && customCharsInput.value.trim()) {
        // Use custom character set for Pro users
        charset = customCharsInput.value.trim();
    } else {
        // Build standard character set
        if (uppercaseCheckbox.checked) charset += UPPERCASE_CHARS;
        if (lowercaseCheckbox.checked) charset += LOWERCASE_CHARS;
        if (numbersCheckbox.checked) charset += NUMBER_CHARS;
        if (symbolsCheckbox.checked) charset += SYMBOL_CHARS;
        
        // Apply Pro exclusion filters
        if (isProActive && excludeSimilar && excludeSimilar.checked) {
            const similarChars = "0O1lI";
            charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
        }
        
        if (isProActive && excludeAmbiguous && excludeAmbiguous.checked) {
            const ambiguousChars = "{}[]()/'\"`,;<>.";
            charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
        }
    }
    
    if (charset.length === 0) {
        alert("Please select at least one character type or enter custom characters");
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

    // Pro Feature Event Listeners
    setupProFeatureListeners();
});

// Setup Pro feature event listeners
function setupProFeatureListeners() {
    // Pattern generation
    const patternSelect = document.getElementById('pattern-select');
    const generatePatternBtn = document.getElementById('generate-pattern');
    
    if (patternSelect) {
        patternSelect.addEventListener('change', function() {
            if (this.value && isProActive) {
                generatePatternBtn.style.display = 'block';
                generatePatternPassphrase();
            } else {
                generatePatternBtn.style.display = 'none';
            }
        });
    }
    
    if (generatePatternBtn) {
        generatePatternBtn.addEventListener('click', generatePatternPassphrase);
    }

    // Mnemonic generation
    const generateMnemonicBtn = document.getElementById('generate-mnemonic');
    if (generateMnemonicBtn) {
        generateMnemonicBtn.addEventListener('click', generateMnemonicPhrase);
    }

    // Advanced wordlist selection
    const wordlistSelect = document.getElementById('wordlist-select');
    if (wordlistSelect) {
        wordlistSelect.addEventListener('change', function() {
            if (isProActive) {
                generatePassphrase();
            }
        });
    }

    // Advanced password options
    const excludeSimilar = document.getElementById('exclude-similar');
    const excludeAmbiguous = document.getElementById('exclude-ambiguous');
    const customChars = document.getElementById('custom-chars');
    
    if (excludeSimilar) {
        excludeSimilar.addEventListener('change', function() {
            if (isProActive) generatePassword();
        });
    }
    
    if (excludeAmbiguous) {
        excludeAmbiguous.addEventListener('change', function() {
            if (isProActive) generatePassword();
        });
    }
    
    if (customChars) {
        customChars.addEventListener('input', function() {
            if (isProActive && this.value) generatePassword();
        });
    }
}

// Pro Feature: Generate pattern-based passphrase
function generatePatternPassphrase() {
    if (!isProActive) return;
    
    const patternSelect = document.getElementById('pattern-select');
    const pattern = patternSelect.value;
    
    if (!pattern || !window.generateFromPattern) return;
    
    const separator = separatorSelect.value;
    const result = window.generateFromPattern(pattern, separator);
    
    passphraseOutput.value = result;
    
    // Calculate entropy (rough estimate for patterns)
    const parts = pattern.split('-').length;
    const entropy = parts * 10; // Rough estimate
    const quantumResistance = entropy / 2;
    
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

// Pro Feature: Generate mnemonic phrase
function generateMnemonicPhrase() {
    if (!isProActive) return;
    
    const mnemonicWordsSelect = document.getElementById('mnemonic-words');
    const wordCount = parseInt(mnemonicWordsSelect.value);
    
    if (!window.generateMnemonic) return;
    
    const result = window.generateMnemonic(wordCount);
    
    passphraseOutput.value = result;
    
    // Calculate entropy for BIP-39
    const entropy = wordCount * Math.log2(2048); // BIP-39 uses 2048 words
    const quantumResistance = entropy / 2;
    
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

// Listen for Pro status changes from options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PRO_STATUS_CHANGED') {
        checkProStatus();
    }
}); 