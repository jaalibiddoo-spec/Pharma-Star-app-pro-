-- =====================================================================
-- PHARMA STAR APP PRO - ENTERPRISE POSTGRESQL & CLOUD SQL DATABASE SCHEMA
-- Ministry of Health (MoH) / EFDA Continuing Professional Development
-- Wholesaler Network, User Access Control, and Clinical Audit Logging
-- =====================================================================

-- Enums for Role and Verification Status
CREATE TYPE user_role AS ENUM ('PROFESSIONAL', 'WHOLESALER', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- 1. Users Table (Handles local login / Google Sign-In mappings)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'PROFESSIONAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Professional Profiles (Tracks regional license and Ministry details)
CREATE TABLE professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    ethiopian_region VARCHAR(100) NOT NULL, -- e.g., 'Oromia', 'Amhara', 'Addis Ababa', 'Tigray', 'Sidama'
    is_verified_by_moh BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Wholesaler Profiles (Allows supply chain users to open accounts)
CREATE TABLE wholesaler_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    tin_number VARCHAR(50) UNIQUE NOT NULL,
    inventory_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Modules & Chapters (Supports automated splitting of book guidelines)
CREATE TABLE cpd_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_credits INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE module_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES cpd_modules(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_markdown TEXT NOT NULL,
    UNIQUE (module_id, chapter_number)
);

-- 5. User Progress & Logs (Tracks real-time chapter reading states)
CREATE TABLE user_chapter_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES module_chapters(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, chapter_id)
);

-- 6. Generated Certificates (Stores immutable records with secure QR codes)
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES cpd_modules(id) ON DELETE CASCADE,
    certificate_code VARCHAR(100) UNIQUE NOT NULL, -- Format: CPD-ORHB-YYYY-XXXXX
    qr_code_hash TEXT NOT NULL,                     -- For lightweight local validation
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, module_id)
);

-- 7. Platform Audit Log (For compliance reporting to institutions)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. High-Performance Query & Inspection Indexes
-- Speeds up regional breakdown reports for Ministry of Health audits
CREATE INDEX idx_prof_region ON professional_profiles(ethiopian_region);

-- Speeds up instant lookups from mobile QR code scanning in the field
CREATE INDEX idx_cert_code ON certificates(certificate_code);

-- Optimized compound index to quickly find completed chapters per user
CREATE INDEX idx_user_progress ON user_chapter_progress(user_id, is_completed);
