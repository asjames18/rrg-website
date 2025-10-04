# ✅ Admin Passcode Gate Added!

## What Was Done

Added a minimal client-side passcode gate to `/admin/` to prevent random visitors from accessing the CMS interface.

---

## Features

✅ **Passcode prompt** on first visit to `/admin/`  
✅ **localStorage persistence** - only asks once per browser  
✅ **Wrong passcode** → redirects to homepage  
✅ **Branded UI** matching site theme (gold/black)  
✅ **Enter key support** for quick access  
✅ **Environment variable** support for production  
✅ **GitHub OAuth** still required after passcode (real security)  

---

## Default Passcode

**Development:** `rrg-dev`

⚠️ **Change this before production deployment!**

---

## How It Works

### First Visit
1. User visits `/admin/`
2. Sees passcode form (branded with site colors)
3. Enters passcode
4. **Correct:** Saves to localStorage → loads CMS → GitHub login
5. **Wrong:** Shows error → redirects to `/` after 1.5 seconds

### Return Visits
- Checks localStorage for `rrg_admin_ok` flag
- If present: skips passcode, loads CMS directly
- If cleared: prompts for passcode again

### After Passcode
- Decap CMS loads
- User must authenticate with **GitHub** to edit
- GitHub OAuth is the **real security layer**

---

## Changing the Passcode

### Production (Environment Variable)

**Netlify:**
```
Settings → Environment Variables
PUBLIC_ADMIN_PASSCODE = YourSecurePasscode123
```

**Vercel:**
```
Settings → Environment Variables
PUBLIC_ADMIN_PASSCODE = YourSecurePasscode123
```

**Local `.env`:**
```bash
PUBLIC_ADMIN_PASSCODE=your-dev-passcode
```

### Quick Hardcode (Less Secure)

Edit `public/admin/index.html` line 109:
```javascript
const PASSCODE = import.meta.env?.PUBLIC_ADMIN_PASSCODE || 'YourNewPass';
```

⚠️ **Warning:** Hardcoded passcodes are visible in browser source.

---

## Security Notes

### This is NOT Real Security

The passcode is **client-side JavaScript**:
- Visible in browser source (if hardcoded)
- Bypassable with dev tools
- Not a replacement for authentication

### Why Use It?

**Purpose:**
- 🚫 Prevent casual visitors from finding CMS
- 🤖 Reduce bot crawling of `/admin/`
- 🚪 Simple barrier before real auth

### Real Security

**GitHub OAuth in Decap CMS:**
- Must have GitHub account
- Must be repo collaborator (or Netlify Identity user)
- All changes tracked in Git
- Full audit trail

**Passcode = Front door. GitHub OAuth = Vault.**

---

## User Flow

```
Visit /admin/
    ↓
Passcode prompt
    ↓
Enter: rrg-dev (or production passcode)
    ↓
✅ Correct → CMS loads
    ↓
GitHub login screen
    ↓
Authenticate with GitHub
    ↓
Edit content
```

**Wrong passcode:**
```
Enter wrong passcode
    ↓
Error: "Incorrect passcode. Redirecting..."
    ↓
Wait 1.5 seconds
    ↓
Redirect to /
```

---

## Testing

### Local Development

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:4321/admin/`

3. Enter passcode: `rrg-dev`

4. Should see Decap CMS load

5. Try wrong passcode → should redirect to home

### Clear and Re-test

```javascript
// Browser console (F12):
localStorage.removeItem('rrg_admin_ok');
// Then refresh /admin/
```

---

## Files Modified

### `public/admin/index.html`
- Added passcode gate overlay
- Added styles for form (branded gold/black)
- Added JavaScript for passcode check
- CMS loads dynamically after passcode

### Documentation Created
- ✅ `ADMIN_GATE_README.md` - Full documentation
- ✅ `ADMIN_GATE_SUMMARY.md` - This file

### Updated
- ✅ `public/admin/README.md` - Added passcode note

---

## Production Checklist

Before deploying:

- [ ] Set `PUBLIC_ADMIN_PASSCODE` environment variable
- [ ] Test passcode on staging
- [ ] Verify wrong passcode redirects
- [ ] Confirm GitHub OAuth still works
- [ ] Share passcode securely with team (1Password, etc.)
- [ ] Document in team wiki/password manager

---

## Troubleshooting

**Passcode not working?**
- Check environment variable is set
- Verify fallback in `index.html` line 109
- Clear browser cache

**Keeps asking for passcode?**
- localStorage disabled in browser
- Using private/incognito mode
- Browser blocking localStorage

**Want to bypass in dev?**
```javascript
localStorage.setItem('rrg_admin_ok', '1');
```

---

## Removing the Gate

To remove passcode gate entirely, replace `public/admin/index.html` with:

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

GitHub OAuth still required for edits.

---

## Example: Production Setup

```bash
# 1. Set environment variable in hosting dashboard
PUBLIC_ADMIN_PASSCODE=SecurePass2025!

# 2. Deploy site
git push origin main

# 3. Visit /admin/
https://your-site.com/admin/

# 4. Enter passcode: SecurePass2025!

# 5. GitHub login appears

# 6. Authenticate and edit!
```

---

## Acceptance Criteria ✅

| Requirement | Status |
|------------|--------|
| Passcode prompt on first visit | ✅ |
| localStorage persistence | ✅ |
| Wrong passcode redirects to `/` | ✅ |
| Correct passcode loads CMS | ✅ |
| GitHub auth still required | ✅ |
| Environment variable support | ✅ |
| Branded UI matching site | ✅ |
| Enter key works | ✅ |

---

## Summary

✅ **Added:** Client-side passcode gate  
✅ **Default:** `rrg-dev` (change for prod)  
✅ **Purpose:** Reduce casual access  
✅ **Security:** GitHub OAuth (real auth)  
✅ **Storage:** localStorage (per-browser)  

**The passcode is a simple deterrent. GitHub authentication is the real security.**

---

**Full details:** See `ADMIN_GATE_README.md`

**Ready to deploy!** Just set `PUBLIC_ADMIN_PASSCODE` in production.

