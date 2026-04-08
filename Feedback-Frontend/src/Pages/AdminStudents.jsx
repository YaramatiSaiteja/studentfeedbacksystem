import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCourses, getAllFeedback, getAllUsers } from '../utils/api';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaChartLine, FaClipboardList, FaUsers, FaSun, FaMoon, FaBars, FaGraduationCap, FaUserCircle, FaBell, FaSignOutAlt, FaBookOpen, FaFilter, FaSort, FaStar, FaSearch } from 'react-icons/fa';

const AdminStudents = () => {
    const [studentsData, setStudentsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [summaryStats, setSummaryStats] = useState({ totalStudents: 0, totalFeedback: 0, avgRating: 0 });
    const [coursesList, setCoursesList] = useState([]);

    // Filters & Sorting state
    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [sortBy, setSortBy] = useState('dateDesc'); // Default newest first

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const currentDepartment = user?.department;
    const currentTeacherName = (user?.fullName || '').trim().toLowerCase();

    useEffect(() => {
        loadData();
    }, []);

    // Filter and Sort effect
    useEffect(() => {
        applyFiltersAndSort();
    }, [studentsData, searchTerm, courseFilter, ratingFilter, sortBy]);

    const loadData = async () => {
        try {
            const [feedback, users, courses] = await Promise.all([
                getAllFeedback(),
                getAllUsers(),
                getCourses()
            ]);

            const visibleCourses = (courses || []).filter(course => {
                const sameDepartment = currentDepartment ? (course.department || course.branch) === currentDepartment : true;
                const sameInstructor = currentTeacherName
                    ? String(course.instructor || '').trim().toLowerCase() === currentTeacherName
                    : true;
                return sameDepartment && sameInstructor;
            });

            // Create fast lookup maps
            const userMap = {};
            (users || []).forEach(u => userMap[u.id] = u);
            const courseMap = {};
            visibleCourses.forEach(c => courseMap[c.id] = c);
            setCoursesList(visibleCourses);

            // Map feedback to detailed student records
            const filteredFeedback = currentDepartment
                ? (feedback || []).filter(fb => visibleCourses.some(course => String(course.id) === String(fb.courseId)))
                : (feedback || []);

            const enhancedFeedback = filteredFeedback.map(fb => {
            const student = userMap[fb.studentId] || {};
            const course = courseMap[fb.courseId] || {};
            let totalScore = Number(fb.courseRating) + Number(fb.instructorRating);
            let count = 2;
            if (fb.contentQuality) { totalScore += Number(fb.contentQuality); count++; }
            if (fb.practicalApplication) { totalScore += Number(fb.practicalApplication); count++; }
            const avgRating = totalScore / count;

            return {
                id: fb.id,
                studentName: student.fullName || 'Unknown Student',
                email: student.email || 'No Email',
                courseTitle: course.title || 'Unknown Course',
                courseId: fb.courseId,
                avgRating: avgRating,
                courseRating: fb.courseRating,
                instructorRating: fb.instructorRating,
                comment: fb.comment,
                submittedAt: fb.submittedAt
            };
        });

        // Compute top summary stats
        const uniqueStudents = new Set(filteredFeedback.map(f => f.studentId)).size;
        const totalFeedback = filteredFeedback.length;
        const overallRating = totalFeedback > 0
            ? enhancedFeedback.reduce((acc, curr) => acc + curr.avgRating, 0) / totalFeedback
            : 0;

        setSummaryStats({
            totalStudents: uniqueStudents,
            totalFeedback,
            avgRating: overallRating.toFixed(1)
        });

        setStudentsData(enhancedFeedback);
        } catch (error) {
            console.error('Failed to load student data:', error);
        }
    };

    const applyFiltersAndSort = () => {
        let result = [...studentsData];

        // 1. Search Filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.studentName.toLowerCase().includes(lowerSearch) ||
                item.email.toLowerCase().includes(lowerSearch)
            );
        }

        // 2. Course Filter
        if (courseFilter) {
            result = result.filter(item => String(item.courseId) === String(courseFilter));
        }

        // 3. Rating Filter
        if (ratingFilter) {
            const limit = parseInt(ratingFilter, 10);
            if (limit === 5) {
                result = result.filter(item => item.avgRating >= 4.5);
            } else if (limit === 4) {
                result = result.filter(item => item.avgRating >= 3.5 && item.avgRating < 4.5);
            } else if (limit === 3) {
                result = result.filter(item => item.avgRating >= 2.5 && item.avgRating < 3.5);
            } else if (limit <= 2) {
                result = result.filter(item => item.avgRating < 2.5);
            }
        }

        // 4. Sorting
        result.sort((a, b) => {
            if (sortBy === 'dateDesc') return new Date(b.submittedAt) - new Date(a.submittedAt);
            if (sortBy === 'dateAsc') return new Date(a.submittedAt) - new Date(b.submittedAt);
            if (sortBy === 'ratingDesc') return b.avgRating - a.avgRating;
            if (sortBy === 'ratingAsc') return a.avgRating - b.avgRating;
            return 0;
        });

        setFilteredData(result);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchTerm.trim().toLowerCase();
        if (!query) return;

        if (query.includes('dashboard') || query.includes('home')) {
            navigate('/admin/dashboard');
            return;
        }
        if (query.includes('report') || query.includes('analytics')) {
            navigate('/admin/reports');
            return;
        }
        if (query.includes('course') || query.includes('deploy')) {
            navigate('/admin/courses');
        }
    };

    // Helper render stars
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;
        return (
            <div className={`d-flex align-items-center ${rating >= 4 ? 'text-success' : rating <= 2.5 ? 'text-danger' : 'text-warning'}`}>
                {rating.toFixed(1)} <FaStar className="ms-1 small" />
            </div>
        );
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="d-flex min-vh-100 bg-transparent flex-column flex-lg-row">
            {/* Mobile Header */}
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom bg-white premium-hover-lift" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center"><FaGraduationCap className="me-2 text-primary" /> FeedbackHub</h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars />
                </button>
            </div>

            {/* Sidebar Overlay on Mobile */}
            {sidebarOpen && <div className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1040 }} onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar */}
            <div className={`sidebar bg-white border-end flex-column admin-fixed-sidebar ${sidebarOpen ? 'd-flex position-fixed' : 'd-none'} d-lg-flex`} style={{ width: '280px', height: '100vh', top: 0, left: 0, zIndex: 1050, transition: 'transform 0.3s ease', backgroundColor: 'var(--card-bg)' }}>
                <div className="p-4 border-bottom d-none d-lg-block">
                    <div className="text-decoration-none text-dark d-flex align-items-center" style={{ cursor: 'default' }}>
                        <h5 className="fw-bolder mb-0 text-primary d-flex align-items-center"><FaGraduationCap className="me-2 fs-3" /> FeedbackHub</h5>
                    </div>
                </div>

                <div className="p-3 flex-grow-1 overflow-auto">
                    <p className="text-muted small fw-bold text-uppercase mb-3 px-2">Analytics</p>
                    <ul className="nav flex-column gap-2 mb-4">
                        <li className="nav-item">
                            <NavLink to="/admin/dashboard" end className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaHome className="me-3 fs-5" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/reports" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaChartLine className="me-3 fs-5" /> View Reports
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/students" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaUsers className="me-3 fs-5" /> Students
                            </NavLink>
                        </li>
                    </ul>

                    <p className="text-muted small fw-bold text-uppercase mb-3 px-2">Management</p>
                    <ul className="nav flex-column gap-2 mb-4">
                        <li className="nav-item">
                            <NavLink to="/admin/courses" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaBookOpen className="me-3 fs-5" /> Deploy Course
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
                </div>
            </div>

            {/* Main Workspace Area */}
            <div className="flex-grow-1 d-flex flex-column w-100 overflow-hidden admin-main-with-fixed-sidebar" style={{ backgroundColor: 'var(--bg-main)' }}>

                {/* Top Navbar */}
                <nav className="navbar navbar-expand bg-white border-bottom px-4 py-3 shadow-sm" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="d-flex align-items-center mb-2 mb-md-0 w-100 justify-content-between">
                        <form className="input-group d-none d-md-flex" style={{ maxWidth: '420px' }} onSubmit={handleSearchSubmit}>
                            <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                            <input
                                type="text"
                                className="form-control bg-light border-0"
                                placeholder="Search students or type reports/courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="btn btn-light border-0 text-muted">Go</button>
                        </form>
                        <ul className="navbar-nav flex-row align-items-center ms-auto">
                            <li className="nav-item me-4 position-relative">
                                <button className="btn btn-link nav-link text-muted hover-scale transition-colors border-0 position-relative" style={{ zIndex: 10 }}>
                                    <FaBell className="fs-5" />
                                </button>
                            </li>
                            <li className="nav-item dropdown d-flex align-items-center">
                                <div className="d-flex flex-column text-end me-3 d-none d-sm-flex">
                                    <span className="fw-bold text-dark lh-sm">{user?.fullName || 'Admin'}</span>
                                    <span className="text-danger small fw-bold lh-sm">{currentDepartment || 'Teacher / Admin'}</span>
                                </div>
                                <button
                                    className="btn p-0 border-0 bg-transparent rounded-circle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                        <FaUserCircle />
                                    </div>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                    <li>
                                        <button className="dropdown-item text-danger fw-semibold" onClick={handleLogout}>
                                            <FaSignOutAlt className="me-2" /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Dashboard Content */}
                <div className="container-fluid p-4 p-md-5 overflow-auto flex-grow-1">

                    {/* Header Banner */}
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
                        <div>
                            <h3 className="fw-bolder text-dark mb-1"><FaUsers className="me-2 text-primary" />Student Submissions</h3>
                            <p className="text-muted mb-0">Review individual student feedback mapping records and trace inputs.</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Total Participants</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{summaryStats.totalStudents}</h3>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaUsers className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Total Entries</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{summaryStats.totalFeedback}</h3>
                                    </div>
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaClipboardList className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Global Avg Rating</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{summaryStats.avgRating} <FaStar className="fs-5 text-warning mb-1 ms-1" /></h3>
                                    </div>
                                    <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaChartLine className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings / Filters card */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold text-dark d-flex align-items-center"><FaFilter className="text-muted me-2" /> Filters</span>
                                <select className="form-select form-select-sm border-0 bg-light rounded-pill px-3 fw-medium text-muted" style={{ width: 'auto' }} value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                                    <option value="">All Courses</option>
                                    {coursesList.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                                <select className="form-select form-select-sm border-0 bg-light rounded-pill px-3 fw-medium text-muted" style={{ width: 'auto' }} value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
                                    <option value="">All Ratings</option>
                                    <option value="5">Excellent (4.5+)</option>
                                    <option value="4">Good (3.5 - 4.4)</option>
                                    <option value="3">Average (2.5 - 3.4)</option>
                                    <option value="2">Poor (&lt; 2.5)</option>
                                </select>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-dark d-flex align-items-center"><FaSort className="text-muted me-2" /> Sort</span>
                                <select className="form-select form-select-sm border border-light rounded-pill px-3 fw-bold text-primary shadow-sm" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="dateDesc">Newest First</option>
                                    <option value="dateAsc">Oldest First</option>
                                    <option value="ratingDesc">Highest Rating</option>
                                    <option value="ratingAsc">Lowest Rating</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 ps-4">Student</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Course</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-center">Avg Rating Give</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-start">Comment Snippet</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-end pe-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <div className="d-flex flex-column align-items-center">
                                                    <FaUsers className="fs-1 text-muted opacity-50 mb-3" />
                                                    <h5 className="fw-bold text-dark">No Students Found</h5>
                                                    <p className="text-muted mb-0">Adjust your search definitions or filters.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((data) => (
                                            <tr key={data.id}>
                                                <td className="ps-4 py-3">
                                                    <div className="fw-bold text-dark d-flex align-items-center">
                                                        <FaUserCircle className="me-2 text-primary fs-5" />
                                                        {data.studentName}
                                                    </div>
                                                    <div className="small text-muted ms-4">{data.email}</div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1 text-truncate" style={{ maxWidth: '180px' }}>
                                                        <FaBookOpen className="me-1 text-primary opacity-75" /> {data.courseTitle}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center fw-bold fs-6">
                                                        {renderStars(data.avgRating)}
                                                    </div>
                                                </td>
                                                <td className="text-start">
                                                    <div className="text-muted small text-truncate fst-italic" style={{ maxWidth: '300px' }}>
                                                        "{data.comment}"
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="small fw-medium text-dark">{formatDate(data.submittedAt)}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {filteredData.length > 0 && (
                            <div className="card-footer bg-white border-top text-center py-3">
                                <span className="small text-muted fw-bold">Showing {filteredData.length} records</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
