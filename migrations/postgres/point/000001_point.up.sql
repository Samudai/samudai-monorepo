CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Members table
CREATE TABLE IF NOT EXISTS members (
    member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(255),
    wallet_address VARCHAR(255),
    chain_id VARCHAR(50),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_code VARCHAR(255),
    is_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Discord integration table
CREATE TABLE IF NOT EXISTS discord (
    discord_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(member_id),
    discord_user_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Points table
CREATE TABLE IF NOT EXISTS points (
    point_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Member points table
CREATE TABLE IF NOT EXISTS member_points (
    member_point_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(member_id),
    point_id UUID NOT NULL REFERENCES points(point_id),
    access TEXT[] DEFAULT '{}',
    roles JSONB DEFAULT '[]',
    member_joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, point_id)
);

-- Member points view
CREATE OR REPLACE VIEW member_points_view AS
SELECT 
    mp.point_id,
    mp.member_id,
    mp.access,
    mp.roles,
    mp.member_joined_at,
    jsonb_build_object(
        'member_id', m.member_id,
        'name', m.name,
        'email', m.email,
        'wallet_address', m.wallet_address,
        'chain_id', m.chain_id,
        'email_verified', m.email_verified,
        'is_onboarded', m.is_onboarded,
        'created_at', m.created_at
    ) as member
FROM member_points mp
JOIN members m ON m.member_id = mp.member_id;

-- Create indexes
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_wallet ON members(wallet_address);
CREATE INDEX idx_discord_member ON discord(member_id);
CREATE INDEX idx_member_points_member ON member_points(member_id);
CREATE INDEX idx_member_points_point ON member_points(point_id); 
