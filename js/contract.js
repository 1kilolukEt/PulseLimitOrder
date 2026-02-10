// Contract interaction layer
class ContractService {
    constructor() {
        this.web3 = null;
        this.contracts = {};
        this.tokenCache = new Map(); // Cache token info
    }

    // Initialize Web3 and contracts
    async init(provider) {
        this.web3 = new Web3(provider);

        // Initialize contracts
        this.contracts.lpManager = new this.web3.eth.Contract(
            ABIS.LPPositionManager,
            CONFIG.LP_POSITION_MANAGER
        );

        this.contracts.nftManager = new this.web3.eth.Contract(
            ABIS.NFTPositionManager,
            CONFIG.NFT_POSITION_MANAGER
        );

        this.contracts.factory = new this.web3.eth.Contract(
            ABIS.Factory,
            CONFIG.FACTORY
        );
    }

    // Get token info (symbol, decimals)
    async getTokenInfo(tokenAddress) {
        // Check cache
        const cacheKey = tokenAddress.toLowerCase();
        if (this.tokenCache.has(cacheKey)) {
            return this.tokenCache.get(cacheKey);
        }

        try {
            const tokenContract = new this.web3.eth.Contract(ABIS.ERC20, tokenAddress);
            const [symbol, decimals] = await Promise.all([
                tokenContract.methods.symbol().call(),
                tokenContract.methods.decimals().call()
            ]);

            const info = { symbol, decimals: Number(decimals) };
            this.tokenCache.set(cacheKey, info);
            return info;
        } catch (error) {
            console.error('Error getting token info:', error);
            return { symbol: 'UNKNOWN', decimals: 18 };
        }
    }

    // Get all NFT IDs for an address
    async getNFTIds(ownerAddress) {
        try {
            const balance = await this.contracts.nftManager.methods.balanceOf(ownerAddress).call();
            const nftIds = [];

            for (let i = 0; i < Number(balance); i++) {
                const tokenId = await this.contracts.nftManager.methods.tokenOfOwnerByIndex(ownerAddress, i).call();
                nftIds.push(Number(tokenId));
            }

            return nftIds;
        } catch (error) {
            console.error('Error getting NFT IDs:', error);
            return [];
        }
    }

    // Get position details
    async getPosition(nftId) {
        try {
            const position = await this.contracts.nftManager.methods.positions(nftId).call();

            // Get token info
            const [token0Info, token1Info] = await Promise.all([
                this.getTokenInfo(position.token0),
                this.getTokenInfo(position.token1)
            ]);

            // Get pool info
            const poolAddress = await this.contracts.factory.methods.getPool(
                position.token0,
                position.token1,
                position.fee
            ).call();

            let currentTick = 0;
            if (poolAddress !== '0x0000000000000000000000000000000000000000') {
                const poolContract = new this.web3.eth.Contract(ABIS.Pool, poolAddress);
                const slot0 = await poolContract.methods.slot0().call();
                currentTick = Number(slot0.tick);
            }

            return {
                nftId,
                token0: position.token0,
                token1: position.token1,
                symbol0: token0Info.symbol,
                symbol1: token1Info.symbol,
                decimals0: token0Info.decimals,
                decimals1: token1Info.decimals,
                fee: Number(position.fee),
                tickLower: Number(position.tickLower),
                tickUpper: Number(position.tickUpper),
                liquidity: position.liquidity.toString(),
                currentTick,
                poolAddress
            };
        } catch (error) {
            console.error('Error getting position:', error);
            throw error;
        }
    }

    // Get all positions for an address
    async getPositions(ownerAddress) {
        const nftIds = await this.getNFTIds(ownerAddress);

        // Deduplicate NFT IDs just in case
        const uniqueNftIds = [...new Set(nftIds)];
        const positions = [];

        for (const nftId of uniqueNftIds) {
            try {
                const position = await this.getPosition(nftId);
                // Only include positions with liquidity
                if (BigInt(position.liquidity) > 0n) {
                    positions.push(position);
                }
            } catch (error) {
                console.error(`Error loading position ${nftId}:`, error);
            }
        }

        return positions;
    }

    // Check if order exists for NFT
    async getOrder(nftId) {
        try {
            const order = await this.contracts.lpManager.methods.orders(nftId).call();

            // Check if order exists (owner != 0x0)
            if (order.owner === '0x0000000000000000000000000000000000000000') {
                return null;
            }

            // Get position info for order
            const position = await this.getPosition(nftId);

            // Convert target price from uint256 to tick
            const targetTick = TICK_MATH.uint256ToTick(order.targetPrice);

            return {
                nftId,
                owner: order.owner,
                targetTick,
                isAbove: order.isAbove,
                gasPayment: order.gasPayment.toString(),
                slippageBps: Number(order.slippageBps),
                position
            };
        } catch (error) {
            console.error('Error getting order:', error);
            return null;
        }
    }

    // Get all active orders for an address
    async getActiveOrders(ownerAddress) {
        // Scan for OrderCreated events
        const currentBlock = await this.web3.eth.getBlockNumber();
        const fromBlock = Math.max(0, Number(currentBlock) - 100000); // Last 100k blocks

        try {
            const events = await this.contracts.lpManager.getPastEvents('OrderCreated', {
                fromBlock,
                toBlock: 'latest'
            });

            // Deduplicate by NFT ID (same NFT can have multiple OrderCreated events)
            const uniqueNftIds = new Set();
            const orders = [];

            for (const event of events) {
                const nftId = Number(event.returnValues.tokenId);

                // Skip if already processed this NFT ID
                if (uniqueNftIds.has(nftId)) {
                    continue;
                }
                uniqueNftIds.add(nftId);

                try {
                    const order = await this.getOrder(nftId);

                    // Check if order exists and belongs to this address
                    if (order && order.owner.toLowerCase() === ownerAddress.toLowerCase()) {
                        orders.push(order);
                    }
                } catch (error) {
                    console.error(`Error loading order ${nftId}:`, error);
                }
            }

            return orders;
        } catch (error) {
            console.error('Error getting active orders:', error);
            return [];
        }
    }

    // Check if NFT is approved
    async isNFTApproved(nftId, ownerAddress) {
        try {
            const approved = await this.contracts.nftManager.methods.getApproved(nftId).call();
            return approved.toLowerCase() === CONFIG.LP_POSITION_MANAGER.toLowerCase();
        } catch (error) {
            console.error('Error checking approval:', error);
            return false;
        }
    }

    // Approve NFT
    async approveNFT(nftId, fromAddress) {
        try {
            const tx = await this.contracts.nftManager.methods.approve(
                CONFIG.LP_POSITION_MANAGER,
                nftId
            ).send({ from: fromAddress });

            return tx;
        } catch (error) {
            console.error('Error approving NFT:', error);
            throw error;
        }
    }

    // Create order
    async createOrder(nftId, targetPrice, isAbove, slippageBps, position, fromAddress) {
        try {
            // Convert human price to tick
            const targetTick = TICK_MATH.humanPriceToTick(
                targetPrice,
                position.decimals0,
                position.decimals1
            );

            // Convert tick to uint256
            const targetPriceUint = TICK_MATH.tickToUint256(targetTick);

            // Calculate gas payment in wei
            const gasPayment = this.web3.utils.toWei(CONFIG.REQUIRED_GAS_PAYMENT, 'ether');

            const tx = await this.contracts.lpManager.methods.createOrder(
                nftId,
                targetPriceUint.toString(),
                isAbove,
                slippageBps
            ).send({
                from: fromAddress,
                value: gasPayment
            });

            return tx;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Cancel order
    async cancelOrder(nftId, fromAddress) {
        try {
            const tx = await this.contracts.lpManager.methods.cancelOrder(nftId).send({
                from: fromAddress
            });

            return tx;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    }

    // Get closed/executed orders history
    async getClosedOrders(ownerAddress) {
        console.log('Loading closed orders for:', ownerAddress);

        // Scan for PositionClosed events
        const currentBlock = await this.web3.eth.getBlockNumber();
        const fromBlock = Math.max(0, Number(currentBlock) - 100000); // Last 100k blocks

        try {
            console.log(`Scanning blocks ${fromBlock} to ${currentBlock} for PositionClosed events...`);

            const events = await this.contracts.lpManager.getPastEvents('PositionClosed', {
                fromBlock,
                toBlock: 'latest'
            });

            console.log(`Found ${events.length} PositionClosed events`);

            const closedOrders = [];

            for (const event of events) {
                const nftId = Number(event.returnValues.tokenId);
                const owner = event.returnValues.owner;

                // Only include orders from this user
                if (owner.toLowerCase() !== ownerAddress.toLowerCase()) {
                    continue;
                }

                console.log(`Processing closed order for NFT #${nftId}`);

                try {
                    // Get basic transaction details
                    const block = await this.web3.eth.getBlock(event.blockNumber);
                    const receipt = await this.web3.eth.getTransactionReceipt(event.transactionHash);
                    const tx = await this.web3.eth.getTransaction(event.transactionHash);

                    // Extract event data
                    const fees0 = event.returnValues.fees0;
                    const fees1 = event.returnValues.fees1;
                    const serviceFee0 = event.returnValues.serviceFee0;
                    const serviceFee1 = event.returnValues.serviceFee1;
                    const amount0 = event.returnValues.amount0;
                    const amount1 = event.returnValues.amount1;

                    // Get token info from Transfer events in the receipt
                    let symbol0 = 'Token0';
                    let symbol1 = 'Token1';
                    let decimals0 = 18;
                    let decimals1 = 18;

                    try {
                        // Find Transfer events to identify token addresses
                        const transferSignature = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
                        const transferLogs = receipt.logs.filter(log => log.topics[0] === transferSignature);

                        // Get unique token addresses
                        const tokenAddresses = [...new Set(transferLogs.map(log => log.address))];

                        if (tokenAddresses.length >= 2) {
                            // Get token info for first 2 tokens
                            const [info0, info1] = await Promise.all([
                                this.getTokenInfo(tokenAddresses[0]),
                                this.getTokenInfo(tokenAddresses[1])
                            ]);

                            symbol0 = info0.symbol;
                            symbol1 = info1.symbol;
                            decimals0 = info0.decimals;
                            decimals1 = info1.decimals;
                        }
                    } catch (e) {
                        console.log(`Could not get token info for NFT #${nftId}, using defaults:`, e.message);
                    }

                    closedOrders.push({
                        nftId,
                        owner,
                        timestamp: Number(block.timestamp),
                        blockNumber: event.blockNumber,
                        transactionHash: event.transactionHash,
                        symbol0,
                        symbol1,
                        decimals0,
                        decimals1,
                        fees0: fees0.toString(),
                        fees1: fees1.toString(),
                        serviceFee0: serviceFee0.toString(),
                        serviceFee1: serviceFee1.toString(),
                        amount0: amount0.toString(),
                        amount1: amount1.toString(),
                        gasUsed: receipt.gasUsed.toString(),
                        gasPrice: tx.gasPrice.toString()
                    });

                    console.log(`Added closed order for NFT #${nftId}: ${symbol0}/${symbol1}`);
                } catch (error) {
                    console.error(`Error loading details for closed order ${nftId}:`, error);
                }
            }

            // Sort by timestamp (most recent first)
            closedOrders.sort((a, b) => b.timestamp - a.timestamp);

            console.log(`Returning ${closedOrders.length} closed orders`);
            return closedOrders;
        } catch (error) {
            console.error('Error getting closed orders:', error);
            return [];
        }
    }
}

// Global instance
const contractService = new ContractService();
