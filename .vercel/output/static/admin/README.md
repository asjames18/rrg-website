# Decap CMS Setup Guide
**Real & Raw Gospel - Content Management System**

## 🎯 What is Decap CMS?

Decap CMS (formerly Netlify CMS) is a **git-based content management system** that allows non-developers to edit content through a web interface. All changes are committed to Git and trigger automatic deployments.

## 🚀 Quick Start

### 1. Access the CMS

Once deployed, visit:
```
https://your-domain.com/admin/
```

**First time?** 
1. Enter the admin passcode (default dev: `rrg-dev`, change for production)
2. Authenticate with GitHub to edit content

**Note:** The passcode is a simple gate to reduce casual access. Real security is GitHub OAuth. See `/ADMIN_GATE_README.md` for details.

### 2. GitHub OAuth Setup (Required)

To allow editors to log in, you need to configure GitHub OAuth:

#### Option A: Netlify (Recommended)
If deploying to Netlify, OAuth is automatic! Just:
1. Deploy your site to Netlify
2. Enable Identity in Netlify dashboard
3. Enable Git Gateway in Identity settings
4. Update `config.yml` backend to:
   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

#### Option B: Vercel/Other Hosts
Use **GitHub OAuth App**:

1. **Create OAuth App in GitHub:**
   - Go to: https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in:
     - **Application name:** RRG CMS
     - **Homepage URL:** `https://your-domain.com`
     - **Authorization callback URL:** `https://api.netlify.com/auth/done`
   - Save and note your **Client ID** and **Client Secret**

2. **Set up OAuth Provider:**
   - Use [Netlify's OAuth service](https://github.com/vencax/netlify-cms-github-oauth-provider) (free)
   - Or deploy your own OAuth server
   - Or use a service like [decap-cms-oauth-provider](https://www.npmjs.com/package/decap-server)

3. **Update config.yml** if using a custom OAuth provider

### 3. Test Locally (Optional)

To test CMS locally without OAuth:

```bash
# Install local backend server
npx decap-server

# In another terminal, run your dev server
npm run dev

# Uncomment in config.yml:
# local_backend: true

# Access at: http://localhost:4321/admin/
```

## 📝 Content Collections

### Blog Posts
- **Path:** `src/content/blog/`
- **Fields:** title, slug, tags, summary, publishedAt, readingTime, body
- **Format:** MDX (Markdown with frontmatter)

**Sacred Names Reminder:**
Always use proper capitalization:
- ✅ YAHUAH (not Yahuah)
- ✅ YAHUSHA (not Yahusha)  
- ✅ RUACH HAQODESH (not Ruach Haqodesh)
- ✅ EL ELYON (not El Elyon)

### Videos
- **Path:** `src/content/videos/`
- **Fields:** title, slug, platform, videoId, series, topics, scriptures, publishedAt
- **Platforms:** YouTube, TikTok, Instagram, Facebook

**Video ID Examples:**
- YouTube: `dQw4w9WgXcQ` (from URL: youtube.com/watch?v=**dQw4w9WgXcQ**)
- TikTok: `7123456789012345678` (from URL)
- Instagram: `CXgVI_xPQzs` (from URL: instagram.com/p/**CXgVI_xPQzs**/)
- Facebook: Full video URL (will be encoded automatically)

### Books
- **Path:** `src/content/books/`
- **Fields:** title, author, slug, affiliate (label/url/merchant), topics, body
- **Use for:** Recommended resources with affiliate links

### Music
- **Path:** `src/content/music/`
- **Fields:** title, slug, type (audio/video), audioSrc, platform, videoId, scriptures
- **Types:**
  - **Audio:** Upload MP3 to `/public/audio/` and reference path
  - **Video:** Embed from YouTube/TikTok/etc.

## 📁 Media Uploads

**Upload folder:** `public/uploads/`  
**Public URL:** `/uploads/filename.jpg`

Uploaded images are automatically committed to Git.

## 🔄 How It Works

1. **Edit Content:** Use the CMS web interface
2. **Save:** Changes are committed to GitHub (branch: `main`)
3. **Deploy:** Vercel/Netlify detects the commit and rebuilds the site
4. **Live:** Changes appear on the site (usually within 1-2 minutes)

## 👥 User Management

### Netlify (with Identity)
- Add users in Netlify dashboard → Identity → Invite users
- Users receive email invitation
- They log in with email/password

### GitHub OAuth (Direct)
- Any GitHub user with repo access can edit
- Manage access via GitHub repo settings → Collaborators

### Recommended Roles
- **Admin:** Full access to all collections
- **Editor:** Can create/edit blog posts and videos
- **Contributor:** Can create drafts (requires editorial workflow)

## 🎨 Editorial Workflow (Optional)

Enable draft → review → publish workflow:

1. Uncomment in `config.yml`:
   ```yaml
   publish_mode: editorial_workflow
   ```

2. Now editors can:
   - Save as **Draft**
   - Move to **In Review**
   - **Publish** when ready

3. Each status creates a separate branch/PR

## 🛠️ Customization

### Change Repository
Update in `config.yml`:
```yaml
backend:
  repo: YOUR_USERNAME/YOUR_REPO_NAME
  branch: main # or your default branch
```

### Update Site URL
Update in `config.yml`:
```yaml
site_url: https://your-actual-domain.com
display_url: https://your-actual-domain.com
```

### Add Custom Fields
Edit `config.yml` and add fields to collections:
```yaml
- { label: "Featured", name: "featured", widget: "boolean", default: false }
- { label: "Cover Image", name: "coverImage", widget: "image", required: false }
```

## 🐛 Troubleshooting

### "Login Error" or OAuth Issues
- ✅ Check GitHub OAuth app callback URL
- ✅ Verify Client ID/Secret are correct
- ✅ Ensure backend.repo matches your actual repo

### "Not Found" when accessing /admin/
- ✅ Ensure `public/admin/index.html` and `config.yml` exist
- ✅ Rebuild and redeploy your site
- ✅ Check browser console for errors

### Changes Not Appearing
- ✅ Check GitHub commits (should see CMS commit messages)
- ✅ Verify Vercel/Netlify deployment succeeded
- ✅ Check build logs for errors

### Local Development
- ✅ Use `npx decap-server` for local testing
- ✅ Enable `local_backend: true` in config.yml
- ✅ No OAuth required for local testing

## 📚 Resources

- [Decap CMS Docs](https://decapcms.org/docs/)
- [GitHub OAuth Setup](https://decapcms.org/docs/github-backend/)
- [Widget Reference](https://decapcms.org/docs/widgets/)
- [Custom Previews](https://decapcms.org/docs/customization/)

## ⚠️ Important Notes

1. **Git-Based:** All content is stored in Git (no database)
2. **Real-Time:** Changes trigger immediate deployments
3. **Secure:** OAuth ensures only authorized users can edit
4. **Version Control:** Full Git history of all edits
5. **Sacred Names:** Always use proper capitalization for divine names

---

**Need Help?** Check the Decap CMS documentation or GitHub issues.

