-- =====================================================
-- UNC USG Website - Sample Data Seeds
-- Populates tables with initial data
-- WARNING: This will DELETE existing data in these tables!
-- Only use for development/testing
-- =====================================================

-- =====================================================
-- CLEAR EXISTING SEED DATA
-- =====================================================

DELETE FROM financial_transactions;
DELETE FROM feedback;
DELETE FROM issuances;
DELETE FROM announcements;
DELETE FROM page_content;
DELETE FROM site_content;
DELETE FROM governance_documents;
DELETE FROM organizations;
DELETE FROM committees;
DELETE FROM officers;

-- =====================================================
-- 1. OFFICERS (Executive & Legislative Branch)
-- =====================================================

INSERT INTO officers (name, position, branch, email, image_url, order_index) VALUES
-- Executive Branch
('Juan Dela Cruz', 'USG President', 'executive', 'president@unc.edu.ph', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 1),
('Maria Santos', 'USG Vice President', 'executive', 'vp@unc.edu.ph', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face', 2),
('Pedro Reyes', 'Executive Secretary', 'executive', 'secretary@unc.edu.ph', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 3),
('Ana Garcia', 'Deputy Secretary', 'executive', 'deputy@unc.edu.ph', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 4),

-- Legislative Branch
('Jose Lopez', 'Council President', 'legislative', 'council.president@unc.edu.ph', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 1),
('Rosa Martinez', 'Council Vice President', 'legislative', 'council.vp@unc.edu.ph', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 2),
('Carlos Aquino', 'Majority Floor Leader', 'legislative', 'majority@unc.edu.ph', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', 3),
('Elena Ramos', 'Minority Floor Leader', 'legislative', 'minority@unc.edu.ph', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 4);

-- =====================================================
-- 2. COMMITTEES
-- =====================================================

INSERT INTO committees (name, head_name, head_email, description, color, icon, member_count, order_index) VALUES
('Finance Committee', 'Sofia Mendoza', 'finance@unc.edu.ph', 'Manages USG budget and financial transactions', 'bg-emerald-500', 'Briefcase', 5, 1),
('Academic Affairs', 'David Tan', 'academic@unc.edu.ph', 'Handles academic concerns and policies', 'bg-blue-500', 'GraduationCap', 6, 2),
('Student Welfare', 'Grace Lee', 'welfare@unc.edu.ph', 'Addresses student welfare and wellness', 'bg-pink-500', 'Heart', 4, 3),
('Events & Activities', 'Mark Gonzales', 'events@unc.edu.ph', 'Organizes campus events and activities', 'bg-orange-500', 'Trophy', 7, 4),
('Communications', 'Isabel Reyes', 'comms@unc.edu.ph', 'Manages public relations and media', 'bg-purple-500', 'Globe', 3, 5),
('Cultural Affairs', 'Miguel Torres', 'culture@unc.edu.ph', 'Promotes arts and cultural activities', 'bg-yellow-500', 'Palette', 4, 6);

-- =====================================================
-- 3. ORGANIZATIONS
-- =====================================================

-- College Student Councils
INSERT INTO organizations (name, abbreviation, type, college, color, order_index) VALUES
('College of Arts and Sciences Student Council', 'CAS-SC', 'college-council', 'College of Arts and Sciences', 'bg-red-500', 1),
('College of Business and Accountancy Student Council', 'CBA-SC', 'college-council', 'College of Business and Accountancy', 'bg-blue-500', 2),
('College of Computer Studies Student Council', 'CCS-SC', 'college-council', 'College of Computer Studies', 'bg-green-500', 3),
('College of Criminal Justice Education Student Council', 'CCJE-SC', 'college-council', 'College of Criminal Justice Education', 'bg-yellow-500', 4),
('College of Education Student Council', 'CED-SC', 'college-council', 'College of Education', 'bg-purple-500', 5),
('College of Engineering and Architecture Student Council', 'CEA-SC', 'college-council', 'College of Engineering and Architecture', 'bg-orange-500', 6),
('College of Law Student Council', 'COL-SC', 'college-council', 'College of Law', 'bg-indigo-500', 7),
('College of Nursing Student Council', 'CON-SC', 'college-council', 'College of Nursing', 'bg-pink-500', 8);

-- Academic Organizations
INSERT INTO organizations (name, abbreviation, type, college, icon, order_index) VALUES
('Computer Science Society', 'CSS', 'academic', 'CCS', 'Code', 10),
('Information Technology Guild', 'ITG', 'academic', 'CCS', 'Server', 11),
('Junior Philippine Institute of Accountants', 'JPIA', 'academic', 'CBA', 'Calculator', 12),
('Junior Marketing Association', 'JMA', 'academic', 'CBA', 'TrendingUp', 13),
('Future Educators Society', 'FES', 'academic', 'CED', 'BookOpen', 14),
('Engineering Students Society', 'ESS', 'academic', 'CEA', 'Cog', 15),
('Architecture Students League', 'ASL', 'academic', 'CEA', 'Building', 16),
('Nursing Students Association', 'NSA', 'academic', 'CON', 'Heart', 17),
('Criminology Students Organization', 'CSO', 'academic', 'CCJE', 'Shield', 18),
('Political Science Society', 'PSS', 'academic', 'CAS', 'Globe', 19),
('Psychology Students Alliance', 'PSA', 'academic', 'CAS', 'Brain', 20),
('Legal Aid Society', 'LAS', 'academic', 'COL', 'Scale', 21);

-- Non-Academic Organizations
INSERT INTO organizations (name, type, icon, order_index) VALUES
('University Chorale', 'non-academic', 'Music', 30),
('Theater Arts Guild', 'non-academic', 'Drama', 31),
('University Dance Troupe', 'non-academic', 'Music', 32),
('Photography Club', 'non-academic', 'Camera', 33),
('Debate Society', 'non-academic', 'MessageSquare', 34),
('Environmental Club', 'non-academic', 'Leaf', 35),
('Red Cross Youth', 'non-academic', 'Heart', 36),
('Rotaract Club', 'non-academic', 'Users', 37),
('University Athletes Association', 'non-academic', 'Trophy', 38),
('Chess Club', 'non-academic', 'Chess', 39),
('E-Sports Organization', 'non-academic', 'Gamepad', 40),
('Campus Ministry', 'non-academic', 'Church', 41);

-- Fraternities and Sororities
INSERT INTO organizations (name, type, founded_year, order_index) VALUES
('Alpha Sigma Phi', 'fraternity', '1985', 50),
('Beta Kappa Sigma', 'fraternity', '1990', 51),
('Gamma Delta Epsilon', 'fraternity', '1988', 52),
('Delta Sigma Pi', 'fraternity', '1992', 53),
('Alpha Delta Sorority', 'sorority', '1987', 54),
('Beta Gamma Sorority', 'sorority', '1991', 55),
('Sigma Kappa Phi', 'sorority', '1989', 56),
('Tau Gamma Rho', 'co-ed', '1995', 57);

-- =====================================================
-- 4. GOVERNANCE DOCUMENTS - Constitution
-- =====================================================

INSERT INTO governance_documents (type, article_number, title, content, order_index) VALUES
('constitution', 'I', 'Name and Domicile', 'This organization shall be known as the University Student Government (USG), hereinafter referred to as the "Government." The seat of the Government shall be at the Student Center Building of the University.', 1),
('constitution', 'II', 'Declaration of Principles', 'The USG recognizes that sovereignty resides in the students and all government authority emanates from them. The USG shall serve and protect the rights, welfare, and interests of the students.', 2),
('constitution', 'III', 'Membership', 'All bona fide students of the University who are currently enrolled and have paid their student government fees shall automatically become members of the USG.', 3),
('constitution', 'IV', 'Structure of Government', 'The USG shall be composed of the Executive Branch, headed by the President; the Legislative Branch, composed of the Student Council; and the Judicial Branch, composed of the Student Tribunal.', 4),
('constitution', 'V', 'The Executive Branch', 'The Executive power shall be vested in the President of the USG. The President shall be assisted by the Vice President, Executive Secretary, and other appointed officers.', 5),
('constitution', 'VI', 'The Legislative Branch', 'The Legislative power shall be vested in the Student Council, composed of elected representatives from each college. The Council shall have the power to enact resolutions, ordinances, and appropriations.', 6),
('constitution', 'VII', 'The Judicial Branch', 'The Judicial power shall be vested in the Student Tribunal. The Tribunal shall have jurisdiction over all cases involving the interpretation of this Constitution and the By-Laws.', 7),
('constitution', 'VIII', 'Elections', 'The USG shall hold general elections annually during the second semester. All officers shall be elected by direct vote of the student body through a secret ballot system.', 8),
('constitution', 'IX', 'Amendments', 'Amendments to this Constitution may be proposed by a two-thirds vote of all members of the Student Council or by petition of at least ten percent of the student body.', 9);

-- =====================================================
-- 5. GOVERNANCE DOCUMENTS - Bylaws
-- =====================================================

INSERT INTO governance_documents (type, article_number, title, content, sections, order_index) VALUES
('bylaw', '1', 'Meetings and Quorum', '', '["The Student Council shall hold regular meetings every two weeks during the academic year.", "A majority of all members shall constitute a quorum for the transaction of business.", "Special meetings may be called by the President or upon written request of one-third of the Council members."]'::jsonb, 1),
('bylaw', '2', 'Order of Business', '', '["Call to Order and Roll Call", "Reading and Approval of Minutes", "Reports from Officers and Committees", "Old Business", "New Business", "Announcements", "Adjournment"]'::jsonb, 2),
('bylaw', '3', 'Committees', '', '["Standing committees shall include: Finance, Academic Affairs, Student Welfare, Events, and Communications.", "Ad hoc committees may be created by resolution of the Council.", "Committee chairs shall be appointed by the President with confirmation by the Council."]'::jsonb, 3),
('bylaw', '4', 'Financial Procedures', '', '["All expenditures shall require approval from the Finance Committee.", "Monthly financial reports shall be submitted to the Council and published for transparency.", "An annual audit shall be conducted at the end of each academic year."]'::jsonb, 4),
('bylaw', '5', 'Election Procedures', '', '["Elections shall be conducted by the Commission on Elections (COMELEC).", "Candidates must file their certificates of candidacy at least two weeks before the election.", "Campaign period shall be limited to one week before the election date."]'::jsonb, 5),
('bylaw', '6', 'Impeachment', '', '["Any officer may be impeached for culpable violation of the Constitution, misconduct, or betrayal of public trust.", "Impeachment proceedings shall be initiated by a complaint filed with the Student Tribunal.", "A two-thirds vote of all Council members shall be required for conviction."]'::jsonb, 6),
('bylaw', '7', 'Amendments to By-Laws', '', '["Amendments may be proposed by any Council member.", "Proposed amendments must be submitted in writing at least one meeting before voting.", "A two-thirds vote of all members present shall be required for adoption."]'::jsonb, 7);

-- =====================================================
-- 6. GOVERNANCE DOCUMENTS - FILE-BASED DOCUMENTS
-- =====================================================

INSERT INTO governance_documents (title, type, version, file_url, file_name, status, published_at) VALUES
('USG Constitution 2024',
 'constitution',
 '2024.1',
 'https://example.com/documents/usg-constitution-2024.pdf',
 'usg-constitution-2024.pdf',
 'published',
 '2024-01-15'),

('USG By-Laws 2024',
 'bylaw',
 '2024.1',
 'https://example.com/documents/usg-bylaws-2024.pdf',
 'usg-bylaws-2024.pdf',
 'published',
 '2024-01-15');

-- =====================================================
-- 7. ANNOUNCEMENTS & BULLETINS
-- =====================================================

INSERT INTO announcements (title, content, category, priority, status, published_at) VALUES
('USG General Assembly 2025', 
 'Join us for the annual General Assembly on February 15, 2025, at 2:00 PM in the University Auditorium. This is your opportunity to voice your concerns, participate in discussions about student welfare, and learn about our plans for the upcoming semester. All students are encouraged to attend.',
 'Event', 'high', 'published', NOW()),

('New Scholarship Program Launched',
 'We are excited to announce a new scholarship program in partnership with the university administration. This merit-based scholarship will provide financial assistance to 50 deserving students. Applications open March 1, 2025. Visit the USG office for requirements.',
 'Announcement', 'high', 'published', NOW() - INTERVAL '2 days'),

('Campus Cleanup Drive Success',
 'Thank you to all 200+ volunteers who participated in our campus cleanup initiative! Together, we collected over 500 kg of recyclable materials and made our campus more beautiful. Special recognition to all participating organizations.',
 'Accomplishment', 'medium', 'published', NOW() - INTERVAL '5 days'),

('Mental Health Awareness Week',
 'Join us March 10-15 for Mental Health Awareness Week featuring free counseling sessions, stress management workshops, mindfulness exercises, and wellness activities. Take care of your mental health - you are not alone!',
 'Event', 'high', 'published', NOW() - INTERVAL '1 day'),

('Student Council Elections 2025',
 'Filing of candidacy for student council elections begins April 1, 2025. Visit the USG office for requirements and guidelines. Be the change you want to see - run for office and serve your fellow students!',
 'Alert', 'high', 'published', NOW() - INTERVAL '3 days');

-- =====================================================
-- 8. ISSUANCES & OFFICIAL DOCUMENTS
-- =====================================================

INSERT INTO issuances (title, description, type, file_url, file_name, status, published_at) VALUES
('Resolution No. 2025-001: Student Welfare Fund',
 'Resolution approving the allocation of ₱500,000 for student welfare programs including scholarships, medical assistance, and emergency financial aid.',
 'Resolution', 'https://example.com/documents/resolution-2025-001.pdf', 'resolution-2025-001.pdf', 'published', '2025-01-15'),

('Financial Report Q4 2024',
 'Comprehensive financial report covering all income and expenditures for the fourth quarter of 2024. Total budget: ₱2,450,000. Transparency is our commitment.',
 'Financial Report', 'https://example.com/documents/financial-report-q4-2024.pdf', 'financial-report-q4-2024.pdf', 'published', '2025-01-10'),

('Memorandum No. 2025-003: Library Hours Extension',
 'Official memorandum announcing extended library hours from 8:00 AM to 10:00 PM, Monday to Saturday, effective February 1, 2025.',
 'Memorandum', 'https://example.com/documents/memorandum-2025-003.pdf', 'memorandum-2025-003.pdf', 'published', '2025-01-20');

-- =====================================================
-- 9. FEEDBACK SUBMISSIONS (TINIG DINIG)
-- =====================================================

INSERT INTO feedback (name, email, student_id, college, subject, message, category, status, is_anonymous) VALUES
('Maria Santos', 'maria.santos@unc.edu.ph', '2021-12345', 'College of Arts and Sciences',
 'Library Facilities Improvement', 'The library needs more power outlets for laptops and better WiFi coverage in the upper floors.',
 'Facilities', 'pending', false),

('Anonymous Student', null, null, 'College of Computer Studies',
 'Mental Health Support', 'Can we have more accessible counseling services? Sometimes the waiting time is too long.',
 'Student Welfare', 'in-progress', true),

('Pedro Reyes', 'pedro.reyes@unc.edu.ph', '2020-67890', 'College of Business and Accountancy',
 'Cafeteria Food Prices', 'Food prices in the cafeteria have increased significantly. Can the USG negotiate with vendors for student discounts?',
 'Suggestion', 'resolved', false);

-- =====================================================
-- 10. FINANCIAL TRANSACTIONS
-- =====================================================

INSERT INTO financial_transactions (date, reference_no, description, category, amount, status) VALUES
('2025-01-15', 'REF-2025-001', 'Scholarship Fund Allocation', 'Scholarship', -250000.00, 'Completed'),
('2025-01-10', 'REF-2025-002', 'Student Activity Fee Collection', 'Revenue', 500000.00, 'Completed'),
('2025-01-05', 'REF-2025-003', 'Mental Health Week Budget', 'Events', -75000.00, 'Completed'),
('2025-01-03', 'REF-2025-004', 'Office Supplies Purchase', 'Administrative', -15000.00, 'Completed'),
('2024-12-20', 'REF-2024-099', 'Campus Cleanup Initiative', 'Projects', -30000.00, 'Completed'),
('2024-12-15', 'REF-2024-098', 'Student Organization Subsidy', 'Subsidy', -100000.00, 'Completed');

-- =====================================================
-- 11. SITE CONTENT (Dynamic Homepage Content)
-- =====================================================

INSERT INTO site_content (section_type, section_key, title, content, metadata, display_order, active)
VALUES
-- Hero Stats (4 items)
('heroStats', 'students-served', 'Students Served', NULL, 
 '{"icon": "Users", "value": "10,000+", "label": "Students Served"}', 1, true),
('heroStats', 'programs-events', 'Programs & Events', NULL, 
 '{"icon": "Star", "value": "50+", "label": "Programs & Events"}', 2, true),
('heroStats', 'transparency', 'Transparency', NULL, 
 '{"icon": "Shield", "value": "100%", "label": "Transparency"}', 3, true),
('heroStats', 'support-available', 'Support Available', NULL, 
 '{"icon": "Heart", "value": "24/7", "label": "Support Available"}', 4, true),

-- Home Stats (4 items)
('homeStats', 'students-represented', 'Students Represented', NULL, 
 '{"icon": "Users", "value": "15,000+", "label": "Students Represented"}', 1, true),
('homeStats', 'projects-completed', 'Projects Completed', NULL, 
 '{"icon": "Award", "value": "50+", "label": "Projects Completed"}', 2, true),
('homeStats', 'budget-managed', 'Budget Managed', NULL, 
 '{"icon": "TrendingUp", "value": "₱2M+", "label": "Budget Managed"}', 3, true),
('homeStats', 'commitment', 'Commitment to You', NULL, 
 '{"icon": "Heart", "value": "100%", "label": "Commitment to You"}', 4, true),

-- Core Values (5 items)
('coreValues', 'transparency', 'Transparency', 'We operate with complete openness and honesty', '{}', 1, true),
('coreValues', 'accountability', 'Accountability', 'We take responsibility for our actions and decisions', '{}', 2, true),
('coreValues', 'service', 'Service', 'We are dedicated to serving the student body', '{}', 3, true),
('coreValues', 'excellence', 'Excellence', 'We strive for the highest standards in everything we do', '{}', 4, true),
('coreValues', 'unity', 'Unity', 'We work together as one student government', '{}', 5, true),

-- Hero Features (3 items)
('heroFeatures', 'governance-hub', 'Governance Hub', NULL, 
 '{"icon": "Users", "description": "Access the USG Constitution, By-Laws, and organizational structure.", "path": "/governance", "color": "from-blue-500 to-blue-600"}', 1, true),
('heroFeatures', 'bulletins-news', 'Bulletins & News', NULL, 
 '{"icon": "FileText", "description": "Stay updated with announcements and official issuances.", "path": "/bulletins", "color": "from-green-500 to-green-600"}', 2, true),
('heroFeatures', 'transparency-portal', 'Transparency Portal', NULL, 
 '{"icon": "DollarSign", "description": "View financial transactions and fund allocations.", "path": "/transparency", "color": "from-purple-500 to-purple-600"}', 3, true),

-- Achievements (3 items)
('achievements', 'student-welfare', 'Enhanced Student Welfare', 'Successfully implemented new student support programs benefiting over 5,000 students', '{}', 1, true),
('achievements', 'budget-transparency', 'Budget Transparency Initiative', 'Launched real-time financial reporting system for complete transparency', '{}', 2, true),
('achievements', 'facilities-improvement', 'Campus Facilities Upgrade', 'Collaborated with administration to improve study areas and internet connectivity', '{}', 3, true);

-- =====================================================
-- 12. PAGE CONTENT (Text Content)
-- =====================================================

INSERT INTO page_content (page, section_key, title, content, active)
VALUES
-- Home page - About section
('home', 'about', 'Your Voice, Our Mission', 
 'The University Student Government serves as the official voice of the student body. We are committed to advocating for student welfare, fostering academic excellence, and creating a vibrant campus community.

Through transparency, accountability, and active engagement, we work tirelessly to ensure that every student''s concerns are heard and addressed.', true),

-- About page - Header
('about', 'header', 'University Student Government', 
 'Designing Spaces for a Better Future - Your voice, our mission', true),

-- About page - Mission
('about', 'mission', 'Our Mission', 
 'To serve as the unified voice of the student body, advocating for their rights, welfare, and interests. We are committed to fostering a culture of transparency, accountability, and excellence in student governance while promoting active participation in university affairs.', true),

-- About page - Vision
('about', 'vision', 'Our Vision', 
 'To be a student government that exemplifies excellence, integrity, and inclusivity, empowering every student to actively participate in shaping their university experience and creating lasting positive change in the academic community.', true);
