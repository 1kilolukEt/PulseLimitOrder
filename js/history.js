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
        const closedOrders = await contractService.getClosedOrders(address);

        historyLoading.style.display = 'none';

        if (closedOrders.length === 0) {
            noHistory.style.display = 'block';
            return;
        }

        // Render closed orders
        closedOrders.forEach(order => renderClosedOrder(order));

    } catch (error) {
        console.error('Error loading history:', error);
        historyLoading.style.display = 'none';
        UTILS.handleError(error);
    }
}

function renderClosedOrder(order) {
    const historyList = document.getElementById('historyList');

    // Format timestamp
    const date = new Date(order.timestamp * 1000);
    const timeStr = date.toLocaleString();

    // Calculate total fees earned (user gets 90%)
    const userFees0 = BigInt(order.fees0) - BigInt(order.serviceFee0);
    const userFees1 = BigInt(order.fees1) - BigInt(order.serviceFee1);

    // Format amounts
    const fees0Display = UTILS.formatTokenAmount(order.fees0, order.decimals0, 6);
    const fees1Display = UTILS.formatTokenAmount(order.fees1, order.decimals1, 6);
    const userFees0Display = UTILS.formatTokenAmount(userFees0.toString(), order.decimals0, 6);
    const userFees1Display = UTILS.formatTokenAmount(userFees1.toString(), order.decimals1, 6);
    const serviceFee0Display = UTILS.formatTokenAmount(order.serviceFee0, order.decimals0, 6);
    const serviceFee1Display = UTILS.formatTokenAmount(order.serviceFee1, order.decimals1, 6);
    const amount0Display = UTILS.formatTokenAmount(order.amount0, order.decimals0, 6);
    const amount1Display = UTILS.formatTokenAmount(order.amount1, order.decimals1, 6);

    // Calculate gas cost
    const gasCostWei = BigInt(order.gasUsed) * BigInt(order.gasPrice);
    const gasCostPLS = Number(gasCostWei) / 1e18;

    // Check if any fees were earned
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
                <span class="stat-value">${amount0Display}</span>
                <small>Principal</small>
            </div>
            <div class="stat">
                <span class="stat-label">Received ${order.symbol1}</span>
                <span class="stat-value">${amount1Display}</span>
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
