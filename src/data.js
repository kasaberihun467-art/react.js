export const initialData = {
  users: [
    { id: 's1', name: 'Olivia Chen', email: 'student@school.com', password: 'student123', role: 'Student', classId: 'c1', phone: '(555) 201-4401', joined: '2023-08-21' },
    { id: 's2', name: 'Ethan Parker', email: 'ethan.parker@school.com', password: 'student123', role: 'Student', classId: 'c1', phone: '(555) 201-4402', joined: '2023-08-21' },
    { id: 's3', name: 'Ava Johnson', email: 'ava.johnson@school.com', password: 'student123', role: 'Student', classId: 'c2', phone: '(555) 201-4403', joined: '2023-08-21' },
    { id: 's4', name: 'Noah Williams', email: 'noah.williams@school.com', password: 'student123', role: 'Student', classId: 'c2', phone: '(555) 201-4404', joined: '2023-08-21' },
    { id: 's5', name: 'Sophia Martinez', email: 'sophia.martinez@school.com', password: 'student123', role: 'Student', classId: 'c3', phone: '(555) 201-4405', joined: '2023-08-21' },
    { id: 's6', name: 'Liam Davis', email: 'liam.davis@school.com', password: 'student123', role: 'Student', classId: 'c3', phone: '(555) 201-4406', joined: '2023-08-21' },
    { id: 't1', name: 'Amelia Brooks', email: 'teacher@school.com', password: 'teacher123', role: 'Teacher', phone: '(555) 301-1200', classIds: ['c1', 'c2'], subjectIds: ['m1', 'm2'] },
    { id: 't2', name: 'James Wilson', email: 'james.wilson@school.com', password: 'teacher123', role: 'Teacher', phone: '(555) 301-1201', classIds: ['c3'], subjectIds: ['m3'] },
    { id: 'd1', name: 'Robert Anderson', email: 'director@school.com', password: 'director123', role: 'Director', phone: '(555) 100-0000' },
  ],
  classes: [
    { id: 'c1', name: 'Grade 10', section: 'A', room: 'Room 204', capacity: 24 },
    { id: 'c2', name: 'Grade 10', section: 'B', room: 'Room 206', capacity: 24 },
    { id: 'c3', name: 'Grade 9', section: 'A', room: 'Room 108', capacity: 22 },
  ],
  subjects: [
    { id: 'm1', name: 'Mathematics', code: 'MAT-10', classIds: ['c1', 'c2'] },
    { id: 'm2', name: 'Biology', code: 'BIO-10', classIds: ['c1', 'c2'] },
    { id: 'm3', name: 'English Literature', code: 'ENG-09', classIds: ['c3'] },
    { id: 'm4', name: 'World History', code: 'HIS-10', classIds: ['c1', 'c2'] },
    { id: 'm5', name: 'Physics', code: 'PHY-10', classIds: ['c1', 'c2'] },
  ],
  assignments: [
    { id: 'a1', title: 'Quadratic Equations Practice', subjectId: 'm1', classId: 'c1', deadline: '2026-11-25', description: 'Complete problems 1–12 in chapter 6.', submissions: [{ studentId: 's1', status: 'Submitted', submittedAt: '2026-11-18', marks: 18, feedback: 'Excellent reasoning.' }, { studentId: 's2', status: 'Pending' }] },
    { id: 'a2', title: 'Cell Structure Lab Report', subjectId: 'm2', classId: 'c1', deadline: '2026-11-28', description: 'Submit a one-page report with your labeled diagram.', submissions: [{ studentId: 's1', status: 'Pending' }, { studentId: 's2', status: 'Submitted', submittedAt: '2026-11-19' }] },
    { id: 'a3', title: 'Reading Reflection', subjectId: 'm3', classId: 'c3', deadline: '2026-11-27', description: 'Share a reflection on this week’s reading.', submissions: [{ studentId: 's5', status: 'Submitted', submittedAt: '2026-11-17', marks: 16, feedback: 'Thoughtful response.' }] },
  ],
  attendance: [
    { id: 'at1', date: '2026-11-19', classId: 'c1', subjectId: 'm1', records: { s1: 'Present', s2: 'Present' } },
    { id: 'at2', date: '2026-11-18', classId: 'c1', subjectId: 'm1', records: { s1: 'Present', s2: 'Late' } },
    { id: 'at3', date: '2026-11-19', classId: 'c2', subjectId: 'm1', records: { s3: 'Present', s4: 'Absent' } },
    { id: 'at4', date: '2026-11-19', classId: 'c3', subjectId: 'm3', records: { s5: 'Present', s6: 'Present' } },
  ],
  results: [
    { id: 'r1', studentId: 's1', subjectId: 'm1', term: 'Fall 2026', exam: 'Midterm', score: 92, maxScore: 100 },
    { id: 'r2', studentId: 's1', subjectId: 'm2', term: 'Fall 2026', exam: 'Midterm', score: 87, maxScore: 100 },
    { id: 'r3', studentId: 's1', subjectId: 'm4', term: 'Fall 2026', exam: 'Midterm', score: 90, maxScore: 100 },
    { id: 'r4', studentId: 's2', subjectId: 'm1', term: 'Fall 2026', exam: 'Midterm', score: 78, maxScore: 100 },
    { id: 'r5', studentId: 's3', subjectId: 'm1', term: 'Fall 2026', exam: 'Midterm', score: 84, maxScore: 100 },
    { id: 'r6', studentId: 's5', subjectId: 'm3', term: 'Fall 2026', exam: 'Midterm', score: 95, maxScore: 100 },
  ],
  announcements: [
    { id: 'n1', title: 'Thanksgiving break schedule', message: 'Campus will be closed November 26–27. Have a safe and restful break!', author: 'Robert Anderson', audience: 'All school', audienceClassIds: [], createdAt: '2026-11-18' },
    { id: 'n2', title: 'Science fair registration is open', message: 'Register your project with the science department by December 2.', author: 'Amelia Brooks', audience: 'Grade 10 · A', audienceClassIds: ['c1'], createdAt: '2026-11-17' },
    { id: 'n3', title: 'Library hours extended', message: 'The library will stay open until 5:30 PM this week for exam preparation.', author: 'Robert Anderson', audience: 'All school', audienceClassIds: [], createdAt: '2026-11-15' },
  ],
  settings: { schoolName: 'Northstar Academy', schoolYear: '2026–2027', term: 'Fall semester', contactEmail: 'hello@northstar.edu' },
}

export const rolePages = {
  Student: [
    ['Dashboard', 'LayoutDashboard'], ['My Profile', 'UserRound'], ['My Subjects', 'BookOpen'], ['Class Timetable', 'CalendarDays'],
    ['My Attendance', 'ClipboardCheck'], ['Examination Results', 'ChartNoAxesColumnIncreasing'], ['Assignments', 'FileText'],
    ['Announcements', 'Megaphone'], ['Settings', 'Settings'],
  ],
  Teacher: [
    ['Dashboard', 'LayoutDashboard'], ['My Profile', 'UserRound'], ['My Classes', 'School'], ['My Subjects', 'BookOpen'],
    ['Student List', 'UsersRound'], ['Attendance Management', 'ClipboardCheck'], ['Assignment Management', 'FileText'],
    ['Examination Management', 'ChartNoAxesColumnIncreasing'], ['Grade Management', 'GraduationCap'],
    ['Announcements', 'Megaphone'], ['Settings', 'Settings'],
  ],
  Director: [
    ['Dashboard', 'LayoutDashboard'], ['Student Management', 'UsersRound'], ['Teacher Management', 'ContactRound'],
    ['Class Management', 'School'], ['Subject Management', 'BookOpen'], ['Teacher Assignment', 'UserRoundCog'],
    ['Attendance Reports', 'ClipboardCheck'], ['Examination Results', 'ChartNoAxesColumnIncreasing'],
    ['Academic Performance', 'ChartNoAxesColumnIncreasing'], ['Announcements', 'Megaphone'], ['School Settings', 'Settings'],
  ],
}
