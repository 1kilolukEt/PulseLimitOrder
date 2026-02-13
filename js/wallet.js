// Wallet connection and management
class WalletService {
    constructor() {
        this.connected = false;
        this.address = null;
        this.provider = null;
        this.chainId = null;
    }

    // Check if MetaMask is installed
    isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined';
    }

    // Connect wallet
    async connect() {
        if (!this.isMetaMaskInstalled()) {
            UTILS.showNotification('Please install MetaMask to use this app');
            return false;
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            this.address = accounts[0];
            this.provider = window.ethereum;

            // Get chain ID
            this.chainId = await window.ethereum.request({ method: 'eth_chainId' });

            // Check if on correct network
            if (parseInt(this.chainId, 16) !== CONFIG.PULSECHAIN_CHAIN_ID) {
                await this.switchNetwork();
            }

            // Initialize contracts
            await contractService.init(this.provider);

            this.connected = true;

            // Setup event listeners
            this.setupEventListeners();

            // Update UI
            this.updateUI();

            return true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            UTILS.handleError(error);
            return false;
        }
    }

    // Switch to PulseChain network
    async switchNetwork() {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${CONFIG.PULSECHAIN_CHAIN_ID.toString(16)}` }]
            });
        } catch (switchError) {
            // Network not added, try to add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: `0x${CONFIG.PULSECHAIN_CHAIN_ID.toString(16)}`,
                            chainName: 'PulseChain',
                            nativeCurrency: {
                                name: 'Pulse',
                                symbol: 'PLS',
                                decimals: 18
                            },
                            rpcUrls: [CONFIG.PULSECHAIN_RPC],
                            blockExplorerUrls: ['https://scan.pulsechain.com/']
                        }]
                    });
                } catch (addError) {
                    throw new Error('Failed to add PulseChain network');
                }
            } else {
                throw switchError;
            }
        }
    }

    // Disconnect wallet
    disconnect() {
        this.connected = false;
        this.address = null;
        this.provider = null;
        this.chainId = null;
        this.updateUI();
    }

    // Setup event listeners
    setupEventListeners() {
        // Account changed
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                this.disconnect();
            } else {
                this.address = accounts[0];
                this.updateUI();
                // Reload data
                if (window.loadPositions) window.loadPositions();
                if (window.loadOrders) window.loadOrders();
            }
        });

        // Chain changed
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        });
    }

    // Update UI
    updateUI() {
        const connectBtn = document.getElementById('connectWallet');
        const walletInfo = document.getElementById('walletInfo');
        const walletAddress = document.getElementById('walletAddress');
        const mainContent = document.getElementById('mainContent');
        const networkInfo = document.getElementById('networkInfo');
        const networkName = document.getElementById('networkName');

        if (this.connected) {
            connectBtn.style.display = 'none';
            walletInfo.style.display = 'flex';
            walletAddress.textContent = UTILS.shortenAddress(this.address);
            mainContent.style.display = 'block';
            networkInfo.style.display = 'flex';
            networkName.textContent = CONFIG.NETWORK_NAME;

            // Update contract address in footer
            document.getElementById('contractAddress').textContent = UTILS.shortenAddress(CONFIG.LP_POSITION_MANAGER);
        } else {
            connectBtn.style.display = 'block';
            walletInfo.style.display = 'none';
            mainContent.style.display = 'none';
            networkInfo.style.display = 'none';
        }
    }

    // Get current address
    getAddress() {
        return this.address;
    }

    // Check if connected
    isConnected() {
        return this.connected;
    }
}

// Global instance
const walletService = new WalletService();
