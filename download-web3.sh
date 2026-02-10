#!/bin/bash

# Download Web3.js locally for offline use

echo "📥 Downloading Web3.js..."

# Create lib directory
mkdir -p lib

# Download Web3.js
curl -o lib/web3.min.js https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js

if [ $? -eq 0 ]; then
    echo "✅ Web3.js downloaded successfully to lib/web3.min.js"
    echo ""
    echo "Now update index.html:"
    echo "Change:"
    echo '  <script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>'
    echo "To:"
    echo '  <script src="lib/web3.min.js"></script>'
    echo ""
    echo "Size: $(du -h lib/web3.min.js | cut -f1)"
else
    echo "❌ Failed to download Web3.js"
    echo "Try manually downloading from:"
    echo "https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"
fi
