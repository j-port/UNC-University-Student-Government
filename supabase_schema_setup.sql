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
-- 4. Announcements (Bulletins & Events)
-- 5. Governance Documents (Constitution & Bylaws)
-- 6. Site Content (Dynamic page content)
-- 7. Page Content (Full page management)
-- 8. Indexes
-- 9. Row Level Security (RLS) Policies
-- 10. Triggers
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
-- 4. ANNOUNCEMENTS
-- Stores announcements, events, and accomplishments
-- =====================================================

CREATE TABLE IF NOT EXISTS announcements (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Announcement information
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Announcement', 'Event', 'Accomplishment', 'Alert')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Media
  image TEXT, -- Image URL or path
  
  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE announcements IS 'Stores USG announcements, events, accomplishments, and alerts';
COMMENT ON COLUMN announcements.category IS 'Announcement type: Announcement, Event, Accomplishment, or Alert';
COMMENT ON COLUMN announcements.priority IS 'Display priority: low, medium, or high';
COMMENT ON COLUMN announcements.status IS 'Publication status: draft, published, or archived';

-- =====================================================
-- 5. GOVERNANCE DOCUMENTS
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
-- 6. SITE CONTENT
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
-- 7. PAGE CONTENT
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
-- 8. INDEXES
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

-- Announcements indexes
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_status ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements(published_at);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at);

-- Governance documents indexes
CREATE INDEX IF NOT EXISTS idx_governance_type ON governance_documents(type);
CREATE INDEX IF NOT EXISTS idx_governance_active ON governance_documents(is_active);

-- Site content indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active);

-- Page content indexes
CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(page_slug);

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- Controls data access at the row level
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- PUBLIC READ ACCESS
-- Anyone can view published content
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Public read access" ON officers;
CREATE POLICY "Public read access" 
  ON officers 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON organizations;
CREATE POLICY "Public read access" 
  ON organizations 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON committees;
CREATE POLICY "Public read access" 
  ON committees 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON announcements;
CREATE POLICY "Public read access" 
  ON announcements 
  FOR SELECT 
  USING (status = 'published');

DROP POLICY IF EXISTS "Public read access" ON governance_documents;
CREATE POLICY "Public read access" 
  ON governance_documents 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON site_content;
CREATE POLICY "Public read access" 
  ON site_content 
  FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON page_content;
CREATE POLICY "Public read access" 
  ON page_content 
  FOR SELECT 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Officers
-- Authenticated users can create, update, and delete
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON officers;
CREATE POLICY "Admin insert access" 
  ON officers 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON officers;
CREATE POLICY "Admin update access" 
  ON officers 
  FOR UPDATE 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON officers;
CREATE POLICY "Admin delete access" 
  ON officers 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Organizations
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON organizations;
CREATE POLICY "Admin insert access" 
  ON organizations 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON organizations;
CREATE POLICY "Admin update access" 
  ON organizations 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON organizations;
CREATE POLICY "Admin delete access" 
  ON organizations 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Committees
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON committees;
CREATE POLICY "Admin insert access" 
  ON committees 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON committees;
CREATE POLICY "Admin update access" 
  ON committees 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON committees;
CREATE POLICY "Admin delete access" 
  ON committees 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Announcements
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON announcements;
CREATE POLICY "Admin insert access" 
  ON announcements 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON announcements;
CREATE POLICY "Admin update access" 
  ON announcements 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON announcements;
CREATE POLICY "Admin delete access" 
  ON announcements 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Governance Documents
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON governance_documents;
CREATE POLICY "Admin insert access" 
  ON governance_documents 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON governance_documents;
CREATE POLICY "Admin update access" 
  ON governance_documents 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON governance_documents;
CREATE POLICY "Admin delete access" 
  ON governance_documents 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Site Content
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON site_content;
CREATE POLICY "Admin insert access" 
  ON site_content 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON site_content;
CREATE POLICY "Admin update access" 
  ON site_content 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON site_content;
CREATE POLICY "Admin delete access" 
  ON site_content 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS - Page Content
-- -----------------------------------------------------

DROP POLICY IF EXISTS "Admin insert access" ON page_content;
CREATE POLICY "Admin insert access" 
  ON page_content 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON page_content;
CREATE POLICY "Admin update access" 
  ON page_content 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON page_content;
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
DROP TRIGGER IF EXISTS update_officers_updated_at ON officers;
CREATE TRIGGER update_officers_updated_at 
  BEFORE UPDATE ON officers
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON organizations
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_committees_updated_at ON committees;
CREATE TRIGGER update_committees_updated_at 
  BEFORE UPDATE ON committees
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at 
  BEFORE UPDATE ON announcements
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_governance_documents_updated_at ON governance_documents;
CREATE TRIGGER update_governance_documents_updated_at 
  BEFORE UPDATE ON governance_documents
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at 
  BEFORE UPDATE ON site_content
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
CREATE TRIGGER update_page_content_updated_at 
  BEFORE UPDATE ON page_content
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SCHEMA SETUP COMPLETE
-- =====================================================
-- To populate with sample data, run: supabase_seed_data.sql
-- =====================================================
