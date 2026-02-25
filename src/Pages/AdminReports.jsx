import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCourses, getAllFeedback } from '../utils/storage';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FaHome, FaChartLine, FaClipboardList, FaUsers, FaCog, FaSun, FaMoon, FaBars, FaChartPie, FaUserCircle, FaBell, FaSignOutAlt, FaBookOpen, FaDownload, FaStar } from 'react-icons/fa';

const AdminReports = () => {
    const [reportData, setReportData] = useState([]);
    const [sortBy, setSortBy] = useState('courseRating');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = () => {
        const courses = getCourses();
        const feedback = getAllFeedback();

        // Aggregate feedback per course
        const aggregated = courses.map(course => {
            const courseFeedback = feedback.filter(f => f.courseId === course.id);
            const total = courseFeedback.length;

            let avgCourse = 0;
            let avgInstructor = 0;
            let avgContent = 0;
            let avgPractical = 0;

            if (total > 0) {
                let validContent = 0, sumContent = 0;
                let validPractical = 0, sumPractical = 0;

                const sumCourse = courseFeedback.reduce((acc, curr) => acc + (Number(curr.courseRating) || 0), 0);
                const sumInstructor = courseFeedback.reduce((acc, curr) => acc + (Number(curr.instructorRating) || 0), 0);

                courseFeedback.forEach(f => {
                    if (f.contentQuality) { sumContent += Number(f.contentQuality); validContent++; }
                    if (f.practicalApplication) { sumPractical += Number(f.practicalApplication); validPractical++; }
                });

                avgCourse = (sumCourse / total).toFixed(1);
                avgInstructor = (sumInstructor / total).toFixed(1);
                if (validContent > 0) avgContent = (sumContent / validContent).toFixed(1);
                if (validPractical > 0) avgPractical = (sumPractical / validPractical).toFixed(1);
            }

            return {
                id: course.id,
                title: course.title,
                instructor: course.instructor,
                totalFeedback: total,
                avgCourseRating: parseFloat(avgCourse),
                avgInstructorRating: parseFloat(avgInstructor),
                avgContentRating: parseFloat(avgContent),
                avgPracticalRating: parseFloat(avgPractical)
            };
        });

        setReportData(aggregated);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Sort Data logic
    const sortedData = [...reportData].sort((a, b) => {
        if (sortBy === 'courseRating') return b.avgCourseRating - a.avgCourseRating;
        if (sortBy === 'instructorRating') return b.avgInstructorRating - a.avgInstructorRating;
        if (sortBy === 'totalFeedback') return b.totalFeedback - a.totalFeedback;
        return 0;
    });

    const exportToCSV = () => {
        const headers = ['Course Title', 'Instructor', 'Total Feedback', 'Avg Course Rating', 'Avg Instructor Rating', 'Avg Content Rating', 'Avg Practical Rating'];
        const rows = sortedData.map(d => [
            `"${d.title}"`,
            `"${d.instructor}"`,
            d.totalFeedback,
            d.avgCourseRating,
            d.avgInstructorRating,
            d.avgContentRating || 'N/A',
            d.avgPracticalRating || 'N/A'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sfh_course_analytics_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="d-flex min-vh-100 bg-transparent flex-column flex-lg-row">
            {/* Mobile Header */}
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom bg-white premium-hover-lift" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center"><FaChartPie className="me-2 text-primary" /> SFH Admin</h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars />
                </button>
            </div>

            {/* Sidebar Overlay on Mobile */}
            {sidebarOpen && <div className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1040 }} onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar */}
            <div className={`sidebar bg-white border-end flex-column ${sidebarOpen ? 'd-flex position-fixed' : 'd-none d-lg-flex'}`} style={{ width: '280px', height: '100vh', top: 0, left: 0, zIndex: 1050, transition: 'transform 0.3s ease', backgroundColor: 'var(--card-bg)' }}>
                <div className="p-4 border-bottom d-none d-lg-block">
                    <div className="text-decoration-none text-dark d-flex align-items-center" style={{ cursor: 'default' }}>
                        <h5 className="fw-bolder mb-0 text-primary d-flex align-items-center"><FaChartPie className="me-2 fs-3" /> System Admin</h5>
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
                                <FaBookOpen className="me-3 fs-5" /> Manage Courses
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/admin/create-form" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 transition-colors ${isActive ? 'active text-white bg-primary shadow-sm' : 'text-muted hover-text-dark sidebar-link-hover'}`} onClick={() => setSidebarOpen(false)}>
                                <FaClipboardList className="me-3 fs-5" /> Forms
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
                    <div className="d-flex align-items-center mb-2 mb-md-0 w-100 justify-content-between">
                        <div className="input-group d-none d-md-flex" style={{ maxWidth: '400px' }}>
                            <span className="input-group-text bg-light border-0"><FaChartLine className="text-muted" /></span>
                            <input type="text" className="form-control bg-light border-0" placeholder="Search analytics metrics..." />
                        </div>
                        <ul className="navbar-nav flex-row align-items-center ms-auto">
                            <li className="nav-item me-4 position-relative">
                                <button className="btn btn-link nav-link text-muted hover-scale transition-colors border-0 position-relative" style={{ zIndex: 10 }}>
                                    <FaBell className="fs-5" />
                                </button>
                            </li>
                            <li className="nav-item dropdown d-flex align-items-center">
                                <div className="d-flex flex-column text-end me-3 d-none d-sm-flex">
                                    <span className="fw-bold text-dark lh-sm">{user?.fullName || 'Admin'}</span>
                                    <span className="text-danger small fw-bold lh-sm text-capitalize">System {user?.role || 'admin'}</span>
                                </div>
                                <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                                    <FaUserCircle />
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Dashboard Content */}
                <div className="container-fluid p-4 p-md-5 overflow-auto flex-grow-1">
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
                        <div>
                            <h3 className="fw-bolder text-dark mb-1"><FaChartLine className="me-2 text-primary" />Deep Analytics Reports</h3>
                            <p className="text-muted mb-0">Aggregate structural statistics tracking academic and instructor performance.</p>
                        </div>
                        <button onClick={exportToCSV} className="btn btn-outline-primary fw-bold rounded-pill px-4 hover-lift"><FaDownload className="me-2" />Export CSV</button>
                    </div>

                    {/* Filter Bar */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body p-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <span className="fw-bold text-dark d-flex align-items-center"><FaChartPie className="text-muted me-2" /> Sorting Configuration</span>
                            <div className="d-flex gap-2">
                                <button onClick={() => setSortBy('courseRating')} className={`btn btn-sm rounded-pill px-3 fw-bold ${sortBy === 'courseRating' ? 'btn-primary' : 'btn-light text-muted border'}`}>Top Course Rating</button>
                                <button onClick={() => setSortBy('instructorRating')} className={`btn btn-sm rounded-pill px-3 fw-bold ${sortBy === 'instructorRating' ? 'btn-primary' : 'btn-light text-muted border'}`}>Top Instructor Rating</button>
                                <button onClick={() => setSortBy('totalFeedback')} className={`btn btn-sm rounded-pill px-3 fw-bold ${sortBy === 'totalFeedback' ? 'btn-primary' : 'btn-light text-muted border'}`}>Highest Volume</button>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 ps-4">Course Entity</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Instructor</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-center">Feedback Volume</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-center">Course Rating</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-center">Instructor Rating</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-center">Content Quality</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-center pe-4">Practical App</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <p className="text-muted fw-bold mb-0">No analytical data available for deployed courses.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedData.map((data) => (
                                            <tr key={data.id}>
                                                <td className="ps-4 py-3">
                                                    <div className="fw-bold text-dark">{data.title}</div>
                                                    <div className="small text-muted">ID: {data.id.substring(0, 8)}</div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1"><FaUserCircle className="me-1 text-primary" /> {data.instructor}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className="fw-bold fs-5 text-dark">{data.totalFeedback}</span>
                                                    <span className="text-muted small d-block">Submissions</span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="fw-bolder fs-5 text-success mb-1">{data.avgCourseRating > 0 ? data.avgCourseRating : '--'}</div>
                                                    {data.avgCourseRating > 0 && (
                                                        <div className="small text-warning">
                                                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar className="text-muted opacity-25" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div className="fw-bolder fs-5 text-info mb-1">{data.avgInstructorRating > 0 ? data.avgInstructorRating : '--'}</div>
                                                    {data.avgInstructorRating > 0 && (
                                                        <div className="small text-warning">
                                                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div className="fw-bold fs-6 text-dark">{data.avgContentRating > 0 ? data.avgContentRating : '--'}</div>
                                                </td>
                                                <td className="text-center pe-4">
                                                    <div className="fw-bold fs-6 text-dark">{data.avgPracticalRating > 0 ? data.avgPracticalRating : '--'}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
