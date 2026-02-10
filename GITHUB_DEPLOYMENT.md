# GitHub Pages Deployment Guide

## Complete Step-by-Step Guide to Deploy Your Website

This guide will help you:
1. ✅ Deploy to GitHub Pages (FREE)
2. ✅ Add custom domain (when you buy one)
3. ✅ Enable HTTPS automatically
4. ✅ Keep it updated easily

---

## Prerequisites

- [x] Git repository (you have this)
- [x] GitHub account
- [ ] Custom domain (optional, can add later)

---

## Option 1: GitHub Pages (Recommended - FREE)

### Step 1: Create GitHub Repository

If you don't have the repo on GitHub yet:

```bash
# Go to your project root
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer

# If you haven't already, create a GitHub repo at:
# https://github.com/new
# Name it: pulsechain-rebalancer

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pulsechain-rebalancer.git

# Or if you already have origin:
git remote set-url origin https://github.com/YOUR_USERNAME/pulsechain-rebalancer.git

# Push to GitHub
git push -u origin main
```

### Step 2: Configure GitHub Pages

#### Option A: Deploy from `website/` folder

1. **Go to your GitHub repository**
   ```
   https://github.com/YOUR_USERNAME/pulsechain-rebalancer
   ```

2. **Click "Settings" tab** (top right)

3. **Click "Pages"** in left sidebar

4. **Configure Source:**
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/website`
   - Click "Save"

5. **Wait 1-2 minutes** for deployment

6. **Your site will be live at:**
   ```
   https://YOUR_USERNAME.github.io/pulsechain-rebalancer/
   ```

#### Option B: Use GitHub Actions (More Control)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Website

on:
  push:
    branches: [ main ]
    paths:
      - 'website/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: 'website'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then:
1. Go to Settings → Pages
2. Source: `GitHub Actions`
3. Push changes to trigger deployment

---

## Step 3: Test Your Deployment

Visit your site:
```
https://YOUR_USERNAME.github.io/pulsechain-rebalancer/
```

**Test checklist:**
- [ ] Page loads
- [ ] Can connect MetaMask
- [ ] Can view positions
- [ ] Can view orders
- [ ] All links work
- [ ] 9mm DEX links work

---

## Step 4: Add Custom Domain (Later)

When you buy a domain (e.g., `lplimitorders.com`):

### A. Configure DNS at Domain Provider

Add these DNS records:

**For root domain (lplimitorders.com):**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

**For www subdomain (www.lplimitorders.com):**
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### B. Configure GitHub Pages

1. Go to Settings → Pages
2. Under "Custom domain", enter: `lplimitorders.com`
3. Click "Save"
4. Check "Enforce HTTPS" (after DNS propagates)

### C. Wait for DNS Propagation

- Usually takes 15 minutes to 24 hours
- Check status: `dig lplimitorders.com`

### D. Test Custom Domain

```
https://lplimitorders.com
https://www.lplimitorders.com
```

Both should work and redirect to HTTPS automatically!

---

## Option 2: Netlify (Alternative - Also FREE)

Netlify is easier for custom domains and has better features.

### Quick Deploy

1. **Create `netlify.toml` in project root:**

```toml
[build]
  publish = "website"
  command = "echo 'No build needed'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
```

2. **Deploy via Netlify CLI:**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer
netlify init

# Follow prompts:
# - Create new site
# - Choose team
# - Site name: lp-limit-orders (or your choice)

# Deploy
netlify deploy --prod --dir=website
```

3. **Your site is live at:**
```
https://lp-limit-orders.netlify.app
```

4. **Add custom domain:**
   - Go to Netlify dashboard
   - Site settings → Domain management
   - Add custom domain
   - Follow DNS instructions

**Netlify advantages:**
- ✅ Automatic HTTPS
- ✅ Instant deploys (push to GitHub)
- ✅ Deploy previews for branches
- ✅ Better custom domain management
- ✅ Edge functions (if needed later)

---

## Option 3: Vercel (Alternative - Also FREE)

Similar to Netlify, optimized for frontend.

### Quick Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
vercel --prod

# Follow prompts
```

Your site: `https://pulsechain-rebalancer.vercel.app`

---

## Recommended Setup: GitHub Pages + Custom Domain

**For your use case, I recommend:**

1. **Now:** Use GitHub Pages
   - Free
   - Easy to set up
   - Good enough for most needs
   - Your site: `https://YOUR_USERNAME.github.io/pulsechain-rebalancer/`

2. **After buying domain:** Keep GitHub Pages or switch to Netlify
   - GitHub Pages: Free but basic
   - Netlify: Free with better features (auto-deploy, preview, etc.)

---

## Complete Deployment Script

I'll create a script to automate this:

```bash
#!/bin/bash
# deploy.sh - Deploy website to GitHub Pages

echo "🚀 Deploying LP Limit Orders Website"
echo "======================================"

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if git repo
if [ ! -d .git ]; then
    echo "❌ Not a git repository"
    exit 1
fi

# Add all website changes
git add website/

# Commit
echo "📝 Committing changes..."
git commit -m "Update website" || echo "No changes to commit"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployed!"
echo ""
echo "Your website will be live in 1-2 minutes at:"
echo "https://YOUR_USERNAME.github.io/pulsechain-rebalancer/"
echo ""
echo "To add custom domain later, see: website/GITHUB_DEPLOYMENT.md"
```

---

## Updating Your Website

After making changes:

```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer

# Make changes to website files...

# Commit and push
git add website/
git commit -m "Update: description of changes"
git push origin main

# Site updates automatically in 1-2 minutes!
```

---

## Domain Name Recommendations

When you buy a domain, consider:

### Good Domain Names:
- `lplimitorders.com` ✅
- `9mmlimitorders.com` ✅
- `pulsechainlp.com` ✅
- `lpautomation.io` ✅

### Where to Buy:
1. **Namecheap** - $8-12/year, easy to use
2. **Cloudflare** - $8-10/year, cheapest, best DNS
3. **Google Domains** - $12/year, simple
4. **GoDaddy** - Avoid (expensive, pushy upsells)

### Recommended: Cloudflare
- Cheapest pricing (at-cost)
- Best DNS (fastest)
- Free SSL
- Good dashboard
- No upsells

**Cost:** ~$10-15/year for `.com`

---

## Security Considerations

### 1. HTTPS (Automatic)

Both GitHub Pages and Netlify provide free HTTPS:
- GitHub Pages: Let's Encrypt (auto-renewed)
- Netlify: Let's Encrypt (auto-renewed)

### 2. Content Security Policy (Optional)

Add to `index.html` if you want extra security:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://rpc.pulsechain.com https://scan.pulsechain.com;
  img-src 'self' data: https:;
">
```

### 3. No Secrets in Code

Your website is public, so:
- ✅ No private keys in code (already following this)
- ✅ No API keys (you don't have any)
- ✅ All contract addresses are public (that's fine)
- ✅ RPC endpoints are public (that's fine)

---

## Monitoring Your Site

### Check if Site is Down

**UptimeRobot (Free):**
- Monitors every 5 minutes
- Email alerts if down
- Free for 50 monitors
- https://uptimerobot.com

**Setup:**
1. Create account
2. Add monitor
3. URL: `https://your-domain.com`
4. Get email if down

### Analytics (Optional)

If you want to track visitors:

**Simple Analytics (Privacy-focused):**
- No cookies
- GDPR compliant
- Simple dashboard
- ~$9/month

**Google Analytics (Free but invasive):**
- Tracks everything
- Requires cookie banner
- Not recommended for crypto

**Plausible (Recommended):**
- Privacy-focused
- No cookies
- Beautiful dashboard
- ~$9/month

---

## Troubleshooting

### Site not updating after push?

1. Check GitHub Actions status
2. Clear browser cache: Cmd+Shift+R (Mac)
3. Wait 2-5 minutes for propagation

### 404 Error on custom domain?

1. Check DNS with: `dig your-domain.com`
2. Wait 24 hours for DNS propagation
3. Verify CNAME file in repo

### MetaMask not connecting?

1. Check if using HTTPS (not HTTP)
2. Open console (F12) for errors
3. Try different browser

### Web3 not loading?

1. Check CDN is accessible
2. Use local Web3: `website/lib/web3.min.js`
3. Check browser console for errors

---

## Complete Deployment Checklist

### Before Deployment
- [ ] Test website locally: `python -m http.server 8000`
- [ ] All links work
- [ ] MetaMask connects
- [ ] Orders display correctly
- [ ] No console errors

### GitHub Setup
- [ ] Code pushed to GitHub
- [ ] Repository is public (or private, your choice)
- [ ] GitHub Pages enabled
- [ ] Correct source folder selected (`/website`)

### After Deployment
- [ ] Site loads at GitHub Pages URL
- [ ] Test on mobile
- [ ] Test MetaMask connection
- [ ] Share URL with trusted users
- [ ] Monitor for issues

### Custom Domain (Later)
- [ ] Domain purchased
- [ ] DNS configured
- [ ] Custom domain added to GitHub Pages
- [ ] HTTPS enforced
- [ ] Both www and non-www work

---

## Cost Summary

### Free Option (GitHub Pages):
```
Hosting: $0/year
Domain: $10-15/year (when you buy one)
HTTPS: $0 (included)
Total: $10-15/year
```

### Premium Option (Netlify/Vercel):
```
Hosting: $0/year (free tier is enough)
Domain: $10-15/year
HTTPS: $0 (included)
Analytics (optional): $9/month
Total: $10-15/year (or $118/year with analytics)
```

**Recommendation: Start with GitHub Pages (free), add domain later ($10/year)**

---

## Next Steps

1. **Now (5 minutes):**
   - Push code to GitHub
   - Enable GitHub Pages
   - Test at GitHub Pages URL

2. **This week (optional):**
   - Buy domain name
   - Configure DNS
   - Add custom domain

3. **Later (optional):**
   - Add analytics
   - Set up monitoring
   - Consider Netlify for auto-deploy

---

## Quick Start Commands

```bash
# 1. Push to GitHub (if not already)
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer
git add .
git commit -m "Prepare for deployment"
git push origin main

# 2. Enable GitHub Pages at:
# https://github.com/YOUR_USERNAME/pulsechain-rebalancer/settings/pages

# 3. Wait 2 minutes, then visit:
# https://YOUR_USERNAME.github.io/pulsechain-rebalancer/

# Done! ✅
```

---

## Support Resources

- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **Custom Domain Guide:** https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- **Netlify Docs:** https://docs.netlify.com
- **This Guide:** `website/GITHUB_DEPLOYMENT.md`

---

**Last Updated:** 2026-02-10
**Deployment Time:** ~5 minutes
**Cost:** FREE (+ domain if you want)
