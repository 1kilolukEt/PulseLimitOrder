// Orders management
async function loadOrders() {
    const ordersLoading = document.getElementById('ordersLoading');
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');

    if (!walletService.isConnected()) {
        return;
    }

    // Show loading
    ordersLoading.style.display = 'block';
    ordersList.innerHTML = '';
    noOrders.style.display = 'none';

    try {
        const address = walletService.getAddress();
        const orders = await contractService.getActiveOrders(address);

        ordersLoading.style.display = 'none';

        if (orders.length === 0) {
            noOrders.style.display = 'block';
            return;
        }

        // Render orders
        orders.forEach(order => renderOrder(order));

    } catch (error) {
        console.error('Error loading orders:', error);
        ordersLoading.style.display = 'none';
        UTILS.handleError(error);
    }
}

function renderOrder(order) {
    const ordersList = document.getElementById('ordersList');
    const position = order.position;

    // Calculate prices
    const currentPrice = TICK_MATH.tickToHumanPrice(
        position.currentTick,
        position.decimals0,
        position.decimals1
    );

    const targetPrice = TICK_MATH.tickToHumanPrice(
        order.targetTick,
        position.decimals0,
        position.decimals1
    );

    // Calculate progress and check if target reached
    let progress = 0;
    let progressDirection = '';
    let isReady = false;

    if (order.isAbove) {
        // Target is above current - price needs to go UP
        progressDirection = 'ABOVE';
        if (currentPrice >= targetPrice) {
            progress = 100;
            isReady = true;
        } else {
            // Calculate how close we are (0% to 100%)
            // Starting price is some reference, let's use a base
            // For simplicity, show percentage of distance covered
            progress = Math.min(100, (currentPrice / targetPrice) * 100);
        }
    } else {
        // Target is below current - price needs to go DOWN
        progressDirection = 'BELOW';
        if (currentPrice <= targetPrice) {
            progress = 100;
            isReady = true;
        } else {
            // Calculate how close we are to target
            // Show percentage: if we need to drop from 10 to 5, and we're at 8,
            // we've covered (10-8)/(10-5) = 40% of the way
            const initialPrice = currentPrice;  // Current is above target
            const priceDistance = currentPrice - targetPrice;
            progress = 0;  // Not there yet, price still above target
        }
    }

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-title">${position.symbol0}/${position.symbol1}</div>
                <div class="position-id">NFT #${order.nftId} • Target ${progressDirection} ${UTILS.formatPrice(targetPrice)}</div>
            </div>
            <span class="badge ${isReady ? 'badge-success' : 'badge-warning'}">
                ${isReady ? 'Ready' : 'Waiting'}
            </span>
        </div>

        <div class="order-stats">
            <div class="stat">
                <span class="stat-label">Current Price</span>
                <span class="stat-value">${UTILS.formatPrice(currentPrice)}</span>
                <small>${position.symbol1}/${position.symbol0}</small>
            </div>
            <div class="stat">
                <span class="stat-label">Target Price</span>
                <span class="stat-value">${UTILS.formatPrice(targetPrice)}</span>
                <small>${order.isAbove ? 'Execute ABOVE' : 'Execute BELOW'}</small>
            </div>
            <div class="stat">
                <span class="stat-label">Slippage</span>
                <span class="stat-value">${order.slippageBps / 100}%</span>
            </div>
            <div class="stat">
                <span class="stat-label">Deposit</span>
                <span class="stat-value">${UTILS.formatTokenAmount(order.gasPayment, 18, 0)} PLS</span>
                <small>Refunded on cancel/execute</small>
            </div>
        </div>

        ${isReady ? `
            <div class="info-box" style="margin-bottom: 15px; background: rgba(16, 185, 129, 0.1); border-color: #10b981;">
                ✅ Target price reached! Order will be executed automatically by the bot.
            </div>
        ` : `
            <div class="info-box" style="margin-bottom: 15px; background: rgba(245, 158, 11, 0.1); border-color: #f59e0b;">
                ⏳ Waiting for target price...
                <br><small>Current: ${UTILS.formatPrice(currentPrice)} • Target: ${UTILS.formatPrice(targetPrice)} •
                ${order.isAbove
                    ? `Need price to rise ${((targetPrice / currentPrice - 1) * 100).toFixed(2)}%`
                    : `Need price to drop ${((currentPrice / targetPrice - 1) * 100).toFixed(2)}%`
                }
                </small>
            </div>
        `}

        <div class="order-actions">
            <button class="btn btn-danger" onclick="cancelOrder(${order.nftId})">
                Cancel Order
            </button>
            <button class="btn btn-secondary" onclick="viewOrderDetails(${order.nftId})">
                View Details
            </button>
            <button class="btn btn-secondary" onclick="window.open('https://dex.9mm.pro/liquidity/${order.nftId}', '_blank')">
                View on 9mm DEX
            </button>
        </div>
    `;

    ordersList.appendChild(card);
}

async function viewOrderDetails(nftId) {
    const modal = document.getElementById('positionModal');
    const modalHeader = modal.querySelector('.modal-header h3');
    const detailsDiv = document.getElementById('positionDetails');

    try {
        const order = await contractService.getOrder(nftId);
        if (!order) {
            UTILS.showNotification('Order not found');
            return;
        }

        const position = order.position;

        const currentPrice = TICK_MATH.tickToHumanPrice(
            position.currentTick,
            position.decimals0,
            position.decimals1
        );

        const targetPrice = TICK_MATH.tickToHumanPrice(
            order.targetTick,
            position.decimals0,
            position.decimals1
        );

        modalHeader.textContent = 'Order Details';

        detailsDiv.innerHTML = `
            <h4>Order Information</h4>
            <div class="position-stats">
                <div class="stat">
                    <span class="stat-label">NFT ID</span>
                    <span class="stat-value">#${order.nftId}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Direction</span>
                    <span class="stat-value">${order.isAbove ? 'ABOVE ↑' : 'BELOW ↓'}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Slippage</span>
                    <span class="stat-value">${order.slippageBps / 100}%</span>
                </div>
            </div>

            <div class="position-stats">
                <div class="stat">
                    <span class="stat-label">Current Price</span>
                    <span class="stat-value">${UTILS.formatPrice(currentPrice)}</span>
                    <small>${position.symbol1}/${position.symbol0}</small>
                </div>
                <div class="stat">
                    <span class="stat-label">Target Price</span>
                    <span class="stat-value">${UTILS.formatPrice(targetPrice)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Deposit</span>
                    <span class="stat-value">${UTILS.formatTokenAmount(order.gasPayment, 18, 0)} PLS</span>
                </div>
            </div>

            <h4 style="margin-top: 20px;">Position Information</h4>
            <div class="position-stats">
                <div class="stat">
                    <span class="stat-label">Pool</span>
                    <span class="stat-value">${position.symbol0}/${position.symbol1}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Fee Tier</span>
                    <span class="stat-value">${position.fee / 10000}%</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Current Tick</span>
                    <span class="stat-value">${position.currentTick}</span>
                </div>
            </div>

            <div class="stat">
                <span class="stat-label">Owner</span>
                <span class="stat-value" style="font-size: 0.85rem; font-family: monospace;">${order.owner}</span>
            </div>
        `;

        modal.classList.add('active');
    } catch (error) {
        UTILS.handleError(error);
    }
}

async function cancelOrder(nftId) {
    const confirmed = confirm(`Are you sure you want to cancel order for NFT #${nftId}?\n\nYour 3,000 PLS deposit will be refunded.`);

    if (!confirmed) {
        return;
    }

    try {
        const address = walletService.getAddress();

        UTILS.showNotification('Cancelling order...');
        await contractService.cancelOrder(nftId, address);

        UTILS.showNotification('Order cancelled successfully! Your PLS has been refunded.');

        // Reload data
        loadOrders();
        loadPositions();

    } catch (error) {
        UTILS.handleError(error);
    }
}
