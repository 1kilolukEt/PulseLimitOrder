// Main application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Setup event listeners
    setupEventListeners();

    // Check if already connected (page refresh)
    checkExistingConnection();
}

function setupEventListeners() {
    // Wallet connection
    const connectBtn = document.getElementById('connectWallet');
    const disconnectBtn = document.getElementById('disconnectWallet');

    if (connectBtn) {
        connectBtn.addEventListener('click', async () => {
            const connected = await walletService.connect();
            if (connected) {
                loadPositions();
                loadOrders();
            }
        });
    }

    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
            walletService.disconnect();
        });
    }

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });

    // Refresh buttons
    const refreshPositionsBtn = document.getElementById('refreshPositions');
    const refreshOrdersBtn = document.getElementById('refreshOrders');
    const refreshHistoryBtn = document.getElementById('refreshHistory');

    if (refreshPositionsBtn) {
        refreshPositionsBtn.addEventListener('click', loadPositions);
    }

    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', loadOrders);
    }

    if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', loadHistory);
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal on background click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

async function checkExistingConnection() {
    if (!walletService.isMetaMaskInstalled()) {
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await walletService.connect();
            loadPositions();
            loadOrders();
            loadHistory();
        }
    } catch (error) {
        console.error('Error checking existing connection:', error);
    }
}

function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    const activeTab = document.getElementById(`${tabName}Tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Load data for active tab
    if (tabName === 'positions') {
        loadPositions();
    } else if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'history') {
        loadHistory();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Make functions globally available
window.loadPositions = loadPositions;
window.loadOrders = loadOrders;
window.loadHistory = loadHistory;
window.viewPositionDetails = viewPositionDetails;
window.viewOrderDetails = viewOrderDetails;
window.openCreateOrderModal = openCreateOrderModal;
window.cancelOrder = cancelOrder;
window.closeModal = closeModal;

// Auto-refresh data periodically
setInterval(() => {
    if (walletService.isConnected()) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'positionsTab') {
            loadPositions();
        } else if (activeTab && activeTab.id === 'ordersTab') {
            loadOrders();
        } else if (activeTab && activeTab.id === 'historyTab') {
            loadHistory();
        }
    }
}, CONFIG.REFRESH_INTERVAL);
