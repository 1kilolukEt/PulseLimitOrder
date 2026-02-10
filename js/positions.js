// Positions management
async function loadPositions() {
    const positionsLoading = document.getElementById('positionsLoading');
    const positionsList = document.getElementById('positionsList');
    const noPositions = document.getElementById('noPositions');

    if (!walletService.isConnected()) {
        return;
    }

    // Show loading
    positionsLoading.style.display = 'block';
    positionsList.innerHTML = '';
    noPositions.style.display = 'none';

    try {
        const address = walletService.getAddress();
        const positions = await contractService.getPositions(address);

        positionsLoading.style.display = 'none';

        if (positions.length === 0) {
            noPositions.style.display = 'block';
            return;
        }

        // Render positions
        positions.forEach(position => renderPosition(position));

    } catch (error) {
        console.error('Error loading positions:', error);
        positionsLoading.style.display = 'none';
        UTILS.handleError(error);
    }
}

function renderPosition(position) {
    const positionsList = document.getElementById('positionsList');

    // Calculate prices
    const currentPrice = TICK_MATH.tickToHumanPrice(
        position.currentTick,
        position.decimals0,
        position.decimals1
    );

    const minPrice = TICK_MATH.tickToHumanPrice(
        position.tickLower,
        position.decimals0,
        position.decimals1
    );

    const maxPrice = TICK_MATH.tickToHumanPrice(
        position.tickUpper,
        position.decimals0,
        position.decimals1
    );

    // Determine if in range
    const inRange = position.currentTick >= position.tickLower &&
                    position.currentTick <= position.tickUpper;

    const card = document.createElement('div');
    card.className = 'position-card';
    card.innerHTML = `
        <div class="position-header">
            <div>
                <div class="position-title">${position.symbol0}/${position.symbol1}</div>
                <div class="position-id">NFT #${position.nftId} • Fee: ${position.fee / 10000}%</div>
            </div>
            <span class="badge ${inRange ? 'badge-success' : 'badge-warning'}">
                ${inRange ? 'In Range' : 'Out of Range'}
            </span>
        </div>

        <div class="position-stats">
            <div class="stat">
                <span class="stat-label">Current Price</span>
                <span class="stat-value">${UTILS.formatPrice(currentPrice)}</span>
                <small>${position.symbol1}/${position.symbol0}</small>
            </div>
            <div class="stat">
                <span class="stat-label">Min Price</span>
                <span class="stat-value">${UTILS.formatPrice(minPrice)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Max Price</span>
                <span class="stat-value">${UTILS.formatPrice(maxPrice)}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Liquidity</span>
                <span class="stat-value">${BigInt(position.liquidity) > 0n ? 'Active' : 'None'}</span>
            </div>
        </div>

        <div class="position-actions">
            <button class="btn btn-primary" onclick="openCreateOrderModal(${position.nftId})">
                Create Limit Order
            </button>
            <button class="btn btn-secondary" onclick="viewPositionDetails(${position.nftId})">
                View Details
            </button>
            <button class="btn btn-secondary" onclick="window.open('https://dex.9mm.pro/liquidity/${position.nftId}', '_blank')">
                View on 9mm DEX
            </button>
        </div>
    `;

    positionsList.appendChild(card);
}

async function viewPositionDetails(nftId) {
    const modal = document.getElementById('positionModal');
    const detailsDiv = document.getElementById('positionDetails');

    try {
        const position = await contractService.getPosition(nftId);

        const currentPrice = TICK_MATH.tickToHumanPrice(
            position.currentTick,
            position.decimals0,
            position.decimals1
        );

        const minPrice = TICK_MATH.tickToHumanPrice(
            position.tickLower,
            position.decimals0,
            position.decimals1
        );

        const maxPrice = TICK_MATH.tickToHumanPrice(
            position.tickUpper,
            position.decimals0,
            position.decimals1
        );

        detailsDiv.innerHTML = `
            <div class="position-stats">
                <div class="stat">
                    <span class="stat-label">NFT ID</span>
                    <span class="stat-value">#${position.nftId}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Pool</span>
                    <span class="stat-value">${position.symbol0}/${position.symbol1}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Fee Tier</span>
                    <span class="stat-value">${position.fee / 10000}%</span>
                </div>
            </div>

            <div class="position-stats">
                <div class="stat">
                    <span class="stat-label">Current Tick</span>
                    <span class="stat-value">${position.currentTick}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Lower Tick</span>
                    <span class="stat-value">${position.tickLower}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Upper Tick</span>
                    <span class="stat-value">${position.tickUpper}</span>
                </div>
            </div>

            <div class="position-stats">
                <div class="stat">
                    <span class="stat-label">Current Price</span>
                    <span class="stat-value">${UTILS.formatPrice(currentPrice)}</span>
                    <small>${position.symbol1}/${position.symbol0}</small>
                </div>
                <div class="stat">
                    <span class="stat-label">Min Price</span>
                    <span class="stat-value">${UTILS.formatPrice(minPrice)}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Max Price</span>
                    <span class="stat-value">${UTILS.formatPrice(maxPrice)}</span>
                </div>
            </div>

            <div class="stat">
                <span class="stat-label">Token0</span>
                <span class="stat-value" style="font-size: 0.85rem; font-family: monospace;">${position.token0}</span>
            </div>

            <div class="stat">
                <span class="stat-label">Token1</span>
                <span class="stat-value" style="font-size: 0.85rem; font-family: monospace;">${position.token1}</span>
            </div>

            <div class="stat">
                <span class="stat-label">Pool Address</span>
                <span class="stat-value" style="font-size: 0.85rem; font-family: monospace;">${position.poolAddress}</span>
            </div>
        `;

        modal.classList.add('active');
    } catch (error) {
        UTILS.handleError(error);
    }
}

async function openCreateOrderModal(nftId) {
    const modal = document.getElementById('createOrderModal');
    const form = document.getElementById('createOrderForm');
    const orderNftId = document.getElementById('orderNftId');
    const orderPositionInfo = document.getElementById('orderPositionInfo');
    const targetPriceHelp = document.getElementById('targetPriceHelp');
    const targetPriceInput = document.getElementById('targetPrice');

    try {
        const position = await contractService.getPosition(nftId);

        const currentPrice = TICK_MATH.tickToHumanPrice(
            position.currentTick,
            position.decimals0,
            position.decimals1
        );

        orderNftId.value = nftId;

        orderPositionInfo.innerHTML = `
            <strong>${position.symbol0}/${position.symbol1}</strong> (NFT #${nftId})<br>
            <small>Current Price: ${UTILS.formatPrice(currentPrice)} ${position.symbol1}/${position.symbol0}</small>
        `;

        targetPriceHelp.textContent = `Current price: ${UTILS.formatPrice(currentPrice)} ${position.symbol1}/${position.symbol0}`;

        // Store position data in form
        form.dataset.position = JSON.stringify(position);

        // Add price adjustment warning when user types
        targetPriceInput.removeEventListener('input', updatePriceAdjustmentWarning);
        targetPriceInput.addEventListener('input', function() {
            updatePriceAdjustmentWarning(this.value, position);
        });

        modal.classList.add('active');
    } catch (error) {
        UTILS.handleError(error);
    }
}

function updatePriceAdjustmentWarning(targetPrice, position) {
    const warningDiv = document.getElementById('priceAdjustmentWarning');
    const warningText = document.getElementById('priceAdjustmentText');

    if (!targetPrice || isNaN(targetPrice) || targetPrice <= 0) {
        warningDiv.style.display = 'none';
        return;
    }

    try {
        // Convert user's price to tick (rounded to integer)
        const targetTick = TICK_MATH.humanPriceToTick(
            parseFloat(targetPrice),
            position.decimals0,
            position.decimals1
        );

        // Convert back to price (this shows what will actually be stored)
        const actualPrice = TICK_MATH.tickToHumanPrice(
            targetTick,
            position.decimals0,
            position.decimals1
        );

        const userPrice = parseFloat(targetPrice);
        const difference = Math.abs(actualPrice - userPrice);
        const percentDiff = (difference / userPrice) * 100;

        // Only show warning if there's a meaningful difference (>0.05%)
        if (percentDiff > 0.05) {
            warningDiv.style.display = 'block';
            warningText.innerHTML = `
                Your entered price: <strong>${UTILS.formatPrice(userPrice)}</strong><br>
                Actual stored price: <strong>${UTILS.formatPrice(actualPrice)}</strong><br>
                <small style="color: var(--text-secondary);">
                    Prices are stored as integer "ticks" internally. The difference is ${percentDiff.toFixed(3)}%
                    due to floating point precision, not tick spacing (target prices don't need tick spacing alignment).
                </small>
            `;
        } else {
            warningDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('Error calculating price adjustment:', error);
        warningDiv.style.display = 'none';
    }
}

// Handle create order form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createOrderForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nftId = Number(document.getElementById('orderNftId').value);
            const targetPrice = parseFloat(document.getElementById('targetPrice').value);
            const direction = document.querySelector('input[name="direction"]:checked').value;
            const slippage = parseFloat(document.getElementById('slippage').value);
            const position = JSON.parse(form.dataset.position);

            const isAbove = direction === 'above';
            const slippageBps = Math.round(slippage * 100);

            try {
                // Check if NFT is approved
                const address = walletService.getAddress();
                const isApproved = await contractService.isNFTApproved(nftId, address);

                if (!isApproved) {
                    UTILS.showNotification('Approving NFT to contract...');
                    await contractService.approveNFT(nftId, address);
                    UTILS.showNotification('NFT approved! Creating order...');
                }

                // Create order
                await contractService.createOrder(nftId, targetPrice, isAbove, slippageBps, position, address);

                UTILS.showNotification('Order created successfully!');
                closeModal('createOrderModal');

                // Reload data
                loadPositions();
                loadOrders();

            } catch (error) {
                UTILS.handleError(error);
            }
        });
    }
});
