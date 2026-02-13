# Deploy Your Website NOW - 5 Minutes

Your GitHub repo: **https://github.com/1kilolukEt/pulsechain-rebalancer**

## Step 1: Push Latest Changes (1 minute)

```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer

# Add all website files
git add website/

# Commit
git commit -m "Prepare website for deployment"

# Push to GitHub
git push origin main
```

**Or use the quick script:**
```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
./deploy.sh
```

---

## Step 2: Enable GitHub Pages (2 minutes)

1. **Go to your repository settings:**
   ```
   https://github.com/1kilolukEt/pulsechain-rebalancer/settings/pages
   ```

2. **Configure GitHub Pages:**
   - Under "Build and deployment"
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/website`  ← **Important!**
   - Click **Save**

3. **Screenshot of what it should look like:**
   ```
   Build and deployment
   ┌─────────────────────────────────────┐
   │ Source: Deploy from a branch        │
   │                                     │
   │ Branch: [main ▾] [/website ▾] Save│
   └─────────────────────────────────────┘
   ```

---

## Step 3: Wait and Test (2 minutes)

1. **Wait 1-2 minutes** for GitHub to build your site

2. **Your website will be live at:**
   ```
   https://1kiloluket.github.io/pulsechain-rebalancer/
   ```

3. **Test it:**
   - Open the URL
   - Connect MetaMask
   - Check if positions/orders load
   - Try all tabs (Positions, Orders, History)

---

## ✅ Done! Your Site is Live

**Your website URL:**
```
https://1kiloluket.github.io/pulsechain-rebalancer/
```

**Share this with users!**

---

## Next Steps (Optional - Do Later)

### Buy a Custom Domain

**Recommended domain names:**
- `lplimitorders.com`
- `9mmlimitorders.com`
- `pulsechainlp.com`

**Where to buy:**
1. **Cloudflare** ($10/year) - Recommended
   - https://www.cloudflare.com/products/registrar/
   - Cheapest, best DNS, no markup

2. **Namecheap** ($12/year) - Easy
   - https://www.namecheap.com
   - User-friendly, good support

3. **Google Domains** ($12/year) - Simple
   - https://domains.google

### Add Custom Domain to GitHub Pages

**After buying domain:**

1. **Configure DNS at your domain provider:**

   Add these A records:
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

   Add CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: 1kiloluket.github.io
   ```

2. **Add to GitHub Pages:**
   - Go to: https://github.com/1kilolukEt/pulsechain-rebalancer/settings/pages
   - Under "Custom domain", enter your domain: `yourdomain.com`
   - Click Save
   - Check "Enforce HTTPS" (after DNS propagates)

3. **Wait 15 minutes to 24 hours** for DNS to propagate

4. **Test:**
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

---

## Updating Your Website (Easy!)

Whenever you make changes:

```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer

# Make your changes to files in website/...

# Deploy
cd website
./deploy.sh

# Or manually:
git add website/
git commit -m "Update: describe your changes"
git push origin main

# Site updates automatically in 1-2 minutes!
```

---

## Troubleshooting

### Website not showing up?

1. **Check GitHub Pages status:**
   ```
   https://github.com/1kilolukEt/pulsechain-rebalancer/settings/pages
   ```
   Should show: "Your site is live at..."

2. **Check recent deployment:**
   ```
   https://github.com/1kilolukEt/pulsechain-rebalancer/deployments
   ```

3. **Clear browser cache:**
   - Chrome/Brave: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Safari: Cmd+Option+E, then reload

### 404 Error?

- Make sure you selected `/website` folder, not `/` (root)
- Wait 2-3 minutes after enabling Pages
- Check that `index.html` exists in `website/` folder

### Changes not showing?

- Wait 1-2 minutes after push
- Clear browser cache
- Check GitHub Actions: https://github.com/1kilolukEt/pulsechain-rebalancer/actions

---

## Quick Reference

**Your Repository:**
```
https://github.com/1kilolukEt/pulsechain-rebalancer
```

**Settings:**
```
https://github.com/1kilolukEt/pulsechain-rebalancer/settings/pages
```

**Your Website:**
```
https://1kiloluket.github.io/pulsechain-rebalancer/
```

**Deploy Command:**
```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
./deploy.sh
```

---

## Cost Breakdown

**Right Now:**
- GitHub Pages: **FREE** ✅
- Custom domain: **Not needed yet**
- HTTPS: **FREE** (auto-enabled) ✅
- **Total: $0/year**

**With Custom Domain:**
- GitHub Pages: **FREE** ✅
- Custom domain: **~$10-15/year**
- HTTPS: **FREE** (auto-enabled) ✅
- **Total: ~$10-15/year**

---

## Support

If something doesn't work:

1. **Check the full guide:** `website/GITHUB_DEPLOYMENT.md`
2. **GitHub Pages docs:** https://docs.github.com/en/pages
3. **Test locally first:** `python -m http.server 8000`

---

**Ready? Let's deploy! 🚀**

Run these commands now:

```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
./deploy.sh
```

Then visit:
```
https://github.com/1kilolukEt/pulsechain-rebalancer/settings/pages
```

And configure GitHub Pages!
