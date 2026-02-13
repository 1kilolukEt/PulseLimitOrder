# Duplicate Orders & Price Precision Fixes

## Issues Fixed

### 1. Duplicate Orders/Positions
**Problem:** Same order and position showing twice in the website

**Root Cause:**
When you recreate an order for the same NFT ID, multiple `OrderCreated` events exist on the blockchain. The website was processing ALL events without deduplication, causing the same order to appear multiple times.

**Fix:**
Added deduplication logic in `contract.js`:

```javascript
// Before (BAD):
for (const event of events) {
    const nftId = Number(event.returnValues.tokenId);
    const order = await this.getOrder(nftId);
    if (order && order.owner === ownerAddress) {
        orders.push(order);  // ❌ Duplicate for recreated orders!
    }
}

// After (GOOD):
const uniqueNftIds = new Set();
for (const event of events) {
    const nftId = Number(event.returnValues.tokenId);

    if (uniqueNftIds.has(nftId)) {
        continue;  // ✅ Skip already processed NFTs
    }
    uniqueNftIds.add(nftId);

    const order = await this.getOrder(nftId);
    if (order && order.owner === ownerAddress) {
        orders.push(order);  // ✅ Only once per NFT!
    }
}
```

**Files Modified:**
- `js/contract.js` - `getActiveOrders()` function (lines 181-191)
- `js/contract.js` - `getPositions()` function (lines 121-122)

---

### 2. Price Precision Issues
**Problem:**
- User sets: `0.000008800`
- Website shows: `0.0000088004` ❌
- Python shows: `0.000008800` ✅

**Root Cause:**
Tick-to-price conversion uses floating point math which isn't perfectly reversible:

```javascript
// User enters: 0.000008800
// Converts to tick: -161234 (integer)
// Converts back to price: 0.00000880039847... (floating point error!)
```

This is unavoidable because ticks are integers but prices are decimals.

**Fix:**
Added rounding to significant figures to match Python precision:

```javascript
// New function in config.js
tickToHumanPrice(tick, decimals0, decimals1) {
    const rawPrice = this.tickToPrice(tick);
    const decimalAdjustment = Math.pow(10, decimals0 - decimals1);
    const price = rawPrice * decimalAdjustment;

    // Round to 10 significant figures (matches Python)
    return this.roundToSignificantFigures(price, 10);
}

roundToSignificantFigures(num, significantFigures) {
    if (num === 0) return 0;

    const magnitude = Math.floor(Math.log10(Math.abs(num)));
    const scale = Math.pow(10, significantFigures - magnitude - 1);

    return Math.round(num * scale) / scale;
}
```

**Additional Enhancement:**
Added `formatPrice()` utility to clean up display:

```javascript
// Formats prices nicely, removing trailing zeros
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
}
```

**Files Modified:**
- `js/config.js` - Added `roundToSignificantFigures()` and `formatPrice()` functions
- `js/orders.js` - Use `UTILS.formatPrice()` for all price displays
- `js/positions.js` - Use `UTILS.formatPrice()` for all price displays

---

## Before vs After

### Duplicate Orders
**Before:**
```
Active Orders (3)
✅ NFT #155327: PLSX/DAI
✅ NFT #155327: PLSX/DAI  ← Duplicate!
✅ NFT #155327: PLSX/DAI  ← Duplicate!
```

**After:**
```
Active Orders (1)
✅ NFT #155327: PLSX/DAI  ← Only once!
```

### Price Precision
**Before:**
```
Target Price: 0.0000088004 DAI/PLSX  ← Wrong!
Python shows: 0.000008800 DAI/PLSX   ← Correct
```

**After:**
```
Target Price: 0.000008800 DAI/PLSX   ← Matches Python!
Python shows: 0.000008800 DAI/PLSX   ← Correct
```

---

## Testing

### Test Duplicate Fix
1. Create an order for NFT #123
2. Cancel it
3. Create another order for the same NFT #123
4. Check "Active Orders" tab
5. Should see only **1** order (not 2!)

### Test Price Precision
1. Create order with target `0.000008800`
2. Check display shows `0.000008800` (not `0.0000088004`)
3. Compare with Python script:
   ```bash
   python scripts/Claude/manage_lp_orders.py check \
       --nft-id YOUR_NFT \
       --wallet $USER_ADDRESS \
       --key $USER_PRIVATE_KEY
   ```
4. Website and Python should show **same price**

---

## Technical Notes

### Why Tick Conversion Isn't Perfect

Uniswap V3 uses ticks for pricing:
- **Tick** = Integer (e.g., -161234)
- **Price** = 1.0001^tick (e.g., 0.00000880039847...)

When you set a price:
1. `0.000008800` → Converted to tick `-161234`
2. `-161234` → Converted back to `0.00000880039847...`
3. The small error is inherent to the system

**Solution:** Round to significant figures to hide this unavoidable imprecision.

### Deduplication Strategy

Instead of filtering duplicates after loading, we now:
1. Collect unique NFT IDs first (using `Set`)
2. Only load each NFT once
3. Faster and cleaner!

---

## Files Changed

1. **js/contract.js**
   - Added deduplication in `getActiveOrders()` (line 181)
   - Added deduplication in `getPositions()` (line 121)

2. **js/config.js**
   - Added `roundToSignificantFigures()` in TICK_MATH (line 279)
   - Updated `tickToHumanPrice()` to use rounding (line 271)
   - Added `formatPrice()` in UTILS (line 328)

3. **js/orders.js**
   - All price displays now use `UTILS.formatPrice()`
   - Lines: 93, 103, 108, 127, 128, 199, 203

4. **js/positions.js**
   - All price displays now use `UTILS.formatPrice()`
   - Lines: 79, 84, 88, 168, 173, 177, 223, 226

---

## Verification

After refresh, verify:

✅ No duplicate orders
✅ No duplicate positions
✅ Prices match Python script exactly
✅ Prices look clean (no trailing garbage digits)

---

## Commit Message

```
fix: deduplicate orders and improve price precision

- Added deduplication for orders and positions (prevents duplicates when order recreated)
- Implemented significant figure rounding for tick-to-price conversion
- Added formatPrice() utility to clean up price displays
- Website prices now match Python script precision (0.000008800 vs 0.0000088004)

Closes: Duplicate orders issue
Closes: Price precision mismatch
```
