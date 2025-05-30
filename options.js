// QuantumGuard Pro Options Page
const TEST_PRO_KEY = 'QUANTUMGUARD-TEST-PRO-2024';

// DOM Elements
const statusDiv = document.getElementById('pro-status');
const messageContainer = document.getElementById('message-container');
const licenseKeyInput = document.getElementById('license-key');
const activateBtn = document.getElementById('activate-btn');
const deactivateBtn = document.getElementById('deactivate-btn');

// Pro features configuration
const PRO_FEATURES = {
    expandedWordlists: true,
    patternGeneration: true,
    mnemonicPhrases: true,
    advancedRandomStrings: true,
    savedPresets: true,
    batchGeneration: true,
    strengthVisualization: true,
    generationStats: true,
    customThemes: true,
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
        
        updateProStatus(isProActive);
    } catch (error) {
        console.error('Error checking Pro status:', error);
        updateProStatus(false);
    }
}

// Update Pro status display
function updateProStatus(isActive) {
    if (isActive) {
        // Pro is active
        statusDiv.className = 'pro-status active';
        statusDiv.innerHTML = `
            <h2>✅ Pro Active</h2>
            <p>All premium features are enabled</p>
        `;
        
        activateBtn.style.display = 'none';
        deactivateBtn.style.display = 'inline-block';
        licenseKeyInput.disabled = true;
        
        showMessage('Pro features are currently active!', 'success');
    } else {
        // Pro is inactive
        statusDiv.className = 'pro-status inactive';
        statusDiv.innerHTML = `
            <h2>⚡ Pro Inactive</h2>
            <p>Enter your license key to activate premium features</p>
        `;
        
        activateBtn.style.display = 'inline-block';
        deactivateBtn.style.display = 'none';
        licenseKeyInput.disabled = false;
    }
}

// Show message to user
function showMessage(text, type = 'success') {
    if (!messageContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageContainer.contains(messageDiv)) {
            messageContainer.removeChild(messageDiv);
        }
    }, 5000);
}

// Activate Pro
async function activatePro() {
    const licenseKey = licenseKeyInput.value.trim();
    
    if (!licenseKey) {
        showMessage('Please enter a license key', 'error');
        return;
    }
    
    activateBtn.disabled = true;
    activateBtn.textContent = 'Activating...';
    
    try {
        // Validate license key (for now, just check the test key)
        if (licenseKey === TEST_PRO_KEY) {
            // Store Pro status
            await chrome.storage.local.set({
                quantumGuardPro: true,
                quantumGuardProFeatures: PRO_FEATURES,
                quantumGuardProKey: licenseKey
            });
            
            // Update UI
            updateProStatus(true);
            showMessage('Pro activated successfully!', 'success');
            
            // Notify popup about status change
            try {
                chrome.runtime.sendMessage({ type: 'PRO_STATUS_CHANGED' });
            } catch (e) {
                console.log('Could not notify popup:', e);
            }
            
        } else {
            showMessage('Invalid license key. Please check and try again.', 'error');
        }
    } catch (error) {
        console.error('Error activating Pro:', error);
        showMessage('Error activating Pro. Please try again.', 'error');
    } finally {
        activateBtn.disabled = false;
        activateBtn.textContent = 'Activate Pro';
    }
}

// Deactivate Pro
async function deactivatePro() {
    deactivateBtn.disabled = true;
    deactivateBtn.textContent = 'Deactivating...';
    
    try {
        // Remove Pro status
        await chrome.storage.local.remove(['quantumGuardPro', 'quantumGuardProFeatures', 'quantumGuardProKey']);
        
        // Update UI
        updateProStatus(false);
        licenseKeyInput.value = '';
        showMessage('Pro deactivated successfully.', 'success');
        
        // Notify popup about status change
        try {
            chrome.runtime.sendMessage({ type: 'PRO_STATUS_CHANGED' });
        } catch (e) {
            console.log('Could not notify popup:', e);
        }
        
    } catch (error) {
        console.error('Error deactivating Pro:', error);
        showMessage('Error deactivating Pro. Please try again.', 'error');
    } finally {
        deactivateBtn.disabled = false;
        deactivateBtn.textContent = 'Deactivate Pro';
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PRO_STATUS') {
        checkProStatus();
    }
}); 