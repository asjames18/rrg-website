# Decap CMS Deployment Checklist
**Real & Raw Gospel - Content Management System**

## ✅ Pre-Deployment Setup

### 1. Update Configuration
Before deploying, update these values in `/public/admin/config.yml`:

```yaml
backend:
  repo: asjames18/rrg-website # ✅ Already set - verify this matches your repo

site_url: https://rrg-website.netlify.app # ⚠️ UPDATE with your actual domain
display_url: https://rrg-website.netlify.app # ⚠️ UPDATE with your actual domain
```

### 2. Choose Your Deployment Method

#### Option A: Netlify (Easiest - Recommended)
**Automatic OAuth setup!**

1. **Deploy to Netlify:**
   ```bash
   # Option 1: Connect GitHub repo in Netlify dashboard
   # Option 2: Use Netlify CLI
   npm install -g netlify-cli
   netlify deploy --prod
   ```

2. **Enable Git Gateway:**
   - In Netlify dashboard → **Identity** → Enable
   - In **Identity** → Settings → **Services** → Enable Git Gateway
   - Update `config.yml`:
     ```yaml
     backend:
       name: git-gateway  # Change from 'github'
       branch: main
     ```

3. **Invite Users:**
   - Identity → **Invite users**
   - They receive email and set password
   - Access CMS at: `https://your-site.netlify.app/admin/`

#### Option B: Vercel/Other Hosts
**Requires manual OAuth setup**

1. **Create GitHub OAuth App:**
   - Go to: https://github.com/settings/developers
   - Click **New OAuth App**
   - Settings:
     - **Name:** RRG Content Manager
     - **Homepage:** `https://your-domain.com`
     - **Callback:** `https://api.netlify.com/auth/done`
   - Save **Client ID** and **Client Secret**

2. **Deploy OAuth Provider:**
   ```bash
   # Use Netlify's free OAuth service:
   # https://github.com/vencax/netlify-cms-github-oauth-provider
   
   # Deploy to serverless platform or use:
   npx decap-server
   ```

3. **Set Environment Variables:**
   In Vercel/hosting dashboard:
   - `GITHUB_CLIENT_ID` = your Client ID
   - `GITHUB_CLIENT_SECRET` = your Client Secret

4. **Keep backend as 'github' in config.yml**

## 🚀 Deployment Steps

### 1. Commit and Push
```bash
git add public/admin/
git commit -m "Add Decap CMS for content management"
git push origin main
```

### 2. Deploy Site
```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# Or just push to GitHub - auto-deploy should trigger
```

### 3. Verify CMS Access
- Visit: `https://your-domain.com/admin/`
- Should see Decap CMS login screen
- Test login with GitHub (or Netlify Identity)

### 4. Test Content Creation
1. Log in to CMS
2. Click **Blog Posts** → **New Blog Post**
3. Fill in fields:
   - Title: "Test Post"
   - Slug: "test-post"
   - Tags: ["Testing"]
   - Summary: "This is a test"
   - Published Date: (select today)
   - Reading Time: 3
   - Body: "# Test\n\nThis is a test post."
4. Click **Publish**
5. Check GitHub - should see new commit
6. Wait for deployment
7. Visit `/blog` - should see new post

## 🔐 User Access Management

### Netlify Identity Users
```bash
# In Netlify dashboard:
Identity → Invite users → enter email

# User receives invitation email
# They set password and can log in
```

### GitHub Collaborators
```bash
# In GitHub repo settings:
Settings → Collaborators → Add people

# They can log in with their GitHub account
```

## 📝 Post-Deployment Tasks

### 1. Create First Content
- [ ] Create 2-3 blog posts
- [ ] Add 1-2 videos
- [ ] Add sample book recommendation

### 2. Train Editors
Share these instructions:
1. Go to `https://your-domain.com/admin/`
2. Log in with GitHub or Netlify Identity
3. Click collection (Blog, Videos, etc.)
4. Click "New [Item]"
5. Fill in all required fields
6. Click "Publish" (or "Save Draft" if workflow enabled)
7. Wait 1-2 minutes for site to rebuild

### 3. Sacred Names Reminder for Editors
Always use proper capitalization:
- ✅ **YAHUAH** (the Father)
- ✅ **YAHUSHA** (the Messiah)
- ✅ **RUACH HAQODESH** (Holy Spirit)
- ✅ **EL ELYON** (Most High)
- ✅ **YAH** (shortened form)
- ✅ **MASHIACH** (the Anointed One)

### 4. Optional: Enable Editorial Workflow
In `config.yml`, add:
```yaml
publish_mode: editorial_workflow
```

Enables: Draft → In Review → Published workflow

## 🐛 Common Issues & Solutions

### Issue: "Login Error"
**Solution:**
- ✅ Check OAuth app callback URL matches
- ✅ Verify Client ID/Secret in environment variables
- ✅ Ensure backend.repo matches your actual repo name

### Issue: "Cannot read config.yml"
**Solution:**
- ✅ Verify file exists at `/public/admin/config.yml`
- ✅ Check YAML syntax (no tabs, proper indentation)
- ✅ Rebuild and redeploy

### Issue: Changes not appearing on site
**Solution:**
- ✅ Check GitHub commits (should see CMS commit message)
- ✅ Check deployment logs for errors
- ✅ Verify build succeeded
- ✅ Clear browser cache

### Issue: "Not authorized"
**Solution:**
- ✅ Ensure user has repo access (GitHub)
- ✅ Check user is invited (Netlify Identity)
- ✅ Verify Git Gateway is enabled (Netlify)

## 📱 Mobile Editing

Good news! Decap CMS works on mobile browsers:
- ✅ Responsive interface
- ✅ Works on iOS Safari, Chrome
- ✅ Can edit content on-the-go

## 🎯 Success Checklist

- [ ] `public/admin/index.html` exists
- [ ] `public/admin/config.yml` exists and is valid
- [ ] Repository name in config matches actual repo
- [ ] Site URL updated in config
- [ ] OAuth configured (GitHub App or Git Gateway)
- [ ] Site deployed to Netlify/Vercel
- [ ] Can access `/admin/` URL
- [ ] Can log in successfully
- [ ] Test content creation works
- [ ] Changes appear in GitHub commits
- [ ] Site rebuilds automatically
- [ ] Published content appears on site

## 📚 Quick Reference

**CMS URL:** `https://your-domain.com/admin/`  
**Config:** `/public/admin/config.yml`  
**Content:** `/src/content/[collection]/`  
**Uploads:** `/public/uploads/`  
**Docs:** https://decapcms.org/docs/

---

## Next Steps After Setup

1. **Customize CMS:**
   - Add custom preview templates
   - Add more fields as needed
   - Customize widget types

2. **Train Team:**
   - Share access with editors
   - Provide quick start guide
   - Emphasize Sacred Names capitalization

3. **Monitor:**
   - Check commit history
   - Review published content
   - Watch deployment logs

**Questions?** See `/public/admin/README.md` for detailed setup guide.

