# Price Comparison Bug Fix

## Bug Description

The website was incorrectly showing "✅ Target price reached!" when the target was NOT actually reached.

## Root Cause

In `js/orders.js`, the price comparison logic was mixing **tick values** with **price values**:

```javascript
// WRONG CODE (before fix):
if (order.isAbove) {
    if (currentPrice >= targetPrice) {
        progress = 100;
    } else {
        const range = targetPrice - position.currentTick;  // ❌ Mixing price and tick!
        const current = currentPrice - position.currentTick; // ❌ Mixing price and tick!
        progress = Math.min(100, Math.max(0, (current / range) * 100));
    }
}
```

This caused incorrect calculations because:
- `currentPrice` is a **human-readable price** (e.g., 0.000008954)
- `targetPrice` is a **human-readable price** (e.g., 0.000008650)
- `position.currentTick` is a **tick value** (e.g., -161234)

You can't subtract a tick from a price - they're different units!

## The Fix

Changed to properly compare prices to prices:

```javascript
// CORRECT CODE (after fix):
if (order.isAbove) {
    // Target is above current - price needs to go UP
    progressDirection = 'ABOVE';
    if (currentPrice >= targetPrice) {
        progress = 100;
        isReady = true;  // ✅ Only mark ready when price actually >= target
    } else {
        progress = Math.min(100, (currentPrice / targetPrice) * 100);
    }
} else {
    // Target is below current - price needs to go DOWN
    progressDirection = 'BELOW';
    if (currentPrice <= targetPrice) {
        progress = 100;
        isReady = true;  // ✅ Only mark ready when price actually <= target
    } else {
        progress = 0;  // Price still above target
    }
}
```

## What Changed

### Before Fix:
```
Current Price: 0.000008954 DAI/PLSX
Target Price: 0.000008650 DAI/PLSX (BELOW)

❌ Website: "✅ Target price reached!"  (WRONG!)
✅ Python:  "⏳ Target not reached yet"  (CORRECT)
```

### After Fix:
```
Current Price: 0.000008954 DAI/PLSX
Target Price: 0.000008650 DAI/PLSX (BELOW)

✅ Website: "⏳ Waiting for target price... Need price to drop 3.51%"  (CORRECT!)
✅ Python:  "⏳ Target not reached yet"  (CORRECT)
```

## Additional Improvements

### 1. Added Status Message
Shows exactly what's needed:
```
⏳ Waiting for target price...
Current: 0.000008954 • Target: 0.000008650 • Need price to drop 3.51%
```

### 2. Clearer Visual Indicators
- **Green box** when target reached
- **Orange box** when waiting

### 3. Percentage Display
Automatically calculates and shows:
- For BELOW orders: how much price needs to DROP
- For ABOVE orders: how much price needs to RISE

## Testing

To verify the fix works:

1. **Start the website:**
   ```bash
   cd website
   python -m http.server 8000
   ```

2. **Open:** http://localhost:8000

3. **Connect wallet** and go to "Active Orders" tab

4. **Check NFT #155327:**
   - Should show "⏳ Waiting for target price..."
   - Should show "Need price to drop 3.39%" (or current percentage)

5. **Compare with Python script:**
   ```bash
   python scripts/Claude/manage_lp_orders.py check \
       --nft-id 155327 \
       --wallet $USER_ADDRESS \
       --key $USER_PRIVATE_KEY
   ```

Both should now agree on whether the target is reached!

## Files Modified

- `website/js/orders.js` - Fixed price comparison logic (lines 54-85, 120-132)

## Commit Message

```
fix: correct price comparison logic in order status

- Fixed bug where orders incorrectly showed as "ready"
- Changed from mixing ticks and prices to comparing prices directly
- Added helpful status message showing percentage needed
- Now matches Python script's price comparison logic

Closes: Price comparison mismatch between website and CLI
```

## Related Issues

This fix ensures the website matches the behavior of:
- `scripts/Claude/manage_lp_orders.py` (check command)
- `scripts/Claude/monitor_limit_orders_bot.py` (price checking)

All three now use the same logic:
- **BELOW orders:** Execute when `currentPrice <= targetPrice`
- **ABOVE orders:** Execute when `currentPrice >= targetPrice`
