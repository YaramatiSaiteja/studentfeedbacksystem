import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { getCourseById, submitFeedback as submitFeedbackApi } from '../utils/api';
import { submitFeedback as submitFeedbackLocal } from '../utils/storage';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import {
    FaRegStar, FaHome, FaBookOpen, FaUserCircle, FaBell,
    FaSignOutAlt, FaSun, FaMoon, FaBars, FaGraduationCap,
    FaCheckCircle, FaStar, FaArrowLeft
} from 'react-icons/fa';

const StarRating = ({ value = 5, onChange = () => {}, size = 20 }) => {
    return (
        <div className="d-flex align-items-center">
            {[1,2,3,4,5].map(i => (
                <button
                    key={i}
                    type="button"
                    className="btn p-0 border-0 bg-transparent me-2"
                    onClick={() => onChange(i)}
                    aria-label={`Rate ${i}`}
                >
                    <FaStar size={size} color={i <= value ? '#f59e0b' : '#d1d5db'} />
                </button>
            ))}
        </div>
    );
};

const SubmitFeedback = () => {
    const [course, setCourse] = useState(null);
    const [feedback, setFeedback] = useState({
        courseRating: 1,
        instructorRating: 1,
        contentQuality: 1,
        subjectDifficulty: 1,
        practicalApplication: 1,
        comment: ''
    });
    const [message, setMessage] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const { id } = useParams();

    useEffect(() => {
        const loadCourse = async () => {
            if (user && user.id && id) {
                try {
                    const found = await getCourseById(id);
                    if (found) {
                        setCourse(found);
                    } else {
                        navigate('/student/dashboard');
                    }
                } catch (err) {
                    console.error('Failed to load course:', err);
                    navigate('/student/dashboard');
                }
            }
        };
        loadCourse();
    }, [id, user, navigate]);

    const numericFields = new Set(['courseRating','instructorRating','contentQuality','subjectDifficulty','practicalApplication']);
    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedback({ ...feedback, [name]: numericFields.has(name) ? Number(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitFeedbackApi({ courseId: Number(course.id), studentId: String(user.id), ...feedback });
            setSubmitted(true);
            setTimeout(() => {
                navigate('/student/dashboard');
            }, 1500);
        } catch (err) {
            console.error('API submit failed, falling back to local storage:', err);
            try {
                submitFeedbackLocal({ courseId: String(course.id), studentId: String(user.id), ...feedback });
                setSubmitted(true);
                setMessage('Saved locally (offline). It will sync when server is available.');
                setTimeout(() => {
                    navigate('/student/dashboard');
                }, 1500);
            } catch (localErr) {
                console.error('Local save failed:', localErr);
                setMessage('Failed to submit feedback. Please try again.');
            }
        }
    };

    const handleLogout = () => { logoutUser(); navigate('/login'); };

    const renderStars = (rating) =>
        [...Array(5)].map((_, i) => (
            <FaStar key={i} size={13} color={i < rating ? '#f59e0b' : '#d1d5db'} />
        ));

    if (!course) return null;

    return (
        <div className="d-flex min-vh-100 flex-column flex-lg-row" style={{ backgroundColor: 'var(--bg-main)' }}>

            {/* Mobile Header */}
            <div className="d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
                <h5 className="mb-0 fw-bold d-flex align-items-center text-primary">
                    <FaGraduationCap className="me-2" /> Feedback Hub
                </h5>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaBars />
                </button>
            </div>

            {sidebarOpen && (
                <div
                    className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                    style={{ zIndex: 1040 }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
                <div
                    className={`bg-white border-end flex-column admin-fixed-sidebar ${sidebarOpen ? 'd-flex position-fixed' : 'd-none d-lg-flex'}`}
                    style={{ width: 240, height: '100vh', top: 0, left: 0, zIndex: 1050 }}
                >
                <div className="p-4 border-bottom d-none d-lg-flex align-items-center gap-2">
                    <FaGraduationCap className="text-primary fs-4" />
                    <span className="fw-bold text-primary fs-5">Feedback Hub</span>
                </div>

                <div className="p-3 flex-grow-1">
                    <p className="text-muted fw-bold text-uppercase mb-3 px-2" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>Menu</p>
                    <ul className="nav flex-column gap-1">
                        <li className="nav-item">
                            <NavLink to="/student/dashboard" end className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 ${isActive ? 'text-white bg-primary' : 'text-muted'}`} onClick={() => setSidebarOpen(false)}>
                                <FaHome className="me-3" /> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/student/feedback" end className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 ${isActive ? 'text-white bg-primary' : 'text-muted'}`} onClick={() => setSidebarOpen(false)}>
                                <FaRegStar className="me-3" /> My Feedback
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/student/courses" className={({ isActive }) => `nav-link fw-medium d-flex align-items-center rounded px-3 py-2 ${isActive ? 'text-white bg-primary' : 'text-muted'}`} onClick={() => setSidebarOpen(false)}>
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
                </div>
            </div>

            {/* Main Area */}
                <div className="flex-grow-1 d-flex flex-column overflow-hidden admin-main-with-fixed-sidebar">
                <nav className="navbar bg-white border-bottom px-4 py-3 shadow-sm">
                    <div className="d-none d-md-flex">
                        <button className="btn btn-light rounded-pill border-0 px-4 fw-bold" onClick={() => navigate('/student/dashboard')}>
                            <FaArrowLeft className="me-2" /> Back to Dashboard
                        </button>
                    </div>
                    <ul className="navbar-nav ms-auto flex-row align-items-center gap-3">
                        <li className="nav-item dropdown d-flex align-items-center gap-2">
                            <div className="d-none d-sm-flex flex-column text-end">
                                <span className="fw-bold text-dark lh-sm" style={{ fontSize: '0.9rem' }}>{user.fullName}</span>
                                <span className="text-muted lh-sm text-capitalize" style={{ fontSize: '0.78rem' }}>{user.role}</span>
                            </div>
                            <button
                                className="btn p-0 border-0 bg-transparent rounded-circle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, fontSize: '1.1rem' }}>
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
                </nav>

                <div className="container p-4 overflow-auto flex-grow-1">
                    {message && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {message}
                            <button type="button" className="btn-close" onClick={() => setMessage('')} />
                        </div>
                    )}

                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-bottom px-4 py-3 rounded-top-4 d-flex align-items-center justify-content-between">
                                    <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                                        <FaRegStar className="text-warning" /> Course Evaluation
                                    </h5>
                                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
                                        {course.title}
                                    </span>
                                </div>

                                <div className="card-body p-4 p-md-5">
                                    {submitted ? (
                                        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
                                            <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mb-4" style={{ width: 80, height: 80, fontSize: '2.2rem' }}>
                                                <FaCheckCircle className="text-success" />
                                            </div>
                                            <h4 className="fw-bold text-dark mb-2">Evaluation Complete</h4>
                                            <p className="text-muted mb-4" style={{ maxWidth: 320 }}>
                                                Thank you for your detailed feedback on <strong>{course.title}</strong>!
                                            </p>
                                            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => navigate('/student/dashboard')}>
                                                Return to Dashboard
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <p className="text-muted mb-4 pb-3 border-bottom">
                                                Your honest feedback helps us improve the quality of education. Please rate your experience across the following dimensions.
                                            </p>

                                            <div className="row g-4 mb-4">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-dark mb-1">Overall Course Rating</label>
                                                    <p className="small text-muted mb-2">How would you rate the course overall?</p>
                                                    <StarRating value={feedback.courseRating} onChange={(v) => setFeedback({ ...feedback, courseRating: v })} />
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <small className="text-muted fw-bold">1</small>
                                                        <small className="text-muted fw-bold">5</small>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-dark mb-1">Instructor Effectiveness</label>
                                                    <p className="small text-muted mb-2">Rate {course.instructor}'s teaching.</p>
                                                    <StarRating value={feedback.instructorRating} onChange={(v) => setFeedback({ ...feedback, instructorRating: v })} />
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <small className="text-muted fw-bold">1</small>
                                                        <small className="text-muted fw-bold">5</small>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-dark mb-1">Course Content & Material</label>
                                                    <p className="small text-muted mb-2">Were the study materials useful and clear?</p>
                                                    <StarRating value={feedback.contentQuality} onChange={(v) => setFeedback({ ...feedback, contentQuality: v })} />
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <small className="text-muted fw-bold">1</small>
                                                        <small className="text-muted fw-bold">5</small>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold text-dark mb-1">Practical Application</label>
                                                    <p className="small text-muted mb-2">How relevant were the labs/practical tasks?</p>
                                                    <StarRating value={feedback.practicalApplication} onChange={(v) => setFeedback({ ...feedback, practicalApplication: v })} />
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <small className="text-muted fw-bold">1</small>
                                                        <small className="text-muted fw-bold">5</small>
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <label className="form-label fw-bold text-dark mb-1">Subject Difficulty</label>
                                                    <p className="small text-muted mb-2">How challenging was the subject curriculum?</p>
                                                    <StarRating value={feedback.subjectDifficulty} onChange={(v) => setFeedback({ ...feedback, subjectDifficulty: v })} />
                                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                                        <small className="text-muted fw-bold">Too Easy (1)</small>
                                                        <small className="text-muted fw-bold">Too Hard (5)</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label fw-bold text-dark mb-2">Detailed Comments & Insights</label>
                                                <textarea
                                                    className="form-control bg-light border-0"
                                                    rows="5"
                                                    name="comment"
                                                    placeholder="Please provide specific examples of what worked well and what could be improved..."
                                                    value={feedback.comment}
                                                    onChange={handleFeedbackChange}
                                                    required
                                                />
                                            </div>

                                            <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                                                <button type="button" className="btn btn-light border fw-bold rounded-pill px-4" onClick={() => navigate('/student/dashboard')}>
                                                    Cancel
                                                </button>
                                                <button type="submit" className="btn btn-primary fw-bold rounded-pill px-5 shadow-sm">
                                                    Submit Evaluation
                                                </button>
                                            </div>
                                        </form>
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

export default SubmitFeedback;
