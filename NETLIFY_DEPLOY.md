# Deploy to Netlify (Works with Private Repos)

Netlify is free and works with private GitHub repos!

## Quick Deploy (5 minutes)

### Option A: Netlify CLI (Recommended)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login
# Opens browser for login

# 3. Go to website folder
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website

# 4. Initialize site
netlify init

# Follow prompts:
# - Create & configure new site
# - Choose team (your account)
# - Site name: lp-limit-orders (or your choice)
# - Build command: (leave empty)
# - Publish directory: . (current directory)

# 5. Deploy!
netlify deploy --prod

# Your site is live at:
# https://lp-limit-orders.netlify.app (or your chosen name)
```

### Option B: Netlify Web UI (Easier)

1. **Go to Netlify:**
   ```
   https://app.netlify.com/start
   ```

2. **Connect GitHub:**
   - Click "Import from Git"
   - Choose "GitHub"
   - Authorize Netlify
   - Select: `1kilolukEt/pulsechain-rebalancer`

3. **Configure Build:**
   - Base directory: `website`
   - Build command: (leave empty)
   - Publish directory: `website`
   - Click "Deploy site"

4. **Your site is live!**
   ```
   https://random-name.netlify.app
   ```

5. **Change site name:**
   - Site settings → Domain management
   - Change name to: `lp-limit-orders`
   - Now: `https://lp-limit-orders.netlify.app`

---

## Auto-Deploy on Push

Once connected to GitHub, Netlify auto-deploys when you push:

```bash
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer
git add website/
git commit -m "Update website"
git push origin main

# Netlify automatically builds and deploys!
# Takes ~30 seconds
```

---

## Add Custom Domain (Later)

When you buy a domain:

1. **In Netlify:**
   - Site settings → Domain management
   - Add custom domain: `yourdomain.com`

2. **In your domain provider (e.g., Cloudflare):**
   - Add CNAME: `www` → `lp-limit-orders.netlify.app`
   - Add CNAME: `@` → `lp-limit-orders.netlify.app`

3. **Enable HTTPS:**
   - Automatic in Netlify (Let's Encrypt)
   - Takes ~1 minute

---

## Advantages of Netlify

✅ **FREE forever**
✅ **Works with private repos**
✅ **Auto-deploy on push**
✅ **Free HTTPS**
✅ **Better performance** (global CDN)
✅ **Deploy previews** (test branches)
✅ **Easy custom domains**
✅ **No build needed** (static site)

---

## Cost Comparison

| Feature | GitHub Pages | Netlify |
|---------|--------------|---------|
| **Public repo** | FREE ✅ | FREE ✅ |
| **Private repo** | $4/month ❌ | FREE ✅ |
| **Custom domain** | FREE ✅ | FREE ✅ |
| **HTTPS** | FREE ✅ | FREE ✅ |
| **Auto-deploy** | YES ✅ | YES ✅ |
| **Deploy previews** | NO ❌ | YES ✅ |
| **Global CDN** | YES ✅ | YES ✅ |

**Winner:** Netlify (if repo is private)

---

## Quick Deploy Commands

```bash
# First time setup
npm install -g netlify-cli
netlify login
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
netlify init
netlify deploy --prod

# Future updates (auto-deploy on push)
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer
git add website/
git commit -m "Update"
git push origin main
# Done! Netlify deploys automatically
```

---

## Troubleshooting

### netlify: command not found

```bash
# Install globally
npm install -g netlify-cli

# Or use npx
npx netlify-cli deploy --prod
```

### Site not updating?

1. Check Netlify dashboard: https://app.netlify.com
2. Look for failed builds
3. Clear cache: Site settings → Build & deploy → Clear cache

### Custom domain not working?

1. Check DNS with: `dig yourdomain.com`
2. Wait 15-30 minutes for DNS propagation
3. Verify CNAME points to Netlify

---

## Recommended: Netlify + Private Repo

**For your use case:**

1. ✅ Keep GitHub repo private
2. ✅ Deploy to Netlify (free)
3. ✅ Auto-deploy on push
4. ✅ Add custom domain later

**Cost:** $0/year + $10-15/year for domain (later)

---

**Ready to deploy?**

```bash
npm install -g netlify-cli
netlify login
cd /Users/berkanbolkan/Desktop/MyPrograms/pulsechain-rebalancer/website
netlify init
netlify deploy --prod
```

Your site will be live in 2 minutes! 🚀
