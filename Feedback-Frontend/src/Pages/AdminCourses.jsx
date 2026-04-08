import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getCourses, createCourse, deleteCourse, updateCourse } from '../utils/api';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FaBookOpen, FaHome, FaChartLine, FaUsers, FaSun, FaMoon, FaBars, FaGraduationCap, FaUserCircle, FaBell, FaSignOutAlt, FaEdit, FaTrashAlt, FaPlusCircle, FaSearch } from 'react-icons/fa';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: '', description: '', instructor: '', department: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const user = getCurrentUser();
    const currentDepartment = user?.department;
    const currentTeacherName = (user?.fullName || '').trim().toLowerCase();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (currentDepartment) {
            setNewCourse(prev => prev.department ? prev : { ...prev, department: currentDepartment });
        }
    }, [currentDepartment]);

    useEffect(() => {
        if (user?.fullName) {
            setNewCourse(prev => prev.instructor ? prev : { ...prev, instructor: user.fullName });
        }
    }, [user?.fullName]);

    const loadData = async () => {
        try {
            const coursesData = await getCourses();
            const department = user?.department;
            const visibleCourses = (coursesData || []).filter(course => {
                const sameDepartment = department ? (course.department || course.branch) === department : true;
                const sameInstructor = currentTeacherName
                    ? String(course.instructor || '').trim().toLowerCase() === currentTeacherName
                    : true;
                return sameDepartment && sameInstructor;
            });
            setCourses(visibleCourses);
        } catch (err) {
            console.error('Failed to load courses:', err);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course? All associated feedback will also be permanently deleted.")) {
            try {
                await deleteCourse(id);
                toast.success('Course deleted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                await loadData();
            } catch (err) {
                console.error('Failed to delete course:', err);
                toast.error('Unable to delete course.', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
    };

    const handleEditChange = (e) => {
        setEditingCourse({ ...editingCourse, [e.target.name]: e.target.value });
    };

    const handleCreateChange = (e) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        if (!newCourse.title || !newCourse.instructor || !newCourse.department) return;

        try {
            await createCourse({
                ...newCourse,
                instructor: user?.fullName || newCourse.instructor
            });
            toast.success('Course deployed successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            setNewCourse({ title: '', description: '', instructor: user?.fullName || '', department: user?.department || '' });
            await loadData();
        } catch (err) {
            console.error('Failed to create course:', err);
            toast.error('Unable to deploy course.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        if (!editingCourse.title || !editingCourse.instructor) return;

        try {
            await updateCourse(editingCourse.id, {
                title: editingCourse.title,
                instructor: editingCourse.instructor,
                department: editingCourse.department,
                description: editingCourse.description
            });
            toast.success('Course updated successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
            setEditingCourse(null);
            await loadData();
        } catch (err) {
            console.error('Failed to update course:', err);
            toast.error('Unable to update course.', {
                position: "top-right",
                autoClose: 3000,
            });
        }
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
        if (query.includes('student')) {
            navigate('/admin/students');
        }
    };

    const filteredCourses = courses.filter((course) => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return true;

        return [course.title, course.instructor, course.department || course.branch, course.description]
            .some((value) => String(value || '').toLowerCase().includes(query));
    });

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
                                placeholder="Search courses or type reports/students..."
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
                    <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
                        <div>
                            <h3 className="fw-bolder text-dark mb-1"><FaBookOpen className="me-2 text-primary" />Deploy Courses</h3>
                            <p className="text-muted mb-0">Create, modify, and manage active courses.</p>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-header bg-white border-bottom pt-4 pb-3 px-4">
                            <h5 className="fw-bold mb-0 text-dark"><FaPlusCircle className="me-2 text-primary" />Deploy New Course</h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleCreateCourse}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Course Title</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            name="title"
                                            placeholder="e.g. Adv. Data Structures"
                                            value={newCourse.title}
                                            onChange={handleCreateChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Instructor Name</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            name="instructor"
                                            placeholder="e.g. Dr. Turing"
                                            value={newCourse.instructor}
                                            onChange={handleCreateChange}
                                            readOnly={!!user?.fullName}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Department</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            name="department"
                                            placeholder="e.g. CSE"
                                            value={newCourse.department}
                                            onChange={handleCreateChange}
                                            readOnly={!!currentDepartment}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Detailed Syllabus</label>
                                        <textarea
                                            className="form-control bg-light border-0 px-3 py-2"
                                            rows="3"
                                            name="description"
                                            placeholder="Brief overview of the curriculum..."
                                            value={newCourse.description}
                                            onChange={handleCreateChange}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="mt-3 text-end">
                                    <button type="submit" className="btn btn-primary fw-bold rounded-pill px-4 shadow-sm hover-lift">Deploy Course</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 ps-4">Course Title</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Instructor</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Department</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3">Description</th>
                                        <th scope="col" className="text-muted small fw-bold text-uppercase py-3 text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5">
                                                <p className="text-muted fw-bold mb-0">No active courses found. Deploy a new course using the form above.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCourses.map((course) => (
                                            <tr key={course.id}>
                                                <td className="ps-4 py-3">
                                                    <div className="fw-bold text-dark">{course.title}</div>
                                                    <div className="small text-muted">ID: {String(course.id).substring(0, 8)}</div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1"><FaUserCircle className="me-1 text-primary" /> {course.instructor}</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark border px-2 py-1">{course.department || course.branch || 'N/A'}</span>
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
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Department</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 px-3 py-2"
                                            name="department"
                                            value={editingCourse.department || editingCourse.branch || ''}
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
