import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getStudentFeedback, getCourses } from '../utils/storage';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FaRegStar, FaHome, FaBookOpen, FaUserCircle, FaBell, FaSignOutAlt, FaSun, FaMoon, FaBars, FaGraduationCap, FaCheckCircle, FaStar } from 'react-icons/fa';

const StudentFeedback = () => {
    const [studentFeedback, setStudentFeedback] = useState([]);
    const [coursesMap, setCoursesMap] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        if (user && user.id) {
            setStudentFeedback(getStudentFeedback(user.id));

            // Build a course map for O(1) lookups
            const courses = getCourses();
            const map = {};
            courses.forEach(c => { map[c.id] = c; });
            setCoursesMap(map);
        }
    }, [user]);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "text-warning" : "text-muted opacity-25"} />
        ));
    };

    return (
        <div className="d-flex min-vh-100 bg-transparent flex-column flex-lg-row">
            {/* Mobile Header */}
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom bg-white premium-hover-lift" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center"><FaGraduationCap className="me-2 text-primary" /> SFH</h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars />
                </button>
            </div>

            {/* Sidebar Overlay on Mobile */}
            {sidebarOpen && <div className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1040 }} onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar - Consistent Job Portal Layout */}
            <div className={`sidebar bg-white border-end flex-column ${sidebarOpen ? 'd-flex position-fixed' : 'd-none d-lg-flex'}`} style={{ width: '280px', height: '100vh', top: 0, left: 0, zIndex: 1050, transition: 'transform 0.3s ease', backgroundColor: 'var(--card-bg)' }}>
                <div className="p-4 border-bottom d-none d-lg-block">
                    <div className="text-decoration-none text-dark d-flex align-items-center">
                        <h5 className="fw-bolder mb-0 text-primary d-flex align-items-center"><FaGraduationCap className="me-2 fs-3" /> Feedback Hub</h5>
                    </div>
                </div>

                <div className="p-3 flex-grow-1">
                    <p className="text-muted small fw-bold text-uppercase mb-3 px-2">Menu</p>
                    <ul className="nav flex-column gap-2 mb-4">
                        <li className="nav-item">
                            <NavLink to="/student/dashboard" end className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaHome className="me-3 fs-5" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/student/feedback" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaRegStar className="me-3 fs-5" /> My Feedback
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/student/courses" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaBookOpen className="me-3 fs-5" /> Courses
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="p-3 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-3 px-2">
                        <span className="text-muted fw-bold small">Dark Mode</span>
                        <button
                            onClick={toggleTheme}
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '32px', height: '32px', backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', color: isDarkMode ? '#fbbf24' : '#64748b', transition: 'all 0.3s ease', border: 'none' }}
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
                        </button>
                    </div>
                    <button onClick={handleLogout} className="btn btn-light w-100 d-flex align-items-center justify-content-center fw-bold transition-colors border sidebar-logout-btn">
                        <FaSignOutAlt className="me-2" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Workspace Area */}
            <div className="flex-grow-1 d-flex flex-column w-100 overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>

                {/* Top Navbar */}
                <nav className="navbar navbar-expand bg-white border-bottom px-4 py-3 shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="d-flex align-items-center mb-2 mb-md-0 d-none d-md-flex">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input type="text" className="form-control rounded-pill bg-light border-0 px-4" placeholder="Search feedback history..." />
                        </div>
                    </div>
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item me-3 position-relative">
                            <button className="btn btn-link nav-link text-muted hover-scale transition-colors border-0 position-relative" style={{ zIndex: 10 }}>
                                <FaBell className="fs-5" />
                            </button>
                        </li>
                        <li className="nav-item dropdown d-flex align-items-center">
                            <div className="d-flex flex-column text-end me-3 d-none d-sm-flex">
                                <span className="fw-bold text-dark lh-sm">{user?.fullName || 'Student'}</span>
                                <span className="text-muted small lh-sm text-capitalize">{user?.role || 'student'}</span>
                            </div>
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                <FaUserCircle />
                            </div>
                        </li>
                    </ul>
                </nav>

                {/* Core Content */}
                <div className="container-fluid p-4 p-md-5 overflow-auto flex-grow-1">
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
                        <div>
                            <h3 className="fw-bolder text-dark mb-1"><FaRegStar className="me-2 text-warning" />Submission History</h3>
                            <p className="text-muted mb-0">Track and review all evaluations you have submitted throughout your academic timeline.</p>
                        </div>
                        <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold border border-primary border-opacity-25 shadow-sm">
                            {studentFeedback.length} Total Submissions
                        </div>
                    </div>

                    {studentFeedback.length === 0 ? (
                        <div className="card border-0 shadow-sm rounded-4 text-center py-5">
                            <div className="card-body py-5 d-flex flex-column align-items-center">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-4 text-muted shadow-sm" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                                    <FaBookOpen />
                                </div>
                                <h4 className="fw-bold text-dark">No Feedback Found</h4>
                                <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>You haven't submitted any course evaluations yet. Head over to your Dashboard to view pending courses.</p>
                                <Link to="/student/dashboard" className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm mt-3 hover-lift">Go to Dashboard</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {studentFeedback.map(fb => {
                                const courseData = coursesMap[fb.courseId];
                                const date = new Date(fb.submittedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });

                                return (
                                    <div className="col-lg-6 col-xl-4" key={fb.id}>
                                        <div className="card border-0 shadow-sm rounded-4 h-100 premium-hover-lift">
                                            <div className="card-header bg-transparent border-bottom pt-4 px-4 pb-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="fw-bold text-dark mb-0 text-truncate pe-2">{courseData?.title || 'Unknown Course'}</h5>
                                                    <span className="badge bg-light text-muted border rounded-pill"><FaCheckCircle className="text-success me-1" /> Submitted</span>
                                                </div>
                                                <p className="text-muted small mb-0"><FaUserCircle className="me-1" /> Instructor: {courseData?.instructor || 'Unknown'}</p>
                                            </div>
                                            <div className="card-body px-4 py-3 bg-light bg-opacity-50">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small fw-bold text-muted text-uppercase">Course Rating</span>
                                                    <div>{renderStars(fb.courseRating)}</div>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="small fw-bold text-muted text-uppercase">Instructor Rating</span>
                                                    <div>{renderStars(fb.instructorRating)}</div>
                                                </div>
                                            </div>
                                            <div className="card-body px-4 pt-3 pb-4">
                                                <p className="text-dark small mb-0 pb-3 border-bottom fst-italic">"{fb.comment}"</p>
                                                <p className="text-muted small mt-3 mb-0 d-flex justify-content-end align-items-center">
                                                    Recorded on {date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentFeedback;
