# 🔑 VAPID Keys Setup Guide

## Step 1: Create Your .env File

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your VAPID keys to `.env`:
   ```env
   # Your keys will look like this (example):
   PUBLIC_VAPID_PUBLIC_KEY=BNxXZ...long-string...abc123
   VAPID_PRIVATE_KEY=aBcD123...different-string...xyz789
   ```

**Important Notes:**
- The **PUBLIC** key (starts with `B`) should be prefixed with `PUBLIC_` so Astro exposes it to the client
- The **PRIVATE** key should NOT have the `PUBLIC_` prefix (server-only)
- Never commit your `.env` file to Git (it's already in `.gitignore`)

---

## Step 2: Update the Notification Prompt Component

The component needs to read the public VAPID key from environment variables.

**File:** `src/components/mobile/NotificationPrompt.tsx`

Change line 57-59 from:
```typescript
// Subscribe to push (you'll need to provide your VAPID public key)
// const vapidKey = 'YOUR_VAPID_PUBLIC_KEY';
// await pushNotifications.subscribe(vapidKey);
```

To:
```typescript
// Subscribe to push with VAPID key from environment
const vapidKey = import.meta.env.PUBLIC_VAPID_PUBLIC_KEY;
if (vapidKey) {
  await pushNotifications.subscribe(vapidKey);
} else {
  console.warn('[NotificationPrompt] VAPID public key not configured');
}
```

---

## Step 3: Restart Your Development Server

After adding the `.env` file, restart your dev server to load the new environment variables:

```bash
npm run dev
```

---

## Step 4: Test Push Notifications

1. **Open your site** in the browser (must be HTTPS in production)
2. **Grant notification permission** when prompted
3. **Check the console** for successful subscription:
   ```
   [Push] Subscribed: PushSubscription {...}
   ```

---

## Step 5: Verify Environment Variables

Add this to any page temporarily to check if your keys are loaded:

```javascript
console.log('VAPID Public Key:', import.meta.env.PUBLIC_VAPID_PUBLIC_KEY);
// Should print your public key (starts with 'B')
```

**Security Note:** The public key is meant to be public (sent to client), but the private key must remain server-only.

---

## For Production Deployment

### Vercel
1. Go to your project settings → Environment Variables
2. Add both keys:
   - `PUBLIC_VAPID_PUBLIC_KEY` = your public key
   - `VAPID_PRIVATE_KEY` = your private key
3. Redeploy your site

### Netlify
1. Go to Site settings → Build & deploy → Environment
2. Add both keys as environment variables
3. Redeploy

### Other Hosts
Add the environment variables to your hosting provider's environment settings or use their CLI:

```bash
# Example for generic hosting
export PUBLIC_VAPID_PUBLIC_KEY="BNxXZ..."
export VAPID_PRIVATE_KEY="aBcD123..."
```

---

## Troubleshooting

### "VAPID public key not configured"
- Check that your `.env` file exists and is in the project root
- Verify the key name is exactly `PUBLIC_VAPID_PUBLIC_KEY`
- Restart your dev server after creating/editing `.env`

### "Failed to subscribe"
- Ensure you're using HTTPS (required for service workers)
- Check that notification permission was granted
- Verify the VAPID key format is correct (should start with 'B')

### "Subscription not saved"
- Check the API endpoint `/api/push/subscribe` is working
- Verify user authentication is working
- Check browser console for errors

---

## Optional: Send Test Notifications (Backend)

To send push notifications from your server, you'll need to use the `web-push` library:

```bash
npm install web-push
```

Then create a helper function:

```typescript
// src/lib/push/send-notification.ts
import webpush from 'web-push';

// Configure web-push with your keys
webpush.setVapidDetails(
  'mailto:your-email@example.com', // Contact email
  import.meta.env.PUBLIC_VAPID_PUBLIC_KEY,
  import.meta.env.VAPID_PRIVATE_KEY
);

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: { title: string; body: string; url?: string }
) {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    console.log('[Push] Notification sent');
  } catch (error) {
    console.error('[Push] Send failed:', error);
  }
}
```

---

## Security Best Practices

✅ **DO:**
- Keep your private key secret (server-only)
- Use environment variables for both keys
- Add `.env` to `.gitignore`
- Rotate keys if compromised

❌ **DON'T:**
- Commit `.env` to Git
- Expose private key to client-side code
- Hardcode keys in source files
- Share keys in public repositories

---

## Summary

1. ✅ Generate VAPID keys: `npx web-push generate-vapid-keys`
2. ✅ Create `.env` file with both keys
3. ✅ Update `NotificationPrompt.tsx` to use the public key
4. ✅ Restart dev server
5. ✅ Test push notifications
6. ✅ Add keys to production environment

**You're all set! 🎉**

