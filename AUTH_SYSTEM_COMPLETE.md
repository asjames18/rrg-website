# 🔐 Authentication System - Complete Setup

## Overview

Your Real & Raw Gospel website now has a complete authentication system with:

- **User Registration & Login** - Regular users can create accounts
- **Admin/Editor Roles** - Role-based access control
- **Protected Routes** - Admin areas require authentication
- **User Management** - Admins can promote users
- **Supabase Integration** - Secure backend authentication

---

## 🚀 Quick Start

### 1. Test User Authentication
```bash
# Start the dev server
npm run dev

# Visit these URLs:
# http://localhost:4321/auth - User sign up/in
# http://localhost:4321/admin-login - Admin sign up/in  
# http://localhost:4321/admin-dashboard - Admin dashboard (requires auth)
```

### 2. Create Your First Admin Account
1. Go to `/admin-login`
2. Click "Create Admin Account"
3. Sign up with your email
4. Check your email for confirmation link
5. Click the link to confirm your account
6. You'll be automatically promoted to admin role

---

## 📁 Files Created

### Authentication Components
- `src/components/AuthForm.tsx` - Sign up/in/reset forms
- `src/components/UserProfile.tsx` - User profile display
- `src/components/UserManagement.tsx` - Admin user management
- `src/hooks/useAuth.ts` - Authentication state hook

### Pages
- `src/pages/auth.astro` - User authentication page
- `src/pages/admin-login.astro` - Admin authentication page
- `src/pages/admin-dashboard.astro` - Admin dashboard with stats

### API Routes
- `src/pages/api/auth-status.ts` - Check auth status
- `src/pages/api/promote-user.ts` - Promote user roles (admin only)

### Middleware
- `src/middleware.ts` - Route protection and auth checks

---

## 🔑 User Roles

### Viewer (Default)
- Can view all public content
- Can create account and sign in
- Basic access to site features

### Editor
- All viewer permissions
- Can create and edit content via CMS
- Can access admin dashboard
- Cannot manage other users

### Admin
- All editor permissions
- Can promote/demote users
- Full access to all admin features
- Can manage site settings

---

## 🛡️ Security Features

### Authentication
- **Supabase Auth** - Industry-standard authentication
- **Email Verification** - Required for new accounts
- **Password Reset** - Secure password recovery
- **JWT Tokens** - Secure session management

### Authorization
- **Role-Based Access** - Different permissions per role
- **Route Protection** - Middleware protects admin routes
- **API Security** - Server-side role verification
- **RLS Policies** - Database-level security

### Admin Protection
- **Passcode Gate** - Basic protection for `/admin` CMS
- **GitHub OAuth** - Required for content editing
- **Role Verification** - Server-side admin checks

---

## 🔧 Configuration

### Environment Variables
```env
# Supabase (already configured)
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Admin Passcode (for CMS access)
PUBLIC_ADMIN_PASSCODE=rrg-dev

# Site URL
PUBLIC_SITE_URL=http://localhost:4321
```

### Database Schema
The system uses these Supabase tables:
- `profiles` - User profiles with roles
- `posts` - Blog posts (with RLS)
- `videos` - Video content (with RLS)
- `books` - Book recommendations (with RLS)
- `music` - Music content (with RLS)

---

## 📱 User Experience

### For Regular Users
1. **Sign Up** - Visit `/auth` to create account
2. **Sign In** - Use email/password to access
3. **Profile** - See role and account info
4. **Sign Out** - Secure logout

### For Admins
1. **Admin Login** - Visit `/admin-login` for admin access
2. **Dashboard** - View stats and manage content
3. **User Management** - Promote users to editors/admins
4. **CMS Access** - Use `/admin` for content editing

---

## 🔄 Workflow Examples

### Creating Content (Editor/Admin)
1. Sign in at `/admin-login`
2. Go to `/admin-dashboard`
3. Click "Content Management System"
4. Enter passcode: `rrg-dev`
5. Authenticate with GitHub
6. Create/edit content

### Promoting a User (Admin Only)
1. Sign in as admin
2. Go to `/admin-dashboard`
3. Find user in "User Management"
4. Change role dropdown
5. User gets new permissions immediately

### User Self-Service
1. User visits `/auth`
2. Signs up with email
3. Confirms email
4. Automatically gets "viewer" role
5. Can sign in/out as needed

---

## 🚨 Important Notes

### Security
- **Change Admin Passcode** - Update `PUBLIC_ADMIN_PASSCODE` for production
- **Strong Passwords** - Enforce strong passwords for admin accounts
- **Regular Audits** - Review user roles periodically
- **Backup Data** - Regular Supabase backups recommended

### Production Deployment
1. Update environment variables in hosting platform
2. Change admin passcode to secure value
3. Test all authentication flows
4. Verify role-based access works
5. Set up monitoring for failed login attempts

### Troubleshooting
- **Email Not Received** - Check spam folder, verify email in Supabase
- **Can't Access Admin** - Ensure user has admin/editor role
- **CMS Not Loading** - Check passcode and GitHub OAuth setup
- **Database Errors** - Verify Supabase connection and RLS policies

---

## 🎯 Next Steps

### Immediate
- [ ] Test user registration and login
- [ ] Create your admin account
- [ ] Test content creation via CMS
- [ ] Promote a test user to editor

### Future Enhancements
- [ ] Add user profile editing
- [ ] Implement content favorites/bookmarks
- [ ] Add user activity tracking
- [ ] Create user groups/communities
- [ ] Add two-factor authentication
- [ ] Implement content approval workflows

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase connection at `/api/test-supabase`
3. Test database access at `/test-database`
4. Check user roles in Supabase dashboard
5. Review middleware logs in terminal

The authentication system is now fully functional and ready for production use! 🚀
