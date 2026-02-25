import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { getCourses, submitFeedback, getStudentFeedback, getPendingCourses } from '../utils/storage';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import {
  FaChalkboardTeacher, FaRegStar, FaHome, FaBookOpen,
  FaUserCircle, FaBell, FaSignOutAlt, FaSun, FaMoon,
  FaBars, FaGraduationCap, FaCheckCircle, FaClock,
  FaChartLine, FaStar
} from 'react-icons/fa';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [studentFeedback, setStudentFeedback] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = getCurrentUser();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { id } = useParams();

  const loadData = () => {
    if (user && user.id) {
      const allCourses = getCourses();
      setCourses(allCourses);
      setPendingCourses(getPendingCourses(user.id));
      setStudentFeedback(getStudentFeedback(user.id));

    }
  };

  useEffect(() => { loadData(); }, [id]);



  const calculateAveragePerformance = () => {
    if (studentFeedback.length === 0) return '--';
    const total = studentFeedback.reduce((acc, curr) => acc + curr.courseRating + curr.instructorRating, 0);
    return (total / (studentFeedback.length * 2)).toFixed(1);
  };

  const avgPerformance = calculateAveragePerformance();

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  // ── Star renderer helper ──
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <FaStar key={i} size={13} color={i < rating ? '#f59e0b' : '#d1d5db'} />
    ));

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
        {/* Logo — no link to home, just a div */}
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
            <input
              type="text"
              className="form-control rounded-pill bg-light border-0 px-4"
              placeholder="Search courses..."
              style={{ maxWidth: 280 }}
            />
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
                <span className="fw-bold text-dark lh-sm" style={{ fontSize: '0.9rem' }}>{user.fullName}</span>
                <span className="text-muted lh-sm text-capitalize" style={{ fontSize: '0.78rem' }}>{user.role}</span>
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

        {/* Content */}
        <div className="container-fluid p-4 overflow-auto flex-grow-1">

          {/* Error message */}
          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} />
            </div>
          )}

          {/* Welcome Banner */}
          <div
            className="rounded-4 mb-4 p-4 p-md-5 position-relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
          >
            <div className="position-absolute top-0 end-0 text-white opacity-10" style={{ fontSize: '14rem', lineHeight: 1, transform: 'translate(10%,-15%)' }}>
              <FaGraduationCap />
            </div>
            <div className="position-relative" style={{ zIndex: 1 }}>
              <h3 className="fw-bold text-white mb-2">Welcome back, {user.fullName}!</h3>
              <p className="mb-0 text-white" style={{ opacity: 0.75 }}>
                You have <strong>{pendingCourses.length}</strong> pending course{pendingCourses.length !== 1 ? 's' : ''} awaiting evaluation this semester. Your voice shapes the future of education.
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Courses Enrolled', value: courses.length, icon: <FaBookOpen />, bg: 'bg-primary bg-opacity-10 text-primary' },
              { label: 'Feedback Given', value: studentFeedback.length, icon: <FaCheckCircle />, bg: 'bg-success bg-opacity-10 text-success' },
              { label: 'Pending Reviews', value: pendingCourses.length, icon: <FaClock />, bg: 'bg-warning bg-opacity-10 text-warning' },
              { label: 'Avg Rating', value: avgPerformance, icon: <FaChartLine />, bg: 'bg-info bg-opacity-10 text-info' },
            ].map(s => (
              <div className="col-6 col-lg-3" key={s.label}>
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body d-flex align-items-center justify-content-between p-4">
                    <div>
                      <p className="text-muted fw-bold mb-1 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>{s.label}</p>
                      <h3 className="fw-bold mb-0 text-dark">{s.value}</h3>
                    </div>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${s.bg}`} style={{ width: 48, height: 48, fontSize: '1.2rem' }}>
                      {s.icon}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">

            {/* Active Courses */}
            <div className="col-12" id="active-courses-section">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center rounded-top-4">
                  <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                    <FaChalkboardTeacher className="text-primary" /> Active Courses
                  </h6>
                  <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-semibold" onClick={() => navigate('/student/courses')}>View All</button>
                </div>
                <div className="card-body p-0">
                  {pendingCourses.length === 0 ? (
                    <div className="p-5 text-center">
                      <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64, fontSize: '1.6rem' }}>
                        <FaCheckCircle className="text-success" />
                      </div>
                      <p className="fw-bold text-dark mb-1">All Caught Up!</p>
                      <p className="text-muted small mb-0 fst-italic">You have no pending course evaluations.</p>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {pendingCourses.map(course => (
                        <li key={course.id} className="list-group-item border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
                          <div>
                            <p className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>{course.title}</p>
                            <small className="text-muted d-flex align-items-center gap-1 mt-1">
                              <FaUserCircle size={11} /> {course.instructor}
                            </small>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold"
                            onClick={() => navigate(`/student/feedback/${course.id}`)}
                          >
                            Give Feedback
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>



          </div>

          {/* Recent Feedback Summary */}
          {studentFeedback.length > 0 && (
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-header bg-white border-bottom px-4 py-3 rounded-top-4">
                <h6 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  <FaChartLine className="text-info" /> Recent Feedback History
                </h6>
              </div>
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {studentFeedback.slice(0, 3).map((fb, i) => {
                    const course = courses.find(c => c.id === fb.courseId);
                    return (
                      <li key={i} className="list-group-item px-4 py-3 d-flex justify-content-between align-items-start">
                        <div>
                          <p className="fw-bold text-dark mb-1" style={{ fontSize: '0.9rem' }}>
                            {course ? course.title : 'Unknown Course'}
                          </p>
                          <p className="text-muted mb-1 fst-italic" style={{ fontSize: '0.82rem' }}>
                            "{fb.comment?.slice(0, 80)}{fb.comment?.length > 80 ? '...' : ''}"
                          </p>
                          <div className="d-flex gap-3">
                            <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                              <span className="text-muted">Course:</span>
                              <span className="d-flex gap-1">{renderStars(fb.courseRating)}</span>
                            </span>
                            <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
                              <span className="text-muted">Instructor:</span>
                              <span className="d-flex gap-1">{renderStars(fb.instructorRating)}</span>
                            </span>
                          </div>
                        </div>
                        <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 fw-semibold" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
                          Submitted
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;