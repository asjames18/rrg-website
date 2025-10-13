# Environment Variables Setup

## The Issue
The admin portal is failing because environment variables are not set up. You need to create a `.env` file with your Supabase credentials.

## Solution

### 1. Create a `.env` file in your project root
Create a file called `.env` in `/Users/asjames18/Development/RRG Website/` with the following content:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. Get your Supabase credentials
1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings > API
4. Copy the following values:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Replace the placeholder values
Replace `your_supabase_url_here`, `your_supabase_anon_key_here`, and `your_supabase_service_role_key_here` with your actual values.

### 4. Restart your development server
After creating the `.env` file, restart your Astro development server.

## Test the setup
Once you've created the `.env` file, test these endpoints:
- `http://localhost:4321/api/check-env` - Check if environment variables are loaded
- `http://localhost:4321/api/test-db` - Test database connection
- `http://localhost:4321/api/test-content` - Test content API

## Security Note
The `.env` file is already in `.gitignore`, so your credentials won't be committed to git. This is good for security.
