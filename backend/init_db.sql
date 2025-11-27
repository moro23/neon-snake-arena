-- Create tables if they don't exist (handled by app usually, but good for pure SQL init)
-- Note: The app's startup event usually creates tables via SQLModel. 
-- However, for init scripts in /docker-entrypoint-initdb.d/, they run BEFORE the app starts.
-- So we might need to create tables here OR ensure this runs after tables are created.
-- Standard Postgres docker init runs these scripts on a fresh volume creation.
-- Let's assume we create the tables here to be safe, matching the models.

CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    avatar VARCHAR DEFAULT '🐍',
    high_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE TABLE IF NOT EXISTS score (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id),
    score INTEGER NOT NULL,
    max_stage_reached INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

CREATE TABLE IF NOT EXISTS activesession (
    user_id UUID PRIMARY KEY REFERENCES "user"(id),
    current_stage INTEGER NOT NULL,
    current_score INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

-- Mock Data

-- Users (password is 'password' hashed with bcrypt)
-- Hash: $2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2
INSERT INTO "user" (id, username, email, hashed_password, avatar, high_score, created_at) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'snake_master', 'master@snake.game', '$2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2', '🐍', 2000, NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'viper_queen', 'queen@snake.game', '$2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2', '👑', 4000, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'python_pro', 'pro@snake.game', '$2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2', '🎮', 600, NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'anaconda_joe', 'joe@snake.game', '$2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2', '🕹️', 1200, NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'cobra_kai', 'kai@snake.game', '$2b$12$yox9ALs5MGMu5hNX9v3MTevrYEXyyK1UfOtwaDUZcb74Q6fP9dzZ2', '⚡', 800, NOW());

-- Scores
INSERT INTO score (user_id, score, max_stage_reached, created_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1500, 5, NOW()),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2000, 7, NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 3500, 10, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 500, 2, NOW()),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 1200, 4, NOW()),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 800, 3, NOW()),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 4000, 12, NOW());

-- Active Sessions
INSERT INTO activesession (user_id, current_stage, current_score, is_active, last_updated) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 8, 2200, TRUE, NOW()),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 3, 600, TRUE, NOW());
