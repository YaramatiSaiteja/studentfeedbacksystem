import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCourses, getStudentFeedback, getPendingCourses } from '../utils/storage';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import {
    FaHome, FaRegStar, FaBookOpen, FaGraduationCap,
    FaUserCircle, FaBell, FaSignOutAlt, FaSun, FaMoon,
    FaBars, FaChalkboardTeacher, FaSearch
} from 'react-icons/fa';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [studentFeedback, setStudentFeedback] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');

    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        if (user?.id) {
            setCourses(getCourses());
            setPendingCourses(getPendingCourses(user.id));
            setStudentFeedback(getStudentFeedback(user.id));
        }
    }, []);

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    const filtered = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor?.toLowerCase().includes(search.toLowerCase()) ||
        c.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="d-flex min-vh-100 flex-column flex-lg-row" style={{ backgroundColor: '#f1f5f9' }}>

            {/* ── Mobile Header ── */}
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
                <h5 className="mb-0 fw-bold d-flex align-items-center text-primary">
                    <FaGraduationCap className="me-2" /> Feedback Hub
                </h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars />
                </button>
            </div>

            {/* ── Sidebar Overlay ── */}
            {sidebarOpen && (
                <div
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                    style={{ zIndex: 1040 }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <div
                className={`bg-white border-end flex-column ${sidebarOpen ? 'd-flex position-fixed' : 'd-none d-lg-flex'}`}
                style={{ width: 240, height: '100vh', top: 0, left: 0, zIndex: 1050 }}
            >
                {/* Logo — no home navigation */}
                <div className="p-4 border-bottom d-none d-lg-flex align-items-center gap-2">
                    <FaGraduationCap className="text-primary fs-4" />
                    <span className="fw-bold text-primary fs-5">Feedback Hub</span>
                </div>

                <div className="p-3 flex-grow-1">
                    <p className="text-muted fw-bold text-uppercase mb-3 px-2" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Menu</p>
                    <ul className="nav flex-column gap-1">
                        <li className="nav-item">
                            <NavLink
                                to="/student/dashboard"
                                end
                                className={({ isActive }) =>
                                    `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 ${isActive ? 'text-white bg-primary' : 'text-muted'}`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <FaHome className="me-3" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/student/feedback"
                                className={({ isActive }) =>
                                    `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 ${isActive ? 'text-white bg-primary' : 'text-muted'}`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <FaRegStar className="me-3" /> My Feedback
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/student/courses"
                                className={({ isActive }) =>
                                    `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 ${isActive ? 'text-white bg-primary' : 'text-muted'}`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <FaBookOpen className="me-3" /> Courses
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="p-3 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-3 px-2">
                        <span className="text-muted fw-bold small">Dark Mode</span>
                        <button
                            onClick={toggleTheme}
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: 32, height: 32, background: isDarkMode ? '#1e293b' : '#f1f5f9', color: isDarkMode ? '#fbbf24' : '#64748b', border: 'none' }}
                        >
                            {isDarkMode ? <FaSun size={13} /> : <FaMoon size={13} />}
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn btn-light w-100 d-flex align-items-center justify-content-center fw-bold border"
                    >
                        <FaSignOutAlt className="me-2" /> Logout
                    </button>
                </div>
            </div>

            {/* ── Main Area ── */}
            <div className="flex-grow-1 d-flex flex-column overflow-hidden">

                {/* Top Navbar */}
                <nav className="navbar bg-white border-bottom px-4 py-3 shadow-sm">
                    <div className="d-none d-md-flex">
                        <div className="input-group" style={{ maxWidth: 280 }}>
                            <span className="input-group-text bg-light border-0 rounded-start-pill">
                                <FaSearch size={13} className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-0 rounded-end-pill"
                                placeholder="Search courses..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul className="navbar-nav ms-auto flex-row align-items-center gap-3">
                        <li className="nav-item position-relative">
                            <button className="btn btn-link text-muted p-0 border-0">
                                <FaBell className="fs-5" />
                                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{ width: 8, height: 8 }} />
                            </button>
                        </li>
                        <li className="nav-item d-flex align-items-center gap-2">
                            <div className="d-none d-sm-flex flex-column text-end">
                                <span className="fw-bold text-dark lh-sm" style={{ fontSize: '0.9rem' }}>{user?.fullName}</span>
                                <span className="text-muted lh-sm text-capitalize" style={{ fontSize: '0.78rem' }}>{user?.role}</span>
                            </div>
                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40, fontSize: '1.1rem' }}
                            >
                                <FaUserCircle />
                            </div>
                        </li>
                    </ul>
                </nav>

                {/* Page Content */}
                <div className="container-fluid p-4 overflow-auto flex-grow-1">

                    {/* Page Header */}
                    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                        <div>
                            <h4 className="fw-bold text-dark mb-1">All Courses</h4>
                            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                Browse all courses published by your instructors
                            </p>
                        </div>
                        <span
                            className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold"
                            style={{ fontSize: '0.78rem' }}
                        >
                            {filtered.length} {filtered.length === 1 ? 'Course' : 'Courses'}
                        </span>
                    </div>

                    {/* Mobile search */}
                    <div className="d-md-none mb-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 rounded-start-pill">
                                <FaSearch size={13} className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-0 rounded-end-pill"
                                placeholder="Search courses..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Empty state — no courses at all */}
                    {courses.length === 0 ? (
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body text-center py-5">
                                <div
                                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-4"
                                    style={{ width: 90, height: 90, fontSize: '2.2rem' }}
                                >
                                    <FaBookOpen className="text-muted" />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">No Courses Available Yet</h5>
                                <p className="text-muted mb-4" style={{ maxWidth: 340, margin: '0 auto', fontSize: '0.9rem' }}>
                                    Your instructors haven't published any courses yet. Once a teacher creates a course, it will appear here automatically.
                                </p>
                                <button
                                    className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
                                    onClick={() => navigate('/student/dashboard')}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>

                    ) : filtered.length === 0 ? (

                        /* Empty state — search no results */
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body text-center py-5">
                                <div
                                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-4"
                                    style={{ width: 90, height: 90, fontSize: '2.2rem' }}
                                >
                                    <FaSearch className="text-muted" />
                                </div>
                                <h5 className="fw-bold text-dark mb-2">No Results Found</h5>
                                <p className="text-muted mb-4" style={{ maxWidth: 300, margin: '0 auto', fontSize: '0.9rem' }}>
                                    No courses match "<strong>{search}</strong>". Try a different search term.
                                </p>
                                <button className="btn btn-outline-secondary rounded-pill px-4 fw-semibold" onClick={() => setSearch('')}>
                                    Clear Search
                                </button>
                            </div>
                        </div>

                    ) : (

                        /* Course grid */
                        <div className="row g-4">
                            {filtered.map(course => {
                                const alreadySubmitted = studentFeedback.some(f => f.courseId === course.id);
                                const isPending = pendingCourses.some(c => c.id === course.id);

                                return (
                                    <div className="col-md-6 col-xl-4" key={course.id}>
                                        <div
                                            className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column"
                                            style={{ transition: 'all 0.22s ease' }}
                                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(15,23,42,0.1)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                                        >
                                            {/* Card top accent */}
                                            <div
                                                className="rounded-top-4"
                                                style={{
                                                    height: 5,
                                                    background: alreadySubmitted
                                                        ? 'linear-gradient(90deg,#059669,#34d399)'
                                                        : isPending
                                                            ? 'linear-gradient(90deg,#f59e0b,#fcd34d)'
                                                            : 'linear-gradient(90deg,#2563eb,#60a5fa)',
                                                }}
                                            />

                                            <div className="card-body p-4 d-flex flex-column">

                                                {/* Top row */}
                                                <div className="d-flex align-items-start justify-content-between mb-3">
                                                    <div
                                                        className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center flex-shrink-0"
                                                        style={{ width: 46, height: 46, fontSize: '1.15rem' }}
                                                    >
                                                        <FaBookOpen />
                                                    </div>
                                                    {alreadySubmitted ? (
                                                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-semibold" style={{ fontSize: '0.7rem' }}>✓ Reviewed</span>
                                                    ) : isPending ? (
                                                        <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2 fw-semibold" style={{ fontSize: '0.7rem' }}>⏳ Pending</span>
                                                    ) : (
                                                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-semibold" style={{ fontSize: '0.7rem' }}>Enrolled</span>
                                                    )}
                                                </div>

                                                {/* Course info */}
                                                <h6 className="fw-bold text-dark mb-2" style={{ fontSize: '0.95rem', lineHeight: 1.35 }}>
                                                    {course.title}
                                                </h6>

                                                <p className="text-muted d-flex align-items-center gap-2 mb-1" style={{ fontSize: '0.82rem' }}>
                                                    <FaChalkboardTeacher size={12} />
                                                    <span>{course.instructor}</span>
                                                </p>

                                                {course.department && (
                                                    <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>
                                                        📚 {course.department}
                                                    </p>
                                                )}

                                                {course.syllabus && (
                                                    <p className="text-muted fst-italic mb-0" style={{ fontSize: '0.78rem', lineHeight: 1.55 }}>
                                                        "{course.syllabus.slice(0, 100)}{course.syllabus.length > 100 ? '...' : ''}"
                                                    </p>
                                                )}

                                                {/* Action button pinned to bottom */}
                                                <div className="mt-auto pt-3">
                                                    {alreadySubmitted ? (
                                                        <button className="btn btn-sm btn-light border w-100 fw-semibold rounded-pill" disabled>
                                                            ✓ Feedback Submitted
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-primary w-100 fw-semibold rounded-pill"
                                                            onClick={() => navigate(`/student/feedback/${course.id}`)}
                                                        >
                                                            Give Feedback
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;