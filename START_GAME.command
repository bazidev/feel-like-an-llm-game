#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting Feel Like an LLM..."
echo ""
echo "🎮 The game will open in your browser at:"
echo "   http://localhost:8888"
echo ""
echo "✨ Press Ctrl+C to stop the server when done"
echo ""
python3 -m http.server 8888

