# Real & Raw Gospel Website Documentation

## 📁 Project Structure

```
rrg-website/
├── docs/                          # Documentation
│   ├── sql/                      # Database schemas and migrations
│   │   ├── CMS_SUPABASE_SCHEMA.sql
│   │   ├── MIGRATE_CONTENT_TO_SUPABASE.sql
│   │   └── FINAL_ADMIN_FIX.sql
│   ├── VIDEO_CMS_GUIDE.md        # Video content management guide
│   ├── MUSIC_CMS_GUIDE.md        # Music content management guide
│   └── ENVIRONMENT_SETUP.md      # Environment setup guide
├── public/                       # Static assets
│   ├── audio/                    # Audio files
│   ├── uploads/                  # User uploads
│   ├── favicon.svg
│   └── rrg-logo.jpg
├── src/
│   ├── components/               # React components
│   │   ├── admin/               # Admin interface components
│   │   ├── cms/                 # CMS components
│   │   ├── AudioPlayer.tsx      # Audio player component
│   │   ├── UniversalVideoEmbed.tsx # Video embed component
│   │   └── ...                  # Other components
│   ├── content/                 # Content collections
│   │   ├── blog/               # Blog posts
│   │   ├── books/              # Books
│   │   └── music/              # Music content
│   ├── layouts/                # Page layouts
│   ├── lib/                    # Utility libraries
│   │   ├── cms/               # CMS API libraries
│   │   ├── supabase.ts        # Supabase client
│   │   └── supabase-admin.ts  # Admin Supabase client
│   ├── pages/                 # Astro pages
│   │   ├── admin.astro        # Admin portal
│   │   ├── api/               # API endpoints
│   │   ├── blog/              # Blog pages
│   │   ├── cms/               # CMS pages
│   │   ├── music/             # Music pages
│   │   └── videos/            # Video pages
│   ├── scripts/               # Client-side scripts
│   └── styles/                # Global styles
├── astro.config.mjs           # Astro configuration
├── package.json               # Dependencies
├── tailwind.config.mjs        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `docs/ENVIRONMENT_SETUP.md`)
4. Run database migrations (see `docs/sql/`)
5. Start development server: `npm run dev`

## 📚 Documentation

- **Environment Setup**: `docs/ENVIRONMENT_SETUP.md`
- **Video CMS Guide**: `docs/VIDEO_CMS_GUIDE.md`
- **Music CMS Guide**: `docs/MUSIC_CMS_GUIDE.md`
- **Database Schema**: `docs/sql/CMS_SUPABASE_SCHEMA.sql`

## 🎯 Features

### Content Management
- **Blog Posts**: Markdown-based blog system
- **Videos**: YouTube, TikTok, Instagram, Facebook support
- **Music**: Audio tracks and music videos
- **Books**: Digital book content

### Admin Portal
- **Unified Interface**: Single admin portal for all content
- **User Management**: Role-based access control
- **Content Editor**: Rich content editing with conditional fields
- **Media Management**: File uploads and organization

### Technical Features
- **Astro Framework**: Modern static site generation
- **Supabase Backend**: Database and authentication
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type-safe development
- **Responsive Design**: Mobile-first approach

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

### Code Style
- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Prettier for code formatting

## 📝 Content Types

### Blog Posts
- Markdown content
- SEO optimization
- Tag system
- Publication scheduling

### Videos
- Multi-platform support
- Series organization
- Scripture references
- Teaching notes

### Music
- Audio file support
- Music video embeds
- Genre classification
- Scripture integration

## 🛠️ Deployment

1. Build the project: `npm run build`
2. Deploy to your hosting platform
3. Configure environment variables
4. Run database migrations
5. Set up Supabase authentication

## 📞 Support

For questions or issues, please refer to the documentation or create an issue in the repository.
