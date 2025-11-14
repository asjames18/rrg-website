# ✅ VAPID Keys Test Guide

## Status Check

✅ **VAPID Keys Configured:**
- `PUBLIC_VAPID_PUBLIC_KEY`: `BAN-9oUD...` (starts with 'B' ✅)
- `VAPID_PRIVATE_KEY`: `cNhwipUj...` (configured ✅)

✅ **Code Updated:**
- `NotificationPrompt.tsx` reads from `import.meta.env.PUBLIC_VAPID_PUBLIC_KEY`
- Push notification service is ready

---

## 🧪 Manual Testing Steps

### 1. Start Your Dev Server
```bash
npm run dev
```

### 2. Open Test Page
Navigate to: **http://localhost:4321/test-pwa**

This page will show:
- ✅ Environment variable status (should show both keys configured)
- ✅ Browser support check
- ✅ Service worker status
- ✅ Push notification test buttons

### 3. Test Push Notifications

**Step 1: Request Permission**
- Click "Request Permission" button
- Browser will ask for notification permission
- Click "Allow"

**Step 2: Subscribe**
- Click "Subscribe to Push" button
- Check console for: `[NotificationPrompt] Subscribed successfully`
- Should see: `[Push] Subscribed: PushSubscription {...}`

**Step 3: Send Test Notification**
- Click "Send Test Notification" button
- You should see a notification appear!

---

## 🔍 Quick Verification

### Check Environment Variables Loaded

Open browser console and run:
```javascript
console.log('VAPID Key:', import.meta.env.PUBLIC_VAPID_PUBLIC_KEY);
```

**Expected:** Should print your public key starting with `BAN-9oUD...`

**If undefined:** Restart your dev server after creating `.env` file

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Test page shows both keys as "Configured"
2. ✅ Browser support shows all green checkmarks
3. ✅ Service worker shows "Active"
4. ✅ After subscribing, console shows: `Subscribed successfully`
5. ✅ Test notification appears when clicked

---

## 🐛 Troubleshooting

### "VAPID public key not configured"
- **Fix:** Restart dev server: `npm run dev`
- **Check:** `.env` file exists in project root
- **Verify:** Key name is exactly `PUBLIC_VAPID_PUBLIC_KEY`

### "Service Worker not active"
- **Fix:** Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- **Check:** Browser console for service worker errors
- **Verify:** Site is served over HTTPS (or localhost)

### "Permission denied"
- **Fix:** Go to browser settings → Site Settings → Notifications → Allow
- **Or:** Click the lock icon in address bar → Permissions → Notifications → Allow

---

## 📱 Test on Mobile

1. **Find your local IP:**
   ```bash
   ipconfig getifaddr en0  # Mac
   # or check Network settings
   ```

2. **Access from phone:**
   - Open: `http://YOUR_IP:4321/test-pwa`
   - Must be on same WiFi network

3. **Test PWA installation:**
   - iOS Safari: Share → Add to Home Screen
   - Android Chrome: Menu → Install App

---

## 🎉 You're All Set!

Your VAPID keys are configured correctly. Just:
1. Start dev server: `npm run dev`
2. Visit: `http://localhost:4321/test-pwa`
3. Test the buttons!

**Everything should work! 🚀**

