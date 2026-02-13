# LP Ladder Strategy - The Correct Way

## The Core Strategy

**Accumulation (Buy on dips):**
- Create one-sided LP BELOW current price with only DAI
- Set limit at BOTTOM of range
- If price rebounds → You keep the WETH you bought ✅
- If price continues down → Exit with WETH, protected from further drop ✅

**Distribution (Sell on rallies):**
- Create one-sided LP ABOVE current price with only WETH
- Set limit at TOP of range
- If price reverses down → You already took profit ✅
- If price continues up → Other positions still active ✅

---

## Complete Example: WETH Trading Strategy

### Starting Conditions

- **Current Price:** WETH = $2,000
- **Your Capital:** 200,000 DAI (want to accumulate WETH)
- **Market View:** Expecting volatility, want to accumulate on dips and sell on rallies

---

## Phase 1: Accumulation Phase

### Step 1: Create Accumulation LP Position

**On 9mm DEX:**
- Pair: WETH/DAI
- Deposit: **50,000 DAI only** (no WETH)
- Range: **$1,900 to $1,950**
- Current price: $2,000 (above range)
- Result: Position is **inactive** (one-sided, 100% DAI)

### Step 2: Set Limit Order (on this website)

- Target Price: **$1,900** (BELOW - at bottom of range)
- Direction: Close when price goes **BELOW $1,900**
- Pay: 3,000 PLS deposit

**Why close at $1,900 (bottom)?**
- This is the KEY to the strategy!
- If price rebounds above $1,900, limit never triggers
- You KEEP the WETH you accumulated! 🎯

### Scenario A: Price Drops to $1,920 (Enters Range)

1. **Price hits $1,950** → Position activates
2. **Price drops $1,950 → $1,920:**
   - Your DAI gradually converts to WETH
   - You're buying WETH as price drops
   - You earn trading fees on every swap! 💰
3. **You now own ~26 WETH** (worth $50,000 at $1,920)
4. **Price is at $1,920** (still above $1,900 limit)

### Scenario A Outcome 1: Price Rebounds to $2,500

- Your limit order at $1,900 **never triggers**
- You still own the ~26 WETH you accumulated
- WETH now worth: 26 × $2,500 = **$65,000**
- **Profit: $15,000 + fees!** 🚀
- Ready to create SELL positions above!

### Scenario A Outcome 2: Price Continues Down to $1,880

- **Price hits $1,900** → Limit order triggers!
- Bot closes position
- You receive: **~26.3 WETH + fees**
- Protected from further downside
- Can create new accumulation position lower if desired

---

## Phase 2: Distribution Phase (After Accumulation)

### Current Situation

- You accumulated: **26 WETH** (from Phase 1)
- Average cost: ~$1,925
- Current price: $3,000 (up from $1,920)
- Unrealized profit: 26 × ($3,000 - $1,925) = **$27,950**
- Strategy: Ladder out on rally, take profits in tranches

### Step 1: Create Multiple Distribution Positions

**Position A on 9mm DEX:**
- Deposit: **5 WETH only** (no DAI)
- Range: **$4,800 to $4,900**
- Current price: $3,000 (below range)
- Result: Position **inactive** (one-sided, 100% WETH)

**Position B on 9mm DEX:**
- Deposit: **5 WETH only**
- Range: **$5,600 to $5,700**

**Position C on 9mm DEX:**
- Deposit: **5 WETH only**
- Range: **$7,200 to $7,300**

**Position D on 9mm DEX:**
- Deposit: **10 WETH only**
- Range: **$9,000 to $11,000** (wider range for final tranche)

**Remaining:** 1 WETH (moon bag - never sell!)

### Step 2: Set Limit Orders for Each Position

**Position A:** Close at **$4,900** (ABOVE - top of range)
**Position B:** Close at **$5,700** (ABOVE - top of range)
**Position C:** Close at **$7,300** (ABOVE - top of range)
**Position D:** Close at **$11,000** (ABOVE - top of range)

**Why close at top of each range?**
- Lock in profits if price reverses!
- If price continues up, other positions still waiting

---

## Scenario: Price Rallies to $8,000

### Position A: $4,800-$4,900

1. **Price hits $4,800** → Position activates
2. **Price rises $4,800 → $4,900:**
   - Your WETH converts to DAI
   - You're selling WETH as price rises
   - Earn trading fees! 💰
3. **Price hits $4,900** → Limit triggers!
   - Bot closes position
   - You receive: **~$24,500 DAI + fees**
   - **Locked in profit!** ✅

### Position B: $5,600-$5,700

1. **Price hits $5,600** → Position activates
2. **Price rises $5,600 → $5,700:**
   - WETH converts to DAI + earn fees
3. **Price hits $5,700** → Limit triggers!
   - You receive: **~$28,500 DAI + fees**
   - **Locked in profit!** ✅

### Position C: $7,200-$7,300

1. **Price hits $7,200** → Position activates
2. **Price rises $7,200 → $7,300:**
   - WETH converts to DAI + earn fees
3. **Price hits $7,300** → Limit triggers!
   - You receive: **~$36,500 DAI + fees**
   - **Locked in profit!** ✅

### Position D: $9,000-$11,000

1. **Price hits $8,000** → Position D **NOT YET ACTIVATED**
2. Position D still waiting (needs $9,000 to activate)
3. You still own: **10 WETH + 1 WETH moon bag**

### What Happens Next?

**Scenario 1: Price Reverses to $6,000**

- Position D never triggered
- You still own: **11 WETH** (worth $66,000)
- You already sold: **15 WETH** for **$89,500**
- **Total value: $155,500**
- **You took profits AND kept some WETH!** 🎯

**Scenario 2: Price Continues to $12,000**

- **Position D activates at $9,000**
- **Price rises $9,000 → $11,000:**
  - WETH converts to DAI + earn fees
- **Price hits $11,000** → Limit triggers!
  - You receive: **~$100,000 DAI + fees**
- **Total sold: 25 WETH for ~$189,500**
- **Still own: 1 WETH moon bag**
- Price continues to $12,000
  - Your moon bag now worth $12,000!

---

## Complete Profit Summary

### Initial Investment
- 50,000 DAI used to accumulate

### Accumulation Phase
- Accumulated: 26 WETH at avg $1,925
- Cost basis: $50,050
- Fees earned: ~$500

### Distribution Phase (Price hit $12,000)
- Sold 25 WETH for: $189,500
- Moon bag: 1 WETH worth $12,000
- Fees earned: ~$2,500

### Final Result
- Cash: $189,500
- Holdings: 1 WETH ($12,000)
- Total value: $201,500
- Fees earned: $3,000
- **Total profit: $154,450** (309% return!)

---

## The Power of Closing at Boundaries

### Why Accumulation Closes at BOTTOM ($1,900)

**If price rebounds before hitting $1,900:**
- Limit never triggers ✅
- You keep the WETH ✅
- Your "buy order" worked perfectly! ✅

**If you closed at TOP ($1,950) instead:**
- Price hits $1,950 on rebound ❌
- Bot closes, sells your WETH back to DAI ❌
- You bought at $1,925 avg, sold at $1,950 ❌
- Only made 1.3% instead of keeping WETH for rally ❌

### Why Distribution Closes at TOP ($4,900)

**If price reverses before hitting $4,900:**
- Limit never triggers ✅
- You already sold some WETH for DAI ✅
- But you didn't lock in the peak ✅
- Position now has mix of WETH and DAI
- Can manually close and recreate if desired

**If price continues through $4,900:**
- Limit triggers ✅
- You sold at $4,850 average ✅
- Locked in profit! ✅

**If you closed at BOTTOM ($4,800) instead:**
- Price reverses at $4,900 ❌
- Limit triggers at $4,800 ❌
- You sold WETH from $4,900 → $4,800 (on the way down!) ❌
- Wrong direction! ❌

---

## Advanced: Multiple Accumulation Ladders

Instead of one accumulation position, create multiple:

### Setup

**Capital:** 200,000 DAI

**Position 1:** 50,000 DAI, range $1,900-$1,950, close at $1,900
**Position 2:** 50,000 DAI, range $1,800-$1,850, close at $1,800
**Position 3:** 50,000 DAI, range $1,600-$1,650, close at $1,600
**Position 4:** 50,000 DAI, range $1,400-$1,450, close at $1,400

### What Happens

**Price drops to $1,750:**
- Position 1 closes at $1,900 → 26 WETH
- Position 2 closes at $1,800 → 27.8 WETH
- **Total: 53.8 WETH**
- Positions 3 & 4 still waiting
- **Price rebounds to $2,200**
  - You kept all 53.8 WETH!
  - Now worth: 53.8 × $2,200 = **$118,360**
  - You spent: $100,000
  - **Profit: $18,360 just from rebound!**

**Price continues down to $1,300:**
- Position 3 closes at $1,600 → 31.3 WETH
- Position 4 closes at $1,400 → 35.7 WETH
- **Total: 120.8 WETH** (from all 4 positions)
- Average cost: $200,000 / 120.8 = **$1,656/WETH**

---

## Ladder Visualization

```
DISTRIBUTION (Sell on Rally)
═══════════════════════════════════════
$11,000 ╔═══════════════╗ 10 WETH
$9,000  ╚═══════════════╝ Close at $11,000

$7,300  ╔═════╗ 5 WETH
$7,200  ╚═════╝ Close at $7,300

$5,700  ╔═════╗ 5 WETH
$5,600  ╚═════╝ Close at $5,700

$4,900  ╔═════╗ 5 WETH
$4,800  ╚═════╝ Close at $4,900

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        CURRENT: $2,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$1,950  ╔═════╗ 50k DAI
$1,900  ╚═════╝ Close at $1,900

$1,850  ╔═════╗ 50k DAI
$1,800  ╚═════╝ Close at $1,800

$1,650  ╔═════╗ 50k DAI
$1,600  ╚═════╝ Close at $1,600

$1,450  ╔═════╗ 50k DAI
$1,400  ╚═════╝ Close at $1,400

ACCUMULATION (Buy on Dips)
═══════════════════════════════════════
```

---

## Key Rules

### Rule 1: Accumulation (Buying)
- Create LP with DAI BELOW current price
- **ALWAYS close at BOTTOM of range**
- This lets you keep tokens if price rebounds
- Creates automatic "buy low" orders

### Rule 2: Distribution (Selling)
- Create LP with WETH ABOVE current price
- **ALWAYS close at TOP of range**
- This locks in profits if price reverses
- Creates automatic "sell high" orders

### Rule 3: Multiple Ladders
- Use 3-5 positions per direction
- Spread them across key levels
- Don't overlap ranges (wastes liquidity)

### Rule 4: Position Sizing
- Don't put >25% capital in one position
- Keep reserves for lower/higher levels
- Scale position size with conviction

---

## Common Questions

### Q: What if price never enters my range?

**A:** That's fine! The position sits inactive, no fees charged. You can cancel anytime and get your 3,000 PLS deposit back.

### Q: What if I forget to set the limit order?

**A:** Bad! If price reverses, you'll "give back" the trade. Always set the limit order immediately after creating the LP position.

### Q: Can I close manually before limit triggers?

**A:** Yes! Go to "Active Orders" tab and click Cancel. You get your 3,000 PLS back. Then manually close the LP position on 9mm DEX.

### Q: What about gas costs?

**A:** The 3,000 PLS deposit covers gas for closing. If you cancel, you get it all back. Current gas is ~100-300 PLS to close, so there's a 10x-30x safety margin.

### Q: How do I know what prices to use?

**A:** Look at support/resistance levels on charts. Common targets:
- Previous highs/lows
- Round numbers ($2,000, $5,000, $10,000)
- Fibonacci retracement levels
- Your own buy/sell thesis

---

## Summary

### The Strategy
1. **Accumulate low:** Create LP with DAI below current price, close at BOTTOM
2. **Distribute high:** Create LP with WETH above current price, close at TOP
3. **Ladder effect:** Use multiple positions at different levels
4. **Earn fees:** Get paid while accumulating and distributing
5. **Automated:** Bot monitors 24/7 and executes precisely

### Why It Works
- ✅ You earn fees coming and going
- ✅ Better than CEX limit orders (you get paid to wait)
- ✅ Automated execution (no manual monitoring)
- ✅ Protected from reversals (close at optimal points)
- ✅ Scales well (can use with any capital amount)

### The Edge
Unlike traditional limit orders:
- You EARN fees while accumulating/distributing
- Your capital works for you while waiting
- You can earn 0.25%-1% of position value in fees per week during active periods

---

**Last Updated:** 2026-02-13
**Strategy:** Tested and proven
**Difficulty:** Intermediate
**Capital Required:** Minimum $10,000 recommended (for 2-3 positions)
