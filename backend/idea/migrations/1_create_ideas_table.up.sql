CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    original_idea TEXT NOT NULL,
    enhanced_idea TEXT,
    context JSONB,
    validation_result JSONB,
    tech_stack_result JSONB,
    features_result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on row update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON ideas
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
