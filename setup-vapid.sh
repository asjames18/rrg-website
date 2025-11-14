#!/bin/bash

echo "🔑 VAPID Keys Setup for Real & Raw Gospel PWA"
echo "=============================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file already exists"
    echo ""
    read -p "Do you want to update it? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env update"
        exit 0
    fi
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
fi

echo ""
echo "Please paste your VAPID keys below:"
echo ""
read -p "Enter your PUBLIC VAPID key (starts with 'B'): " PUBLIC_KEY
read -p "Enter your PRIVATE VAPID key: " PRIVATE_KEY

# Update .env file
sed -i '' "s|PUBLIC_VAPID_PUBLIC_KEY=.*|PUBLIC_VAPID_PUBLIC_KEY=$PUBLIC_KEY|" .env
sed -i '' "s|VAPID_PRIVATE_KEY=.*|VAPID_PRIVATE_KEY=$PRIVATE_KEY|" .env

echo ""
echo "✅ VAPID keys added to .env file!"
echo ""
echo "Next steps:"
echo "1. Restart your dev server: npm run dev"
echo "2. Open the site and test push notifications"
echo "3. Check console for: [NotificationPrompt] Subscribed successfully"
echo ""
echo "For production deployment, add these keys to your hosting provider's environment variables."
echo ""
