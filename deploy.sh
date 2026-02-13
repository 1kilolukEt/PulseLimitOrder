#!/bin/bash
# Quick deploy script for website

set -e  # Exit on error

echo ""
echo "🚀 LP Limit Orders - Website Deployment"
echo "========================================"
echo ""

# Check if in git repo
if [ ! -d ../.git ]; then
    echo "❌ Error: Not in a git repository"
    echo "   This script should be run from the website directory"
    exit 1
fi

# Go to repo root
cd ..

echo "📋 Current status:"
git status --short

echo ""
read -p "📝 Commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update website"
fi

echo ""
echo "📦 Staging changes..."
git add website/

echo "💾 Committing..."
if git commit -m "$commit_msg"; then
    echo "✅ Changes committed"
else
    echo "ℹ️  No changes to commit"
fi

echo ""
echo "📤 Pushing to GitHub..."
if git push origin main; then
    echo "✅ Pushed to GitHub!"
else
    echo "❌ Push failed. Check your GitHub connection."
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your website will be updated in 1-2 minutes at:"
echo "👉 https://YOUR_USERNAME.github.io/pulsechain-rebalancer/"
echo ""
echo "To check deployment status:"
echo "https://github.com/YOUR_USERNAME/pulsechain-rebalancer/actions"
echo ""
