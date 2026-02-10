# LP Limit Orders Website

A lightweight web interface for managing limit orders on 9mm Pro LP positions on PulseChain.

## Features

- 🔌 **Connect Wallet** - MetaMask integration for PulseChain
- 📊 **View Positions** - See all your LP positions with current prices and ranges
- 🎯 **Create Limit Orders** - Set automated limit orders for your positions
- 📈 **Monitor Orders** - Track active orders and their progress
- ❌ **Cancel Orders** - Cancel orders and get your deposit back
- 🔄 **Auto-refresh** - Data updates every 30 seconds

## Technology Stack

- **Pure HTML/CSS/JavaScript** - No build tools required
- **Web3.js** - Ethereum/PulseChain interaction
- **MetaMask** - Wallet connection
- **Static hosting ready** - Deploy anywhere (GitHub Pages, Netlify, Vercel, etc.)

## Setup

### Option 1: Local Development

1. **Simple HTTP Server (Python)**
   ```bash
   cd website
   python3 -m http.server 8000
   ```
   Then open: http://localhost:8000

2. **Simple HTTP Server (Node.js)**
   ```bash
   cd website
   npx http-server -p 8000
   ```
   Then open: http://localhost:8000

3. **PHP Built-in Server**
   ```bash
   cd website
   php -S localhost:8000
   ```
   Then open: http://localhost:8000

### Option 2: Deploy to Static Hosting

#### GitHub Pages

1. Create a new repository
2. Push the `website` folder contents
3. Enable GitHub Pages in repository settings
4. Access at: `https://yourusername.github.io/repo-name`

#### Netlify

1. Create account at netlify.com
2. Drag and drop the `website` folder
3. Site will be live instantly
4. Custom domain optional

#### Vercel

1. Create account at vercel.com
2. Import repository or drag/drop folder
3. Deploy with one click
4. Custom domain optional

## File Structure

```
website/
├── index.html          # Main HTML page
├── css/
│   └── style.css      # Styling
├── js/
│   ├── config.js      # Configuration and constants
│   ├── contract.js    # Smart contract interactions
│   ├── wallet.js      # Wallet connection management
│   ├── positions.js   # LP positions functionality
│   ├── orders.js      # Orders functionality
│   └── app.js         # Main application logic
└── README.md          # This file
```

## Configuration

Edit `js/config.js` to update:

- Contract addresses
- Network settings
- UI preferences
- Gas payment amounts

## Usage

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Switch to PulseChain if needed

2. **View Your Positions**
   - See all LP positions
   - Check current prices and ranges
   - View position details

3. **Create Limit Order**
   - Click "Create Limit Order" on a position
   - Set target price
   - Choose direction (above/below)
   - Set slippage tolerance
   - Approve NFT (one-time per position)
   - Confirm order creation (costs 3,000 PLS deposit)

4. **Monitor Orders**
   - Switch to "Active Orders" tab
   - See order status and progress
   - Cancel orders if needed (refunds deposit)

## Smart Contract Functions

The website interacts with these contract functions:

### View Functions
- `orders(tokenId)` - Get order details
- `positions(tokenId)` - Get LP position info

### State-Changing Functions
- `createOrder()` - Create a new limit order (costs 3,000 PLS)
- `cancelOrder()` - Cancel an order (refunds deposit)
- `approve()` - Approve NFT to contract (one-time)

## Security Notes

- ✅ All transactions require user approval in MetaMask
- ✅ No private keys are stored or transmitted
- ✅ Contract addresses are hardcoded and verified
- ✅ All data is read directly from blockchain
- ⚠️ Always verify contract addresses before approving
- ⚠️ Test with small amounts first

## Browser Compatibility

- ✅ Chrome/Brave (Recommended)
- ✅ Firefox
- ✅ Edge
- ✅ Safari (with MetaMask extension)
- ❌ Mobile browsers (MetaMask app browser only)

## Troubleshooting

### "Please install MetaMask"
- Install MetaMask browser extension
- Refresh the page

### "Wrong Network"
- Click "Switch Network" when prompted
- Or manually switch to PulseChain in MetaMask

### "Transaction Failed"
- Check you have enough PLS for gas
- Verify order creation requires 3,000 PLS deposit
- Check slippage tolerance if market is volatile

### "Position Not Found"
- Ensure you have LP positions on 9mm DEX
- Refresh the page
- Check you're connected with correct wallet

## Development

### Adding New Features

1. **Add UI** - Update `index.html` and `css/style.css`
2. **Add Logic** - Create/update JavaScript files
3. **Test** - Test locally before deploying

### Modifying Contract Integration

Edit `js/contract.js` to:
- Add new contract functions
- Update ABIs
- Add new contract interactions

### Customizing Appearance

Edit `css/style.css`:
- Change colors in `:root` variables
- Modify component styles
- Update responsive breakpoints

## Maintenance

This site requires minimal maintenance:

- ✅ **No database** - All data from blockchain
- ✅ **No backend** - Pure frontend static site
- ✅ **No build process** - Direct HTML/CSS/JS
- ✅ **No dependencies** - CDN for Web3.js only
- ✅ **Auto-updates** - Reads current blockchain state

The only maintenance needed is updating contract addresses if you deploy new versions.

## Resources

- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [PulseChain Documentation](https://pulsechain.com/docs)
- [9mm DEX](https://9mm.pro/)

## License

MIT License - Feel free to modify and use as needed.

## Support

For issues or questions:
- Check browser console for errors
- Verify MetaMask is connected
- Ensure you're on PulseChain network
- Check contract addresses are correct
