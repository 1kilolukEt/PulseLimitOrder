// Execution history management
async function loadHistory() {
    const historyLoading = document.getElementById('historyLoading');
    const historyList = document.getElementById('historyList');
    const noHistory = document.getElementById('noHistory');

    if (!walletService.isConnected()) {
        return;
    }

    // Show loading
    historyLoading.style.display = 'block';
    historyList.innerHTML = '';
    noHistory.style.display = 'none';

    try {
        const address = walletService.getAddress();
        const historyItems = await contractService.getClosedOrders(address);

        historyLoading.style.display = 'none';

        if (historyItems.length === 0) {
            noHistory.style.display = 'block';
            return;
        }

        // Render all history items (created, cancelled, closed)
        historyItems.forEach(item => renderHistoryItem(item));

    } catch (error) {
        console.error('Error loading history:', error);
        historyLoading.style.display = 'none';
        UTILS.handleError(error);
    }
}

function renderHistoryItem(item) {
    // Route to appropriate render function based on type
    switch (item.type) {
        case 'created':
            renderOrderCreated(item);
            break;
        case 'cancelled':
            renderOrderCancelled(item);
            break;
        case 'closed':
            renderOrderClosed(item);
            break;
        default:
            console.warn('Unknown history item type:', item.type);
    }
}

function renderOrderCreated(order) {
    const historyList = document.getElementById('historyList');

    const date = new Date(order.timestamp * 1000);
    const timeStr = date.toLocaleString();

    const direction = order.isAbove ? 'ABOVE' : 'BELOW';
    const directionIcon = order.isAbove ? '⬆️' : '⬇️';
    const slippagePct = (Number(order.slippageBps) / 100).toFixed(1);

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-title">📝 ${order.symbol0}/${order.symbol1}</div>
                <div class="position-id">NFT #${order.nftId} • Created ${timeStr}</div>
            </div>
            <span class="badge badge-info">
                Order Created
            </span>
        </div>

        <div class="order-stats">
            <div class="stat">
                <span class="stat-label">Direction</span>
                <span class="stat-value">${directionIcon} ${direction}</span>
                <small>Target Tick: ${order.targetPrice}</small>
            </div>
            <div class="stat">
                <span class="stat-label">Slippage</span>
                <span class="stat-value">${slippagePct}%</span>
                <small>Protection</small>
            </div>
        </div>

        <div class="info-box" style="margin-bottom: 15px;">
            💰 <strong>Deposit:</strong> ${UTILS.formatTokenAmount(order.gasPayment, 18, 2)} PLS
            <br><small style="color: var(--text-secondary);">Refundable gas deposit</small>
        </div>

        <div class="order-actions">
            <button class="btn btn-secondary" onclick="window.open('https://scan.pulsechain.com/tx/${order.transactionHash}', '_blank')">
                View Transaction
            </button>
            <button class="btn btn-secondary" onclick="window.open('https://dex.9mm.pro/liquidity/${order.nftId}', '_blank')">
                View on 9mm DEX
            </button>
        </div>
    `;

    historyList.appendChild(card);
}

function renderOrderCancelled(order) {
    const historyList = document.getElementById('historyList');

    const date = new Date(order.timestamp * 1000);
    const timeStr = date.toLocaleString();

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-title">❌ ${order.symbol0}/${order.symbol1}</div>
                <div class="position-id">NFT #${order.nftId} • Cancelled ${timeStr}</div>
            </div>
            <span class="badge badge-warning">
                Cancelled
            </span>
        </div>

        <div class="info-box" style="margin-bottom: 15px; background: rgba(245, 158, 11, 0.1); border-color: #f59e0b;">
            ♻️ <strong>Refunded:</strong> ${UTILS.formatTokenAmount(order.refundedGas, 18, 2)} PLS
            <br><small style="color: var(--text-secondary);">Gas deposit returned to your wallet</small>
        </div>

        <div class="order-actions">
            <button class="btn btn-secondary" onclick="window.open('https://scan.pulsechain.com/tx/${order.transactionHash}', '_blank')">
                View Transaction
            </button>
            <button class="btn btn-secondary" onclick="window.open('https://dex.9mm.pro/liquidity/${order.nftId}', '_blank')">
                View on 9mm DEX
            </button>
        </div>
    `;

    historyList.appendChild(card);
}

function renderOrderClosed(order) {
    const historyList = document.getElementById('historyList');

    const date = new Date(order.timestamp * 1000);
    const timeStr = date.toLocaleString();

    // Calculate fees
    const userFees0 = BigInt(order.fees0) - BigInt(order.serviceFee0);
    const userFees1 = BigInt(order.fees1) - BigInt(order.serviceFee1);

    const fees0Display = UTILS.formatTokenAmount(order.fees0, order.decimals0, 6);
    const fees1Display = UTILS.formatTokenAmount(order.fees1, order.decimals1, 6);
    const userFees0Display = UTILS.formatTokenAmount(userFees0.toString(), order.decimals0, 6);
    const userFees1Display = UTILS.formatTokenAmount(userFees1.toString(), order.decimals1, 6);
    const serviceFee0Display = UTILS.formatTokenAmount(order.serviceFee0, order.decimals0, 6);
    const serviceFee1Display = UTILS.formatTokenAmount(order.serviceFee1, order.decimals1, 6);
    const principal0Display = UTILS.formatTokenAmount(order.principal0, order.decimals0, 6);
    const principal1Display = UTILS.formatTokenAmount(order.principal1, order.decimals1, 6);

    const gasCostWei = BigInt(order.gasUsed) * BigInt(order.gasPrice);
    const gasCostPLS = Number(gasCostWei) / 1e18;
    const hasFees = BigInt(order.fees0) > 0n || BigInt(order.fees1) > 0n;

    const card = document.createElement('div');
    card.className = 'order-card';
    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-title">✅ ${order.symbol0}/${order.symbol1}</div>
                <div class="position-id">NFT #${order.nftId} • Executed ${timeStr}</div>
            </div>
            <span class="badge badge-success">
                Completed
            </span>
        </div>

        <div class="order-stats">
            <div class="stat">
                <span class="stat-label">Received ${order.symbol0}</span>
                <span class="stat-value">${principal0Display}</span>
                <small>Principal</small>
            </div>
            <div class="stat">
                <span class="stat-label">Received ${order.symbol1}</span>
                <span class="stat-value">${principal1Display}</span>
                <small>Principal</small>
            </div>
        </div>

        ${hasFees ? `
            <div class="info-box" style="margin-bottom: 15px; background: rgba(16, 185, 129, 0.1); border-color: #10b981;">
                <strong>💰 Fees Earned:</strong><br>
                ${BigInt(order.fees0) > 0n ? `• Total ${order.symbol0} fees: ${fees0Display}<br>` : ''}
                ${BigInt(order.fees1) > 0n ? `• Total ${order.symbol1} fees: ${fees1Display}<br>` : ''}
                <br>
                <strong>Your Share (90%):</strong><br>
                ${userFees0 > 0n ? `• ${order.symbol0}: ${userFees0Display}<br>` : ''}
                ${userFees1 > 0n ? `• ${order.symbol1}: ${userFees1Display}<br>` : ''}
                <br>
                <small style="color: var(--text-secondary);">
                    Service Fee (10%):
                    ${BigInt(order.serviceFee0) > 0n ? ` ${order.symbol0}: ${serviceFee0Display}` : ''}
                    ${BigInt(order.serviceFee1) > 0n ? ` ${order.symbol1}: ${serviceFee1Display}` : ''}
                </small>
            </div>
        ` : `
            <div class="info-box" style="margin-bottom: 15px; background: rgba(100, 100, 100, 0.1); border-color: var(--border);">
                ℹ️ No fees earned (position may have been created recently)
            </div>
        `}

        <div class="order-stats">
            <div class="stat">
                <span class="stat-label">Gas Used</span>
                <span class="stat-value">${Number(order.gasUsed).toLocaleString()}</span>
                <small>${gasCostPLS.toFixed(6)} PLS</small>
            </div>
            <div class="stat">
                <span class="stat-label">Block</span>
                <span class="stat-value">#${order.blockNumber.toLocaleString()}</span>
            </div>
        </div>

        <div class="order-actions">
            <button class="btn btn-secondary" onclick="window.open('https://scan.pulsechain.com/tx/${order.transactionHash}', '_blank')">
                View Transaction
            </button>
            <button class="btn btn-secondary" onclick="window.open('https://dex.9mm.pro/liquidity/${order.nftId}', '_blank')">
                View on 9mm DEX
            </button>
        </div>
    `;

    historyList.appendChild(card);
}
