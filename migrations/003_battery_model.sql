-- Add battery_model column for tracking battery type/model
ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS battery_model text NOT NULL DEFAULT '';

-- Grant service_role access
GRANT SELECT, INSERT ON test_runs TO service_role;
