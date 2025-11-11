# Real & Raw Gospel - Developer Guide

Complete guide for developers working on the RRG website.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Development Workflow](#development-workflow)
5. [Security Features](#security-features)
6. [API Documentation](#api-documentation)
7. [Content Management](#content-management)
8. [Deployment](#deployment)

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd "RRG Website"

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## Project Structure

```
RRG Website/
├── src/
│   ├── components/       # React components
│   ├── content/          # MDX content collections
│   ├── layouts/          # Astro layouts
│   ├── lib/              # Utility libraries
│   │   ├── logger.ts     # Environment-based logging
│   │   ├── env.ts        # Environment validation
│   │   ├── sanitize.ts   # Input sanitization
│   │   ├── rate-limit.ts # Rate limiting
│   │   ├── validation.ts # Zod schemas
│   │   └── ...
│   ├── pages/            # Astro pages and API routes
│   └── styles/           # Global styles
├── public/               # Static assets
├── docs/                 # Documentation
└── astro.config.mjs      # Astro configuration
```

## Environment Setup

### Required Variables

- `PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)

### Optional Variables

- `PUBLIC_ADMIN_PASSCODE` - Admin CMS passcode
- `PUBLIC_SITE_URL` - Site URL for RSS/sitemap
- `SENTRY_DSN` - Error tracking (Sentry)
- `PUBLIC_PLAUSIBLE_DOMAIN` - Analytics (Plausible)
- `PUBLIC_FATHOM_SITE_ID` - Analytics (Fathom)

See `.env.example` for complete list.

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

Server runs on `http://localhost:4321`

### Building for Production

```bash
npm run build
npm run preview
```

### Code Quality

- TypeScript strict mode enabled
- No `any` types allowed
- ESLint configured
- Prettier formatting

## Security Features

### Authentication & Authorization

- Supabase Auth for user authentication
- Role-based access control (admin, editor, user)
- Middleware protection for admin/CMS routes

### Security Measures

1. **Rate Limiting**: API endpoints protected with rate limits
   - Auth endpoints: 5 requests per 15 minutes
   - CMS endpoints: 30 requests per minute
   - Other APIs: 100 requests per 15 minutes

2. **Input Sanitization**: All user input sanitized
   - String sanitization with XSS prevention
   - Email validation
   - URL validation
   - Markdown content sanitization

3. **CSRF Protection**: State-changing endpoints protected
   - Token-based CSRF protection
   - Timing-safe comparison

4. **File Upload Security**:
   - File size limits (10MB)
   - MIME type validation
   - Magic number/file signature verification
   - Content verification beyond MIME type

5. **Environment-Based Logging**:
   - Debug logs only in development
   - Error logs in all environments
   - No sensitive data in logs

## API Documentation

### Content Management API

All CMS endpoints require authentication and editor/admin role.

**Base URL**: `/api/cms`

#### Endpoints

- `GET /api/cms/content` - List content
- `POST /api/cms/content` - Create content
- `PUT /api/cms/content?id={id}` - Update content
- `DELETE /api/cms/content?id={id}` - Delete content
- `GET /api/cms/stats` - Get CMS statistics
- `POST /api/cms/upload` - Upload media file

### Authentication API

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/request-reset` - Request password reset

## Content Management

### Content Collections

Content is managed through Astro content collections:

- `blog` - Blog posts (MDX)
- `videos` - Video content
- `books` - Book recommendations
- `music` - Music tracks

### Creating Content

1. Use the CMS at `/cms` (requires admin access)
2. Or create MDX files in `src/content/{collection}/`

### Content Schema

See `src/content/config.ts` for collection schemas.

## Deployment

### Vercel Deployment

```bash
# Deploy to production
npm run deploy:prebuilt:prod

# Or fresh deploy
npm run deploy:fresh
```

### Environment Variables

Set all required environment variables in your deployment platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables

### Database Setup

1. Run Supabase migrations from `docs/sql/`
2. Set up RLS policies
3. Configure authentication providers

## Additional Resources

- [Environment Setup Guide](ENVIRONMENT_SETUP.md)
- [CMS Setup Guide](CMS_SETUP_GUIDE.md)
- [Video CMS Guide](VIDEO_CMS_GUIDE.md)
- [Music CMS Guide](MUSIC_CMS_GUIDE.md)
- [Supabase Setup](SUPABASE_SETUP.md)

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Check `.env` file exists
   - Restart dev server after changes
   - Verify variable names match exactly

2. **Authentication errors**
   - Verify Supabase credentials
   - Check user roles in database
   - Review middleware logs

3. **Build errors**
   - Run `npm install` to update dependencies
   - Check TypeScript errors: `npm run astro check`
   - Verify all environment variables set

## Support

For questions or issues, refer to the documentation in the `docs/` directory or create an issue in the repository.

