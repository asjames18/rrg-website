# 🗄️ Supabase Setup Complete

## What Was Added

Supabase integration for Real & Raw Gospel with PostgreSQL database, authentication, and file storage.

---

## 📦 Installation

**1. Install Supabase client:**
```bash
npm install @supabase/supabase-js
```

**2. Create `.env` file in project root:**
```bash
# Copy from .env.example
cp .env.example .env
```

**3. Add your Supabase credentials to `.env`:**
```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
PUBLIC_ADMIN_PASSCODE=your-secure-passcode
PUBLIC_SITE_URL=http://localhost:4321
```

---

## 🗃️ Database Schema

Your Supabase database now has:

### Tables

**`public.profiles`** - User profiles
- `id` - UUID (references auth.users)
- `email` - Text (unique)
- `role` - admin | editor | viewer
- `created_at` - Timestamp

**`public.posts`** - Blog posts
- `id`, `title`, `slug`, `summary`, `body_md`
- `tags[]`, `published`, `published_at`
- `author` (references profiles)

**`public.videos`** - Video content
- `id`, `title`, `slug`, `platform`, `video_id`
- `series[]`, `topics[]`, `scriptures[]`, `notes_md`
- `published`, `published_at`

**`public.books`** - Recommended books
- `id`, `title`, `slug`, `author_name`
- `affiliate_label`, `affiliate_url`, `affiliate_merchant`
- `topics[]`, `body_md`

**`public.music`** - Music/audio
- `id`, `title`, `slug`, `type` (audio|video)
- `audio_src`, `platform`, `video_id`
- `scriptures[]`, `notes_md`

### Security (RLS)

**Row Level Security enabled on all tables:**
- ✅ Public can read published content
- ✅ Only admins/editors can write
- ✅ Automatic profile creation on signup

---

## 📁 Files Created

```
src/lib/
├── supabase.ts           # Browser client (public operations)
└── supabase-server.ts    # Server client (admin operations)

.env.example              # Environment variables template
```

---

## 🔧 Usage Examples

### Reading Published Posts (Browser)

```typescript
import { supabase } from '../lib/supabase';

// Get all published posts
const { data: posts, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false });
```

### Server-Side Operations (Astro)

```astro
---
import { supabaseServer } from '../lib/supabase-server';

// Bypass RLS to get ALL posts (build time)
const { data: allPosts } = await supabaseServer
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });
---
```

### Authentication

```typescript
import { supabase } from '../lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

### Upload to Storage

```typescript
import { supabase } from '../lib/supabase';

// Upload file to 'media' bucket
const { data, error } = await supabase.storage
  .from('media')
  .upload('logos/rrg-logo.jpg', file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('media')
  .getPublicUrl('logos/rrg-logo.jpg');
```

---

## 🔐 User Roles

**Viewer** (default)
- Can read published content
- Can authenticate and comment (if implemented)

**Editor**
- All viewer permissions
- Can create/edit content
- Can publish own content

**Admin**
- All editor permissions
- Can manage users
- Can publish/unpublish any content
- Full database access

**To promote a user to admin/editor:**
```sql
-- In Supabase SQL Editor
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

---

## 🚀 Migration Strategy

You have two options:

### Option A: Keep MDX Files (Hybrid)
- Keep existing MDX files for content
- Use Supabase for user features (auth, comments, etc.)
- Gradually migrate content to database

### Option B: Migrate to Database
- Import existing MDX content to Supabase tables
- Use Supabase as single source of truth
- Remove MDX files after migration

**Recommendation:** Start with Option A (hybrid), then migrate when ready.

---

## 📊 Next Steps

### 1. Verify Setup

```bash
# Install dependencies
npm install

# Restart dev server
npm run dev
```

### 2. Test Connection

Create `src/pages/api/test-supabase.ts`:
```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.from('posts').select('count');
  
  return new Response(JSON.stringify({
    success: !error,
    count: data?.[0]?.count || 0,
    error: error?.message
  }));
};
```

Visit: `http://localhost:4321/api/test-supabase`

### 3. Create First User

Use Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. Check database → `profiles` table (should auto-create)
5. Update role to `admin` via SQL editor

### 4. Create Sample Content

In Supabase Dashboard → SQL Editor:
```sql
insert into public.posts (title, slug, summary, body_md, tags, published, published_at)
values (
  'Test Post from Supabase',
  'test-post-from-supabase',
  'This is a test post created in the database',
  '# Hello from Supabase\n\nThis content is stored in PostgreSQL!',
  array['Testing', 'Supabase'],
  true,
  now()
);
```

---

## 🔗 Integration with Existing Site

### Update Blog Index

```astro
---
// src/pages/blog/index.astro
import { supabase } from '../../lib/supabase';
import type { Post } from '../../lib/supabase';

// Get posts from Supabase instead of MDX
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
  .order('published_at', { ascending: false });
---

<Base title="Blog">
  {posts?.map((post: Post) => (
    <article>
      <h2>{post.title}</h2>
      <p>{post.summary}</p>
      <a href={`/blog/${post.slug}`}>Read more</a>
    </article>
  ))}
</Base>
```

### Update Blog Detail

```astro
---
// src/pages/blog/[slug].astro
import { supabase } from '../../lib/supabase';
import { marked } from 'marked'; // npm install marked

export async function getStaticPaths() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('published', true);
  
  return posts?.map(post => ({ params: { slug: post.slug } })) || [];
}

const { slug } = Astro.params;
const { data: post } = await supabase
  .from('posts')
  .select('*')
  .eq('slug', slug)
  .single();

const content = post?.body_md ? marked(post.body_md) : '';
---

<Base title={post?.title}>
  <h1>{post?.title}</h1>
  <div set:html={content} />
</Base>
```

---

## 🛡️ Security Best Practices

✅ **Environment Variables**
- Never commit `.env` to Git
- Use different keys for dev/production
- Rotate service role key periodically

✅ **Row Level Security**
- Always enabled on public tables
- Test policies thoroughly
- Never bypass RLS in browser code

✅ **Authentication**
- Use email confirmation in production
- Implement password reset
- Enable 2FA for admins

✅ **API Keys**
- `anon key` → safe for browser
- `service_role key` → server-side ONLY

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Astro + Supabase Guide](https://docs.astro.build/en/guides/backend/supabase/)

---

## ✅ Checklist

- [ ] Created Supabase project
- [ ] Ran SQL schema in SQL Editor
- [ ] Created `media` storage bucket
- [ ] Added credentials to `.env`
- [ ] Ran `npm install`
- [ ] Tested connection at `/api/test-supabase`
- [ ] Created first admin user
- [ ] Inserted test content
- [ ] Updated blog pages to use Supabase

---

**Your database is ready! You now have authentication, storage, and a powerful PostgreSQL backend.** 🎯

