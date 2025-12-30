-- Make email column nullable for anonymous feedback
ALTER TABLE feedback ALTER COLUMN email DROP NOT NULL;

-- Add missing columns to feedback table
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS college TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

-- Insert sample feedback data
INSERT INTO feedback (name, email, student_id, college, category, subject, message, status, is_anonymous, created_at)
VALUES
  ('Juan Dela Cruz', 'juan.delacruz@unc.edu.ph', '24-00123', 'College of Engineering and Architecture', 'Facilities', 'Classroom Air Conditioning Issue', 'The air conditioning unit in Room 301 of the Engineering Building has not been working for two weeks now. This affects our learning as the room becomes very hot during afternoon classes.', 'pending', false, NOW() - INTERVAL '2 hours'),
  ('Anonymous', NULL, NULL, 'College of Arts and Sciences', 'Academic', 'Request for Extended Library Hours', 'I would like to request for extended library hours during finals week. Many students need more time to study and prepare for exams.', 'in-progress', true, NOW() - INTERVAL '4 hours'),
  ('Maria Santos', 'maria.santos@unc.edu.ph', '23-00456', 'College of Nursing', 'Financial', 'Scholarship Inquiry', 'I would like to inquire about the application process for the academic scholarship for the next semester.', 'resolved', false, NOW() - INTERVAL '1 day'),
  ('Pedro Garcia', 'pedro.garcia@unc.edu.ph', '25-00789', 'College of Computer Studies', 'Facilities', 'Wi-Fi Connectivity Problems', 'The Wi-Fi in the CCS building is very slow and often disconnects. This is problematic for students who need stable internet for coding and online research.', 'pending', false, NOW() - INTERVAL '1 day 2 hours'),
  ('Anonymous', NULL, NULL, 'College of Business and Accountancy', 'Suggestion', 'More Student Events', 'I suggest organizing more student events and activities that promote networking and skill development.', 'in-progress', true, NOW() - INTERVAL '2 days');
