import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, BookOpen, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, Eye, EyeOff,
  FileText, GraduationCap, LayoutDashboard, LogOut, Menu, MoreHorizontal, Plus, Search,
  Settings, ShieldCheck, Sparkles, UsersRound, X,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { initialData, rolePages } from './data'

const icons = {
  LayoutDashboard, UserRound: ShieldCheck, BookOpen, CalendarDays, ClipboardCheck,
  ChartNoAxesColumnIncreasing: Activity, FileText, Megaphone: Bell, Settings,
  School: GraduationCap, UsersRound, ContactRound: UsersRound, UserRoundCog: ShieldCheck,
}
const slug = (text) => text.toLowerCase().replaceAll(' ', '-')
const today = new Date().toISOString().slice(0, 10)
const makeId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`
const average = (values) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0
const grade = (score) => score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
const prettyDate = (date) => date ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const readStoredData = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('northstar-data'))
    return saved ? { ...initialData, ...saved } : initialData
  } catch {
    return initialData
  }
}

function useSchoolData() {
  const [data, setData] = useState(readStoredData)
  useEffect(() => localStorage.setItem('northstar-data', JSON.stringify(data)), [data])
  const update = (key, updater) => setData((current) => ({
    ...current,
    [key]: typeof updater === 'function' ? updater(current[key]) : updater,
  }))
  return [data, update]
}

function App() {
  const [data, update] = useSchoolData()
  const [userId, setUserId] = useState(() => localStorage.getItem('northstar-user'))
  const user = data.users.find((item) => item.id === userId)
  useEffect(() => {
    if (userId && !user) {
      localStorage.removeItem('northstar-user')
      setUserId(null)
    }
  }, [user, userId])
  const signIn = (account) => {
    localStorage.setItem('northstar-user', account.id)
    setUserId(account.id)
  }
  const signOut = () => {
    localStorage.removeItem('northstar-user')
    setUserId(null)
  }
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/app/dashboard" replace /> : <Login data={data} onLogin={signIn} />} />
      <Route path="/app/:page" element={user ? <Workspace data={data} update={update} user={user} onLogout={signOut} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? '/app/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}><span className="brand-mark"><GraduationCap size={21} /></span><span className="brand-copy"><b>northstar</b><small>ACADEMY</small></span></div>
}

function Login({ data, onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const login = (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    window.setTimeout(() => {
      const account = data.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
      setBusy(false)
      if (!account || !['Student', 'Teacher', 'Director'].includes(account.role)) {
        setError('That email and password combination doesn’t match a demo account.')
        return
      }
      onLogin(account)
      navigate('/app/dashboard')
    }, 350)
  }
  const demo = [
    { role: 'Student', email: 'student@school.com', password: 'student123' },
    { role: 'Teacher', email: 'teacher@school.com', password: 'teacher123' },
    { role: 'Director', email: 'director@school.com', password: 'director123' },
  ]
  return (
    <main className="login-page">
      <section className="login-story">
        <div className="login-story-top"><Brand /><span className="school-year">EST. 1998&nbsp; · &nbsp;LEARN WITH PURPOSE</span></div>
        <div className="story-content">
          <div className="eyebrow"><Sparkles size={14} /> A brighter way to learn</div>
          <h1>Every day is a<br /><em>new beginning.</em></h1>
          <p>One welcoming place for students, educators, and school leaders to learn, teach, and grow together.</p>
          <div className="story-stat-row"><div><strong>1,240</strong><span>curious minds</span></div><i /><div><strong>98%</strong><span>family happiness</span></div></div>
        </div>
        <div className="story-quote"><span className="quote-mark">“</span><p>Education is not the filling of a pail, but the lighting of a fire.</p><small>W. B. YEATS</small></div>
        <div className="login-dots" />
      </section>
      <section className="login-form-side">
        <div className="mobile-brand"><Brand /></div>
        <div className="login-card">
          <div className="login-welcome"><div className="welcome-icon"><ShieldCheck size={23} /></div><div className="eyebrow">YOUR SCHOOL, IN SYNC</div><h2>Welcome back</h2><p>Sign in to your Northstar account to continue.</p></div>
          <form onSubmit={login} className="auth-form">
            <label>Email address<input type="email" placeholder="you@school.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required /></label>
            <label>Password<div className="password-wrap"><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={6} /><button type="button" className="password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button type="submit" className="primary-button login-submit" disabled={busy}>{busy ? 'Signing you in…' : <>Sign in <ArrowRight size={17} /></>}</button>
          </form>
          <div className="demo-box"><div className="demo-heading"><span><span className="live-dot" /> DEMO ACCESS</span><span>Frontend simulation</span></div><div className="demo-accounts">{demo.map((account) => <button key={account.role} className="demo-account" type="button" onClick={() => { setEmail(account.email); setPassword(account.password); setError('') }}><span className={`role-dot ${account.role.toLowerCase()}`} /><span><b>{account.role}</b><small>{account.email}</small></span><ChevronRight size={15} /></button>)}</div></div>
          <div className="secure-note"><ShieldCheck size={14} /> Demo authentication · Account data stays in this browser</div>
        </div>
        <div className="login-footer">© 2026 Northstar Academy <span>•</span> Built for brighter futures</div>
      </section>
    </main>
  )
}

function Workspace({ data, update, user, onLogout }) {
  const { page = 'dashboard' } = useParams()
  const navigate = useNavigate()
  const pageName = rolePages[user.role].find(([name]) => slug(name) === page)?.[0]
  if (!pageName) return <Navigate to="/app/dashboard" replace />
  const [menuOpen, setMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])
  const change = (key, updater) => update(key, updater)
  return (
    <div className="app-shell">
      {menuOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand"><Brand /><button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="nav-section-label">WORKSPACE</div>
        <nav className="side-nav" aria-label={`${user.role} navigation`}>
          {rolePages[user.role].map(([name, iconName]) => {
            const Icon = icons[iconName] || LayoutDashboard
            return <Link key={name} to={`/app/${slug(name)}`} className={`nav-link ${pageName === name ? 'active' : ''}`} onClick={() => setMenuOpen(false)}><Icon size={18} strokeWidth={1.8} /><span>{name}</span>{name === 'Assignments' && user.role === 'Student' && <i className="nav-pill">2</i>}</Link>
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-help"><div className="help-icon"><Sparkles size={17} /></div><b>Need a hand?</b><p>Your school team is here to help.</p><button onClick={() => setNotice('Please contact hello@northstar.edu for help.')}>Get support <ArrowRight size={14} /></button></div>
        <button className="nav-link logout-link" onClick={onLogout}><LogOut size={18} /><span>Sign out</span></button>
        <div className="sidebar-foot"><span className="online-indicator" /> All systems operational <span>v1.0</span></div>
      </aside>
      <main className="main-panel">
        <header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="breadcrumbs"><span>Northstar</span><ChevronRight size={14} /><b>{pageName}</b></div></div><div className="topbar-right"><span className="term-chip"><span className="term-dot" /> 2026–27&nbsp; · &nbsp;Fall term</span><button className="icon-button notification-button" aria-label="Announcements" onClick={() => navigate(`/app/${slug(rolePages[user.role].find(([name]) => name === 'Announcements')?.[0] || 'Dashboard')}`)}><Bell size={18} /><i /></button><div className="topbar-divider" /><button className="profile-menu" onClick={() => navigate(`/app/${slug(rolePages[user.role].find(([name]) => name === 'My Profile')?.[0] || 'Dashboard')}`)}><span className={`avatar ${user.role.toLowerCase()}`}>{initials(user.name)}</span><span className="profile-name"><b>{user.name}</b><small>{user.role}</small></span><ChevronDown size={15} /></button></div></header>
        <div className="page-content"><PageContent page={pageName} data={data} user={user} change={change} notify={setNotice} /></div>
        <footer className="app-footer"><span>© 2026 Northstar Academy</span><span>Learning together, every day <span className="footer-heart">♥</span></span></footer>
      </main>
      {notice && <div className="toast"><CheckCircle2 size={17} /> {notice}</div>}
    </div>
  )
}

function initials(name = '') {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase()
}
const getClass = (data, id) => data.classes.find((item) => item.id === id)
const getSubject = (data, id) => data.subjects.find((item) => item.id === id)
const getUser = (data, id) => data.users.find((item) => item.id === id)
const studentsOf = (data, classId) => data.users.filter((item) => item.role === 'Student' && (!classId || item.classId === classId))
const Field = ({ field, value, onChange }) => (
  field.type === 'select'
    ? <select required={field.required !== false} name={field.name} value={value ?? ''} onChange={onChange}><option value="" disabled>{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>{field.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>
    : field.type === 'textarea'
      ? <textarea name={field.name} required={field.required !== false} placeholder={field.placeholder || ''} value={value ?? ''} onChange={onChange} rows={3} />
      : <input name={field.name} required={field.required !== false} type={field.type || 'text'} placeholder={field.placeholder || ''} min={field.min} max={field.max} value={value ?? ''} onChange={onChange} />)

function FormPanel({ title, description, fields, submitLabel = 'Save changes', initialValues = {}, onSubmit, onCancel, compact = false }) {
  const [values, setValues] = useState(() => Object.fromEntries(fields.map((field) => [field.name, initialValues[field.name] ?? ''])))
  useEffect(() => setValues(Object.fromEntries(fields.map((field) => [field.name, initialValues[field.name] ?? '']))), [initialValues, fields])
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(values)
    if (!initialValues.id) setValues(Object.fromEntries(fields.map((field) => [field.name, ''])))
  }
  return <form className={`form-panel ${compact ? 'form-panel-compact' : ''}`} onSubmit={handleSubmit}>
    <div className="form-panel-title"><div><h3>{title}</h3>{description && <p>{description}</p>}</div>{onCancel && <button type="button" className="icon-button subtle-button" aria-label="Close form" onClick={onCancel}><X size={17} /></button>}</div>
    <div className="form-fields">{fields.map((field) => <label key={field.name} className={field.wide ? 'field-wide' : ''}>{field.label}<Field field={field} value={values[field.name]} onChange={(event) => setValues({ ...values, [field.name]: event.target.value })} /></label>)}</div>
    <div className="form-actions"><button type="submit" className="primary-button"><Check size={16} /> {submitLabel}</button>{onCancel && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}</div>
  </form>
}

function PageContent({ page, data, user, change, notify }) {
  const context = { page, data, user, change, notify }
  if (page === 'Dashboard') return <Dashboard {...context} />
  if (page === 'My Profile') return <Profile {...context} />
  if (page === 'My Subjects') return user.role === 'Student' ? <StudentSubjects {...context} /> : <TeacherSubjects {...context} />
  if (page === 'Class Timetable') return <Timetable {...context} />
  if (page === 'My Attendance' || page === 'Attendance Reports') return user.role === 'Student' ? <AttendanceView {...context} /> : <AttendanceReports {...context} />
  if (page === 'Examination Results') return user.role === 'Student' ? <ResultsView {...context} /> : <ResultsManagement {...context} />
  if (page === 'Assignments' || page === 'Assignment Management') return <Assignments {...context} />
  if (page === 'Announcements') return <Announcements {...context} />
  if (page === 'Settings' || page === 'School Settings') return <SettingsPage {...context} />
  if (page === 'My Classes') return <MyClasses {...context} />
  if (page === 'Student List') return <StudentList {...context} />
  if (page === 'Attendance Management') return <AttendanceManagement {...context} />
  if (page === 'Examination Management' || page === 'Grade Management') return <ResultsManagement {...context} />
  if (page === 'Student Management') return <DirectorStudents {...context} />
  if (page === 'Teacher Management') return <DirectorTeachers {...context} />
  if (page === 'Class Management') return <DirectorClasses {...context} />
  if (page === 'Subject Management') return <DirectorSubjects {...context} />
  if (page === 'Teacher Assignment') return <TeacherAssignment {...context} />
  if (page === 'Academic Performance') return <AcademicPerformance {...context} />
  return <Dashboard {...context} />
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>
}
function MetricCard({ label, value, changeText, icon: Icon, tone = 'blue', footnote }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={18} /></span></div><div className="metric-value">{value}</div><div className="metric-foot">{changeText && <span className="metric-change"><ArrowUpRight size={14} />{changeText}</span>}{footnote && <span>{footnote}</span>}</div></article>
}
function Panel({ title, subtitle, action, children, className = '' }) {
  return <section className={`panel ${className}`}><div className="panel-heading"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>
}
function ChartTooltip({ active, payload, label }) {
  return active && payload?.length ? <div className="chart-tooltip"><b>{label}</b>{payload.map((entry) => <span key={entry.name} style={{ color: entry.color }}>{entry.name}: {entry.value}{entry.name.toLowerCase().includes('attendance') ? '%' : ''}</span>)}</div> : null
}

function Dashboard({ data, user }) {
  if (user.role === 'Student') {
    const subjects = data.subjects.filter((subject) => subject.classIds?.includes(user.classId))
    const marks = data.results.filter((result) => result.studentId === user.id)
    const attendanceRows = data.attendance.filter((item) => item.classId === user.classId)
    const attendanceValues = attendanceRows.flatMap((item) => Object.entries(item.records).filter(([id]) => id === user.id).map(([, status]) => status === 'Present' ? 100 : status === 'Late' ? 50 : 0))
    const attendancePct = attendanceValues.length ? average(attendanceValues) : 96
    const assignments = data.assignments.filter((item) => item.classId === user.classId)
    const announcements = data.announcements.filter((item) => !item.audienceClassIds?.length || item.audienceClassIds.includes(user.classId)).slice(0, 3)
    return <><PageHeading eyebrow="STUDENT OVERVIEW" title={`Good morning, ${user.name.split(' ')[0]}!`} description="Here’s what’s happening in your learning journey." action={<span className="date-chip"><CalendarDays size={15} /> {prettyDate(today)}</span>} />
      <div className="metric-grid four"><MetricCard label="Enrolled subjects" value={subjects.length} changeText="Your learning lineup" icon={BookOpen} tone="blue" /><MetricCard label="Attendance" value={`${attendancePct}%`} changeText="Great consistency" icon={ClipboardCheck} tone="green" /><MetricCard label="Assignments" value={assignments.length} footnote="in your class" icon={FileText} tone="purple" /><MetricCard label="Exam average" value={`${average(marks.map((item) => item.score)) || '—'}${marks.length ? '%' : ''}`} changeText="Fall semester" icon={Activity} tone="orange" /></div>
      <div className="dashboard-grid"><Panel title="Your week at a glance" subtitle="A little progress adds up to a lot." className="welcome-panel"><div className="student-welcome"><div className="welcome-illustration"><div className="illustration-sun" /><div className="illustration-book"><BookOpen size={42} /></div><span className="sparkle s-one">✦</span><span className="sparkle s-two">✦</span></div><div><span className="welcome-tag">KEEP IT UP</span><h2>You’re building<br />something wonderful.</h2><p>Stay curious, keep showing up, and celebrate every small win.</p><Link className="text-link" to="/app/assignments">Check your assignments <ArrowRight size={15} /></Link></div></div></Panel>
        <Panel title="Coming up" subtitle="Your next deadlines"><div className="deadline-list">{assignments.slice(0, 3).map((item) => <div className="deadline-item" key={item.id}><span className="deadline-icon"><FileText size={17} /></span><span className="deadline-copy"><b>{item.title}</b><small>{getSubject(data, item.subjectId)?.name}</small></span><span className="deadline-date">{prettyDate(item.deadline)}</span></div>)}{!assignments.length && <EmptyState text="No assignments yet." />}</div></Panel></div>
      <div className="dashboard-grid lower-grid"><Panel title="Latest announcements" subtitle="News from around Northstar" action={<Link className="text-link" to="/app/announcements">See all <ArrowRight size={14} /></Link>}><AnnouncementPreview rows={announcements} /></Panel><Panel title="Your subject snapshot" subtitle="Fall 2026 results"><div className="subject-snapshot">{subjects.slice(0, 4).map((subject, index) => { const result = marks.find((item) => item.subjectId === subject.id); const palette = ['blue', 'green', 'purple', 'orange']; return <div className="snapshot-row" key={subject.id}><span className={`snapshot-dot ${palette[index % palette.length]}`} /><span>{subject.name}</span><b>{result ? `${result.score}%` : 'In progress'}</b></div> })}{!subjects.length && <EmptyState text="No subjects assigned yet." />}</div></Panel></div>
    </>
  }
  if (user.role === 'Teacher') {
    const students = studentsOf(data).filter((student) => user.classIds?.includes(student.classId))
    const assignments = data.assignments.filter((item) => user.classIds?.includes(item.classId) && user.subjectIds?.includes(item.subjectId))
    const pending = assignments.reduce((sum, item) => sum + item.submissions.filter((submission) => submission.status === 'Pending').length, 0)
    const attendanceRows = data.attendance.filter((item) => user.classIds?.includes(item.classId))
    const attendancePct = average(attendanceRows.flatMap((row) => Object.values(row.records).map((status) => status === 'Present' ? 100 : status === 'Late' ? 50 : 0)))
    return <><PageHeading eyebrow="TEACHER OVERVIEW" title={`Good morning, ${user.name.split(' ')[0]}!`} description="Your classroom is ready. Here’s the latest." action={<span className="date-chip"><CalendarDays size={15} /> {prettyDate(today)}</span>} />
      <div className="metric-grid four"><MetricCard label="Assigned classes" value={user.classIds?.length || 0} changeText="This school year" icon={GraduationCap} tone="blue" /><MetricCard label="Assigned subjects" value={user.subjectIds?.length || 0} changeText="Across your classes" icon={BookOpen} tone="green" /><MetricCard label="Total students" value={students.length} changeText="On your roster" icon={UsersRound} tone="purple" /><MetricCard label="Pending reviews" value={pending} footnote={`${attendancePct || 96}% attendance avg.`} icon={FileText} tone="orange" /></div>
      <div className="dashboard-grid"><Panel title="Class attendance" subtitle="Attendance at a glance"><AttendanceChart data={data} classIds={user.classIds} /></Panel><Panel title="Your classes" subtitle="A quick look at your classrooms"><div className="class-card-list">{(user.classIds || []).map((id) => { const room = getClass(data, id); if (!room) return null; const roster = studentsOf(data, id); return <div className="class-card-row" key={id}><span className="class-avatar">{room.section}</span><span><b>{room.name} · {room.section}</b><small>{room.room} · {roster.length} students</small></span><ChevronRight size={16} /></div> })}<Link to="/app/my-classes" className="text-link class-all-link">View all classes <ArrowRight size={14} /></Link></div></Panel></div>
      <div className="dashboard-grid lower-grid"><Panel title="Recent assignments" subtitle="Keep your classwork moving" action={<Link className="text-link" to="/app/assignment-management">Manage all <ArrowRight size={14} /></Link>}><div className="assignment-mini-list">{assignments.slice(0, 3).map((item) => <div className="assignment-mini" key={item.id}><span className="deadline-icon"><FileText size={17} /></span><span><b>{item.title}</b><small>{getClass(data, item.classId)?.name} · {item.submissions.filter((s) => s.status === 'Submitted').length} submitted</small></span><span className="status-tag pending">{item.submissions.filter((s) => s.status === 'Pending').length} pending</span></div>)}</div></Panel><Panel title="School announcements" subtitle="Stay in the loop"><AnnouncementPreview rows={data.announcements.slice(0, 3)} /></Panel></div>
    </>
  }
  const studentCount = data.users.filter((item) => item.role === 'Student').length
  const teacherCount = data.users.filter((item) => item.role === 'Teacher').length
  const attendancePct = average(data.attendance.flatMap((row) => Object.values(row.records).map((status) => status === 'Present' ? 100 : status === 'Late' ? 50 : 0)))
  const overall = average(data.results.map((item) => item.score))
  const enrollments = data.classes.map((room, index) => ({ name: room.name.replace('Grade ', 'Gr. ') + ' ' + room.section, students: studentsOf(data, room.id).length, lastTerm: [19, 17, 16][index % 3] }))
  const performance = data.subjects.slice(0, 5).map((subject) => ({ name: subject.name.split(' ')[0], average: average(data.results.filter((item) => item.subjectId === subject.id).map((item) => item.score)) || 0 }))
  return <><PageHeading eyebrow="SCHOOL OVERVIEW" title="Good morning, Robert" description="Here’s how your school is doing today." action={<span className="date-chip"><CalendarDays size={15} /> {prettyDate(today)}</span>} />
    <div className="metric-grid six"><MetricCard label="Total students" value={studentCount.toLocaleString()} changeText="+8.2% this year" icon={UsersRound} tone="blue" /><MetricCard label="Teaching staff" value={teacherCount} changeText="Across all grades" icon={GraduationCap} tone="green" /><MetricCard label="Active classes" value={data.classes.length} changeText="School-wide" icon={BookOpen} tone="purple" /><MetricCard label="Subjects" value={data.subjects.length} footnote="Curriculum-wide" icon={FileText} tone="orange" /><MetricCard label="Attendance" value={`${attendancePct || 96}%`} changeText="Today’s average" icon={ClipboardCheck} tone="teal" /><MetricCard label="Academic average" value={`${overall || 88}%`} changeText="Fall semester" icon={Activity} tone="rose" /></div>
    <div className="dashboard-grid director-charts"><Panel title="Student enrollment" subtitle="Current students by class" action={<span className="chart-legend"><i /> This year</span>}><ResponsiveContainer width="100%" height={228}><BarChart data={enrollments} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} dy={9} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="students" name="Students" fill="#5478e8" radius={[6, 6, 0, 0]} barSize={30} /></BarChart></ResponsiveContainer></Panel>
      <Panel title="Attendance overview" subtitle="Recorded attendance status"><div className="attendance-chart-wrap"><ResponsiveContainer width="100%" height={190}><PieChart><Pie data={[{ name: 'Present', value: attendancePct || 96, color: '#4bb68b' }, { name: 'Other', value: 100 - (attendancePct || 96), color: '#eff2f7' }]} dataKey="value" innerRadius={62} outerRadius={83} paddingAngle={3} startAngle={90} endAngle={-270}><Cell fill="#4bb68b" /><Cell fill="#eff2f7" /></Pie><Tooltip /></PieChart></ResponsiveContainer><div className="pie-center"><b>{attendancePct || 96}%</b><span>present</span></div></div><div className="attendance-legend"><span><i className="legend-green" /> Present <b>{attendancePct || 96}%</b></span><span><i className="legend-gray" /> Absent / late <b>{100 - (attendancePct || 96)}%</b></span></div></Panel>
    </div>
    <div className="dashboard-grid lower-grid"><Panel title="Academic performance" subtitle="Average results by subject"><ResponsiveContainer width="100%" height={200}><AreaChart data={performance} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8799f2" stopOpacity={0.25} /><stop offset="100%" stopColor="#8799f2" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} dy={8} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} /><Tooltip content={<ChartTooltip />} /><Area type="monotone" dataKey="average" name="Average" stroke="#7186e8" strokeWidth={2.5} fill="url(#scoreFill)" /></AreaChart></ResponsiveContainer></Panel><Panel title="Recent school activity" subtitle="The latest from your community"><AnnouncementPreview rows={data.announcements.slice(0, 3)} /></Panel></div>
  </>
}

function AttendanceChart({ data, classIds }) {
  const chartData = data.classes.filter((room) => classIds.includes(room.id)).map((room) => {
    const records = data.attendance.filter((item) => item.classId === room.id).flatMap((item) => Object.values(item.records))
    return { name: `${room.name.replace('Grade ', '')} ${room.section}`, attendance: average(records.map((status) => status === 'Present' ? 100 : status === 'Late' ? 50 : 0)) || 96 }
  })
  return <ResponsiveContainer width="100%" height={220}><BarChart data={chartData} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} dy={8} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="attendance" name="Attendance" fill="#55bd93" radius={[6, 6, 0, 0]} barSize={32} /></BarChart></ResponsiveContainer>
}
function AnnouncementPreview({ rows = [] }) {
  return <div className="announcement-preview">{rows.map((item) => <article className="announcement-row" key={item.id}><span className="announcement-icon"><Bell size={16} /></span><div><b>{item.title}</b><p>{item.message}</p><small>{item.author} <i>·</i> {prettyDate(item.createdAt)}</small></div></article>)}{!rows.length && <EmptyState text="Nothing new to share yet." />}</div>
}
function EmptyState({ text }) { return <div className="empty-state"><span><Sparkles size={19} /></span><p>{text}</p></div> }

function Profile({ data, user, change, notify }) {
  const fields = [{ name: 'name', label: 'Full name' }, { name: 'email', label: 'Email address', type: 'email' }, { name: 'phone', label: 'Phone number', required: false }]
  return <><PageHeading eyebrow={`${user.role.toUpperCase()} ACCOUNT`} title="My profile" description="Your personal details and account information." />
    <div className="profile-layout"><Panel title="Personal information" subtitle="Keep your contact details up to date."><FormPanel title="Edit your details" fields={fields} initialValues={user} submitLabel="Update profile" onSubmit={(values) => { change('users', (users) => users.map((item) => item.id === user.id ? { ...item, ...values } : item)); notify('Your profile was updated.') }} /></Panel><aside className="profile-aside"><div className="profile-identity"><span className={`avatar avatar-large ${user.role.toLowerCase()}`}>{initials(user.name)}</span><h3>{user.name}</h3><span className="role-badge">{user.role}</span>{user.role === 'Student' && <p>{getClass(data, user.classId)?.name} · {getClass(data, user.classId)?.section}</p>}</div><div className="identity-detail"><span>EMAIL</span><b>{user.email}</b></div><div className="identity-detail"><span>PHONE</span><b>{user.phone || 'Not provided'}</b></div>{user.role === 'Student' && <div className="identity-detail"><span>ENROLLED</span><b>{prettyDate(user.joined)}</b></div>}<div className="account-security"><ShieldCheck size={17} /><span><b>Account protected</b><small>Your profile is only visible to your school.</small></span></div></aside></div>
  </>
}

function StudentSubjects({ data, user }) {
  const subjects = data.subjects.filter((subject) => subject.classIds?.includes(user.classId))
  return <><PageHeading eyebrow="YOUR LEARNING" title="My subjects" description="The classes and teachers on your schedule." /><div className="subject-grid">{subjects.map((subject, index) => <article className="subject-card" key={subject.id}><div className={`subject-art art-${index % 4}`}><BookOpen size={23} /><span>{subject.code}</span></div><div className="subject-card-body"><span className="subject-code">{subject.code}</span><h3>{subject.name}</h3><p>{getClass(data, user.classId)?.name} · Section {getClass(data, user.classId)?.section}</p><div className="subject-card-foot"><span className="teacher-chip"><span className="avatar avatar-tiny">{initials((data.users.find((teacher) => teacher.role === 'Teacher' && teacher.subjectIds?.includes(subject.id)) || {}).name || 'T')}</span>{data.users.find((teacher) => teacher.role === 'Teacher' && teacher.subjectIds?.includes(subject.id))?.name || 'School faculty'}</span><span className="schedule-chip"><Clock3 size={13} /> 4 periods / week</span></div></div></article>)}</div></>
}
function TeacherSubjects({ data, user }) {
  const subjects = data.subjects.filter((subject) => user.subjectIds?.includes(subject.id))
  return <><PageHeading eyebrow="TEACHING RESOURCES" title="My subjects" description="Your assigned subjects and the classes you teach." /><div className="subject-grid">{subjects.map((subject, index) => <article className="subject-card" key={subject.id}><div className={`subject-art art-${index % 4}`}><BookOpen size={23} /><span>{subject.code}</span></div><div className="subject-card-body"><span className="subject-code">{subject.code}</span><h3>{subject.name}</h3><p>Assigned to {subject.classIds.filter((id) => user.classIds?.includes(id)).map((id) => `${getClass(data, id)?.name} ${getClass(data, id)?.section}`).join(', ') || 'your classes'}</p><div className="subject-card-foot"><span className="schedule-chip"><UsersRound size={13} /> {studentsOf(data).filter((student) => user.classIds?.includes(student.classId) && subject.classIds.includes(student.classId)).length} students</span></div></div></article>)}</div></>
}
function Timetable({ data, user }) {
  const classIds = user.role === 'Student' ? [user.classId] : user.classIds || []
  const rooms = data.classes.filter((room) => classIds.includes(room.id))
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const periods = ['8:15 – 9:05', '9:15 – 10:05', '10:20 – 11:10', '11:20 – 12:10', '1:00 – 1:50']
  return <><PageHeading eyebrow="YOUR SCHOOL WEEK" title="Class timetable" description="A steady rhythm makes room for great ideas." action={<span className="date-chip"><CalendarDays size={15} /> Week of Nov 16</span>} /><Panel title={user.role === 'Student' ? `${getClass(data, user.classId)?.name} · ${getClass(data, user.classId)?.section}` : 'Your teaching schedule'} subtitle="Fall semester · 2026–2027"><div className="table-scroll"><table className="data-table timetable"><thead><tr><th>TIME</th>{days.map((day) => <th key={day}>{day}</th>)}</tr></thead><tbody>{periods.map((period, index) => <tr key={period}><td className="time-cell">{period}</td>{days.map((day, dayIndex) => { const room = rooms.length ? rooms[(index + dayIndex) % rooms.length] : null; const subjects = data.subjects.filter((subject) => subject.classIds?.includes(room?.id)); const subject = subjects.length ? subjects[(index + dayIndex) % subjects.length] : null; return <td key={day}><div className={`timetable-cell cell-${(index + dayIndex) % 4}`}><b>{subject?.name || (index === 2 ? 'Advisory' : 'Study hall')}</b><span>{room?.room || 'Learning commons'}</span></div></td> })}</tr>)}</tbody></table></div></Panel><div className="timetable-note"><Clock3 size={16} /> Lunch break is from 12:10 PM to 1:00 PM each day.</div></>
}
function AttendanceView({ data, user }) {
  const rows = data.attendance.filter((item) => item.classId === user.classId && item.records[user.id] !== undefined).sort((a, b) => b.date.localeCompare(a.date))
  const present = rows.filter((item) => item.records[user.id] === 'Present').length
  const pct = rows.length ? Math.round((present / rows.length) * 100) : 96
  return <><PageHeading eyebrow="YOUR SCHOOL YEAR" title="My attendance" description="Showing up is a superpower. Keep your momentum going." /><div className="metric-grid three"><MetricCard label="Attendance rate" value={`${pct}%`} changeText="You’re doing great" icon={ClipboardCheck} tone="green" /><MetricCard label="Days present" value={present} footnote={`of ${rows.length || 20} recorded days`} icon={CheckCircle2} tone="blue" /><MetricCard label="Days to review" value={rows.filter((item) => item.records[user.id] !== 'Present').length} footnote="Late or absent" icon={CalendarDays} tone="orange" /></div><Panel title="Attendance history" subtitle="Your recent classroom records"><AttendanceTable rows={rows} data={data} studentId={user.id} /></Panel></>
}
function AttendanceTable({ rows, data, studentId, includeClass = false }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>DATE</th>{includeClass && <th>CLASS</th>}<th>SUBJECT</th><th>STATUS</th><th>RECORDED</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{prettyDate(row.date)}</td>{includeClass && <td>{getClass(data, row.classId)?.name} · {getClass(data, row.classId)?.section}</td>}<td>{getSubject(data, row.subjectId)?.name || 'Homeroom'}</td><td><span className={`status-tag ${(row.records[studentId] || 'Present').toLowerCase()}`}>{row.records[studentId] || 'Present'}</span></td><td>{row.date === today ? 'Today' : 'Class register'}</td></tr>)}</tbody></table>{!rows.length && <EmptyState text="Attendance records will appear here." />}</div>
}
function ResultsView({ data, user }) {
  const rows = data.results.filter((item) => item.studentId === user.id)
  return <><PageHeading eyebrow="YOUR ACHIEVEMENTS" title="Examination results" description="Celebrate what you know, and keep growing." /><div className="metric-grid three"><MetricCard label="Overall average" value={`${average(rows.map((item) => item.score)) || '—'}${rows.length ? '%' : ''}`} changeText={rows.length ? 'Fall 2026' : 'No results yet'} icon={Activity} tone="blue" /><MetricCard label="Examinations" value={rows.length} footnote="Results published" icon={FileText} tone="purple" /><MetricCard label="Subjects above 80%" value={rows.filter((item) => item.score >= 80).length} footnote="Keep up the great work" icon={GraduationCap} tone="green" /></div><Panel title="Your results" subtitle="Fall 2026 · Midterm examinations"><ResultsTable rows={rows} data={data} /></Panel></>
}
function ResultsTable({ rows, data }) {
  return <div className="table-scroll"><table className="data-table"><thead><tr><th>SUBJECT</th><th>EXAM</th><th>TERM</th><th>SCORE</th><th>GRADE</th><th>PROGRESS</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><b>{getSubject(data, row.subjectId)?.name || '—'}</b></td><td>{row.exam}</td><td>{row.term}</td><td><b>{row.score}<span className="score-max"> / {row.maxScore}</span></b></td><td><span className={`grade-badge grade-${grade(row.score).toLowerCase()}`}>{grade(row.score)}</span></td><td><div className="score-track"><i style={{ width: `${Math.min(100, row.score / row.maxScore * 100)}%` }} /></div></td></tr>)}</tbody></table>{!rows.length && <EmptyState text="Your teachers haven’t published any results yet." />}</div>
}
function Assignments({ data, user, change, notify }) {
  const isStudent = user.role === 'Student'
  const allowedClasses = isStudent ? [user.classId] : user.classIds || []
  const rows = data.assignments.filter((item) => allowedClasses.includes(item.classId) && (isStudent || user.subjectIds?.includes(item.subjectId)))
  const [selected, setSelected] = useState('')
  const [search, setSearch] = useState('')
  const filtered = rows.filter((item) => `${item.title} ${getSubject(data, item.subjectId)?.name}`.toLowerCase().includes(search.toLowerCase()))
  const saveAssignment = (values) => {
    if (!isStudent && (!user.classIds?.includes(values.classId) || !user.subjectIds?.includes(values.subjectId) || !getSubject(data, values.subjectId)?.classIds?.includes(values.classId))) {
      notify('Choose one of your assigned subjects and classes.')
      return
    }
    const previous = data.assignments.find((item) => item.id === selected)
    const submissions = previous?.classId === values.classId
      ? previous.submissions
      : studentsOf(data, values.classId).map((student) => previous?.submissions.find((submission) => submission.studentId === student.id) || { studentId: student.id, status: 'Pending' })
    const payload = { ...values, id: selected || makeId('a'), submissions }
    change('assignments', (items) => selected ? items.map((item) => item.id === selected ? payload : item) : [...items, payload])
    setSelected('')
    notify(selected ? 'Assignment updated.' : 'Assignment created.')
  }
  const removeAssignment = (id) => { change('assignments', (items) => items.filter((item) => item.id !== id)); notify('Assignment deleted.') }
  const submitWork = (assignment) => {
    change('assignments', (items) => items.map((item) => item.id === assignment.id ? { ...item, submissions: item.submissions.map((submission) => submission.studentId === user.id ? { ...submission, status: 'Submitted', submittedAt: today } : submission) } : item))
    notify('Your assignment was submitted.')
  }
  const fields = [{ name: 'title', label: 'Assignment title' }, { name: 'classId', label: 'Class', type: 'select', options: data.classes.filter((item) => user.classIds?.includes(item.id)).map((item) => ({ value: item.id, label: `${item.name} · ${item.section}` })) }, { name: 'subjectId', label: 'Subject', type: 'select', options: data.subjects.filter((item) => user.subjectIds?.includes(item.id)).map((item) => ({ value: item.id, label: item.name })) }, { name: 'deadline', label: 'Deadline', type: 'date' }, { name: 'description', label: 'Instructions', type: 'textarea', wide: true }]
  const editing = data.assignments.find((item) => item.id === selected)
  return <><PageHeading eyebrow={isStudent ? 'YOUR CLASSWORK' : 'CLASSROOM TOOLS'} title={isStudent ? 'Assignments' : 'Assignment management'} description={isStudent ? 'Everything you need to do, all in one place.' : 'Create classwork and support your students’ progress.'} action={!isStudent && <button className="primary-button" onClick={() => setSelected(selected === 'new' ? '' : 'new')}><Plus size={16} /> New assignment</button>} />
    {!isStudent && (selected === 'new' || editing) && <FormPanel title={editing ? 'Edit assignment' : 'Create an assignment'} description="Share clear instructions and a deadline with your class." fields={fields} initialValues={editing || {}} onSubmit={saveAssignment} onCancel={() => setSelected('')} />}
    <Panel title={isStudent ? 'Your assignments' : 'Published assignments'} subtitle={`${filtered.length} assignment${filtered.length === 1 ? '' : 's'} in your classes`} action={<div className="table-search"><Search size={15} /><input placeholder="Search assignments" value={search} onChange={(event) => setSearch(event.target.value)} /></div>}>
      <div className="assignment-list">{filtered.map((item) => {
        const submission = item.submissions.find((entry) => entry.studentId === user.id)
        const submitted = submission?.status === 'Submitted'
        return <article className="assignment-card" key={item.id}><div className="assignment-card-main"><span className="assignment-card-icon"><FileText size={19} /></span><div><div className="assignment-tags"><span className="subject-code">{getSubject(data, item.subjectId)?.name}</span><span className={`status-tag ${submitted ? 'present' : 'pending'}`}>{isStudent ? submitted ? 'Submitted' : 'To do' : `${item.submissions.filter((entry) => entry.status === 'Submitted').length} / ${item.submissions.length} submitted`}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="assignment-meta"><span><CalendarDays size={14} /> Due {prettyDate(item.deadline)}</span><span><UsersRound size={14} /> {getClass(data, item.classId)?.name} · {getClass(data, item.classId)?.section}</span></div>{submission?.feedback && <div className="feedback-box"><b>Teacher feedback:</b> {submission.feedback}{submission.marks !== undefined && <span> · {submission.marks}/20</span>}</div>}</div></div><div className="assignment-actions">{isStudent ? <button className={`secondary-button ${submitted ? 'button-done' : ''}`} disabled={submitted} onClick={() => submitWork(item)}>{submitted ? <><Check size={15} /> Submitted</> : 'Submit work'}</button> : <><button className="secondary-button" onClick={() => setSelected(item.id)}>Edit</button><button className="icon-button" aria-label={`Delete ${item.title}`} onClick={() => removeAssignment(item.id)}><X size={16} /></button></>}</div></article>
      })}{!filtered.length && <EmptyState text="No assignments match your search." />}</div>
    </Panel>
    {!isStudent && <ReviewSubmissions data={data} assignments={filtered} change={change} notify={notify} />}
  </>
}
function ReviewSubmissions({ data, assignments, change, notify }) {
  const [review, setReview] = useState(null)
  const submissionRows = assignments.flatMap((assignment) => assignment.submissions.filter((item) => item.status === 'Submitted').map((submission) => ({ assignment, submission })))
  const fields = [{ name: 'marks', label: 'Mark out of 20', type: 'number', min: 0, max: 20 }, { name: 'feedback', label: 'Feedback', type: 'textarea', wide: true, required: false }]
  return <Panel title="Student submissions" subtitle={`${submissionRows.length} submissions ready to review`}><div className="table-scroll"><table className="data-table"><thead><tr><th>STUDENT</th><th>ASSIGNMENT</th><th>SUBMITTED</th><th>MARK / 20</th><th /></tr></thead><tbody>{submissionRows.map(({ assignment, submission }) => <tr key={`${assignment.id}-${submission.studentId}`}><td>{getUser(data, submission.studentId)?.name}</td><td>{assignment.title}</td><td>{prettyDate(submission.submittedAt)}</td><td>{submission.marks ?? '—'}</td><td><button className="text-link" onClick={() => setReview({ assignment, submission })}>Review</button></td></tr>)}</tbody></table>{!submissionRows.length && <EmptyState text="Submitted work will appear here for review." />}</div>{review && <FormPanel title={`Review ${getUser(data, review.submission.studentId)?.name}’s work`} fields={fields} initialValues={review.submission} submitLabel="Save feedback" onCancel={() => setReview(null)} onSubmit={(values) => { change('assignments', (items) => items.map((item) => item.id === review.assignment.id ? { ...item, submissions: item.submissions.map((submission) => submission.studentId === review.submission.studentId ? { ...submission, marks: Number(values.marks), feedback: values.feedback } : submission) } : item)); setReview(null); notify('Feedback saved.') }} />}</Panel>
}
function MyClasses({ data, user }) {
  return <><PageHeading eyebrow="YOUR CLASSROOMS" title="My classes" description="A home for every student and every new idea." /><div className="classroom-grid">{(user.classIds || []).map((id) => { const room = getClass(data, id); if (!room) return null; const students = studentsOf(data, id); const subjects = data.subjects.filter((subject) => user.subjectIds?.includes(subject.id) && subject.classIds?.includes(id)); return <Panel key={id} title={`${room.name} · ${room.section}`} subtitle={`${room.room} · ${students.length} students`}><div className="class-subject-tags">{subjects.map((subject) => <span key={subject.id}>{subject.name}</span>)}</div><div className="student-avatars">{students.slice(0, 6).map((student) => <span key={student.id} className="avatar avatar-small" title={student.name}>{initials(student.name)}</span>)}<span className="avatar-count">{students.length} students</span></div><div className="class-detail-row"><span>Class capacity</span><b>{students.length} / {room.capacity || 24}</b></div></Panel> })}</div></>
}
function StudentList({ data, user }) {
  const [query, setQuery] = useState('')
  const [classId, setClassId] = useState('')
  const [selected, setSelected] = useState(null)
  const students = studentsOf(data).filter((item) => user.classIds?.includes(item.classId)).filter((item) => (!classId || item.classId === classId) && `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageHeading eyebrow="YOUR ROSTER" title="Student list" description="Get to know the students in your classrooms." /><Panel title="Assigned students" subtitle={`${students.length} students`}><div className="table-toolbar"><div className="table-search"><Search size={15} /><input placeholder="Search by name or email" value={query} onChange={(event) => setQuery(event.target.value)} /></div><select className="filter-select" value={classId} onChange={(event) => setClassId(event.target.value)}><option value="">All assigned classes</option>{data.classes.filter((room) => user.classIds?.includes(room.id)).map((room) => <option value={room.id} key={room.id}>{room.name} · {room.section}</option>)}</select></div><div className="table-scroll"><table className="data-table"><thead><tr><th>STUDENT</th><th>CLASS</th><th>EMAIL</th><th>ATTENDANCE</th><th /></tr></thead><tbody>{students.map((student) => { const records = data.attendance.filter((row) => row.classId === student.classId && row.records[student.id]); const pct = records.length ? average(records.map((row) => row.records[student.id] === 'Present' ? 100 : row.records[student.id] === 'Late' ? 50 : 0)) : 96; return <tr key={student.id}><td><span className="table-person"><span className="avatar avatar-small">{initials(student.name)}</span><b>{student.name}</b></span></td><td>{getClass(data, student.classId)?.name} · {getClass(data, student.classId)?.section}</td><td>{student.email}</td><td><span className="attendance-inline">{pct}%</span></td><td><button className="text-link" onClick={() => setSelected(student)}>View profile</button></td></tr> })}</tbody></table>{!students.length && <EmptyState text="No students found for this search." />}</div></Panel>{selected && <StudentDetail data={data} student={selected} onClose={() => setSelected(null)} />}</>
}
function StudentDetail({ data, student, onClose }) {
  const results = data.results.filter((item) => item.studentId === student.id)
  return <div className="modal-backdrop" onClick={onClose}><section className="detail-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={onClose}><X size={18} /></button><div className="profile-identity"><span className="avatar avatar-large">{initials(student.name)}</span><h3>{student.name}</h3><span className="role-badge">{getClass(data, student.classId)?.name} · {getClass(data, student.classId)?.section}</span></div><div className="identity-detail"><span>EMAIL</span><b>{student.email}</b></div><div className="identity-detail"><span>PHONE</span><b>{student.phone || 'Not provided'}</b></div><div className="identity-detail"><span>EXAM AVERAGE</span><b>{average(results.map((item) => item.score)) || '—'}{results.length ? '%' : ''}</b></div><div className="identity-detail"><span>EXAMS COMPLETED</span><b>{results.length}</b></div><button className="secondary-button modal-done" onClick={onClose}>Done</button></section></div>
}
function AttendanceManagement({ data, user, change, notify }) {
  const [classId, setClassId] = useState(user.classIds?.[0] || '')
  const [date, setDate] = useState(today)
  const [subjectId, setSubjectId] = useState(user.subjectIds?.[0] || '')
  const students = studentsOf(data, classId)
  const existing = data.attendance.find((row) => row.classId === classId && row.date === date && row.subjectId === subjectId)
  const [records, setRecords] = useState({})
  useEffect(() => {
    const row = data.attendance.find((item) => item.classId === classId && item.date === date && item.subjectId === subjectId)
    setRecords(Object.fromEntries(students.map((student) => [student.id, row?.records?.[student.id] || 'Present'])))
  }, [classId, date, subjectId, data.attendance, students.map((student) => student.id).join(',')])
  const save = () => {
    const payload = { id: existing?.id || makeId('at'), classId, date, subjectId, records: { ...(existing?.records || {}), ...records } }
    change('attendance', (rows) => existing ? rows.map((row) => row.id === existing.id ? payload : row) : [...rows, payload])
    notify(existing ? 'Attendance updated.' : 'Attendance saved.')
  }
  const past = data.attendance.filter((row) => user.classIds?.includes(row.classId)).sort((a, b) => b.date.localeCompare(a.date))
  return <><PageHeading eyebrow="CLASSROOM TOOLS" title="Attendance management" description="A thoughtful record helps every student thrive." /><Panel title="Take attendance" subtitle="Choose a class, subject, and date to get started."><div className="table-toolbar"><select className="filter-select" value={classId} onChange={(event) => setClassId(event.target.value)}>{data.classes.filter((room) => user.classIds?.includes(room.id)).map((room) => <option key={room.id} value={room.id}>{room.name} · {room.section}</option>)}</select><select className="filter-select" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>{data.subjects.filter((subject) => user.subjectIds?.includes(subject.id)).map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select><input className="filter-select" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div><div className="table-scroll"><table className="data-table"><thead><tr><th>STUDENT</th><th>STATUS</th><th>MARK PRESENT</th><th>MARK LATE</th><th>MARK ABSENT</th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><span className="table-person"><span className="avatar avatar-small">{initials(student.name)}</span><b>{student.name}</b></span></td><td><span className={`status-tag ${(records[student.id] || 'Present').toLowerCase()}`}>{records[student.id] || 'Present'}</span></td>{['Present', 'Late', 'Absent'].map((status) => <td key={status}><button className={`attendance-choice ${records[student.id] === status ? 'chosen' : ''}`} onClick={() => setRecords((value) => ({ ...value, [student.id]: status }))}>{records[student.id] === status && <Check size={13} />}{status}</button></td>)}</tr>)}</tbody></table>{!students.length && <EmptyState text="There are no students in this class yet." />}</div><div className="table-bottom"><span>{Object.values(records).filter((status) => status === 'Present').length} present · {Object.values(records).filter((status) => status === 'Late').length} late · {Object.values(records).filter((status) => status === 'Absent').length} absent</span><button className="primary-button" onClick={save}><Check size={16} /> Save attendance</button></div></Panel><Panel title="Recent attendance history" subtitle="Your assigned classes"><AttendanceTable rows={past} data={data} studentId={user.id} includeClass /></Panel></>
}
function AttendanceReports({ data }) {
  const rows = data.attendance.slice().sort((a, b) => b.date.localeCompare(a.date))
  const total = rows.reduce((count, row) => count + Object.keys(row.records).length, 0)
  const present = rows.reduce((count, row) => count + Object.values(row.records).filter((status) => status === 'Present').length, 0)
  return <><PageHeading eyebrow="SCHOOL REPORTS" title="Attendance reports" description="Monitor attendance trends across every classroom." /><div className="metric-grid three"><MetricCard label="Overall attendance" value={`${Math.round(present / (total || 1) * 100)}%`} changeText="Across all records" icon={ClipboardCheck} tone="green" /><MetricCard label="Class registers" value={rows.length} footnote="Attendance sessions" icon={CalendarDays} tone="blue" /><MetricCard label="Students tracked" value={total} footnote="Recorded check-ins" icon={UsersRound} tone="purple" /></div><div className="dashboard-grid"><Panel title="Attendance by class" subtitle="Classroom-level summary"><div className="summary-bar-list">{data.classes.map((room) => { const classRows = rows.filter((row) => row.classId === room.id); const values = classRows.flatMap((row) => Object.values(row.records).map((status) => status === 'Present' ? 100 : status === 'Late' ? 50 : 0)); const rate = average(values); return <div className="summary-bar-row" key={room.id}><span>{room.name} · {room.section}</span><div className="score-track"><i style={{ width: `${rate || 0}%` }} /></div><b>{rate || 0}%</b></div> })}</div></Panel><Panel title="Latest registers" subtitle="Most recent classroom updates"><div className="recent-registers">{rows.slice(0, 5).map((row) => <div className="class-card-row" key={row.id}><span className="deadline-icon"><ClipboardCheck size={17} /></span><span><b>{getClass(data, row.classId)?.name} · {getClass(data, row.classId)?.section}</b><small>{prettyDate(row.date)} · {getSubject(data, row.subjectId)?.name}</small></span><span className="status-tag present">{Object.values(row.records).filter((s) => s === 'Present').length} present</span></div>)}</div></Panel></div><Panel title="All attendance records" subtitle={`${rows.length} saved registers`}><div className="table-scroll"><table className="data-table"><thead><tr><th>DATE</th><th>CLASS</th><th>SUBJECT</th><th>STUDENTS</th><th>PRESENT</th><th>LATE</th><th>ABSENT</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td>{prettyDate(row.date)}</td><td>{getClass(data, row.classId)?.name} · {getClass(data, row.classId)?.section}</td><td>{getSubject(data, row.subjectId)?.name}</td><td>{Object.keys(row.records).length}</td><td>{Object.values(row.records).filter((s) => s === 'Present').length}</td><td>{Object.values(row.records).filter((s) => s === 'Late').length}</td><td>{Object.values(row.records).filter((s) => s === 'Absent').length}</td></tr>)}</tbody></table></div></Panel></>
}
function ResultsManagement({ data, user, change, notify }) {
  const isTeacher = user.role === 'Teacher'
  const allowedClassIds = isTeacher ? user.classIds || [] : data.classes.map((room) => room.id)
  const allowedSubjectIds = isTeacher ? user.subjectIds || [] : data.subjects.map((subject) => subject.id)
  const [classId, setClassId] = useState(allowedClassIds[0] || '')
  const [subjectId, setSubjectId] = useState(allowedSubjectIds[0] || '')
  const [exam, setExam] = useState('Midterm')
  const [term, setTerm] = useState('Fall 2026')
  const students = studentsOf(data, classId)
  const existing = data.results.filter((row) => students.some((student) => student.id === row.studentId) && row.subjectId === subjectId)
  const saveScore = (studentId, rawScore) => {
    if (rawScore === '' || !Number.isFinite(Number(rawScore)) || Number(rawScore) < 0 || Number(rawScore) > 100) {
      notify('Enter an examination mark from 0 to 100.')
      return
    }
    const found = data.results.find((row) => row.studentId === studentId && row.subjectId === subjectId && row.exam === exam && row.term === term)
    const result = { id: found?.id || makeId('r'), studentId, subjectId, exam, term, score: Number(rawScore), maxScore: 100 }
    change('results', (rows) => found ? rows.map((row) => row.id === found.id ? result : row) : [...rows, result])
  }
  const scopedResults = isTeacher ? data.results.filter((row) => allowedSubjectIds.includes(row.subjectId) && allowedClassIds.includes(getUser(data, row.studentId)?.classId)) : data.results
  return <><PageHeading eyebrow={isTeacher ? 'CLASSROOM TOOLS' : 'SCHOOL REPORTS'} title={isTeacher ? 'Examination management' : 'Examination results'} description={isTeacher ? 'Record scores and celebrate progress with your students.' : 'Published results across classes and subjects.'} />
    {isTeacher && <Panel title="Enter examination marks" subtitle="Choose a class, subject, and examination. Grades are calculated automatically."><div className="table-toolbar"><select className="filter-select" value={classId} onChange={(event) => setClassId(event.target.value)}>{data.classes.filter((room) => allowedClassIds.includes(room.id)).map((room) => <option value={room.id} key={room.id}>{room.name} · {room.section}</option>)}</select><select className="filter-select" value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>{data.subjects.filter((subject) => allowedSubjectIds.includes(subject.id)).map((subject) => <option value={subject.id} key={subject.id}>{subject.name}</option>)}</select><select className="filter-select" value={exam} onChange={(event) => setExam(event.target.value)}><option>Midterm</option><option>Final exam</option><option>Quiz</option><option>Project</option></select><select className="filter-select" value={term} onChange={(event) => setTerm(event.target.value)}><option>Fall 2026</option><option>Spring 2027</option></select></div><div className="table-scroll"><table className="data-table"><thead><tr><th>STUDENT</th><th>EXISTING SCORE</th><th>ENTER SCORE / 100</th><th>GRADE</th></tr></thead><tbody>{students.map((student) => { const result = data.results.find((row) => row.studentId === student.id && row.subjectId === subjectId && row.exam === exam && row.term === term); return <ScoreInputRow key={student.id} student={student} result={result} onSave={saveScore} /> })}</tbody></table>{!students.length && <EmptyState text="There are no students in this class yet." />}</div></Panel>}
    <Panel title={isTeacher ? 'Class performance' : 'Published examination results'} subtitle={isTeacher ? `${existing.length} recorded subject results` : `${scopedResults.length} results across the school`}><ResultsTable rows={scopedResults} data={data} /></Panel>
    {isTeacher && <Panel title="Performance by student" subtitle="Average results for your classes"><div className="summary-bar-list">{students.map((student) => { const studentResults = data.results.filter((row) => row.studentId === student.id && allowedSubjectIds.includes(row.subjectId)); const mark = average(studentResults.map((row) => row.score)); return <div className="summary-bar-row" key={student.id}><span>{student.name}</span><div className="score-track"><i style={{ width: `${mark}%` }} /></div><b>{mark ? `${mark}%` : '—'}</b></div> })}</div></Panel>}
  </>
}
function ScoreInputRow({ student, result, onSave }) {
  const [value, setValue] = useState(result?.score ?? '')
  useEffect(() => setValue(result?.score ?? ''), [result?.score])
  return <tr><td><span className="table-person"><span className="avatar avatar-small">{initials(student.name)}</span><b>{student.name}</b></span></td><td>{result ? `${result.score} / 100` : '—'}</td><td><div className="score-entry"><input aria-label={`Score for ${student.name}`} type="number" min="0" max="100" value={value} onChange={(event) => setValue(event.target.value)} placeholder="0–100" /><button className="text-link" onClick={() => onSave(student.id, value)}>Save</button></div></td><td>{value !== '' && <span className={`grade-badge grade-${grade(Number(value)).toLowerCase()}`}>{grade(Number(value))}</span>}</td></tr>
}
function DirectorStudents({ data, change, notify }) {
  const [query, setQuery] = useState('')
  const [classId, setClassId] = useState('')
  const [editing, setEditing] = useState(null)
  const students = data.users.filter((item) => item.role === 'Student').filter((item) => (!classId || item.classId === classId) && `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()))
  const fields = [{ name: 'name', label: 'Full name' }, { name: 'email', label: 'Email address', type: 'email' }, { name: 'classId', label: 'Assign to class', type: 'select', options: data.classes.map((room) => ({ value: room.id, label: `${room.name} · ${room.section}` })) }, { name: 'phone', label: 'Phone number', required: false }]
  const save = (values) => {
    change('users', (users) => editing ? users.map((item) => item.id === editing.id ? { ...item, ...values } : item) : [...users, { id: makeId('s'), ...values, password: 'student123', role: 'Student', joined: today }])
    setEditing(null); notify(editing ? 'Student details updated.' : 'Student registered.')
  }
  const remove = (student) => { if (!window.confirm(`Remove ${student.name} from the school directory?`)) return; change('users', (users) => users.filter((item) => item.id !== student.id)); notify('Student record deleted.') }
  return <><PageHeading eyebrow="SCHOOL DIRECTORY" title="Student management" description="Welcome students in, and help every learner find their place." action={<button className="primary-button" onClick={() => setEditing(editing?.id === 'new' ? null : { id: 'new' })}><Plus size={16} /> Register student</button>} />{editing && <FormPanel title={editing.id === 'new' ? 'Register a new student' : `Edit ${editing.name}`} description="Add the student’s contact information and classroom." fields={fields} initialValues={editing.id === 'new' ? {} : editing} submitLabel={editing.id === 'new' ? 'Register student' : 'Save student'} onSubmit={save} onCancel={() => setEditing(null)} />}<Panel title="All students" subtitle={`${students.length} enrolled students`}><div className="table-toolbar"><div className="table-search"><Search size={15} /><input placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} /></div><select className="filter-select" value={classId} onChange={(event) => setClassId(event.target.value)}><option value="">All classes</option>{data.classes.map((room) => <option value={room.id} key={room.id}>{room.name} · {room.section}</option>)}</select></div><div className="table-scroll"><table className="data-table"><thead><tr><th>STUDENT</th><th>CLASS</th><th>EMAIL</th><th>PHONE</th><th>ENROLLED</th><th /></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><span className="table-person"><span className="avatar avatar-small">{initials(student.name)}</span><b>{student.name}</b></span></td><td>{getClass(data, student.classId)?.name} · {getClass(data, student.classId)?.section}</td><td>{student.email}</td><td>{student.phone || '—'}</td><td>{prettyDate(student.joined)}</td><td><RowActions onEdit={() => setEditing(student)} onDelete={() => remove(student)} /></td></tr>)}</tbody></table>{!students.length && <EmptyState text="No students found." />}</div></Panel></>
}
function DirectorTeachers({ data, change, notify }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const teachers = data.users.filter((item) => item.role === 'Teacher').filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(query.toLowerCase()))
  const fields = [{ name: 'name', label: 'Full name' }, { name: 'email', label: 'Email address', type: 'email' }, { name: 'phone', label: 'Phone number', required: false }]
  const save = (values) => {
    change('users', (users) => editing ? users.map((item) => item.id === editing.id ? { ...item, ...values } : item) : [...users, { id: makeId('t'), ...values, password: 'teacher123', role: 'Teacher', classIds: [], subjectIds: [] }])
    setEditing(null); notify(editing ? 'Teacher details updated.' : 'Teacher registered.')
  }
  const remove = (teacher) => { if (!window.confirm(`Remove ${teacher.name} from the staff directory?`)) return; change('users', (users) => users.filter((item) => item.id !== teacher.id)); notify('Teacher record deleted.') }
  return <><PageHeading eyebrow="SCHOOL DIRECTORY" title="Teacher management" description="The people who make every school day meaningful." action={<button className="primary-button" onClick={() => setEditing(editing?.id === 'new' ? null : { id: 'new' })}><Plus size={16} /> Add teacher</button>} />{editing && <FormPanel title={editing.id === 'new' ? 'Register a teacher' : `Edit ${editing.name}`} fields={fields} initialValues={editing.id === 'new' ? {} : editing} submitLabel={editing.id === 'new' ? 'Register teacher' : 'Save teacher'} onSubmit={save} onCancel={() => setEditing(null)} />}<Panel title="Teaching staff" subtitle={`${teachers.length} teachers`}><div className="table-toolbar"><div className="table-search"><Search size={15} /><input placeholder="Search teachers" value={query} onChange={(event) => setQuery(event.target.value)} /></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>TEACHER</th><th>EMAIL</th><th>CLASSES</th><th>SUBJECTS</th><th>PHONE</th><th /></tr></thead><tbody>{teachers.map((teacher) => <tr key={teacher.id}><td><span className="table-person"><span className="avatar avatar-small teacher">{initials(teacher.name)}</span><b>{teacher.name}</b></span></td><td>{teacher.email}</td><td>{teacher.classIds?.map((id) => `${getClass(data, id)?.name} ${getClass(data, id)?.section}`).join(', ') || 'Unassigned'}</td><td>{teacher.subjectIds?.map((id) => getSubject(data, id)?.name).filter(Boolean).join(', ') || 'Unassigned'}</td><td>{teacher.phone || '—'}</td><td><RowActions onEdit={() => setEditing(teacher)} onDelete={() => remove(teacher)} /></td></tr>)}</tbody></table></div></Panel></>
}
function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="text-link" onClick={onEdit}>Edit</button><button className="text-link danger-link" onClick={onDelete}>Delete</button></div>
}
function DirectorClasses({ data, change, notify }) {
  const [editing, setEditing] = useState(null)
  const fields = [{ name: 'name', label: 'Grade / class name', placeholder: 'e.g. Grade 8' }, { name: 'section', label: 'Section', placeholder: 'e.g. A' }, { name: 'room', label: 'Room', placeholder: 'e.g. Room 205' }, { name: 'capacity', label: 'Capacity', type: 'number', min: 1 }]
  const save = (values) => { change('classes', (items) => editing ? items.map((item) => item.id === editing.id ? { ...item, ...values, capacity: Number(values.capacity) } : item) : [...items, { id: makeId('c'), ...values, capacity: Number(values.capacity) }]); setEditing(null); notify(editing ? 'Class updated.' : 'Class created.') }
  const remove = (room) => { const count = studentsOf(data, room.id).length; if (!window.confirm(`Delete ${room.name} · ${room.section}?${count ? ` ${count} student(s) will need reassignment.` : ''}`)) return; change('classes', (items) => items.filter((item) => item.id !== room.id)); change('users', (users) => users.map((item) => item.classId === room.id ? { ...item, classId: '' } : item)); change('subjects', (items) => items.map((item) => ({ ...item, classIds: item.classIds.filter((id) => id !== room.id) }))); notify('Class deleted.') }
  return <><PageHeading eyebrow="ACADEMIC STRUCTURE" title="Class management" description="Build supportive classrooms, one section at a time." action={<button className="primary-button" onClick={() => setEditing(editing?.id === 'new' ? null : { id: 'new' })}><Plus size={16} /> Create class</button>} />{editing && <FormPanel title={editing.id === 'new' ? 'Create a class' : 'Edit class details'} fields={fields} initialValues={editing.id === 'new' ? { capacity: 24 } : editing} submitLabel="Save class" onSubmit={save} onCancel={() => setEditing(null)} />}<div className="classroom-grid">{data.classes.map((room) => { const students = studentsOf(data, room.id); const teachers = data.users.filter((item) => item.role === 'Teacher' && item.classIds?.includes(room.id)); const subjects = data.subjects.filter((item) => item.classIds?.includes(room.id)); return <Panel key={room.id} title={`${room.name} · ${room.section}`} subtitle={room.room} action={<div className="row-actions"><button className="text-link" onClick={() => setEditing(room)}>Edit</button><button className="text-link danger-link" onClick={() => remove(room)}>Delete</button></div>}><div className="class-stats"><div><b>{students.length}</b><span>students</span></div><div><b>{teachers.length}</b><span>teachers</span></div><div><b>{subjects.length}</b><span>subjects</span></div></div><div className="class-detail-row"><span>Capacity</span><b>{students.length} / {room.capacity || 24}</b></div><div className="class-subject-tags">{subjects.map((subject) => <span key={subject.id}>{subject.name}</span>)}</div></Panel> })}</div></>
}
function DirectorSubjects({ data, change, notify }) {
  const [editing, setEditing] = useState(null)
  const fields = [{ name: 'name', label: 'Subject name' }, { name: 'code', label: 'Subject code' }, { name: 'classId', label: 'Assign to class', type: 'select', options: data.classes.map((room) => ({ value: room.id, label: `${room.name} · ${room.section}` })) }]
  const save = (values) => { change('subjects', (subjects) => { const found = editing && subjects.find((item) => item.id === editing.id); return found ? subjects.map((item) => item.id === found.id ? { ...item, name: values.name, code: values.code, classIds: Array.from(new Set([...(item.classIds || []), values.classId])) } : item) : [...subjects, { id: makeId('m'), name: values.name, code: values.code, classIds: [values.classId] }] }); setEditing(null); notify(editing ? 'Subject updated.' : 'Subject added.') }
  const remove = (subject) => { if (!window.confirm(`Delete ${subject.name} from the curriculum?`)) return; change('subjects', (items) => items.filter((item) => item.id !== subject.id)); change('users', (users) => users.map((item) => ({ ...item, subjectIds: item.subjectIds?.filter((id) => id !== subject.id) || [] }))); notify('Subject deleted.') }
  return <><PageHeading eyebrow="ACADEMIC STRUCTURE" title="Subject management" description="Shape a curriculum that inspires students to explore." action={<button className="primary-button" onClick={() => setEditing(editing?.id === 'new' ? null : { id: 'new' })}><Plus size={16} /> Add subject</button>} />{editing && <FormPanel title={editing.id === 'new' ? 'Add a subject' : 'Edit subject'} description="Assign the subject to a class. Add more classes by updating the subject again." fields={fields} initialValues={editing.id === 'new' ? {} : { ...editing, classId: editing.classIds[0] }} submitLabel="Save subject" onSubmit={save} onCancel={() => setEditing(null)} />}<Panel title="Curriculum" subtitle={`${data.subjects.length} subjects`}><div className="table-scroll"><table className="data-table"><thead><tr><th>SUBJECT</th><th>CODE</th><th>CLASSES</th><th>ENROLLED STUDENTS</th><th /></tr></thead><tbody>{data.subjects.map((subject) => <tr key={subject.id}><td><span className="table-person"><span className="subject-mini-icon"><BookOpen size={16} /></span><b>{subject.name}</b></span></td><td><span className="code-chip">{subject.code}</span></td><td>{subject.classIds.map((id) => `${getClass(data, id)?.name} ${getClass(data, id)?.section}`).join(', ')}</td><td>{studentsOf(data).filter((student) => subject.classIds.includes(student.classId)).length}</td><td><RowActions onEdit={() => setEditing(subject)} onDelete={() => remove(subject)} /></td></tr>)}</tbody></table></div></Panel></>
}
function TeacherAssignment({ data, change, notify }) {
  const [editingId, setEditingId] = useState('')
  const fields = [{ name: 'teacherId', label: 'Teacher', type: 'select', options: data.users.filter((item) => item.role === 'Teacher').map((item) => ({ value: item.id, label: item.name })) }, { name: 'classId', label: 'Class', type: 'select', options: data.classes.map((room) => ({ value: room.id, label: `${room.name} · ${room.section}` })) }, { name: 'subjectId', label: 'Subject', type: 'select', options: data.subjects.map((item) => ({ value: item.id, label: item.name })) }]
  const save = (values) => {
    const assignment = { teacherId: values.teacherId, classId: values.classId, subjectId: values.subjectId }
    change('users', (users) => users.map((teacher) => {
      if (teacher.role !== 'Teacher') return teacher
      const classIds = new Set(teacher.classIds || [])
      const subjectIds = new Set(teacher.subjectIds || [])
      if (teacher.id === editingId) { classIds.delete(editingId.split(':')[1]); subjectIds.delete(editingId.split(':')[2]) }
      if (teacher.id === values.teacherId) { classIds.add(values.classId); subjectIds.add(values.subjectId) }
      return { ...teacher, classIds: [...classIds], subjectIds: [...subjectIds] }
    }))
    setEditingId('')
    notify('Teacher assignment saved.')
  }
  const remove = (teacher, classId, subjectId) => {
    if (!window.confirm(`Remove ${teacher.name} from ${getSubject(data, subjectId)?.name} · ${getClass(data, classId)?.name}?`)) return
    change('users', (users) => users.map((item) => item.id === teacher.id ? { ...item, classIds: item.classIds.filter((id) => id !== classId), subjectIds: item.subjectIds.filter((id) => id !== subjectId) } : item))
    notify('Teacher assignment removed.')
  }
  const rows = data.users.filter((item) => item.role === 'Teacher').flatMap((teacher) => (teacher.classIds || []).flatMap((classId) => (teacher.subjectIds || []).filter((subjectId) => getSubject(data, subjectId)?.classIds?.includes(classId)).map((subjectId) => ({ teacher, classId, subjectId }))))
  return <><PageHeading eyebrow="STAFF & CURRICULUM" title="Teacher assignment" description="Bring the right educators and subjects together." action={<button className="primary-button" onClick={() => setEditingId(editingId ? '' : 'new')}><Plus size={16} /> New assignment</button>} />{editingId && <FormPanel title="Assign a teacher" description="Select the teacher, class, and subject for this assignment." fields={fields} initialValues={editingId !== 'new' ? (() => { const [teacherId, classId, subjectId] = editingId.split(':'); return { teacherId, classId, subjectId } })() : {}} submitLabel="Save assignment" onSubmit={save} onCancel={() => setEditingId('')} />}<Panel title="Current assignments" subtitle={`${rows.length} teaching assignments`}><div className="table-scroll"><table className="data-table"><thead><tr><th>TEACHER</th><th>CLASS</th><th>SUBJECT</th><th>STUDENTS</th><th /></tr></thead><tbody>{rows.map(({ teacher, classId, subjectId }) => <tr key={`${teacher.id}-${classId}-${subjectId}`}><td><span className="table-person"><span className="avatar avatar-small teacher">{initials(teacher.name)}</span><b>{teacher.name}</b></span></td><td>{getClass(data, classId)?.name} · {getClass(data, classId)?.section}</td><td>{getSubject(data, subjectId)?.name}</td><td>{studentsOf(data, classId).length}</td><td><div className="row-actions"><button className="text-link" onClick={() => setEditingId(`${teacher.id}:${classId}:${subjectId}`)}>Edit</button><button className="text-link danger-link" onClick={() => remove(teacher, classId, subjectId)}>Remove</button></div></td></tr>)}</tbody></table>{!rows.length && <EmptyState text="Create a teacher assignment to get started." />}</div></Panel></>
}
function AcademicPerformance({ data }) {
  const subjects = data.subjects.map((subject) => ({ name: subject.name, average: average(data.results.filter((row) => row.subjectId === subject.id).map((row) => row.score)), count: data.results.filter((row) => row.subjectId === subject.id).length })).filter((item) => item.count)
  const studentAverages = data.users.filter((item) => item.role === 'Student').map((student) => { const results = data.results.filter((row) => row.studentId === student.id); return { student, score: average(results.map((row) => row.score)), count: results.length } }).filter((item) => item.count).sort((a, b) => b.score - a.score)
  return <><PageHeading eyebrow="SCHOOL REPORTS" title="Academic performance" description="Understand progress, celebrate achievements, and spot opportunities." /><div className="metric-grid three"><MetricCard label="School average" value={`${average(data.results.map((item) => item.score)) || '—'}${data.results.length ? '%' : ''}`} changeText="All published exams" icon={Activity} tone="blue" /><MetricCard label="Results published" value={data.results.length} footnote="Across all classes" icon={FileText} tone="purple" /><MetricCard label="Students assessed" value={new Set(data.results.map((item) => item.studentId)).size} footnote="With exam results" icon={UsersRound} tone="green" /></div><div className="dashboard-grid"><Panel title="Average by subject" subtitle="Fall 2026 examination scores"><ResponsiveContainer width="100%" height={250}><BarChart data={subjects} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} dy={8} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#8b94a7', fontSize: 11 }} /><Tooltip content={<ChartTooltip />} /><Bar dataKey="average" name="Average" radius={[6, 6, 0, 0]} barSize={32}>{subjects.map((item, index) => <Cell key={item.name} fill={['#6684e8', '#55bd93', '#ad84db', '#f0a35f', '#55b6be'][index % 5]} />)}</Bar></BarChart></ResponsiveContainer>{!subjects.length && <EmptyState text="Results will appear after teachers publish marks." />}</Panel><Panel title="Student progress" subtitle="Average across published exams"><div className="summary-bar-list">{studentAverages.map(({ student, score }) => <div className="summary-bar-row" key={student.id}><span>{student.name}</span><div className="score-track"><i style={{ width: `${score}%` }} /></div><b>{score}%</b></div>)}</div>{!studentAverages.length && <EmptyState text="No student results yet." />}</Panel></div><Panel title="Subject performance detail" subtitle="Classroom-wide results"><div className="table-scroll"><table className="data-table"><thead><tr><th>SUBJECT</th><th>CODE</th><th>CLASSES</th><th>RESULTS</th><th>AVERAGE</th><th>GRADE</th></tr></thead><tbody>{subjects.map((item) => { const subject = data.subjects.find((entry) => entry.name === item.name); return <tr key={item.name}><td><b>{item.name}</b></td><td>{subject?.code}</td><td>{subject?.classIds.map((id) => `${getClass(data, id)?.name} ${getClass(data, id)?.section}`).join(', ')}</td><td>{item.count}</td><td>{item.average}%</td><td><span className={`grade-badge grade-${grade(item.average).toLowerCase()}`}>{grade(item.average)}</span></td></tr> })}</tbody></table></div></Panel></>
}
function Announcements({ data, user, change, notify }) {
  const canPublish = user.role !== 'Student'
  const [showForm, setShowForm] = useState(false)
  const allowedClassIds = user.role === 'Teacher' ? user.classIds || [] : data.classes.map((room) => room.id)
  const fields = [{ name: 'title', label: 'Announcement title' }, { name: 'classId', label: 'Share with', type: 'select', options: [{ value: 'all', label: 'Everyone at school' }, ...data.classes.filter((room) => allowedClassIds.includes(room.id)).map((room) => ({ value: room.id, label: `${room.name} · ${room.section}` }))] }, { name: 'message', label: 'Your message', type: 'textarea', wide: true }]
  const rows = data.announcements.filter((item) => user.role !== 'Student' || !item.audienceClassIds?.length || item.audienceClassIds.includes(user.classId))
  const publish = (values) => {
    const classId = values.classId === 'all' ? '' : values.classId
    const classInfo = getClass(data, classId)
    const announcement = { id: makeId('n'), title: values.title, message: values.message, author: user.name, audience: classInfo ? `${classInfo.name} · ${classInfo.section}` : 'All school', audienceClassIds: classInfo ? [classId] : [], createdAt: today }
    change('announcements', (items) => [announcement, ...items])
    setShowForm(false); notify('Announcement published.')
  }
  const remove = (item) => { if (!window.confirm(`Delete “${item.title}”?`)) return; change('announcements', (items) => items.filter((entry) => entry.id !== item.id)); notify('Announcement deleted.') }
  return <><PageHeading eyebrow="SCHOOL COMMUNITY" title="Announcements" description={canPublish ? 'Share good news, important reminders, and bright ideas.' : 'The latest updates and news from your school.'} action={canPublish && <button className="primary-button" onClick={() => setShowForm(!showForm)}><Plus size={16} /> New announcement</button>} />{showForm && <FormPanel title="Write an announcement" description="Your message will be visible to the selected audience." fields={fields} initialValues={{ classId: 'all' }} submitLabel="Publish announcement" onSubmit={publish} onCancel={() => setShowForm(false)} />}<div className="announcement-feed">{rows.map((item) => <article className="announcement-card" key={item.id}><div className="announcement-card-top"><span className="announcement-icon"><Bell size={17} /></span><span className="audience-chip">{item.audience}</span>{canPublish && item.author === user.name && <button className="icon-button announcement-delete" aria-label="Delete announcement" onClick={() => remove(item)}><X size={16} /></button>}</div><h2>{item.title}</h2><p>{item.message}</p><div className="announcement-card-footer"><span className="avatar avatar-tiny teacher">{initials(item.author)}</span><span><b>{item.author}</b><small>{prettyDate(item.createdAt)}</small></span></div></article>)}{!rows.length && <EmptyState text="There are no announcements yet." />}</div></>
}
function SettingsPage({ data, user, change, notify }) {
  const director = user.role === 'Director'
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const fields = [{ name: 'schoolName', label: 'School name' }, { name: 'schoolYear', label: 'Academic year' }, { name: 'term', label: 'Current term' }, { name: 'contactEmail', label: 'Contact email', type: 'email' }]

  const updatePassword = (event) => {
    event.preventDefault()
    if (password.length < 6) { notify('Password must be at least 6 characters.'); return }
    if (password !== confirmation) { notify('The passwords do not match.'); return }
    change('users', (users) => users.map((item) => item.id === user.id ? { ...item, password } : item))
    setPassword(''); setConfirmation(''); notify('Your password has been updated.')
  }

  return <><PageHeading eyebrow="PREFERENCES" title={director ? 'School settings' : 'Settings'} description={director ? 'Keep your school profile and academic year information current.' : 'Manage your account and personal preferences.'} />{director && <Panel title="School profile" subtitle="This information is shared across the school."><FormPanel title="Academic information" fields={fields} initialValues={data.settings} submitLabel="Save school settings" onSubmit={(values) => { change('settings', values); notify('School settings updated.') }} /></Panel>}<div className="settings-grid"><Panel title="Update password" subtitle="Choose a strong password you don’t use elsewhere."><form className="form-panel form-panel-compact" onSubmit={updatePassword}><div className="form-fields"><label>New password<input type="password" minLength="6" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></label><label>Confirm new password<input type="password" minLength="6" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Enter it again" /></label></div><div className="form-actions"><button className="primary-button" type="submit"><ShieldCheck size={16} /> Update password</button></div></form></Panel><Panel title="Privacy & security" subtitle="Your information stays in this browser."><div className="privacy-item"><span className="privacy-icon"><ShieldCheck size={18} /></span><span><b>Frontend demo authentication</b><small>Role-based demo accounts are stored locally for this prototype.</small></span></div><div className="privacy-item"><span className="privacy-icon green"><CheckCircle2 size={18} /></span><span><b>Local data storage</b><small>School data is saved in this browser’s local storage.</small></span></div><div className="privacy-item"><span className="privacy-icon purple"><Activity size={18} /></span><span><b>Demo mode</b><small>No backend or external services are connected.</small></span></div></Panel></div></>
}
export default App
