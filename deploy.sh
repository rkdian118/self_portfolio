#!/bin/bash

echo "🚀 Starting deployment process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install all project dependencies
echo "📦 Installing all project dependencies..."
npm run install:all

# Build all projects
echo "🔨 Building all projects..."
npm run build

echo "✅ Deployment complete!"
echo "🌐 Your application is ready to run on a single port:"
echo "   - Main site: http://localhost:3000/"
echo "   - Admin panel: http://localhost:3000/admin"
echo "   - API: http://localhost:3000/api"
echo ""
echo "To start the server, run: npm start"