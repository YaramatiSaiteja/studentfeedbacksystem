import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import FeedbackCard from '../components/FeedbackCard';
import { getCourses, getAllFeedback, getAnalytics } from '../utils/api';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { FaChartLine, FaClipboardList, FaHome, FaBookOpen, FaUserCircle, FaBell, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes, FaSearch, FaGraduationCap, FaUsers, FaChartPie } from 'react-icons/fa';

// Register Chart.js modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [allFeedback, setAllFeedback] = useState([]);
    const [analytics, setAnalytics] = useState({ averageCourseRating: 0, averageInstructorRating: 0, totalFeedback: 0 });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Chart Data States
    const [ratingDistData, setRatingDistData] = useState(null);
    const [trendData, setTrendData] = useState(null);
    const [sentimentData, setSentimentData] = useState(null);
    const [aiInsightText, setAiInsightText] = useState("Awaiting analytics to generate insights.");

    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const currentDepartment = user?.department;
    const currentTeacherName = (user?.fullName || '').trim().toLowerCase();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [c, f, analyticsData] = await Promise.all([
                getCourses(),
                getAllFeedback(),
                getAnalytics()
            ]);

            const scopedCourses = (c || []).filter(course => {
                const sameDepartment = currentDepartment ? (course.department || course.branch) === currentDepartment : true;
                const sameInstructor = currentTeacherName
                    ? String(course.instructor || '').trim().toLowerCase() === currentTeacherName
                    : true;
                return sameDepartment && sameInstructor;
            });
            const scopedCourseIds = new Set(scopedCourses.map(course => String(course.id)));
            const scopedFeedback = currentDepartment
                ? (f || []).filter(item => scopedCourseIds.has(String(item.courseId)))
                : (f || []);

            setCourses(scopedCourses);
            setAllFeedback(scopedFeedback);

            const totalFeedback = scopedFeedback.length;
            const averageCourseRating = totalFeedback
                ? (scopedFeedback.reduce((sum, item) => sum + (Number(item.courseRating) || 0), 0) / totalFeedback).toFixed(1)
                : 0;
            const averageInstructorRating = totalFeedback
                ? (scopedFeedback.reduce((sum, item) => sum + (Number(item.instructorRating) || 0), 0) / totalFeedback).toFixed(1)
                : 0;

            setAnalytics(currentDepartment
                ? { averageCourseRating, averageInstructorRating, totalFeedback }
                : (analyticsData || { averageCourseRating: 0, averageInstructorRating: 0, totalFeedback: 0 }));

            const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            scopedFeedback.forEach(item => {
                const cR = Number(item.courseRating) || 0;
                const iR = Number(item.instructorRating) || 0;
                const contR = Number(item.contentQuality) || 0;
                const pracR = Number(item.practicalApplication) || 0;
                if (cR) dist[cR] = (dist[cR] || 0) + 1;
                if (iR) dist[iR] = (dist[iR] || 0) + 1;
                if (contR) dist[contR] = (dist[contR] || 0) + 1;
                if (pracR) dist[pracR] = (dist[pracR] || 0) + 1;
            });

            setRatingDistData({
                labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
                datasets: [{
                    label: 'Volume of Ratings',
                    data: [dist[1], dist[2], dist[3], dist[4], dist[5]],
                    backgroundColor: 'rgba(56, 189, 248, 0.7)',
                    borderColor: '#38bdf8',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            });

            let positive = 0, neutral = 0, constructive = 0;
            scopedFeedback.forEach(item => {
                const cR = Number(item.courseRating) || 3;
                const iR = Number(item.instructorRating) || 3;
                const avg = (cR + iR) / 2;
                if (avg >= 4) positive++;
                else if (avg >= 3) neutral++;
                else constructive++;
            });

            setSentimentData({
                labels: ['Positive (Recommend)', 'Neutral', 'Constructive (Investigate)'],
                datasets: [{
                    data: [positive, neutral, constructive],
                    backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            });

            let aiInsight = 'Awaiting more feedback variants to generate predictive insights.';
            if (scopedFeedback.length > 0) {
                let totalDiff = 0, totalPrac = 0, validDiffs = 0, validPracs = 0;
                scopedFeedback.forEach(item => {
                    if (item.subjectDifficulty) {
                        totalDiff += Number(item.subjectDifficulty);
                        validDiffs++;
                    }
                    if (item.practicalApplication) {
                        totalPrac += Number(item.practicalApplication);
                        validPracs++;
                    }
                });

                let insights = [];
                if (validDiffs > 0) {
                    const avgDiff = totalDiff / validDiffs;
                    if (avgDiff > 4) insights.push('Students find course material structurally very difficult.');
                    else if (avgDiff < 2) insights.push('Curriculum may be too simplistic; consider advancing topics.');
                }
                if (validPracs > 0) {
                    const avgPrac = totalPrac / validPracs;
                    if (avgPrac < 3) insights.push('Laboratory / practical tasks require urgent attention or restaging.');
                    else if (avgPrac >= 4.5) insights.push('Practical labs are extremely well received by the cohort.');
                }

            if (insights.length > 0) aiInsight = insights.join(" ");
            else if (constructive > positive) aiInsight = "High volume of constructive feedback incoming. Critical course adjustments may be needed.";
            else if (positive > (neutral + constructive)) aiInsight = "Cohort sentiment is overwhelmingly positive. Continuation of current syllabus is recommended.";
        }
        setAiInsightText(aiInsight);

        // 3. Real Feedback Trend Line (Over the last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            d.setHours(0, 0, 0, 0);
            return d;
        });

        const trendLabels = last7Days.map((d, i) => i === 6 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }));
        const trendCounts = Array(7).fill(0);

        scopedFeedback.forEach(item => {
            if (!item.submittedAt) return;
            const itemDate = new Date(item.submittedAt);
            itemDate.setHours(0, 0, 0, 0);

            const timeDiff = itemDate.getTime() - last7Days[0].getTime();
            const dayIndex = Math.round(timeDiff / (1000 * 3600 * 24));

            if (dayIndex >= 0 && dayIndex < 7) {
                trendCounts[dayIndex]++;
            }
        });

        setTrendData({
            labels: trendLabels,
            datasets: [{
                label: 'Submissions',
                data: trendCounts,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: '#6366f1',
                tension: 0.4,
                pointBackgroundColor: '#6366f1'
            }]
        });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    // Calculate participation loosely based on total feedback vs courses (mock stat)
    const participationRate = courses.length > 0 ? Math.min(Math.round((analytics.totalFeedback / (courses.length * 5)) * 100), 100) : 0;

    const lowPerformanceCourses = courses
        .map((course) => {
            const items = allFeedback.filter((fb) => String(fb.courseId) === String(course.id));
            if (items.length === 0) return null;
            const avg = items.reduce((sum, fb) => {
                const c = Number(fb.courseRating) || 0;
                const i = Number(fb.instructorRating) || 0;
                return sum + (c + i) / 2;
            }, 0) / items.length;
            return {
                id: course.id,
                title: course.title,
                instructor: course.instructor,
                avgRating: Number(avg.toFixed(1)),
                total: items.length
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.avgRating - b.avgRating)
        .slice(0, 3);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesQuery = (...values) => {
        if (!normalizedQuery) return true;
        return values.some((value) => String(value || '').toLowerCase().includes(normalizedQuery));
    };

    const filteredLowPerformanceCourses = lowPerformanceCourses.filter((course) =>
        matchesQuery(course.title, course.instructor)
    );

    const filteredFeedback = allFeedback.filter((fb) => {
        const linkedCourse = courses.find((course) => String(course.id) === String(fb.courseId));
        return matchesQuery(linkedCourse?.title, linkedCourse?.instructor, fb.comment, fb.improvementSuggestion, fb.expectedChanges);
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim().toLowerCase();
        if (!query) return;

        if (query.includes('dashboard') || query.includes('home')) {
            navigate('/admin/dashboard');
            return;
        }
        if (query.includes('report')) {
            navigate('/admin/reports');
            return;
        }
        if (query.includes('student')) {
            navigate('/admin/students');
            return;
        }
        if (query.includes('course') || query.includes('deploy')) {
            navigate('/admin/courses');
            return;
        }
        if (query.includes('action')) {
            const section = document.getElementById('admin-action-center');
            section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Chart.js Theming Options (Reacts to dark mode)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: isDarkMode ? '#cbd5e1' : '#475569', font: { family: "'Inter', sans-serif" } }
            },
            title: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' },
                ticks: { color: isDarkMode ? '#94a3b8' : '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { color: isDarkMode ? '#94a3b8' : '#64748b' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: isDarkMode ? '#cbd5e1' : '#475569', padding: 20, usePointStyle: true }
            }
        }
    };

    return (
        <div className="d-flex min-vh-100 bg-transparent flex-column flex-lg-row">
            {/* Mobile Header (Visible only on small screens) */}
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom bg-white premium-hover-lift" style={{ backgroundColor: 'var(--card-bg)' }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center"><FaGraduationCap className="me-2 text-primary" />FeedbackHub</h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Sidebar Overlay on Mobile */}
            {sidebarOpen && <div className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50" style={{ zIndex: 1040 }} onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar */}
            <div className={`sidebar bg-white border-end flex-column admin-fixed-sidebar ${sidebarOpen ? 'd-flex position-fixed' : 'd-none'} d-lg-flex`} style={{ width: '280px', height: '100vh', top: 0, left: 0, zIndex: 1050, transition: 'transform 0.3s ease', backgroundColor: 'var(--card-bg)' }}>
                <div className="p-4 border-bottom d-none d-lg-block">
                    <div className="text-decoration-none text-dark d-flex align-items-center">
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
                    <div className="d-flex align-items-center mb-2 mb-md-0 d-none d-md-flex w-100 justify-content-between">
                        <form className="input-group" style={{ maxWidth: '360px' }} onSubmit={handleSearchSubmit}>
                            <span className="input-group-text bg-light border-0"><FaSearch className="text-muted" /></span>
                            <input
                                type="text"
                                className="form-control bg-light border-0"
                                placeholder="Search and press Enter..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btn-light border-0 text-muted">Go</button>
                        </form>
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item me-4 position-relative">
                                <button className="btn btn-link nav-link text-muted hover-scale transition-colors border-0 position-relative" style={{ zIndex: 10 }}>
                                    <FaBell className="fs-5" />
                                    <span className="position-absolute top-25 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                </button>
                            </li>
                            <li className="nav-item dropdown d-flex align-items-center">
                                <div className="d-flex flex-column text-end me-3 d-none d-sm-flex">
                                    <span className="fw-bold text-dark lh-sm">{user.fullName}</span>
                                    <span className="text-danger small fw-bold lh-sm">Department: {currentDepartment || 'Not set'}</span>
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

                    {/* Welcome Banner */}
                    <div className="shadow-sm border-0 mb-4 overflow-hidden position-relative premium-hover-lift rounded-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                        <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'translate(10%, -20%)', fontSize: '15rem' }}>
                            <FaChartPie className="text-white" />
                        </div>
                        <div className="p-4 p-md-5 position-relative z-1">
                            <div className="row align-items-center">
                                <div className="col-lg-8 text-white">
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-danger bg-opacity-75 text-white px-3 py-2 rounded-pill fw-bold border border-light border-opacity-25 me-3">Department: {currentDepartment || 'Not set'}</span>
                                        <span className="badge bg-primary bg-opacity-75 text-white px-3 py-2 rounded-pill fw-bold border border-light border-opacity-25"><FaBookOpen className="me-1" /> {courses.length} Active Courses</span>
                                    </div>
                                    <h2 className="fw-bold mb-2">Welcome back to the Control Center.</h2>
                                    <p className="lead mb-3 opacity-75">You are actively monitoring {allFeedback.length} discrete data points across your educational platform today.</p>
                                    <div className="rounded-3 p-3 border border-light border-opacity-25" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                        <p className="mb-0 text-white small d-flex align-items-center"><FaChartLine className="me-2 text-warning fs-5" /> <strong>Insight Engine:</strong> &nbsp;<span className="fst-italic opacity-75">{aiInsightText}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Cards Row */}
                    <div className="row g-4 mb-4">
                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Total Feedback</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{analytics.totalFeedback}</h3>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaClipboardList className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Avg Course Rating</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{analytics.averageCourseRating}</h3>
                                    </div>
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaChartLine className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Active Courses</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{courses.length}</h3>
                                    </div>
                                    <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaBookOpen className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm border-0 h-100 rounded-4 premium-hover-lift">
                                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <p className="text-muted fw-bold mb-1 small text-uppercase">Participation Rate</p>
                                        <h3 className="fw-bolder mb-0 text-dark">{participationRate}%</h3>
                                    </div>
                                    <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                        <FaUsers className="fs-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statement-aligned action center */}
                    <div className="card border-0 shadow-sm rounded-4 mb-4" id="admin-action-center">
                        <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                            <h5 className="fw-bold mb-1 text-dark">Admin Action Center</h5>
                            <p className="text-muted mb-0 small">Course improvement suggestions based on aggregated ratings.</p>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="rounded-4 border h-100 p-3 bg-light bg-opacity-50">
                                        <p className="fw-bold mb-1 text-dark"><FaClipboardList className="me-2 text-warning" />Improve Course Content</p>
                                        <p className="text-muted small mb-2">Prioritize low-rated courses for syllabus/content improvements.</p>
                                        {filteredLowPerformanceCourses.length === 0 ? (
                                            <p className="text-muted small mb-0">No course trend data available yet.</p>
                                        ) : (
                                            <ul className="mb-0 ps-3 small">
                                                {filteredLowPerformanceCourses.map((c) => (
                                                    <li key={c.id} className="text-muted">{c.title} ({c.avgRating}/5)</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Left Column: Charts */}
                        <div className="col-lg-5 d-flex flex-column gap-4">
                            {/* Visualizations - Trend Line */}
                            <div className="card border-0 shadow-sm rounded-4 flex-grow-1">
                                <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0 text-dark"><FaChartLine className="me-2 text-primary" />Engagement Trends</h5>
                                    <span className="badge bg-light text-muted border">Past 7 Days</span>
                                </div>
                                <div className="card-body p-4" style={{ height: '250px' }}>
                                    {trendData && <Line data={trendData} options={chartOptions} />}
                                </div>
                            </div>

                            {/* Visualizations - Double Charts Row */}
                            <div className="row g-4 flex-grow-1">
                                <div className="col-xl-6">
                                    <div className="card border-0 shadow-sm rounded-4 h-100">
                                        <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                                            <h6 className="fw-bold mb-0 text-dark">Rating Spread</h6>
                                        </div>
                                        <div className="card-body p-4 pb-2" style={{ height: '220px' }}>
                                            {ratingDistData && <Bar data={ratingDistData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="card border-0 shadow-sm rounded-4 h-100">
                                        <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                                            <h6 className="fw-bold mb-0 text-dark">Sentiment Breakdown</h6>
                                        </div>
                                        <div className="card-body p-4 pb-2" style={{ height: '220px' }}>
                                            {sentimentData && <Pie data={sentimentData} options={pieOptions} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Real-time Feedback Stream */}
                        <div className="col-lg-7">
                            <div className="card border-0 shadow-sm h-100 rounded-4">
                                <div className="card-header bg-white border-bottom pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                                    <h5 className="fw-bold mb-0 text-dark"><FaClipboardList className="me-2 text-success" />Real-time Activity Stream</h5>
                                    <span className="badge bg-light text-primary border rounded-pill px-3 py-2 fw-bold">{filteredFeedback.length} Reports</span>
                                </div>
                                <div className="card-body p-4 bg-light bg-opacity-50">
                                    {filteredFeedback.length === 0 ? (
                                        <div className="text-center text-muted py-5 d-flex flex-column align-items-center h-100 justify-content-center">
                                            <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mb-3 text-muted shadow-sm" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                                <FaClipboardList />
                                            </div>
                                            <h5 className="fw-bold text-dark">Awaiting Analytics</h5>
                                            <p className="text-muted" style={{ maxWidth: '250px' }}>No student feedback has been populated into the database cluster yet.</p>
                                        </div>
                                    ) : (
                                        <div style={{ maxHeight: '800px', overflowY: 'auto' }} className="pe-2 custom-scrollbar">
                                            {/* Reverse feedback array to show newest first */}
                                            {[...filteredFeedback].reverse().map(fb => (
                                                <FeedbackCard key={fb.id} feedback={fb} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


