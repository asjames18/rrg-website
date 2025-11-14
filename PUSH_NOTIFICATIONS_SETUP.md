# Push Notifications Setup Guide

## ✅ Database Table Already Exists

The `push_subscriptions` table already exists in your database! That's good - it means it was created previously.

## 🔍 Verify Table Structure

Run this query in Supabase SQL Editor to check the table structure:

```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'push_subscriptions'
ORDER BY ordinal_position;
```

## ✅ Expected Table Structure

The table should have these columns:
- `id` (UUID, PRIMARY KEY)
- `user_id` (UUID, references auth.users)
- `endpoint` (TEXT, UNIQUE, NOT NULL)
- `p256dh` (TEXT, NOT NULL)
- `auth` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## 🔧 If Table Structure Needs Updates

If the table exists but is missing columns, you can add them:

```sql
-- Add missing columns (only if they don't exist)
ALTER TABLE push_subscriptions 
  ADD COLUMN IF NOT EXISTS p256dh TEXT,
  ADD COLUMN IF NOT EXISTS auth TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add unique constraint on endpoint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'push_subscriptions_endpoint_key'
  ) THEN
    ALTER TABLE push_subscriptions 
    ADD CONSTRAINT push_subscriptions_endpoint_key UNIQUE (endpoint);
  END IF;
END $$;
```

## ✅ Everything Should Work Now!

Since the table exists, your push notifications should work:

1. **Users can subscribe** - Subscriptions will be saved to the table
2. **Admin Dashboard** - Can view subscriptions and stats
3. **Send Notifications** - Ready to send (once web-push is implemented)

## 🧪 Test It

1. Go to `/admin` → Push Notifications tab
2. Check if subscriptions appear (if any users have subscribed)
3. Try sending a test notification

## 📝 Next Steps

To enable actual notification sending, you'll need to:

1. Install web-push: `npm install web-push`
2. Update `/api/admin/push/send.ts` with actual sending logic
3. Use your VAPID private key to encrypt notifications

The database is ready! 🎉

