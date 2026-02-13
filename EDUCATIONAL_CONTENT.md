# Educational Content - LP Limit Orders Explained

## Table of Contents

1. [Security & Safety](#security--safety)
2. [Use Case 1: LP Positions as Buy/Sell Orders](#use-case-1-lp-positions-as-buysell-orders)
3. [Use Case 2: Impermanent Loss Protection](#use-case-2-impermanent-loss-protection)
4. [Understanding One-Sided LP Positions](#understanding-one-sided-lp-positions)
5. [Complete Examples](#complete-examples)

---

## Security & Safety

### What The Contract CAN Do

✅ **Close your LP position** when your target price is reached
✅ **Send you 100% of your capital** + 90% of earned fees
✅ **Take the 3,000 PLS deposit** (to cover bot's gas costs)
✅ **Take 10% service fee** from LP trading fees only (NOT from your capital)

### What The Contract CANNOT Do

❌ **Cannot transfer your NFT** to anyone else
❌ **Cannot execute** if target price is not reached
❌ **Cannot take** any of your LP capital
❌ **Cannot close** your position without your approval
❌ **Cannot do anything** except close the position

### Why Your Funds Are Safe

**Smart contract permissions:**
```solidity
// You approve the contract to call decreaseLiquidity() and collect()
// The contract CANNOT call transferFrom() on your NFT
// It can only close your position and send you the funds
```

**You maintain control:**
- You own the NFT at all times
- You can cancel the order anytime (get 3,000 PLS back)
- The contract has no approval to transfer the NFT
- Only you can transfer or sell the NFT

**Worst case scenario:**
- If bot fails, you still own your LP position
- You can manually close it anytime on 9mm DEX
- Your capital is never at risk

---

## Use Case 1: LP Positions as Buy/Sell Orders

### The Concept

Uniswap V3 / 9mm Pro concentrated liquidity positions can become **one-sided** when price moves out of range. This means you can use LP positions as **limit orders that earn fees while waiting**.

### Example 1: Using LP to BUY PLSX

**Scenario:** You want to buy 10,000 PLSX, but only if price drops to $0.000080

**Traditional approach:**
- Set limit buy on CEX
- Pays maker fees (~0.1%)
- No yield while waiting

**LP Limit Order approach:**

1. **Create one-sided LP position:**
   - Deposit: 800 DAI (only)
   - Price range: $0.000075 to $0.000085 (BELOW current price of $0.000090)
   - Since price is above range, position stays 100% DAI

2. **Position earns fees while waiting:**
   - If price oscillates near your range, you collect trading fees
   - If someone market sells through your range, you provide liquidity and earn fees

3. **Price drops to $0.000080 (enters your range):**
   - Your DAI automatically converts to PLSX (you're buying)
   - You collect fees during the conversion
   - You now own ~10,000 PLSX (actual amount depends on price movement)

4. **Set limit order to close ABOVE:**
   - Set target price: $0.000095 (your take profit)
   - Bot monitors and will auto-close when PLSX hits $0.000095
   - You'll exit with 100% DAI again (sold PLSX at profit)

**Benefits:**
- ✅ Earn LP fees while waiting for entry
- ✅ Earn fees while position is active
- ✅ Automated exit at target price
- ✅ Better than CEX limit orders (you earn yield!)

### Example 2: Using LP to SELL PLSX

**Scenario:** You own 50,000 PLSX, want to sell if price hits $0.000120

**LP Limit Order approach:**

1. **Create one-sided LP position:**
   - Deposit: 50,000 PLSX (only)
   - Price range: $0.000115 to $0.000125 (ABOVE current price of $0.000100)
   - Since price is below range, position stays 100% PLSX

2. **Price rises to $0.000120 (enters your range):**
   - Your PLSX automatically converts to DAI (you're selling)
   - You earn fees during the selling
   - You now own ~6,000 DAI

3. **Set limit order to close BELOW:**
   - Set target price: $0.000095 (rebuy cheaper)
   - Bot auto-closes and you get DAI back
   - You can now rebuy PLSX cheaper

**Benefits:**
- ✅ Sell at target price automatically
- ✅ Earn fees while selling
- ✅ Can set stop-loss below to protect gains
- ✅ No CEX needed

---

## Use Case 2: Impermanent Loss Protection

### The Problem: Impermanent Loss

When you provide liquidity in a 50/50 pool:
- If price moves 2x in either direction, you lose ~5.7% vs holding
- If price moves 5x, you lose ~25.5% vs holding

**This is called "impermanent loss" (IL)**

### The Solution: Automated Exit

Set a limit order to close your position before IL becomes significant.

### Example: Yield Farming with IL Protection

**Scenario:** You're farming PLSX/DAI for 50% APY, but worried about price volatility

1. **Create LP position:**
   - Deposit: 5,000 DAI + 50,000,000 PLSX
   - Current price: $0.0001
   - Wide range: $0.00008 to $0.00012 (±20%)
   - APY: 50% from fees + incentives

2. **Set protective limit orders:**
   - **Option A:** Set ONE limit order at ±20% (either $0.00008 OR $0.00012)
   - **Option B:** Set TWO limit orders (create one, then another after first executes)

3. **Farm with confidence:**
   - Earn 50% APY while price is stable
   - If price moves ±20%, position auto-closes
   - IL is limited to ~4% (much less than the fees earned)
   - Net result: Profit from fees, protected from major IL

### IL Protection Strategy Table

| Price Change | IL Without Protection | IL With ±20% Stop | Net Result |
|--------------|----------------------|-------------------|------------|
| 0% (stable) | 0% | 0% | ✅ +50% APY |
| +10% | -0.6% | -0.6% | ✅ +49.4% APY |
| +20% | -4% | -4% | ✅ +46% APY, then EXIT |
| +50% | -20% | Auto-exited at +20% | ✅ +46% APY (protected) |
| +100% | -25.5% | Auto-exited at +20% | ✅ +46% APY (protected) |

**Key insight:** You capture most of the yield (while price is stable) but limit IL exposure by exiting automatically.

### Practical IL Protection Strategy

**Conservative (±10% stops):**
```
LP Range: $0.00009 to $0.00011 (current: $0.0001)
Close target: $0.000088 (if price drops 12%)
Max IL: ~1.5%
APY exposure time: Shorter (exits faster)
Best for: Volatile tokens, short-term farming
```

**Moderate (±20% stops):**
```
LP Range: $0.00008 to $0.00012 (current: $0.0001)
Close target: $0.000076 (if price drops 24%)
Max IL: ~4%
APY exposure time: Medium
Best for: Established tokens, medium-term farming
```

**Aggressive (±50% stops):**
```
LP Range: $0.00005 to $0.00015 (current: $0.0001)
Close target: $0.000040 (if price drops 60%)
Max IL: ~20%
APY exposure time: Longer (stays in longer)
Best for: Stable pairs, long-term farming, high conviction
```

---

## Understanding One-Sided LP Positions

### How Uniswap V3 / 9mm Concentrated Liquidity Works

Traditional AMMs (Uniswap V2):
- Your liquidity is spread across all prices (0 to ∞)
- Always 50/50 split
- Capital inefficient

**Concentrated Liquidity (V3):**
- You choose a **price range**
- Liquidity only active in that range
- **10x-4000x more capital efficient**
- Position composition changes as price moves

### The Three States of an LP Position

```
Price Timeline:

    $0.00005        $0.00010        $0.00015
       ↓               ↓               ↓
    [--------LP Range: $0.00008 - $0.00012--------]

State 1: Price = $0.00007 (BELOW range)
  - Position: 100% token1 (e.g., 100% DAI)
  - Status: Inactive (no fees earned)
  - What happened: All PLSX was sold for DAI as price fell

State 2: Price = $0.00010 (WITHIN range)
  - Position: ~50/50 PLSX/DAI (ratio varies by price)
  - Status: ACTIVE (earning fees!)
  - What's happening: Providing liquidity, swaps go through you

State 3: Price = $0.00014 (ABOVE range)
  - Position: 100% token0 (e.g., 100% PLSX)
  - Status: Inactive (no fees earned)
  - What happened: All DAI was used to buy PLSX as price rose
```

### Why This Is Powerful

**Traditional limit order:**
- Sits idle until executed
- No yield
- Pays fees

**One-sided LP "limit order":**
- Earns fees while waiting (if price touches range)
- Earns fees during execution
- Better than limit orders!

### Creating One-Sided Positions

**To create a one-sided position:**

1. **Want to BUY at lower price:**
   - Set range BELOW current price
   - Deposit only token1 (e.g., DAI)
   - When price drops into range, you buy automatically
   - Set limit order ABOVE to sell at profit

2. **Want to SELL at higher price:**
   - Set range ABOVE current price
   - Deposit only token0 (e.g., PLSX)
   - When price rises into range, you sell automatically
   - Set limit order BELOW to rebuy cheaper

**On 9mm DEX:**
- When creating position, adjust the price range
- Deposit only the token you want to start with
- DEX will show "Position will be inactive" (that's correct!)
- Create the position
- Come to this website and set your limit order

---

## Complete Examples

### Example 1: Buy Low, Sell High with LP

**Goal:** Buy PLSX at $0.000080, sell at $0.000120

**Step-by-step:**

1. **Current price:** $0.000100

2. **Create BUY position on 9mm:**
   - Token pair: PLSX/DAI
   - Deposit: 1,000 DAI (only)
   - Range: $0.000078 to $0.000082 (centered at $0.000080)
   - Fee tier: 0.25%
   - Position is inactive (price above range)

3. **Wait for price to drop:**
   - If price touches $0.000082, position activates
   - As price drops to $0.000078, your DAI converts to ~12,500,000 PLSX
   - You earn trading fees during the conversion

4. **Set SELL limit order:**
   - Come to this website
   - Set target: $0.000120 (ABOVE current)
   - Direction: Close when price goes ABOVE
   - Pay 3,000 PLS deposit

5. **Bot executes automatically:**
   - When PLSX hits $0.000120, bot closes position
   - You receive: 12,500,000 PLSX (now worth $1,500) + fees earned
   - Profit: $500 + fees - gas (minus 10% of fees as service fee)

### Example 2: Yield Farm with IL Protection

**Goal:** Farm PLSX/DAI for yield, but limit IL to 5%

**Step-by-step:**

1. **Current price:** $0.000100

2. **Create balanced LP on 9mm:**
   - Token pair: PLSX/DAI
   - Deposit: 5,000 DAI + 50,000,000 PLSX
   - Range: $0.000080 to $0.000120 (±20%)
   - Fee tier: 0.25%
   - Expected APY: 60% (fees + incentives)

3. **Set downside protection:**
   - Come to this website
   - Set target: $0.000076 (BELOW by 24%)
   - Direction: Close when price goes BELOW
   - This limits IL to ~4%

4. **Farm with peace of mind:**
   - Earn 60% APY while price is stable
   - If price crashes, bot auto-closes at -24%
   - You lose ~4% to IL, but kept 60% APY for however long you farmed
   - Example: Farm for 1 month, earn 5% APY, lose 4% IL = +1% net (still profitable!)

5. **What if price is stable for 3 months?**
   - Earn: 60% APY × 3/12 = 15% profit
   - IL: 0% (price didn't move much)
   - Net: +15% (won!)

6. **What if price drops 25% after 1 month?**
   - Earned: 60% APY × 1/12 = 5%
   - IL: -4% (position closed at -24% price move)
   - Net: +1% (small win, avoided major IL)

### Example 3: Sell High, Rebuy Low

**Goal:** Sell PLSX rally, rebuy on dip

**Step-by-step:**

1. **Current price:** $0.000100

2. **You own:** 100,000,000 PLSX (worth $10,000)

3. **Create SELL position on 9mm:**
   - Token pair: PLSX/DAI
   - Deposit: 100,000,000 PLSX (only)
   - Range: $0.000118 to $0.000122 (centered at $0.000120)
   - Position is inactive (price below range)

4. **Price rallies to $0.000120:**
   - Position activates
   - Your PLSX converts to DAI (you're selling)
   - End result: ~12,000 DAI
   - You earned fees during the sale

5. **Set REBUY limit order:**
   - Come to this website
   - Set target: $0.000095 (BELOW by 21%)
   - Direction: Close when price goes BELOW
   - Pay 3,000 PLS deposit

6. **Price drops back to $0.000095:**
   - Bot closes position
   - You receive: 12,000 DAI
   - You can now rebuy 126,315,789 PLSX (at $0.000095)
   - Profit: 26,315,789 PLSX (26% more PLSX!)

---

## Fee Breakdown

### What You Pay

1. **9mm DEX trading fees:**
   - Swaps: 0.25% (goes to LPs, including you)
   - Position creation: Gas only (~$0.01-0.10 in PLS)

2. **Our service fees:**
   - 3,000 PLS deposit (refundable if you cancel)
   - 10% of LP trading fees earned (not your capital!)

### Example Fee Calculation

**Scenario:**
- You farm $10,000 LP for 2 months
- Position earns $200 in trading fees
- You close with our limit order

**Your fees:**
- LP trading fees earned: $200
- Your share: $200 × 90% = $180
- Service fee: $200 × 10% = $20
- 3,000 PLS deposit: Kept by bot (covers gas)
- Gas for closing: ~$1 (paid by bot from your deposit)

**Total:**
- Received: $10,000 capital + $180 fees
- Paid: $20 service fee + $30 PLS deposit (~$3)
- Net profit: $157

---

## FAQ

### Q: Is my capital at risk?

**A:** No. The contract can only close your LP position and send you the funds. It cannot transfer your NFT or take your capital. Worst case: Bot fails and you manually close on 9mm DEX.

### Q: What if I want to cancel?

**A:** Go to "Active Orders" tab, click Cancel. You get your 3,000 PLS back immediately. You keep your LP position.

### Q: What if price moves before execution?

**A:** The contract has 5% slippage protection. If price moves more than 5% between bot seeing the trigger and executing, the transaction reverts (protects you from MEV).

### Q: Can the bot steal my LP fees?

**A:** No. The contract is programmed to:
1. Close position
2. Calculate fees = (total collected) - (principal)
3. Send you 100% capital + 90% of fees
4. Send service 10% of fees
5. Delete the order

This happens atomically in one transaction. The bot cannot take more than 10% of fees.

### Q: What if gas prices spike?

**A:** The 3,000 PLS deposit covers gas. Current gas cost to close is ~100-300 PLS. This gives a 10x-30x safety margin.

### Q: Can I set multiple orders on one position?

**A:** No. One order per NFT. But you can cancel and create a new order anytime.

### Q: Do I need to keep the website open?

**A:** No! The bot runs 24/7 on a server. Just set your order and close the website. Check back anytime to view status.

---

## Best Practices

### ✅ Do:

- Start with small positions to learn
- Set realistic price targets (don't expect 10x overnight)
- Use IL protection when farming volatile pairs
- Check your positions regularly
- Cancel orders if your strategy changes

### ❌ Don't:

- Don't use your last 3,000 PLS for deposit (keep some for gas)
- Don't set targets that will never be reached (wastes deposit)
- Don't forget about slippage (use 5-10% for volatile tokens)
- Don't expect instant execution (price needs to actually reach target)
- Don't panic if position is "inactive" (one-sided positions are meant to be inactive)

---

## Resources

- **9mm DEX:** https://dex.9mm.pro
- **9mm Docs:** https://docs.9mm.pro
- **Uniswap V3 Whitepaper:** https://uniswap.org/whitepaper-v3.pdf
- **IL Calculator:** https://dailydefi.org/tools/impermanent-loss-calculator/

---

**Questions or issues?**
- Check contract on PulseScan: [Link will be added after deployment]
- View source code: [GitHub link]

**Last Updated:** 2026-02-13
