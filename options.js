// QuantumGuard Pro Options Page
const TEST_PRO_KEY = 'QUANTUMGUARD-TEST-PRO-2024';

// DOM Elements
const statusDiv = document.getElementById('pro-status');
const statusTitle = document.getElementById('status-title');
const statusDescription = document.getElementById('status-description');
const messageArea = document.getElementById('message-area');
const licenseKeyInput = document.getElementById('license-key');
const activateBtn = document.getElementById('activate-btn');
const deactivateBtn = document.getElementById('deactivate-btn');
const proFeaturesDiv = document.getElementById('pro-features');

// Pro features configuration
const PRO_FEATURES = {
    expandedWordlists: true,
    patternGeneration: true,
    mnemonicPhrases: true,
    advancedRandomStrings: true,
    savedPresets: true,
    batchGeneration: true,
    advancedStrengthViz: true,
    generationStats: true,
    premiumThemes: true,
};

// Initialize the options page
document.addEventListener('DOMContentLoaded', async () => {
    await checkProStatus();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    activateBtn.addEventListener('click', activatePro);
    deactivateBtn.addEventListener('click', deactivatePro);
    
    // Allow Enter key to activate
    licenseKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            activatePro();
        }
    });
}

// Check current Pro status
async function checkProStatus() {
    try {
        const result = await chrome.storage.local.get(['quantumGuardPro', 'quantumGuardProFeatures']);
        const isProActive = result.quantumGuardPro === true;
        
        updateUI(isProActive);
        
        if (isProActive) {
            console.log('Pro features:', result.quantumGuardProFeatures);
        }
    } catch (error) {
        console.error('Error checking Pro status:', error);
        showMessage('Error checking Pro status', 'error');
    }
}

// Update the UI based on Pro status
function updateUI(isProActive) {
    if (isProActive) {
        statusDiv.className = 'pro-status pro-active';
        statusTitle.textContent = '✅ QuantumGuard Pro Active';
        statusDescription.textContent = 'All premium features are unlocked';
        
        activateBtn.style.display = 'none';
        deactivateBtn.style.display = 'inline-block';
        proFeaturesDiv.style.display = 'block';
        
        licenseKeyInput.value = '';
        licenseKeyInput.disabled = true;
    } else {
        statusDiv.className = 'pro-status pro-inactive';
        statusTitle.textContent = '⚠️ QuantumGuard Free Version';
        statusDescription.textContent = 'Activate Pro to unlock all features';
        
        activateBtn.style.display = 'inline-block';
        deactivateBtn.style.display = 'none';
        proFeaturesDiv.style.display = 'none';
        
        licenseKeyInput.disabled = false;
    }
}

// Activate Pro license
async function activatePro() {
    const licenseKey = licenseKeyInput.value.trim();
    
    if (!licenseKey) {
        showMessage('Please enter a license key', 'error');
        return;
    }
    
    activateBtn.disabled = true;
    activateBtn.textContent = 'Activating...';
    
    try {
        // Validate license key
        const isValid = await validateLicenseKey(licenseKey);
        
        if (isValid) {
            // Store Pro status and features
            await chrome.storage.local.set({
                quantumGuardPro: true,
                quantumGuardProFeatures: PRO_FEATURES,
                quantumGuardLicenseKey: licenseKey
            });
            
            updateUI(true);
            showMessage('✅ Pro license activated successfully!', 'success');
            
            // Notify popup if it's open
            notifyPopup();
        } else {
            showMessage('❌ Invalid license key. Please check and try again.', 'error');
        }
    } catch (error) {
        console.error('Error activating Pro:', error);
        showMessage('Error activating Pro license', 'error');
    } finally {
        activateBtn.disabled = false;
        activateBtn.textContent = 'Activate Pro';
    }
}

// Deactivate Pro license
async function deactivatePro() {
    if (!confirm('Are you sure you want to deactivate QuantumGuard Pro? You will lose access to all premium features.')) {
        return;
    }
    
    deactivateBtn.disabled = true;
    deactivateBtn.textContent = 'Deactivating...';
    
    try {
        // Remove Pro status and features
        await chrome.storage.local.remove([
            'quantumGuardPro', 
            'quantumGuardProFeatures', 
            'quantumGuardLicenseKey'
        ]);
        
        updateUI(false);
        showMessage('Pro license deactivated', 'success');
        
        // Notify popup if it's open
        notifyPopup();
    } catch (error) {
        console.error('Error deactivating Pro:', error);
        showMessage('Error deactivating Pro license', 'error');
    } finally {
        deactivateBtn.disabled = false;
        deactivateBtn.textContent = 'Deactivate Pro';
    }
}

// Validate license key (placeholder - replace with actual validation)
async function validateLicenseKey(key) {
    // For now, just check against test key
    // Later this will validate with Lemon Squeezy API
    return key === TEST_PRO_KEY;
}

// Show message to user
function showMessage(text, type) {
    messageArea.innerHTML = `<div class="message ${type}">${text}</div>`;
    
    // Auto-hide success messages
    if (type === 'success') {
        setTimeout(() => {
            messageArea.innerHTML = '';
        }, 3000);
    }
}

// Notify popup about Pro status change
function notifyPopup() {
    // Send message to popup if it's open
    chrome.runtime.sendMessage({
        type: 'PRO_STATUS_CHANGED'
    }).catch(() => {
        // Popup might not be open, that's fine
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PRO_STATUS') {
        checkProStatus();
    }
}); 