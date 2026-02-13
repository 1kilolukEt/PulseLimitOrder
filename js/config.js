// Configuration
const CONFIG = {
    // Network
    PULSECHAIN_CHAIN_ID: 369,
    PULSECHAIN_RPC: 'https://rpc.pulsechain.com',
    NETWORK_NAME: 'PulseChain',

    // Contracts
    LP_POSITION_MANAGER: '0x5CA8bdf54A61e4070a048689D631f7573bd77237',
    NFT_POSITION_MANAGER: '0xCC05bf158202b4F461Ede8843d76dcd7Bbad07f2',
    FACTORY: '0xe50DbDC88E87a2C92984d794bcF3D1d76f619C68',

    // Order Settings
    REQUIRED_GAS_PAYMENT: '3000', // PLS
    DEFAULT_SLIPPAGE_BPS: 500, // 5%

    // UI Settings
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_DECIMALS: 10
};

// Contract ABIs (minimal, only needed functions)
const ABIS = {
    LPPositionManager: [
        {
            "name": "orders",
            "type": "function",
            "inputs": [{"name": "tokenId", "type": "uint256"}],
            "outputs": [
                {"name": "owner", "type": "address"},
                {"name": "targetPrice", "type": "uint256"},
                {"name": "isAbove", "type": "bool"},
                {"name": "gasPayment", "type": "uint256"},
                {"name": "slippageBps", "type": "uint256"}
            ],
            "stateMutability": "view"
        },
        {
            "name": "owner",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        },
        {
            "name": "operator",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        },
        {
            "name": "createOrder",
            "type": "function",
            "inputs": [
                {"name": "tokenId", "type": "uint256"},
                {"name": "targetPrice", "type": "uint256"},
                {"name": "isAbove", "type": "bool"},
                {"name": "slippageBps", "type": "uint256"}
            ],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "name": "cancelOrder",
            "type": "function",
            "inputs": [{"name": "tokenId", "type": "uint256"}],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "name": "closePosition",
            "type": "function",
            "inputs": [{"name": "tokenId", "type": "uint256"}],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "name": "OrderCreated",
            "type": "event",
            "inputs": [
                {"name": "tokenId", "type": "uint256", "indexed": true},
                {"name": "owner", "type": "address", "indexed": true},
                {"name": "targetPrice", "type": "uint256", "indexed": false},
                {"name": "isAbove", "type": "bool", "indexed": false},
                {"name": "gasPayment", "type": "uint256", "indexed": false},
                {"name": "slippageBps", "type": "uint256", "indexed": false}
            ]
        },
        {
            "name": "OrderCancelled",
            "type": "event",
            "inputs": [
                {"name": "tokenId", "type": "uint256", "indexed": true},
                {"name": "owner", "type": "address", "indexed": true},
                {"name": "refund", "type": "uint256", "indexed": false}
            ]
        },
        {
            "name": "PositionClosed",
            "type": "event",
            "inputs": [
                {"name": "tokenId", "type": "uint256", "indexed": true},
                {"name": "owner", "type": "address", "indexed": true},
                {"name": "amount0", "type": "uint256", "indexed": false},
                {"name": "amount1", "type": "uint256", "indexed": false},
                {"name": "fee0", "type": "uint256", "indexed": false},
                {"name": "fee1", "type": "uint256", "indexed": false}
            ]
        }
    ],

    NFTPositionManager: [
        {
            "name": "ownerOf",
            "type": "function",
            "inputs": [{"name": "tokenId", "type": "uint256"}],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        },
        {
            "name": "positions",
            "type": "function",
            "inputs": [{"name": "tokenId", "type": "uint256"}],
            "outputs": [
                {"name": "nonce", "type": "uint96"},
                {"name": "operator", "type": "address"},
                {"name": "token0", "type": "address"},
                {"name": "token1", "type": "address"},
                {"name": "fee", "type": "uint24"},
                {"name": "tickLower", "type": "int24"},
                {"name": "tickUpper", "type": "int24"},
                {"name": "liquidity", "type": "uint128"},
                {"name": "feeGrowthInside0LastX128", "type": "uint256"},
                {"name": "feeGrowthInside1LastX128", "type": "uint256"},
                {"name": "tokensOwed0", "type": "uint128"},
                {"name": "tokensOwed1", "type": "uint128"}
            ],
            "stateMutability": "view"
        },
        {
            "name": "balanceOf",
            "type": "function",
            "inputs": [{"name": "owner", "type": "address"}],
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view"
        },
        {
            "name": "tokenOfOwnerByIndex",
            "type": "function",
            "inputs": [
                {"name": "owner", "type": "address"},
                {"name": "index", "type": "uint256"}
            ],
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view"
        },
        {
            "name": "approve",
            "type": "function",
            "inputs": [
                {"name": "to", "type": "address"},
                {"name": "tokenId", "type": "uint256"}
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "name": "getApproved",
            "type": "function",
            "inputs": [{"name": "tokenId", "type": "uint256"}],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        }
    ],

    Factory: [
        {
            "name": "getPool",
            "type": "function",
            "inputs": [
                {"name": "tokenA", "type": "address"},
                {"name": "tokenB", "type": "address"},
                {"name": "fee", "type": "uint24"}
            ],
            "outputs": [{"name": "pool", "type": "address"}],
            "stateMutability": "view"
        }
    ],

    Pool: [
        {
            "name": "slot0",
            "type": "function",
            "inputs": [],
            "outputs": [
                {"name": "sqrtPriceX96", "type": "uint160"},
                {"name": "tick", "type": "int24"},
                {"name": "observationIndex", "type": "uint16"},
                {"name": "observationCardinality", "type": "uint16"},
                {"name": "observationCardinalityNext", "type": "uint16"},
                {"name": "feeProtocol", "type": "uint32"},
                {"name": "unlocked", "type": "bool"}
            ],
            "stateMutability": "view"
        },
        {
            "name": "token0",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        },
        {
            "name": "token1",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view"
        },
        {
            "name": "liquidity",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "uint128"}],
            "stateMutability": "view"
        }
    ],

    ERC20: [
        {
            "name": "symbol",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "string"}],
            "stateMutability": "view"
        },
        {
            "name": "decimals",
            "type": "function",
            "inputs": [],
            "outputs": [{"name": "", "type": "uint8"}],
            "stateMutability": "view"
        },
        {
            "name": "balanceOf",
            "type": "function",
            "inputs": [{"name": "account", "type": "address"}],
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view"
        }
    ]
};

// Tick math helpers
const TICK_MATH = {
    // Convert tick to price
    tickToPrice(tick) {
        return Math.pow(1.0001, tick);
    },

    // Convert price to tick
    priceToTick(price) {
        return Math.round(Math.log(price) / Math.log(1.0001));
    },

    // Convert tick to human-readable price with decimals
    tickToHumanPrice(tick, decimals0, decimals1) {
        const rawPrice = this.tickToPrice(tick);
        const decimalAdjustment = Math.pow(10, decimals0 - decimals1);
        const price = rawPrice * decimalAdjustment;

        // Round to 10 significant figures to remove floating point errors
        // This matches Python's precision
        return this.roundToSignificantFigures(price, 10);
    },

    // Round to significant figures to avoid floating point display errors
    roundToSignificantFigures(num, significantFigures) {
        if (num === 0) return 0;

        // For very small numbers, round to fixed decimal places instead
        // This avoids issues with significant figures on small decimals
        if (Math.abs(num) < 0.01) {
            // Round to 12 decimal places for small numbers
            return Math.round(num * 1e12) / 1e12;
        }

        const magnitude = Math.floor(Math.log10(Math.abs(num)));
        const scale = Math.pow(10, significantFigures - magnitude - 1);

        return Math.round(num * scale) / scale;
    },

    // Convert human price to tick
    humanPriceToTick(humanPrice, decimals0, decimals1) {
        const decimalAdjustment = Math.pow(10, decimals1 - decimals0);
        const rawPrice = humanPrice * decimalAdjustment;
        return this.priceToTick(rawPrice);
    },

    // Convert tick to uint256 for contract
    tickToUint256(tick) {
        if (tick >= 0) {
            return BigInt(tick);
        } else {
            // Two's complement for negative ticks
            return BigInt(2) ** BigInt(256) + BigInt(tick);
        }
    },

    // Convert uint256 from contract to tick
    uint256ToTick(uint256Value) {
        const value = BigInt(uint256Value);
        const halfMax = BigInt(2) ** BigInt(255);

        if (value < halfMax) {
            return Number(value);
        } else {
            // Two's complement - negative number
            return Number(value - BigInt(2) ** BigInt(256));
        }
    }
};

// Utility functions
const UTILS = {
    // Shorten address
    shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },

    // Format number with commas
    formatNumber(num, decimals = 2) {
        return Number(num).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    // Format token amount
    formatTokenAmount(amount, decimals = 18, maxDecimals = 4) {
        const value = Number(amount) / Math.pow(10, decimals);
        if (value === 0) return '0';
        if (value < 0.0001) return value.toFixed(10);
        return value.toFixed(maxDecimals);
    },

    // Format price for display (removes trailing zeros)
    formatPrice(price, maxDecimals = 10) {
        if (price === 0) return '0';

        // For very small numbers, use more decimals
        if (Math.abs(price) < 0.000001) {
            return parseFloat(price.toFixed(maxDecimals)).toString();
        }

        // For regular numbers, format nicely
        const formatted = price.toFixed(maxDecimals);

        // Remove trailing zeros
        return parseFloat(formatted).toString();
    },

    // Copy to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Simple alert for now, can be enhanced with custom notifications
        alert(message);
    },

    // Handle errors
    handleError(error) {
        console.error('Error:', error);
        let message = 'An error occurred';

        if (error.message) {
            message = error.message;
        } else if (error.reason) {
            message = error.reason;
        }

        this.showNotification(message, 'error');
    }
};
