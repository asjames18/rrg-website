# 🗄️ Supabase SQL Setup Guide

## Quick Setup Instructions

### 1. **Open Supabase Dashboard**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### 2. **Run the SQL Setup**
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents of `supabase-setup.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute the SQL

### 3. **Verify Setup**
After running the SQL, you should see:
- ✅ 5 tables created: `profiles`, `posts`, `videos`, `books`, `music`
- ✅ Row Level Security enabled on all tables
- ✅ Policies created for role-based access
- ✅ Triggers set up for automatic profile creation
- ✅ Indexes created for performance

### 4. **Test the Setup**
1. Go to your website: `https://rrg-website.vercel.app/auth`
2. Create a new account
3. Check your email and confirm the account
4. You should automatically have a profile with `viewer` role

### 5. **Create Your First Admin**
1. Go to: `https://rrg-website.vercel.app/admin-promote`
2. Enter your email address
3. Enter admin secret: `rrg-admin-2024`
4. Click "Promote to Admin"
5. Sign out and sign back in
6. You should now see admin options!

---

## 🔍 **What This SQL Does**

### **Tables Created:**
- **`profiles`** - User accounts with roles (admin/editor/viewer)
- **`posts`** - Blog posts with markdown content
- **`videos`** - Video content from various platforms
- **`books`** - Book recommendations with affiliate links
- **`music`** - Music and audio content

### **Security Features:**
- **Row Level Security (RLS)** - Database-level access control
- **Role-based Policies** - Different permissions for different user types
- **Automatic Profile Creation** - Profiles created when users sign up
- **Secure Triggers** - Automatic timestamp updates

### **User Roles:**
- **`viewer`** - Can read published content (default)
- **`editor`** - Can create and edit content
- **`admin`** - Can manage users and all content

---

## 🚨 **Important Notes**

### **Environment Variables**
Make sure these are set in your `.env` file:
```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### **Admin Secret**
The admin promotion tool uses this secret:
- **Secret**: `rrg-admin-2024`
- **Location**: `/admin-promote` page

### **First Admin Account**
Since you need at least one admin to start:
1. Create your account at `/auth`
2. Use `/admin-promote` to promote yourself
3. Or manually update the database:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

---

## 🔧 **Troubleshooting**

### **If Tables Already Exist**
The SQL uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

### **If You Get Permission Errors**
Make sure you're running the SQL as the database owner (usually the case in Supabase).

### **If RLS Policies Don't Work**
Check that RLS is enabled:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### **If Profile Creation Fails**
Check the trigger:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## ✅ **Verification Checklist**

After running the SQL, verify:

- [ ] Can create new user accounts at `/auth`
- [ ] New users get `viewer` role automatically
- [ ] Can promote users to admin at `/admin-promote`
- [ ] Admin users can access `/admin-dashboard`
- [ ] Regular users cannot access admin routes
- [ ] Content tables are created and accessible
- [ ] RLS policies are working correctly

---

## 🎉 **You're All Set!**

Your Supabase database is now properly configured for the Real & Raw Gospel website with:
- ✅ Secure authentication
- ✅ Role-based access control
- ✅ Content management capabilities
- ✅ Automatic user profile creation
- ✅ Proper security policies

**Next step**: Test the login system and start creating content!
