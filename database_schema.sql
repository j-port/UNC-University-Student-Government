-- =====================================================
-- UNC USG Website - Complete Database Schema
-- Unified schema for all tables, indexes, RLS, and triggers
-- Version: 2.0
-- Date: December 31, 2025
-- =====================================================

-- =====================================================
-- MIGRATION: DROP UPDATED TABLES TO RECREATE WITH NEW STRUCTURE
-- Run this section if you have old table structures
-- =====================================================

-- Drop tables that have been restructured (this will recreate them with new structure)
DROP TABLE IF EXISTS site_content CASCADE;
DROP TABLE IF EXISTS page_content CASCADE;
DROP TABLE IF EXISTS governance_documents CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;

-- =====================================================
-- TABLE OF CONTENTS
-- =====================================================
-- 1. Officers & Organizational Chart
-- 2. Organizations (FSOs, Fraternities, etc.)
-- 3. Committees
-- 4. Announcements (Bulletins & Events)
-- 5. Issuances & Reports
-- 6. Governance Documents (Constitution & Bylaws)
-- 7. Feedback (TINIG DINIG)
-- 8. Financial Transactions
-- 9. Site Content (Dynamic homepage content)
-- 10. Page Content (Page text content)
-- 11. Storage Buckets & Policies
-- 12. Indexes
-- 13. Row Level Security (RLS) Policies
-- 14. Triggers
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
-- 5. ISSUANCES & REPORTS
-- Stores official documents, reports, resolutions, and memorandums
-- =====================================================

CREATE TABLE IF NOT EXISTS issuances (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Document information
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Resolution', 'Report', 'Memorandum', 'Financial Report', 'Other')),
  
  -- File information
  file_url TEXT NOT NULL, -- URL to the uploaded file in Supabase Storage
  file_name TEXT NOT NULL, -- Original file name
  file_size INTEGER, -- File size in bytes
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Publishing
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE issuances IS 'Stores USG official documents, reports, resolutions, and memorandums';
COMMENT ON COLUMN issuances.type IS 'Document type: Resolution, Report, Memorandum, Financial Report, or Other';
COMMENT ON COLUMN issuances.file_url IS 'URL to the uploaded file in Supabase Storage';
COMMENT ON COLUMN issuances.status IS 'Publication status: draft, published, or archived';

-- =====================================================
-- 6. GOVERNANCE DOCUMENTS
-- Stores constitution articles and bylaws
-- =====================================================

CREATE TABLE IF NOT EXISTS governance_documents (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Document information
  type TEXT NOT NULL CHECK (type IN ('constitution', 'bylaw')),
  title TEXT NOT NULL,
  
  -- For article-based documents
  article_number TEXT,
  content TEXT,
  sections JSONB, -- Array of sections/subsections for complex documents
  
  -- For file-based documents
  version TEXT,
  file_url TEXT,
  file_name TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at DATE,
  
  -- Display & Status
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE governance_documents IS 'Stores USG constitution and bylaws - both article-based and file-based documents';
COMMENT ON COLUMN governance_documents.sections IS 'JSONB array for complex document structure (subsections, clauses, etc.)';
COMMENT ON COLUMN governance_documents.article_number IS 'Article/section number (e.g., "I", "II", "1", "2") - for article-based documents';
COMMENT ON COLUMN governance_documents.content IS 'Article content - for article-based documents';
COMMENT ON COLUMN governance_documents.file_url IS 'URL to PDF document - for file-based documents';
COMMENT ON COLUMN governance_documents.file_name IS 'Original filename - for file-based documents';

-- =====================================================
-- 7. FEEDBACK (TINIG DINIG)
-- Stores student feedback and concerns
-- =====================================================

CREATE TABLE IF NOT EXISTS feedback (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reference number for tracking
  reference_number TEXT UNIQUE,
  
  -- Submitter information (optional for anonymous feedback)
  name TEXT,
  email TEXT,
  student_id TEXT,
  college TEXT,
  
  -- Feedback content
  category TEXT NOT NULL CHECK (category IN ('Academic', 'Facilities', 'Financial', 'Student Welfare', 'Governance', 'Suggestion', 'Other')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Attachment (Google Drive link or file URL)
  attachment_url TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'responded', 'resolved')),
  response TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE feedback IS 'Stores student feedback submissions from TINIG DINIG system';
COMMENT ON COLUMN feedback.reference_number IS 'Unique tracking reference number in format TNG-YYYYMMDD-ID';
COMMENT ON COLUMN feedback.attachment_url IS 'URL to attached file (Google Drive link or storage URL)';
COMMENT ON COLUMN feedback.is_anonymous IS 'True if feedback was submitted anonymously';
COMMENT ON COLUMN feedback.status IS 'Feedback resolution status: pending, in_progress, responded, or resolved';

-- =====================================================
-- 8. FINANCIAL TRANSACTIONS
-- Stores USG financial transactions for transparency
-- =====================================================

CREATE TABLE IF NOT EXISTS financial_transactions (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Transaction information
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL, -- Positive for income, negative for expenses
  
  -- Reference & Status
  reference_no TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
  
  -- Additional details
  notes TEXT,
  attachments JSONB, -- Array of attachment URLs
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE financial_transactions IS 'Stores all USG financial transactions for transparency reporting';
COMMENT ON COLUMN financial_transactions.amount IS 'Positive for income, negative for expenses';
COMMENT ON COLUMN financial_transactions.reference_no IS 'Unique transaction reference number';

-- =====================================================
-- 9. SITE CONTENT (Dynamic Homepage Content)
-- Stores dynamic content for home page sections
-- (stats, features, core values, achievements)
-- =====================================================

CREATE TABLE IF NOT EXISTS site_content (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content identification
  section_type TEXT NOT NULL CHECK (section_type IN ('heroStats', 'homeStats', 'coreValues', 'heroFeatures', 'achievements')),
  section_key TEXT NOT NULL,
  
  -- Content fields
  title TEXT,
  content TEXT,
  
  -- Flexible metadata storage
  metadata JSONB DEFAULT '{}', -- For icons, values, labels, descriptions, paths, colors
  
  -- Display & Status
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique section-key combination
  UNIQUE(section_type, section_key)
);

COMMENT ON TABLE site_content IS 'Stores dynamic content for home page sections including stats, features, and core values';
COMMENT ON COLUMN site_content.section_type IS 'Type of section: heroStats, homeStats, coreValues, heroFeatures, achievements';
COMMENT ON COLUMN site_content.section_key IS 'Unique identifier within section type (e.g., students-served)';
COMMENT ON COLUMN site_content.metadata IS 'JSON object containing icon, value, label, description, path, color fields';
COMMENT ON COLUMN site_content.display_order IS 'Order in which items appear (lower numbers appear first)';

-- =====================================================
-- 10. PAGE CONTENT (Page Text Content)
-- Stores text content for specific pages
-- (about, mission, vision)
-- =====================================================

CREATE TABLE IF NOT EXISTS page_content (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Page identification
  page TEXT NOT NULL CHECK (page IN ('home', 'about')),
  section_key TEXT NOT NULL,
  
  -- Content fields
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique page-section combination
  UNIQUE(page, section_key)
);

COMMENT ON TABLE page_content IS 'Stores text content for specific pages like about, mission, vision';
COMMENT ON COLUMN page_content.page IS 'Page identifier: home, about';
COMMENT ON COLUMN page_content.section_key IS 'Section identifier within page (e.g., about, mission, vision)';

-- =====================================================
-- 11. STORAGE BUCKETS & POLICIES
-- Supabase Storage configuration for file uploads
-- =====================================================

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
CREATE POLICY "Authenticated upload access"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
CREATE POLICY "Authenticated update access"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;
CREATE POLICY "Authenticated delete access"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');

-- =====================================================
-- 12. INDEXES
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

-- Issuances indexes
CREATE INDEX IF NOT EXISTS idx_issuances_type ON issuances(type);
CREATE INDEX IF NOT EXISTS idx_issuances_status ON issuances(status);
CREATE INDEX IF NOT EXISTS idx_issuances_published_at ON issuances(published_at);
CREATE INDEX IF NOT EXISTS idx_issuances_created_at ON issuances(created_at);

-- Governance documents indexes
CREATE INDEX IF NOT EXISTS idx_governance_type ON governance_documents(type);
CREATE INDEX IF NOT EXISTS idx_governance_active ON governance_documents(is_active);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_reference_number ON feedback(reference_number);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_is_anonymous ON feedback(is_anonymous);

-- Financial transactions indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON financial_transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON financial_transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON financial_transactions(status);

-- Site content indexes
CREATE INDEX IF NOT EXISTS idx_site_content_section_type ON site_content(section_type);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(active);
CREATE INDEX IF NOT EXISTS idx_site_content_display_order ON site_content(display_order);

-- Page content indexes
CREATE INDEX IF NOT EXISTS idx_page_content_page ON page_content(page);
CREATE INDEX IF NOT EXISTS idx_page_content_active ON page_content(active);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON financial_transactions(created_at);

-- =====================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- Controls data access at the row level
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE issuances ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- PUBLIC READ ACCESS
-- Anyone can view published content
-- -----------------------------------------------------

-- Officers
DROP POLICY IF EXISTS "Public read access" ON officers;
CREATE POLICY "Public read access" 
  ON officers 
  FOR SELECT 
  USING (true);

-- Organizations
DROP POLICY IF EXISTS "Public read access" ON organizations;
CREATE POLICY "Public read access" 
  ON organizations 
  FOR SELECT 
  USING (true);

-- Committees
DROP POLICY IF EXISTS "Public read access" ON committees;
CREATE POLICY "Public read access" 
  ON committees 
  FOR SELECT 
  USING (true);

-- Announcements (public can only see published)
DROP POLICY IF EXISTS "Public read access" ON announcements;
CREATE POLICY "Public read access" 
  ON announcements 
  FOR SELECT 
  USING (status = 'published');

-- Announcements (admin can see all)
DROP POLICY IF EXISTS "Admin read all access" ON announcements;
CREATE POLICY "Admin read all access" 
  ON announcements 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Issuances (public can only see published)
DROP POLICY IF EXISTS "Public read access" ON issuances;
CREATE POLICY "Public read access" 
  ON issuances 
  FOR SELECT 
  USING (status = 'published');

-- Issuances (admin can see all)
DROP POLICY IF EXISTS "Admin read all access" ON issuances;
CREATE POLICY "Admin read all access" 
  ON issuances 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Governance Documents
DROP POLICY IF EXISTS "Public read access" ON governance_documents;
CREATE POLICY "Public read access" 
  ON governance_documents 
  FOR SELECT 
  USING (true);

-- Feedback (only authenticated can read all)
DROP POLICY IF EXISTS "Admin read access" ON feedback;
CREATE POLICY "Admin read access" 
  ON feedback 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Feedback (anyone can submit - explicit for all roles)
DROP POLICY IF EXISTS "Public insert access" ON feedback;
CREATE POLICY "Public insert access" 
  ON feedback 
  FOR INSERT 
  WITH CHECK (true);

-- Feedback (public can read by reference number for tracking - explicit for all roles)
DROP POLICY IF EXISTS "Public read by reference" ON feedback;
CREATE POLICY "Public read by reference" 
  ON feedback 
  FOR SELECT 
  USING (reference_number IS NOT NULL);

-- Financial Transactions
DROP POLICY IF EXISTS "Public read access" ON financial_transactions;
CREATE POLICY "Public read access" 
  ON financial_transactions 
  FOR SELECT 
  USING (true);

-- Site Content (public can view active content only)
DROP POLICY IF EXISTS "Public read access" ON site_content;
CREATE POLICY "Public read access" 
  ON site_content 
  FOR SELECT 
  USING (active = true);

-- Page Content (public can view active content only)
DROP POLICY IF EXISTS "Public read access" ON page_content;
CREATE POLICY "Public read access" 
  ON page_content 
  FOR SELECT 
  USING (active = true);

-- -----------------------------------------------------
-- ADMIN WRITE ACCESS
-- Authenticated users can create, update, and delete
-- -----------------------------------------------------

-- Officers
DROP POLICY IF EXISTS "Admin insert access" ON officers;
CREATE POLICY "Admin insert access" ON officers FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON officers;
CREATE POLICY "Admin update access" ON officers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON officers;
CREATE POLICY "Admin delete access" ON officers FOR DELETE TO authenticated USING (true);

-- Organizations
DROP POLICY IF EXISTS "Admin insert access" ON organizations;
CREATE POLICY "Admin insert access" ON organizations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON organizations;
CREATE POLICY "Admin update access" ON organizations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON organizations;
CREATE POLICY "Admin delete access" ON organizations FOR DELETE TO authenticated USING (true);

-- Committees
DROP POLICY IF EXISTS "Admin insert access" ON committees;
CREATE POLICY "Admin insert access" ON committees FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON committees;
CREATE POLICY "Admin update access" ON committees FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON committees;
CREATE POLICY "Admin delete access" ON committees FOR DELETE TO authenticated USING (true);

-- Announcements
DROP POLICY IF EXISTS "Admin insert access" ON announcements;
CREATE POLICY "Admin insert access" ON announcements FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON announcements;
CREATE POLICY "Admin update access" ON announcements FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON announcements;
CREATE POLICY "Admin delete access" ON announcements FOR DELETE TO authenticated USING (true);

-- Issuances
DROP POLICY IF EXISTS "Admin insert access" ON issuances;
CREATE POLICY "Admin insert access" ON issuances FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON issuances;
CREATE POLICY "Admin update access" ON issuances FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON issuances;
CREATE POLICY "Admin delete access" ON issuances FOR DELETE TO authenticated USING (true);

-- Governance Documents
DROP POLICY IF EXISTS "Admin insert access" ON governance_documents;
CREATE POLICY "Admin insert access" ON governance_documents FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON governance_documents;
CREATE POLICY "Admin update access" ON governance_documents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON governance_documents;
CREATE POLICY "Admin delete access" ON governance_documents FOR DELETE TO authenticated USING (true);

-- Feedback
DROP POLICY IF EXISTS "Admin update access" ON feedback;
CREATE POLICY "Admin update access" ON feedback FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON feedback;
CREATE POLICY "Admin delete access" ON feedback FOR DELETE TO authenticated USING (true);

-- Financial Transactions
DROP POLICY IF EXISTS "Admin insert access" ON financial_transactions;
CREATE POLICY "Admin insert access" ON financial_transactions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON financial_transactions;
CREATE POLICY "Admin update access" ON financial_transactions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON financial_transactions;
CREATE POLICY "Admin delete access" ON financial_transactions FOR DELETE TO authenticated USING (true);

-- Site Content
DROP POLICY IF EXISTS "Admin insert access" ON site_content;
CREATE POLICY "Admin insert access" ON site_content FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON site_content;
CREATE POLICY "Admin update access" ON site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON site_content;
CREATE POLICY "Admin delete access" ON site_content FOR DELETE TO authenticated USING (true);

-- Page Content
DROP POLICY IF EXISTS "Admin insert access" ON page_content;
CREATE POLICY "Admin insert access" ON page_content FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update access" ON page_content;
CREATE POLICY "Admin update access" ON page_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete access" ON page_content;
CREATE POLICY "Admin delete access" ON page_content FOR DELETE TO authenticated USING (true);

-- =====================================================
-- 14. TRIGGERS
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

-- Apply trigger to all tables with updated_at column
DROP TRIGGER IF EXISTS update_officers_updated_at ON officers;
CREATE TRIGGER update_officers_updated_at BEFORE UPDATE ON officers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_committees_updated_at ON committees;
CREATE TRIGGER update_committees_updated_at BEFORE UPDATE ON committees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_issuances_updated_at ON issuances;
CREATE TRIGGER update_issuances_updated_at BEFORE UPDATE ON issuances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_governance_documents_updated_at ON governance_documents;
CREATE TRIGGER update_governance_documents_updated_at BEFORE UPDATE ON governance_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON financial_transactions;
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SCHEMA SETUP COMPLETE
-- =====================================================
-- Next step: Run database_test_data.sql to populate with test data
-- =====================================================
