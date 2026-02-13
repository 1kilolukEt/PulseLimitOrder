# Quick Start Guide

Get your LP Limit Orders website running in 60 seconds! ⚡

## Step 1: Start Development Server (30 seconds)

Open terminal and run:

```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
./start.sh
```

Select option `1` (Python HTTP Server)

**Or manually:**
```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
python3 -m http.server 8000
```

## Step 2: Open in Browser (10 seconds)

Open: **http://localhost:8000**

## Step 3: Connect Wallet (20 seconds)

1. Click "Connect Wallet"
2. Approve MetaMask connection
3. Switch to PulseChain if prompted
4. Done! Your positions will load automatically

---

## Testing Checklist

Try these features:

- [ ] View your LP positions
- [ ] Click "View Details" on a position
- [ ] Click "Create Limit Order"
- [ ] Check the "Active Orders" tab
- [ ] Cancel an order (if you have one)

---

## Deploy to Internet (FREE)

### Easiest: Netlify (2 minutes)

1. Go to https://netlify.com
2. Sign up (free)
3. Drag the `website` folder onto the Netlify dashboard
4. Done! You get a URL like: `https://your-site.netlify.app`

**That's it!** Your site is live on the internet for free.

---

## Need Help?

**Website won't load?**
```bash
# Try a different port
python3 -m http.server 8080
# Then open: http://localhost:8080
```

**MetaMask won't connect?**
- Make sure MetaMask extension is installed
- Try refreshing the page
- Check browser console (F12) for errors

**Positions not showing?**
- Ensure you're connected to PulseChain network
- Verify you have LP positions on 9mm DEX
- Check contract address in `js/config.js`

---

## What Next?

### If Testing Locally:
- Create a test limit order
- Cancel it to get deposit back
- Try on mobile (MetaMask app browser)

### If Deploying:
- See `DEPLOYMENT.md` for detailed guides
- Set up custom domain (optional)
- Share link with users!

---

## Quick Reference

**Contract Address:**
`0x5CA8bdf54A61e4070a048689D631f7573bd77237`

**Files to customize:**
- `js/config.js` - Contract addresses, settings
- `css/style.css` - Colors, theme
- `index.html` - Text, layout

**Documentation:**
- `README.md` - Full user guide
- `DEPLOYMENT.md` - Deployment options
- `WEBSITE_SUMMARY.md` - Technical overview

---

## You're All Set! 🎉

The website is ready to use. Start the server and connect your wallet to begin!

**Remember:**
- 🆓 Hosting is FREE on Netlify/Vercel/GitHub Pages
- 🔒 Your private keys never leave MetaMask
- 📱 Works on mobile (MetaMask app browser)
- ⚡ Loads in under 2 seconds
- 🌍 Can be accessed from anywhere after deployment

Enjoy your LP Limit Orders website!
