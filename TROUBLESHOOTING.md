# Troubleshooting Guide

## "Web3 is not defined" Error

This error means the Web3.js library didn't load from the CDN. Here are the solutions:

### Solution 1: Use Test Page (Recommended)

I've created a test page to diagnose the issue:

```bash
cd website
python -m http.server 8000
# Open: http://localhost:8000/test.html
```

This will show you exactly what's working and what's not.

### Solution 2: Use Different Web3 CDN

If the CDN is blocked or slow, try these alternatives:

**Option A: Update index.html to use unpkg:**
```html
<script src="https://unpkg.com/web3@1.10.0/dist/web3.min.js"></script>
```

**Option B: Use cdnjs:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.10.0/web3.min.js"></script>
```

**Option C: Use jsDelivr (current):**
```html
<script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>
```

### Solution 3: Download Web3.js Locally (Best for offline)

If CDNs don't work or you want offline access:

```bash
cd website
mkdir lib
curl -o lib/web3.min.js https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js
```

Then update `index.html`:
```html
<!-- Change from: -->
<script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>

<!-- To: -->
<script src="lib/web3.min.js"></script>
```

### Solution 4: Check Browser Console

Open browser console (F12) and check for errors:

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Refresh the page
4. Look for errors

Common errors:
- `Failed to load resource` - CDN blocked or internet issue
- `CORS policy` - Need to run a local server (not file://)
- `Script error` - Check Content Security Policy

### Solution 5: Verify CORS / Local Server

**MUST USE A LOCAL SERVER**, not `file://` protocol!

❌ Wrong:
```
file:///Users/you/website/index.html
```

✅ Correct:
```
http://localhost:8000
```

To start local server:
```bash
cd website
python -m http.server 8000
```

### Solution 6: Clear Browser Cache

Sometimes cached files cause issues:

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Click "Empty Cache and Hard Reload"

Or:
- Chrome/Edge: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Safari: Cmd+Option+E

### Solution 7: Try Different Browser

Test in another browser:
- Chrome
- Firefox
- Brave
- Edge

### Solution 8: Check Firewall/Antivirus

Some firewalls block CDN access:
- Temporarily disable firewall
- Add exception for jsdelivr.net
- Use local Web3.js file (Solution 3)

---

## Other Common Issues

### "MetaMask not detected"

**Solution:**
1. Install MetaMask extension
2. Refresh the page
3. Check console for errors

### "Wrong Network" / "Please switch to PulseChain"

**Solution:**
1. Open MetaMask
2. Click network dropdown
3. Select "PulseChain"
4. If not listed, add custom network:
   - Network Name: PulseChain
   - RPC URL: https://rpc.pulsechain.com
   - Chain ID: 369
   - Currency: PLS
   - Explorer: https://scan.pulsechain.com

### "No positions found"

**Possible causes:**
1. You don't have LP positions on 9mm DEX
2. Wrong wallet connected
3. Contract address incorrect
4. RPC issues

**Solution:**
- Verify you have LP positions on 9mm.pro
- Check you're connected with correct wallet
- Verify contract address in `js/config.js`

### "Transaction failed"

**Common causes:**
1. Insufficient PLS for gas
2. Insufficient PLS for deposit (3,000 PLS required)
3. NFT not approved
4. Slippage too low
5. Network congestion

**Solution:**
- Ensure you have at least 3,500 PLS (3,000 deposit + gas)
- Click "Approve NFT" first if needed
- Increase slippage tolerance
- Try again later

### "Contract call failed"

**Solution:**
1. Check RPC is working: https://rpc.pulsechain.com
2. Verify contract addresses in `js/config.js`:
   ```javascript
   LP_POSITION_MANAGER: '0x5CA8bdf54A61e4070a048689D631f7573bd77237'
   NFT_POSITION_MANAGER: '0xCC05bf158202b4F461Ede8843d76dcd7Bbad07f2'
   FACTORY: '0xe50DbDC88E87a2C92984d794bcF3D1d76f619C68'
   ```
3. Try different RPC if main is down

### "Positions loading forever"

**Solution:**
1. Check browser console for errors
2. Verify you're on PulseChain (Chain ID 369)
3. Try refreshing the page
4. Check RPC endpoint is responding:
   ```bash
   curl -X POST https://rpc.pulsechain.com \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

---

## Quick Diagnostic Script

Run this in browser console (F12):

```javascript
console.log('=== Diagnostic Info ===');
console.log('Web3 defined:', typeof Web3 !== 'undefined');
console.log('Web3 version:', typeof Web3 !== 'undefined' ? Web3.version : 'N/A');
console.log('MetaMask detected:', typeof window.ethereum !== 'undefined');
console.log('Current URL:', window.location.href);
console.log('Protocol:', window.location.protocol);
console.log('Is local server:', window.location.protocol === 'http:' || window.location.protocol === 'https:');
if (typeof window.ethereum !== 'undefined') {
    console.log('Connected address:', window.ethereum.selectedAddress);
    console.log('Chain ID:', window.ethereum.chainId);
}
```

This will show you what's working and what's not.

---

## Still Having Issues?

If none of the above work:

1. **Run the test page:**
   ```bash
   cd website
   python -m http.server 8000
   # Open: http://localhost:8000/test.html
   ```

2. **Check console output** and share any error messages

3. **Try the offline version** (Solution 3) - download Web3.js locally

4. **Verify all files are present:**
   ```bash
   cd website
   ls -la
   # Should see: index.html, css/, js/, test.html
   ```

5. **Test with minimal page:**
   Create `minimal.html`:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Test</title></head>
   <body>
       <h1>Test</h1>
       <div id="result"></div>
       <script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>
       <script>
           document.getElementById('result').textContent =
               typeof Web3 !== 'undefined' ? '✅ Web3 loaded!' : '❌ Web3 failed';
       </script>
   </body>
   </html>
   ```

---

## Contact Info

If you've tried everything and it still doesn't work:

1. Note your:
   - Operating system
   - Browser and version
   - Error messages in console
   - Output from test.html

2. Check the GitHub issues or create a new one with the details above
