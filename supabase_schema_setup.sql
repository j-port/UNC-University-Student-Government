-- =====================================================
-- UNC USG Website - Database Schema
-- Complete schema for dynamic content management
-- Version: 1.0
-- Date: December 31, 2025
-- =====================================================

-- =====================================================
-- TABLE OF CONTENTS
-- =====================================================
-- 1. Officers & Organizational Chart
-- 2. Organizations (FSOs, Fraternities, etc.)
-- 3. Committees
-- 4. Governance Documents (Constitution & Bylaws)
-- 5. Site Content (Dynamic page content)
-- 6. Page Content (Full page management)
-- 7. Indexes
-- 8. Row Level Security (RLS) Policies
-- 9. Triggers
-- =====================================================

-- =====================================================
-- 1. OFFICERS & ORGANIZATIONAL CHART
-- Stores executive, legislative, and committee officers
-- =====================================================

CREATE TABLE IF NOT EXISTS officers (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Officer information
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  branch TEXT NOT NULL CHECK (branch IN ('executive', 'legislative', 'committee')),
  email TEXT,
  phone TEXT,
  image_url TEXT,
  college TEXT,
  
  -- Display & Status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE officers IS 'Stores all USG officers including executive, legislative, and committee members';
COMMENT ON COLUMN officers.branch IS 'Branch type: executive, legislative, or committee';
COMMENT ON COLUMN officers.order_index IS 'Order for displaying officers (lower = first)';

-- =====================================================
-- 2. ORGANIZATIONS
-- Stores FSOs, fraternities, sororities, and councils
-- =====================================================

CREATE TABLE IF NOT EXISTS organizations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Organization information
  name TEXT NOT NULL,
  abbreviation TEXT,
  type TEXT NOT NULL CHECK (type IN ('academic', 'non-academic', 'fraternity', 'sorority', 'co-ed', 'college-council')),
  college TEXT,
  description TEXT,
  
  -- Leadership
  head_name TEXT,
  head_email TEXT,
  
  -- Details
  member_count INTEGER DEFAULT 0,
  founded_year TEXT,
  
  -- UI customization
  icon TEXT,
  color TEXT,
  
  -- Display & Status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE organizations IS 'Stores all student organizations including FSOs, fraternities, and college councils';
COMMENT ON COLUMN organizations.type IS 'Organization type: academic, non-academic, fraternity, sorority, co-ed, or college-council';

-- =====================================================
-- 3. COMMITTEES
-- Stores USG committees and their information
-- =====================================================

CREATE TABLE IF NOT EXISTS committees (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Committee information
  name TEXT NOT NULL,
  description TEXT,
  
  -- Leadership
  head_name TEXT NOT NULL,
  head_email TEXT,
  member_count INTEGER DEFAULT 0,
  
  -- UI customization
  color TEXT DEFAULT 'bg-blue-500',
  icon TEXT DEFAULT 'Briefcase',
  
  -- Display & Status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE committees IS 'Stores USG committees with their leadership and member information';

-- =====================================================
-- 4. GOVERNANCE DOCUMENTS
-- Stores constitution articles and bylaws
-- =====================================================

CREATE TABLE IF NOT EXISTS governance_documents (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Document information
  type TEXT NOT NULL CHECK (type IN ('constitution', 'bylaw')),
  article_number TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Structured content
  sections JSONB, -- Array of sections/subsections for complex documents
  
  -- Display & Status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE governance_documents IS 'Stores USG constitution and bylaws with structured content';
COMMENT ON COLUMN governance_documents.sections IS 'JSONB array for complex document structure (subsections, clauses, etc.)';

-- =====================================================
-- 5. SITE CONTENT
-- Stores dynamic content for various page sections
-- =====================================================

CREATE TABLE IF NOT EXISTS site_content (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content identification
  section TEXT NOT NULL, -- e.g., 'hero_stats', 'core_values', 'achievements'
  key TEXT NOT NULL,
  value TEXT,
  
  -- Flexible metadata storage
  metadata JSONB, -- For icons, colors, paths, additional data
  
  -- Display & Status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique section-key combination
  UNIQUE(section, key)
);

COMMENT ON TABLE site_content IS 'Flexible storage for dynamic content across various page sections';
COMMENT ON COLUMN site_content.section IS 'Section identifier (e.g., hero_stats, core_values, achievements)';
COMMENT ON COLUMN site_content.metadata IS 'JSONB for flexible data storage (icons, colors, URLs, etc.)';

-- =====================================================
-- 6. PAGE CONTENT
-- Stores full page content for custom pages
-- =====================================================

CREATE TABLE IF NOT EXISTS page_content (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Page identification
  page_slug TEXT NOT NULL UNIQUE, -- e.g., 'about', 'home', 'governance'
  
  -- Page content
  title TEXT,
  subtitle TEXT,
  content JSONB, -- Flexible storage for various content types
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE page_content IS 'Stores full page content for dynamic page management';
COMMENT ON COLUMN page_content.page_slug IS 'Unique page identifier used in URL routing';
COMMENT ON COLUMN page_content.content IS 'JSONB for flexible content structure (paragraphs, images, lists, etc.)';

-- =====================================================
-- 7. INDEXES
-- Improves query performance for common lookups
-- =====================================================

-- Officers indexes
CREATE INDEX IF NOT EXISTS idx_officers_branch ON officers(branch);
CREATE INDEX IF NOT EXISTS idx_officers_active ON officers(is_active);
CREATE INDEX IF NOT EXISTS idx_officers_order ON officers(order_index);

-- Organizations indexes
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_college ON organizations(college);
CREATE INDEX IF NOT EXISTS idx_organizations_active ON organizations(is_active);

-- Committees indexes
CREATE INDEX IF NOT EXISTS idx_committees_active ON committees(is_active);

-- Governance documents indexes
CREATE INDEX IF NOT EXISTS idx_governance_type ON governance_documents(type);
CREATE INDEX IF NOT EXISTS idx_governance_active ON governance_documents(is_active);

-- Site content indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active);

-- Page content indexes
CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(page_slug);

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Controls data access at the row level
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- PUBLIC READ ACCESS
-- Anyone can view published content
-- -----------------------------------------------------

CREATE POLICY "Public read access" 
  ON officers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access" 
  ON organizations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access" 
  ON committees 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access" 
  ON governance_documents 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access" 
  ON site_content 
  FOR SELECT 
  USING (true);

CREATE POLICY "Public read access" 
  ON page_content 
  FOR SELECT 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Officers
-- Authenticated users can create, update, and delete
-- -----------------------------------------------------

CREATE POLICY "Admin insert access" 
  ON officers 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin update access" 
  ON officers 
  FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin delete access" 
  ON officers 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Organizations
-- -----------------------------------------------------

CREATE POLICY "Admin insert access" 
  ON organizations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin update access" 
  ON organizations 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin delete access" 
  ON organizations 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Committees
-- -----------------------------------------------------

CREATE POLICY "Admin insert access" 
  ON committees 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin update access" 
  ON committees 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin delete access" 
  ON committees 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Governance Documents
-- -----------------------------------------------------

CREATE POLICY "Admin insert access" 
  ON governance_documents 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin update access" 
  ON governance_documents 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin delete access" 
  ON governance_documents 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Site Content
-- -----------------------------------------------------

CREATE POLICY "Admin insert access" 
  ON site_content 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin update access" 
  ON site_content 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin delete access" 
  ON site_content 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Page Content
-- -----------------------------------------------------

CREATE POLICY "Admin insert access" 
  ON page_content 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admin update access" 
  ON page_content 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Admin delete access" 
  ON page_content 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- =====================================================
-- 9. TRIGGERS
-- Automatically updates timestamps on record changes
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically sets updated_at to current timestamp on row update';

-- Apply trigger to all tables
CREATE TRIGGER update_officers_updated_at 
  BEFORE UPDATE ON officers
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON organizations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_committees_updated_at 
  BEFORE UPDATE ON committees
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_governance_documents_updated_at 
  BEFORE UPDATE ON governance_documents
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at 
  BEFORE UPDATE ON site_content
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at 
  BEFORE UPDATE ON page_content
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SCHEMA SETUP COMPLETE
-- =====================================================
-- To populate with sample data, run: supabase_seed_data.sql
-- =====================================================
