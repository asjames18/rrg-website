# Admin Passcode Gate

## Overview

A minimal client-side passcode gate protects `/admin/` from casual visitors. This is **NOT real security**—it's just a deterrent to prevent random people from stumbling into the CMS interface.

**Real security:** GitHub OAuth in Decap CMS (users must authenticate with GitHub to make changes).

---

## How It Works

1. **First visit to `/admin/`:**
   - User sees passcode prompt
   - Must enter correct passcode
   - Wrong passcode → redirect to `/`
   - Correct passcode → stores flag in `localStorage` and loads CMS

2. **Subsequent visits:**
   - Checks `localStorage` for `rrg_admin_ok` flag
   - If present, skips passcode and loads CMS directly
   - If cleared, prompts for passcode again

3. **After passcode:**
   - Decap CMS loads
   - User must authenticate with GitHub to edit content
   - GitHub OAuth is the **real** security layer

---

## Default Passcode

**Development:** `rrg-dev`

⚠️ **Change this before deploying to production!**

---

## Changing the Passcode

### Option 1: Environment Variable (Recommended for Production)

Set an environment variable in your deployment platform:

**Netlify:**
```bash
# In Netlify dashboard:
Site settings → Environment variables → Add variable

Key: PUBLIC_ADMIN_PASSCODE
Value: your-secure-passcode-here
```

**Vercel:**
```bash
# In Vercel dashboard:
Settings → Environment Variables → Add

Key: PUBLIC_ADMIN_PASSCODE
Value: your-secure-passcode-here
```

**Local `.env` file:**
```bash
# Create .env in project root (already gitignored)
PUBLIC_ADMIN_PASSCODE=your-dev-passcode
```

The code automatically reads: `import.meta.env?.PUBLIC_ADMIN_PASSCODE`

### Option 2: Hardcoded (Quick but Less Secure)

Edit `public/admin/index.html` line 109:

```javascript
// Before:
const PASSCODE = import.meta.env?.PUBLIC_ADMIN_PASSCODE || 'rrg-dev';

// After:
const PASSCODE = import.meta.env?.PUBLIC_ADMIN_PASSCODE || 'YourNewPasscode123';
```

⚠️ **Warning:** Hardcoded passcodes are visible in source code. Anyone can inspect the HTML and see the passcode. Use environment variables for better security.

---

## Resetting Access

### Clear passcode for a specific browser:
```javascript
// In browser console (F12 → Console tab):
localStorage.removeItem('rrg_admin_ok');
```

Then refresh `/admin/` to re-prompt for passcode.

### Clear for all users:
Change the passcode (see above). Existing users will need the new passcode.

---

## Features

✅ **One-time prompt per browser**  
✅ **Enter key support**  
✅ **Wrong passcode redirects to home**  
✅ **Branded UI matching site theme**  
✅ **Reminder that GitHub auth is still required**  
✅ **Works with or without environment variables**  

---

## Security Notes

### This is NOT Real Security

The passcode gate is **client-side JavaScript**. Anyone with browser dev tools can:
- View the source and see the passcode (if hardcoded)
- Modify localStorage to bypass the gate
- Disable JavaScript to skip the check

### Why Use It?

**Purpose:**
- Prevent **casual visitors** from accidentally finding the CMS
- Reduce **bots** from crawling `/admin/`
- Add a **simple barrier** before the real auth

### The Real Security

**GitHub OAuth in Decap CMS:**
- Users must have GitHub account
- Must be repo collaborator OR use Netlify Identity
- All commits are attributed to their GitHub account
- Full audit trail of who changed what

**The passcode gate is just the front door. GitHub OAuth is the vault.**

---

## User Experience

### First-time visitor to `/admin/`:
1. Sees branded passcode form
2. Enters passcode
3. If correct: CMS loads → GitHub login screen
4. Authenticates with GitHub
5. Can edit content

### Returning visitor:
1. Visits `/admin/`
2. CMS loads immediately (passcode saved)
3. GitHub login (if not already logged in)
4. Can edit content

### Wrong passcode:
1. Shows error: "Incorrect passcode. Redirecting..."
2. Waits 1.5 seconds
3. Redirects to homepage `/`

---

## Troubleshooting

### "Passcode doesn't work"
- Check if you set the environment variable correctly
- Verify the fallback passcode in `index.html` (line 109)
- Clear browser cache and try again

### "Keeps asking for passcode"
- localStorage might be disabled in browser
- Browser in private/incognito mode (clears localStorage on close)
- Browser settings blocking localStorage

### "Want to bypass passcode in dev"
Temporarily set localStorage manually:
```javascript
// In browser console:
localStorage.setItem('rrg_admin_ok', '1');
```

Then refresh page.

---

## Production Checklist

Before deploying:

- [ ] Set `PUBLIC_ADMIN_PASSCODE` environment variable
- [ ] Test passcode works on staging
- [ ] Verify wrong passcode redirects
- [ ] Confirm GitHub OAuth still required after passcode
- [ ] Share passcode securely with authorized editors (1Password, etc.)
- [ ] Document passcode in team password manager

---

## Code Location

**File:** `public/admin/index.html`

**Key functions:**
- `checkPasscode()` - Validates input
- `removeGate()` - Hides passcode form
- `loadCMS()` - Dynamically loads Decap CMS script

**localStorage key:** `rrg_admin_ok`

**Default passcode:** `rrg-dev` (change in production!)

---

## Removing the Gate

If you want to remove the passcode gate entirely:

1. Replace `public/admin/index.html` with simple version:
   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="utf-8"/>
       <meta name="viewport" content="width=device-width,initial-scale=1"/>
       <title>RRG Admin</title>
       <link rel="icon" href="/rrg-logo.jpg" type="image/jpeg" />
     </head>
     <body>
       <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
     </body>
   </html>
   ```

2. Redeploy

**Note:** Only GitHub-authenticated users can edit, but anyone can see the CMS login screen.

---

## Example: Setting Passcode for Production

### Netlify Deployment

```bash
# 1. Deploy site to Netlify
netlify deploy --prod

# 2. Set environment variable
# In Netlify dashboard:
# Site → Settings → Environment Variables
# Add: PUBLIC_ADMIN_PASSCODE = YourSecurePass123!

# 3. Trigger rebuild
# Netlify will inject the env var during build

# 4. Test
# Visit https://your-site.netlify.app/admin/
# Enter: YourSecurePass123!
# Should load CMS → GitHub login
```

### Vercel Deployment

```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Set environment variable
# In Vercel dashboard:
# Project → Settings → Environment Variables
# Add: PUBLIC_ADMIN_PASSCODE = YourSecurePass123!
# Scope: Production

# 3. Redeploy to apply env var
vercel --prod

# 4. Test
# Visit https://your-site.vercel.app/admin/
```

---

## Summary

✅ **Added:** Client-side passcode gate at `/admin/`  
✅ **Default:** `rrg-dev` (change for production)  
✅ **Storage:** `localStorage` (per-browser)  
✅ **Security:** GitHub OAuth still required for edits  
✅ **Purpose:** Reduce casual/bot access  

**Not a replacement for real authentication—just a simple barrier.**

Share the passcode securely with authorized team members only.

