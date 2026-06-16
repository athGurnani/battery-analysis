-- Drop old columns
ALTER TABLE test_runs DROP COLUMN IF EXISTS voltage_start;
ALTER TABLE test_runs DROP COLUMN IF EXISTS voltage_end;
ALTER TABLE test_runs DROP COLUMN IF EXISTS voltage_drop;
ALTER TABLE test_runs DROP COLUMN IF EXISTS encoded_blob;

-- Rename resistance -> internal_resistance (if needed)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_runs' AND column_name = 'resistance'
  ) THEN
    ALTER TABLE test_runs RENAME COLUMN resistance TO internal_resistance;
  END IF;
END $$;

-- Rename temperature -> avg_temp
ALTER TABLE test_runs RENAME COLUMN temperature TO avg_temp;

-- Add new columns (if not already present)
ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS voltage_sag    numeric NOT NULL DEFAULT 0;
ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS capacity       numeric NOT NULL DEFAULT 0;
ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS recovery_time  numeric NOT NULL DEFAULT 0;
ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS team_number    numeric NOT NULL DEFAULT 0;
ALTER TABLE test_runs ADD COLUMN IF NOT EXISTS battery_label  text    NOT NULL DEFAULT '';

-- Clear the table
TRUNCATE TABLE test_runs;

-- Grant service_role access (bypasses RLS)
GRANT SELECT, INSERT ON test_runs TO service_role;
