# 🧪 Authentication Testing Checklist

## Current Status
✅ Dev server is running on http://localhost:4321
✅ Signup API updated with fallback URLs
✅ Auth callback handler created
✅ Refresh token error handling fixed
✅ Browser module import fixed

---

## 🎯 Step-by-Step Testing Guide

### **Step 1: Check Supabase Settings** 

**Before testing, verify your Supabase configuration:**

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers** → **Email**
3. Check the **"Confirm email"** setting:
   - ✅ **DISABLED** = You can sign in immediately (RECOMMENDED for testing)
   - ❌ **ENABLED** = You need to check email or manually verify

**Quick Fix if Enabled:**
- Toggle **"Confirm email"** to OFF
- Click **Save**
- This allows instant sign-in without email verification

---

### **Step 2: Test Sign In (Existing Account)** ⚡

Since you already created an account, let's test signing in:

1. **Open**: http://localhost:4321/auth
2. **Click**: "Sign In" tab
3. **Enter**:
   - Email: `asjames18@gmail.com`
   - Password: [the password you used when signing up]
4. **Click**: "Sign In"

**Expected Results:**
- ✅ Success message appears
- ✅ Page redirects to home
- ✅ "Sign In" button changes to user menu with your email
- ✅ No console errors

**If it fails with "Email not confirmed":**
- Go back to Step 1 and disable email confirmation in Supabase
- OR manually verify your email in Supabase Dashboard → Users

---

### **Step 3: Test Sign Up (New Account)** 📝

Test creating a brand new account:

1. **Open**: http://localhost:4321/auth
2. **Click**: "Sign Up" tab
3. **Enter**:
   - Email: `test@example.com` (use a different email)
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
4. **Click**: "Create Account"

**Expected Results:**
- ✅ Success message: "Account created successfully!"
- ✅ Green notification appears
- ✅ Form clears
- ✅ No console errors

**Then Sign In with the new account:**
- Switch to "Sign In" tab
- Enter the new credentials
- Should sign in successfully

---

### **Step 4: Test Password Reset** 🔑

1. **Open**: http://localhost:4321/auth
2. **Click**: "Reset" tab
3. **Enter**: your email address
4. **Click**: "Send Reset Email"

**Expected Results:**
- ✅ Success message appears
- ✅ Check email for reset link (if email is configured)
- ✅ If email not configured, check Supabase logs

---

### **Step 5: Test Protected Routes** 🔒

Try accessing admin areas:

1. **Open**: http://localhost:4321/cms
2. **Expected**: Should redirect to `/auth` (if not signed in)
3. **Sign in** if needed
4. **Expected**: Should show access denied (unless you have admin role)

**To grant admin access:**
1. Go to Supabase Dashboard → Database → SQL Editor
2. Run this query (replace with your email):
```sql
-- Check if user exists
SELECT id, email FROM auth.users WHERE email = 'asjames18@gmail.com';

-- Create admin role (use the user ID from above)
INSERT INTO user_roles (user_id, role)
VALUES ('YOUR_USER_ID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

---

### **Step 6: Check Browser Console** 🔍

1. **Open**: http://localhost:4321/auth
2. **Open DevTools**: Press F12 or Cmd+Option+I
3. **Check Console tab**

**Expected Output:**
```
[SimpleAuthForm] Initializing...
[SimpleAuthForm] Supabase client available
[SimpleAuthForm] Hidden static loading fallback
[Supabase] Token refreshed successfully
```

**Should NOT see:**
- ❌ 404 errors for `/lib/supabase-browser`
- ❌ "Invalid Refresh Token" errors
- ❌ "refresh_token_already_used" errors
- ❌ Module resolution errors

---

### **Step 7: Test Sign Out** 👋

1. **After signing in**, look for your email in the header
2. **Click** on your profile/user menu
3. **Click** "Sign Out"
4. **Expected**:
   - ✅ Redirects to `/auth`
   - ✅ Success message or notification
   - ✅ User menu disappears
   - ✅ "Sign In" button reappears

---

## 🔧 Common Issues & Fixes

### Issue: "Email not confirmed"
**Fix**: Disable email confirmation in Supabase (see Step 1)

### Issue: "Invalid email or password"
**Possible causes**:
1. Wrong password
2. User doesn't exist yet
3. Email confirmation required but not done

**Fix**: 
- Try password reset
- Check Supabase Dashboard → Users to see if account exists
- Disable email confirmation

### Issue: 404 for supabase-browser
**Status**: ✅ FIXED - Dynamic import now used

### Issue: Refresh token errors
**Status**: ✅ FIXED - Better error handling added

### Issue: Can't access admin pages
**Fix**: Grant admin role (see Step 5)

---

## 📊 Verification Checklist

Check off each item as you test:

### Authentication Flows
- [ ] Sign up with new account
- [ ] Sign in with existing account
- [ ] Sign out
- [ ] Password reset flow

### Error Handling
- [ ] Invalid email shows error
- [ ] Weak password rejected
- [ ] Mismatched passwords rejected
- [ ] Invalid login credentials show friendly error

### Browser Functionality
- [ ] No console errors
- [ ] No 404 errors
- [ ] Auth state persists on page refresh
- [ ] User menu shows after sign in

### Server Functionality  
- [ ] Middleware protects admin routes
- [ ] Session cookies set correctly
- [ ] Refresh tokens work without errors

---

## 🚀 Quick Test Commands

Run these in the browser console to test:

```javascript
// Test 1: Check if Supabase client exists
import('../lib/supabase-browser.ts').then(({ getSupabase }) => {
  const supabase = getSupabase();
  console.log('✅ Supabase client loaded:', supabase);
});

// Test 2: Check current session
import('../lib/supabase-browser.ts').then(async ({ getSupabase }) => {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session);
  console.log('User email:', session?.user?.email);
});

// Test 3: Check auth state
import('../lib/supabase-browser.ts').then(({ getSupabase }) => {
  const supabase = getSupabase();
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    console.log('Session:', session);
  });
});
```

---

## 📝 Test Results

**Date**: _____________

**Sign Up**: ⬜ Pass ⬜ Fail  
**Sign In**: ⬜ Pass ⬜ Fail  
**Sign Out**: ⬜ Pass ⬜ Fail  
**Password Reset**: ⬜ Pass ⬜ Fail  
**Protected Routes**: ⬜ Pass ⬜ Fail  
**No Console Errors**: ⬜ Pass ⬜ Fail  

**Notes**:
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

## 🆘 Need Help?

If something isn't working:

1. **Check the terminal** where Astro is running for server errors
2. **Check browser console** for client-side errors  
3. **Check Supabase Dashboard** → Logs → Auth Logs
4. **Try the quick fixes** in the Common Issues section above

---

## ✅ Success Criteria

Your auth system is working perfectly if:

1. ✅ You can create new accounts
2. ✅ You can sign in with existing accounts
3. ✅ You can sign out successfully
4. ✅ Protected routes redirect to auth page
5. ✅ No refresh token errors in console
6. ✅ No 404 errors for supabase-browser
7. ✅ Auth state persists on page refresh
8. ✅ User menu shows email after sign in

**All items checked?** 🎉 Your authentication system is fully operational!

