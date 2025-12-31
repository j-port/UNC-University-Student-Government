-- =====================================================
-- UNC USG Website - Sample Data Seeds
-- Populates tables with initial data
-- =====================================================

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
-- 6. SITE CONTENT
-- =====================================================

-- Hero Stats
INSERT INTO site_content (section, key, value, metadata, order_index) VALUES
('hero_stats', 'students', '10,000+', '{"label": "Students Served", "icon": "Users"}'::jsonb, 1),
('hero_stats', 'programs', '50+', '{"label": "Programs & Events", "icon": "Star"}'::jsonb, 2),
('hero_stats', 'transparency', '100%', '{"label": "Transparency", "icon": "Shield"}'::jsonb, 3),
('hero_stats', 'support', '24/7', '{"label": "Support Available", "icon": "Heart"}'::jsonb, 4);

-- Home Stats
INSERT INTO site_content (section, key, value, metadata, order_index) VALUES
('home_stats', 'students_represented', '15,000+', '{"label": "Students Represented", "icon": "Users"}'::jsonb, 1),
('home_stats', 'projects_completed', '50+', '{"label": "Projects Completed", "icon": "Award"}'::jsonb, 2),
('home_stats', 'budget_managed', '₱2M+', '{"label": "Budget Managed", "icon": "TrendingUp"}'::jsonb, 3),
('home_stats', 'commitment', '100%', '{"label": "Commitment to You", "icon": "Heart"}'::jsonb, 4);

-- Core Values
INSERT INTO site_content (section, key, value, metadata, order_index) VALUES
('core_values', 'service', 'Service', '{"description": "Dedicated to serving the student body with passion and commitment.", "icon": "Heart", "color": "bg-red-500"}'::jsonb, 1),
('core_values', 'transparency', 'Transparency', '{"description": "Open and honest in all our dealings and decision-making processes.", "icon": "Eye", "color": "bg-blue-500"}'::jsonb, 2),
('core_values', 'unity', 'Unity', '{"description": "Fostering solidarity and collaboration among all students.", "icon": "Users", "color": "bg-green-500"}'::jsonb, 3),
('core_values', 'excellence', 'Excellence', '{"description": "Striving for the highest standards in everything we do.", "icon": "Award", "color": "bg-purple-500"}'::jsonb, 4),
('core_values', 'innovation', 'Innovation', '{"description": "Embracing new ideas and creative solutions for student welfare.", "icon": "Lightbulb", "color": "bg-yellow-500"}'::jsonb, 5),
('core_values', 'accountability', 'Accountability', '{"description": "Taking responsibility for our actions and their outcomes.", "icon": "CheckCircle", "color": "bg-indigo-500"}'::jsonb, 6);

-- Achievements
INSERT INTO site_content (section, key, value, order_index) VALUES
('achievements', 'library_hours', 'Successfully advocated for extended library hours', 1),
('achievements', 'tinig_dinig', 'Launched the TINIG DINIG feedback system', 2),
('achievements', 'events', 'Organized 50+ student events and activities', 3),
('achievements', 'funds', 'Managed ₱2M+ student funds with full transparency', 4),
('achievements', 'scholarships', 'Established scholarship programs for deserving students', 5),
('achievements', 'partnerships', 'Created partnerships with local businesses for student discounts', 6);

-- Hero Features
INSERT INTO site_content (section, key, value, metadata, order_index) VALUES
('hero_features', 'governance', 'Governance Hub', '{"description": "Access the USG Constitution, By-Laws, and organizational structure.", "path": "/governance", "icon": "Users", "color": "from-blue-500 to-blue-600"}'::jsonb, 1),
('hero_features', 'bulletins', 'Bulletins & News', '{"description": "Stay updated with announcements and official issuances.", "path": "/bulletins", "icon": "FileText", "color": "from-green-500 to-green-600"}'::jsonb, 2),
('hero_features', 'transparency', 'Transparency Portal', '{"description": "View financial transactions and fund allocations.", "path": "/transparency", "icon": "DollarSign", "color": "from-purple-500 to-purple-600"}'::jsonb, 3);

-- Page Content (About, Mission, Vision)
INSERT INTO page_content (page_slug, title, subtitle, content) VALUES
('about', 'University Student Government', 'Designing Spaces for a Better Future - Your voice, our mission', 
 '{"intro": "The University Student Government serves as the official voice of the student body. We are committed to advocating for student welfare, fostering academic excellence, and creating a vibrant campus community.", "commitment": "Through transparency, accountability, and active engagement, we work tirelessly to ensure that every student''s concerns are heard and addressed."}'::jsonb),
('mission', 'Our Mission', '', 
 '{"text": "To empower and represent the student body through transparent governance, innovative programs, and unwavering commitment to student welfare and academic excellence."}'::jsonb),
('vision', 'Our Vision', '', 
 '{"text": "A united student community where every voice matters, every concern is addressed, and every student thrives in an environment of excellence, integrity, and inclusive leadership."}'::jsonb);
