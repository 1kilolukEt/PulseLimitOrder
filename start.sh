#!/bin/bash

# Simple development server launcher for LP Limit Orders website

echo "🚀 Starting LP Limit Orders Website..."
echo ""
echo "Choose a server:"
echo "1) Python HTTP Server (recommended)"
echo "2) PHP Built-in Server"
echo "3) Node.js HTTP Server"
echo ""
read -p "Enter choice (1-3): " choice

PORT=8000

case $choice in
    1)
        echo ""
        echo "Starting Python HTTP Server on port $PORT..."
        echo "Open: http://localhost:$PORT"
        echo ""
        python -m http.server $PORT
        ;;
    2)
        echo ""
        echo "Starting PHP Built-in Server on port $PORT..."
        echo "Open: http://localhost:$PORT"
        echo ""
        php -S localhost:$PORT
        ;;
    3)
        echo ""
        echo "Starting Node.js HTTP Server on port $PORT..."
        echo "Open: http://localhost:$PORT"
        echo ""
        npx http-server -p $PORT
        ;;
    *)
        echo "Invalid choice. Defaulting to Python..."
        echo ""
        echo "Starting Python HTTP Server on port $PORT..."
        echo "Open: http://localhost:$PORT"
        echo ""
        python -m http.server $PORT
        ;;
esac
