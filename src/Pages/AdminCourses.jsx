import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getCourses, deleteCourse, editCourse } from '../utils/storage';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FaBookOpen, FaHome, FaChartLine, FaClipboardList, FaUsers, FaCog, FaSun, FaMoon, FaBars, FaChartPie, FaUserCircle, FaBell, FaSignOutAlt, FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const user = getCurrentUser();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setCourses(getCourses());
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course? All associated feedback will also be permanently deleted.")) {
            deleteCourse(id);
            setMessage({ type: 'success', text: 'Course deleted successfully!' });
            loadData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    const handleEditChange = (e) => {
        setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
    };

    const handleUpdateCourse = (e) => {
        e.preventDefault();
        if (!editingCourse.title || !editingCourse.instructor) return;

        editCourse(editingCourse.id, {
            title: editingCourse.title,
            instructor: editingCourse.instructor,
            description: editingCourse.description
        });

        setMessage({ type: 'success', text: 'Course updated successfully!' });
        setEditingCourse(null);
        loadData();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
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
                            <span className="input-group-text bg-light border-0"><FaBookOpen className="text-muted" /></span>
                            <input type="text" className="form-control bg-light border-0" placeholder="Search course inventory..." />
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
                            <h3 className="fw-bolder text-dark mb-1"><FaBookOpen className="me-2 text-primary" />Course Management</h3>
                            <p className="text-muted mb-0">Modify active curriculums or permanently delete deprecated courses.</p>
                        </div>
                        <Link to="/admin/dashboard" className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm hover-lift"><FaPlusCircle className="me-2" />Add Course</Link>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type} alert-dismissible fade show shadow-sm`} role="alert">
                            {message.text}
                            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                        </div>
                    )}

                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 ps-4">Course Title</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Instructor</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Description</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <p className="text-muted fw-bold mb-0">No active courses found. Initialize one from the primary Dashboard.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        courses.map((course) => (
                                            <tr key={course.id}>
                                                <td className="ps-4 py-3">
                                                    <div className="fw-bold text-dark">{course.title}</div>
                                                    <div className="small text-muted">ID: {course.id.substring(0, 8)}</div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1"><FaUserCircle className="me-1 text-primary" /> {course.instructor}</span>
                                                </td>
                                                <td className="text-muted small" style={{ maxWidth: '300px' }}>
                                                    <div className="text-truncate">{course.description || 'No description provided.'}</div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <button onClick={() => setEditingCourse(course)} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2 hover-scale"><FaEdit className="me-1" /> Edit</button>
                                                    <button onClick={() => handleDelete(course.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3 hover-scale"><FaTrashAlt className="me-1" /> Delete</button>
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

            {/* Edit Course Modal Overlay */}
            {editingCourse && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-bottom-0 pt-4 px-4">
                                <h5 className="modal-title fw-bold text-dark"><FaEdit className="text-primary me-2" /> Modify Course</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingCourse(null)}></button>
                            </div>
                            <div className="modal-body px-4 pb-4">
                                <form onSubmit={handleUpdateCourse}>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Course Title</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            name="title"
                                            value={editingCourse.title}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Instructor Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            name="instructor"
                                            value={editingCourse.instructor}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Detailed Syllabus</label>
                                        <textarea
                                            className="form-control bg-light border-0 px-3 py-2"
                                            rows="3"
                                            name="description"
                                            value={editingCourse.description}
                                            onChange={handleEditChange}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 text-end">
                                        <button type="button" className="btn btn-light fw-bold rounded-pill px-4" onClick={() => setEditingCourse(null)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm hover-lift">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
