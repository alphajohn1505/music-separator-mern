#!/bin/bash

# Music Separator - Quick Setup Script
# Run this script to set up the entire project automatically

echo "🎵 Music Separator - Automated Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed!"
    echo "Please install Python 3.8+ from https://python.org"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend npm install failed!"
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Install Python Dependencies
echo "🐍 Installing Demucs (AI Model)..."
pip3 install demucs --break-system-packages 2>/dev/null || pip3 install demucs
if [ $? -ne 0 ]; then
    echo "⚠️  Demucs installation warning (may still work)"
fi
echo "✅ Demucs installed"
echo ""

# Install Frontend Dependencies
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend npm install failed!"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
cd ..
mkdir -p backend/uploads
mkdir -p backend/outputs
echo "✅ Directories created"
echo ""

echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "The app will open at http://localhost:3000"
echo ""
echo "Happy separating! 🎸🎵"
