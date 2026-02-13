# Tick Spacing vs Target Price - Important Distinction

## TL;DR

**Position Bounds (pa/pb):** ✅ MUST be rounded to tick spacing multiples
**Target Price (limit orders):** ❌ Does NOT need tick spacing rounding

---

## Summary Table

| Use Case | Must Align to Tick Spacing? | Why? |
|----------|---------------------------|------|
| **Position tickLower** | ✅ YES | Pool contract requirement |
| **Position tickUpper** | ✅ YES | Pool contract requirement |
| **Current pool price** | ❌ NO | Moves continuously with swaps |
| **Limit order target** | ❌ NO | Just a comparison value |

---

## Detailed Explanation

### 1. Position Bounds MUST Use Tick Spacing

When creating a liquidity position:

```solidity
// Pool contract enforces this
require(tickLower % tickSpacing == 0, "Invalid tick");
require(tickUpper % tickSpacing == 0, "Invalid tick");
```

**Why?**
- Liquidity storage optimization
- Gas efficiency
- Fee tier logic

**Example (tick spacing = 50):**
```python
# Valid position bounds
tickLower = 123400  # 123400 % 50 = 0 ✅
tickUpper = 123500  # 123500 % 50 = 0 ✅

# Invalid position bounds
tickLower = 123456  # 123456 % 50 = 6 ❌ Will revert!
tickUpper = 123567  # 123567 % 50 = 17 ❌ Will revert!
```

### 2. Target Price Does NOT Need Tick Spacing

When checking if limit order should execute:

```python
# From monitor_limit_orders_bot.py
current_tick = pool.slot0().tick  # Can be ANY value (e.g., 123,467)
target_tick = order.targetPrice    # Can be ANY value (e.g., 123,456)

if is_above:
    target_reached = current_tick >= target_tick
else:
    target_reached = current_tick <= target_tick
```

**Why target_tick doesn't need rounding:**
1. We're not creating a position at target_tick
2. We're just comparing two integers
3. current_tick can be any value (pool moves continuously)
4. No contract enforcement needed

**Example:**
```python
# All valid target ticks
target_tick = 123456  ✅
target_tick = 123457  ✅
target_tick = 123467  ✅

# Current tick can be anything
current_tick = 123467  # Check: 123467 >= 123456? YES → Execute!
```

---

## Why You Still See Price Changes

When you enter a target price like `0.000008800`, it might display as `0.0000088004`. This is due to:

### 1. Integer Tick Conversion
```javascript
// Price must be stored as integer tick
price = 0.000008800
↓
tick = Math.round(Math.log(price) / Math.log(1.0001))
     = Math.round(123456.789)
     = 123457  // Integer tick
↓
display_price = 1.0001^123457
              = 0.0000088004
```

### 2. Floating Point Precision
```javascript
// JavaScript floating point limitations
Math.log(0.000008800) / Math.log(1.0001)
// Small rounding errors accumulate
```

### 3. Decimal Adjustments
```javascript
// Converting between token decimals
adjustedPrice = price * 10^(decimals1 - decimals0)
// More precision loss
```

**But this is NOT tick spacing rounding!**

---

## Code Verification

### Website (js/config.js)

```javascript
// For target prices - NO tick spacing rounding
humanPriceToTick(humanPrice, decimals0, decimals1) {
    const decimalAdjustment = Math.pow(10, decimals1 - decimals0);
    const rawPrice = humanPrice * decimalAdjustment;
    return this.priceToTick(rawPrice);  // Just rounds to integer
}

priceToTick(price) {
    return Math.round(Math.log(price) / Math.log(1.0001));
    // ↑ Rounds to nearest INTEGER tick, not tick spacing multiple
}
```

### Python Rebalancer (capital_preservation_rebalancer2.py)

```python
# For position bounds - YES tick spacing rounding
def round_to_valid_tick(self, tick: int) -> int:
    """Round to nearest valid tick based on tick spacing"""
    return round(tick / self.tick_spacing) * self.tick_spacing

# Used for pa and pb
new_pa_valid, new_pb_valid, tick_a, tick_b = self.get_valid_price_range(
    new_pa_desired, new_pb_desired
)
# ↑ This rounds to tick spacing
```

**For limit order targets:** The Python code would just use the tick directly without calling `round_to_valid_tick()`.

---

## Real-World Example

### Scenario: PLSX/DAI pool (tick spacing = 50)

**Creating a position:**
```python
# User wants range: 0.0000088 to 0.0000092
tickLower = price_to_tick(0.0000088) = 123,456
tickUpper = price_to_tick(0.0000092) = 123,678

# MUST round to tick spacing
tickLower = round(123456 / 50) * 50 = 123,450 ✅
tickUpper = round(123678 / 50) * 50 = 123,700 ✅

# Actual range: 0.00000879606 to 0.00000920564
```

**Creating a limit order:**
```python
# User wants target: 0.0000090
target_tick = price_to_tick(0.0000090) = 123,567

# NO rounding needed! Use as-is
target_tick = 123,567 ✅

# Actual target: 0.0000090004 (from integer tick conversion only)
```

---

## Impact on Price Difference

### Position Bounds (with tick spacing = 50)

Maximum adjustment from rounding:
```
1 tick = 0.01% price change
50 ticks = 0.5% price change

Max adjustment = ±25 ticks = ±0.25%
```

**Significant** for tight ranges

### Target Price (integer rounding only)

Maximum adjustment from rounding:
```
±0.5 tick = ±0.005% price change
```

**Negligible** - much smaller than tick spacing rounding

---

## When You See "Price Adjusted"

### Old Warning (Incorrect):
```
⚠️ Price Adjusted for Pool Tick Spacing:
Your entered price: 0.000008800
Actual executable price: 0.0000088004
This adjustment is required because prices must
align with the pool's tick spacing.
```
❌ **Wrong** - Target prices don't need tick spacing alignment

### New Warning (Correct):
```
ℹ️ Price Precision Note:
Your entered price: 0.000008800
Actual stored price: 0.0000088004
Prices are stored as integer "ticks" internally.
The difference is 0.045% due to floating point precision,
not tick spacing (target prices don't need tick spacing alignment).
```
✅ **Correct** - Clarifies it's not tick spacing

---

## Testing

### Test Position Creation (Needs Tick Spacing)

```javascript
// Try to create position with invalid ticks
const pool = await factory.getPool(token0, token1, fee);
await nftManager.mint({
    token0: token0,
    token1: token1,
    fee: fee,
    tickLower: 123456,  // Invalid! Not multiple of 50
    tickUpper: 123567,  // Invalid! Not multiple of 50
    // ...
});
// → Reverts: "Invalid tick"
```

### Test Limit Order (No Tick Spacing Needed)

```javascript
// Create limit order with any tick
await lpManager.createOrder(
    nftId,
    123456,  // Any tick value ✅
    true,
    500
);
// → Works fine!

// Bot checks
current_tick = 123467
target_tick = 123456
is_above = true
target_reached = 123467 >= 123456  // true ✅
```

---

## FAQ

### Q: Why does my target price change slightly?

**A:** Floating point precision during price ↔ tick conversion. NOT tick spacing rounding.

### Q: Can I use exact arbitrary prices for limit orders?

**A:** Almost. Prices must be representable as integer ticks, but that's ~0.01% granularity - much finer than tick spacing.

### Q: Should I worry about the price difference?

**A:** No. For target prices, the difference is <0.1% typically, while:
- Price volatility: 1-10%/hour
- Your slippage setting: 0.5-5%

### Q: Does Python round target prices to tick spacing?

**A:** It shouldn't. The `round_to_valid_tick()` function should only be used for position bounds (pa/pb), not target prices.

---

## Summary

| Concept | Position Bounds | Target Price |
|---------|----------------|--------------|
| **Tick spacing required?** | ✅ YES | ❌ NO |
| **Enforced by** | Pool contract | Nothing |
| **Maximum adjustment** | ±0.25% | ±0.005% |
| **Rounding function** | `round(tick/spacing)*spacing` | `round(tick)` |
| **Reason for rounding** | Contract requirement | Precision limits |

**Key Takeaway:** You were right - target prices don't need tick spacing rounding, only position bounds do!

---

**Last Updated:** 2026-02-10
