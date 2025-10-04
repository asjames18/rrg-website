# 🔧 How to Add Admin Role

## Quick Methods to Promote Users to Admin

### **Method 1: Admin Promotion Tool (Easiest)**
1. Visit: `http://localhost:4321/admin-promote`
2. Enter the user's email address
3. Enter admin secret: `rrg-admin-2024`
4. Click "Promote to Admin"

### **Method 2: Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Find the user by email
4. Click **Edit** on their profile
5. In the **Raw User Meta Data** section, add:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save changes

### **Method 3: SQL Editor (Supabase)**
1. Go to **SQL Editor** in Supabase dashboard
2. Run this query:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'user@example.com';
   ```

### **Method 4: Admin Dashboard (If Already Admin)**
1. Sign in as an existing admin
2. Go to `/profile`
3. Click the **Admin Panel** tab
4. Find the user in the User Management section
5. Change their role dropdown to "Admin"

---

## 🔐 **Making Your First Admin**

Since you need at least one admin to start, here are the recommended steps:

### **Step 1: Create Your Account**
1. Go to `http://localhost:4321/auth`
2. Sign up with your email
3. Confirm your email (check your inbox)

### **Step 2: Promote Yourself to Admin**
Choose one of these methods:

#### **Option A: Use the Promotion Tool**
1. Visit `http://localhost:4321/admin-promote`
2. Enter your email
3. Enter secret: `rrg-admin-2024`
4. Click "Promote to Admin"

#### **Option B: Use Supabase Dashboard**
1. Go to Supabase → Authentication → Users
2. Find your email
3. Edit → Raw User Meta Data → Add `{"role": "admin"}`
4. Save

#### **Option C: Use SQL**
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### **Step 3: Verify Admin Access**
1. Sign out and sign back in
2. Go to `/profile`
3. You should see an "Admin Panel" tab
4. You should see your role as "Admin" in the profile card

---

## 🛡️ **Security Notes**

### **Admin Secret**
- The promotion tool uses a simple secret: `rrg-admin-2024`
- **Change this in production!** Update it in `/src/pages/api/promote-to-admin.ts`
- Consider using environment variables for production

### **Role Hierarchy**
- **Admin**: Full access to everything
- **Editor**: Can create/edit content, manage users
- **Viewer**: Can view content, basic access

### **Best Practices**
1. **Limit admin access** - Only promote trusted users
2. **Use strong passwords** - Especially for admin accounts
3. **Regular audits** - Review who has admin access
4. **Change secrets** - Update admin secrets regularly

---

## 🚨 **Troubleshooting**

### **"User not found" Error**
- Make sure the user has created an account first
- Check the email spelling exactly
- User must have confirmed their email

### **"Invalid admin secret" Error**
- Use the exact secret: `rrg-admin-2024`
- Check for typos or extra spaces

### **Admin Panel Not Showing**
- Sign out and sign back in after promotion
- Check that the role was actually updated in the database
- Clear browser cache if needed

### **Permission Denied Errors**
- Make sure you're using the correct Supabase service role key
- Check that RLS policies are set up correctly
- Verify the user exists in the profiles table

---

## 📋 **Quick Reference**

| Method | Difficulty | Speed | Best For |
|--------|------------|-------|----------|
| Promotion Tool | Easy | Fast | Quick promotions |
| Supabase Dashboard | Medium | Medium | One-off promotions |
| SQL Editor | Hard | Fast | Bulk operations |
| Admin Dashboard | Easy | Fast | Ongoing management |

---

## 🎯 **Next Steps After Getting Admin Access**

1. **Test admin features** - Try the admin dashboard
2. **Promote other users** - Make editors/admins as needed
3. **Configure settings** - Set up site preferences
4. **Create content** - Start adding posts, videos, etc.
5. **Manage users** - Use the user management tools

You're now ready to fully manage your Real & Raw Gospel website! 🚀


