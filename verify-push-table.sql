-- Verify Push Subscriptions Table Setup
-- Run this to check if all constraints and indexes are in place

-- 1. Check if UNIQUE constraint exists on endpoint
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'push_subscriptions'::regclass
AND contype = 'u';

-- 2. Check if FOREIGN KEY exists on user_id
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'push_subscriptions'::regclass
AND contype = 'f';

-- 3. Check if indexes exist
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'push_subscriptions';

-- 4. Add UNIQUE constraint if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'push_subscriptions'::regclass
    AND conname = 'push_subscriptions_endpoint_key'
  ) THEN
    ALTER TABLE push_subscriptions 
    ADD CONSTRAINT push_subscriptions_endpoint_key UNIQUE (endpoint);
    RAISE NOTICE 'Added UNIQUE constraint on endpoint';
  ELSE
    RAISE NOTICE 'UNIQUE constraint on endpoint already exists';
  END IF;
END $$;

-- 5. Add FOREIGN KEY if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'push_subscriptions'::regclass
    AND conname LIKE '%user_id%'
    AND contype = 'f'
  ) THEN
    ALTER TABLE push_subscriptions 
    ADD CONSTRAINT push_subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FOREIGN KEY on user_id';
  ELSE
    RAISE NOTICE 'FOREIGN KEY on user_id already exists';
  END IF;
END $$;

-- 6. Add indexes if missing
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id 
ON push_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint 
ON push_subscriptions(endpoint);

-- 7. Final verification
SELECT 
    'Table Structure' AS check_type,
    COUNT(*) AS column_count
FROM information_schema.columns
WHERE table_name = 'push_subscriptions'
UNION ALL
SELECT 
    'Indexes' AS check_type,
    COUNT(*) AS index_count
FROM pg_indexes
WHERE tablename = 'push_subscriptions'
UNION ALL
SELECT 
    'Constraints' AS check_type,
    COUNT(*) AS constraint_count
FROM pg_constraint
WHERE conrelid = 'push_subscriptions'::regclass;

