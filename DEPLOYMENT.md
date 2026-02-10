# Deployment Guide

This guide covers deploying the LP Limit Orders website to various hosting platforms.

## Quick Start (Local Development)

```bash
cd website
./start.sh
# Or directly: python3 -m http.server 8000
```

Open http://localhost:8000

---

## Option 1: GitHub Pages (Free, Easiest)

### Step 1: Create Repository
```bash
# In the website directory
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push to GitHub
```bash
# Create repository on github.com first, then:
git remote add origin https://github.com/yourusername/lp-limit-orders.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository settings
2. Click "Pages" in sidebar
3. Select "main" branch and "/" (root) folder
4. Click "Save"
5. Wait 1-2 minutes

Your site will be live at: `https://yourusername.github.io/lp-limit-orders`

**Pros:**
- ✅ Completely free
- ✅ Automatic HTTPS
- ✅ Easy to update (just push commits)
- ✅ Custom domains supported

**Cons:**
- ❌ Public repository required (or pay for GitHub Pro)
- ❌ Slower deployment (1-2 minutes)

---

## Option 2: Netlify (Free, Fast)

### Method A: Drag & Drop (Easiest)
1. Go to https://netlify.com
2. Sign up/log in
3. Drag the `website` folder onto the Netlify dashboard
4. Site is live immediately!

### Method B: GitHub Integration (Best)
1. Push code to GitHub (see Option 1)
2. Go to https://netlify.com
3. Click "New site from Git"
4. Connect GitHub repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
6. Click "Deploy site"

Your site will be live at: `https://random-name-12345.netlify.app`

**Custom Domain:**
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow DNS setup instructions

**Pros:**
- ✅ Instant deployment
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Free custom domains
- ✅ Better performance
- ✅ Form handling (if needed later)

**Cons:**
- ❌ 300 build minutes/month limit (not an issue for static sites)

---

## Option 3: Vercel (Free, Very Fast)

### Method A: CLI
```bash
npm i -g vercel
cd website
vercel
```

### Method B: GitHub Integration
1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import GitHub repository
5. Deploy settings:
   - Framework: Other
   - Root Directory: `./`
6. Click "Deploy"

Your site will be live at: `https://your-project.vercel.app`

**Pros:**
- ✅ Fastest deployment
- ✅ Excellent performance
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Free custom domains
- ✅ Great analytics

**Cons:**
- ❌ None for static sites

---

## Option 4: Cloudflare Pages (Free, Global CDN)

1. Push code to GitHub
2. Go to https://pages.cloudflare.com
3. Sign up/log in
4. Click "Create a project"
5. Connect GitHub repository
6. Build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
7. Click "Save and Deploy"

Your site will be live at: `https://your-project.pages.dev`

**Pros:**
- ✅ Global CDN (fastest worldwide)
- ✅ Unlimited bandwidth
- ✅ DDoS protection
- ✅ Web3 IPFS integration available

**Cons:**
- ❌ Slightly more complex setup

---

## Option 5: IPFS (Decentralized, Web3)

### Using Fleek
1. Go to https://fleek.co
2. Sign up with GitHub
3. Connect repository
4. Deploy to IPFS
5. Get IPFS hash and ENS domain

**Pros:**
- ✅ Truly decentralized
- ✅ Censorship resistant
- ✅ Perfect for Web3 apps
- ✅ ENS domain integration

**Cons:**
- ❌ Slower initial load
- ❌ Requires IPFS gateway
- ❌ More complex setup

---

## Option 6: Traditional Web Hosting

If you have traditional web hosting (cPanel, etc.):

1. **Via FTP:**
   ```
   Upload all files from website/ folder to public_html/
   ```

2. **Via SSH:**
   ```bash
   scp -r website/* user@yourserver.com:/path/to/public_html/
   ```

3. **Access:**
   ```
   https://yourdomain.com
   ```

**Pros:**
- ✅ Full control
- ✅ Can bundle with other sites

**Cons:**
- ❌ Manual deployment
- ❌ Costs money
- ❌ Need to manage SSL/HTTPS

---

## Recommended Setup

**For Personal Use:**
- Use **Netlify** or **GitHub Pages**
- Both are free and easy

**For Production/Public:**
- Use **Vercel** (best performance)
- Or **Cloudflare Pages** (global CDN)

**For Maximum Decentralization:**
- Use **IPFS via Fleek**
- Get ENS domain

---

## Post-Deployment Checklist

After deploying to any platform:

### 1. Test Wallet Connection
- [ ] Open site in browser
- [ ] Click "Connect Wallet"
- [ ] Verify MetaMask prompts appear
- [ ] Confirm connection works

### 2. Test Network Switching
- [ ] Try connecting on wrong network
- [ ] Verify auto-switch to PulseChain works
- [ ] Confirm error messages are clear

### 3. Test Position Loading
- [ ] Connect wallet with LP positions
- [ ] Verify positions load correctly
- [ ] Check prices display properly

### 4. Test Order Creation
- [ ] Try creating a limit order
- [ ] Verify approval flow works
- [ ] Confirm order creation succeeds

### 5. Test on Mobile
- [ ] Open site on mobile device
- [ ] Use MetaMask mobile browser
- [ ] Verify all functions work

### 6. Performance Check
- [ ] Run Lighthouse audit
- [ ] Check load times
- [ ] Verify no console errors

---

## Updating the Site

### GitHub Pages / Netlify / Vercel (with Git)
```bash
# Make your changes
git add .
git commit -m "Update description"
git push

# Site auto-deploys in 1-2 minutes
```

### Netlify (Drag & Drop)
1. Make changes locally
2. Drag new folder to Netlify
3. Site updates immediately

### Traditional Hosting
```bash
# Upload changed files via FTP/SSH
scp changed-file.js user@server:/path/to/site/
```

---

## Custom Domain Setup

### Netlify
1. Site settings > Domain management
2. Add custom domain
3. Update DNS:
   ```
   Type: CNAME
   Name: www (or @)
   Value: your-site.netlify.app
   ```

### Vercel
1. Project settings > Domains
2. Add domain
3. Update DNS:
   ```
   Type: CNAME
   Name: www (or @)
   Value: cname.vercel-dns.com
   ```

### GitHub Pages
1. Add `CNAME` file with your domain
2. Update DNS:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   ```

---

## SSL/HTTPS

All modern platforms (Netlify, Vercel, GitHub Pages, Cloudflare) provide **automatic HTTPS** for free using Let's Encrypt.

No configuration needed!

---

## Monitoring

### Free Monitoring Tools
- **UptimeRobot** - Site uptime monitoring
- **Vercel Analytics** - Built-in (if using Vercel)
- **Google Analytics** - Add to index.html if needed
- **Plausible** - Privacy-friendly analytics

### Example: Adding Plausible
```html
<!-- Add to index.html before </head> -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

---

## Troubleshooting

### "Site not loading"
- Clear browser cache
- Check DNS propagation (can take 24-48 hours)
- Verify files uploaded correctly

### "Wallet not connecting"
- Check browser console for errors
- Verify Web3.js CDN is loading
- Ensure site is HTTPS (required for MetaMask)

### "Positions not loading"
- Verify contract addresses in config.js
- Check RPC endpoint is working
- Test on different network if issues persist

---

## Cost Estimate

**Free Tier Limits:**
- GitHub Pages: Unlimited (with public repo)
- Netlify: 100 GB bandwidth/month
- Vercel: 100 GB bandwidth/month
- Cloudflare: Unlimited bandwidth

**Realistic Usage:**
- Average page: ~500 KB
- 1000 visitors/month: ~500 MB
- Well within all free tiers!

**You can host this site completely free forever.** 🎉

---

## Support

Need help deploying?
1. Check platform documentation
2. Review error messages in console
3. Test locally first with `./start.sh`
4. Verify all files are present
