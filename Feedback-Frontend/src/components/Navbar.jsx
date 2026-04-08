import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logoutUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaGraduationCap } from 'react-icons/fa';

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .sfh-navbar {
    background: #0a0a0a;
    border-bottom: 2px solid #d4a017;
    box-shadow: 0 2px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(212,160,23,0.3);
    padding: 0 !important;
    height: 66px;
    position: relative;
    font-family: 'Plus Jakarta Sans', sans-serif;
    z-index: 1050;
  }

  .sfh-inner {
    display: flex;
    align-items: center;
    height: 66px;
    width: 100%;
  }

  /* ── Brand ── */
  .sfh-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none !important;
    font-size: 1.05rem;
    font-weight: 700;
    color: #ffffff !important;
    letter-spacing: -0.01em;
    transition: color 0.2s ease;
    flex-shrink: 0;
  }
  .sfh-brand:hover { color: #d4a017 !important; }

  .sfh-brand-icon {
    width: 38px;
    height: 38px;
    background: linear-gradient(135deg, #d4a017, #f0c040);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(212,160,23,0.4);
    flex-shrink: 0;
  }

  /* ── Nav list ── */
  .sfh-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 2px;
    height: 66px;
  }

  .sfh-nav-item {
    display: flex;
    align-items: center;
  }

  .sfh-nav-link {
    text-decoration: none !important;
    color: #a0a0a0;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    padding: 7px 16px;
    border-radius: 8px;
    transition: color 0.18s ease, background 0.18s ease;
    white-space: nowrap;
  }
  .sfh-nav-link:hover {
    color: #d4a017;
    background: rgba(212,160,23,0.08);
  }

  /* ── Welcome ── */
  .sfh-welcome {
    color: #606060;
    font-size: 0.82rem;
    font-weight: 400;
    padding: 0 14px;
    white-space: nowrap;
  }
  .sfh-welcome strong {
    color: #d4a017;
    font-weight: 600;
  }

  /* ── Buttons ── */
  .sfh-btn-logout {
    background: transparent;
    border: 1px solid rgba(160,160,160,0.25);
    color: #a0a0a0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    padding: 7px 18px;
    border-radius: 22px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .sfh-btn-logout:hover {
    border-color: rgba(239,68,68,0.5);
    color: #fca5a5;
    background: rgba(239,68,68,0.08);
  }

  .sfh-btn-signup {
    background: linear-gradient(135deg, #d4a017 0%, #f0c040 100%);
    border: none;
    color: #0a0a0a !important;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    padding: 8px 22px;
    border-radius: 22px;
    text-decoration: none !important;
    transition: all 0.22s ease;
    white-space: nowrap;
    letter-spacing: 0.02em;
    box-shadow: 0 2px 14px rgba(212,160,23,0.35);
    display: inline-flex;
    align-items: center;
  }
  .sfh-btn-signup:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(212,160,23,0.55);
    color: #0a0a0a !important;
  }

  /* ── Divider ── */
  .sfh-divider {
    width: 1px;
    height: 22px;
    background: rgba(255,255,255,0.08);
    margin: 0 10px;
    flex-shrink: 0;
  }

  /* ── Theme toggle ── */
  .sfh-theme-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #808080;
    flex-shrink: 0;
  }
  .sfh-theme-btn:hover {
    background: rgba(212,160,23,0.12);
    border-color: rgba(212,160,23,0.4);
    color: #d4a017;
    transform: rotate(20deg);
  }

  /* ── Mobile ── */
  @media (max-width: 991px) {
    .sfh-navbar { height: auto; min-height: 64px; }
    .sfh-inner { height: 64px; }
    .sfh-collapse {
      background: #0d0d0d;
      border-top: 1px solid rgba(212,160,23,0.2);
      padding: 10px 0 16px;
    }
    .sfh-nav-list {
      flex-direction: column;
      align-items: flex-start;
      height: auto;
      gap: 2px;
      padding: 4px 0;
    }
    .sfh-nav-item { width: 100%; }
    .sfh-nav-link { display: block; width: 100%; }
    .sfh-divider { display: none; }
    .sfh-welcome { padding: 8px 16px; }
    .sfh-btn-logout, .sfh-btn-signup { margin: 4px 16px; }
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      <style>{navStyles}</style>
      <nav className="sfh-navbar navbar navbar-expand-lg fixed-top">
        <div className="container-fluid px-4 px-lg-5">
          <div className="sfh-inner">

            {/* Logo */}
            <Link className="sfh-brand navbar-brand me-auto" to="/">
              <div className="sfh-brand-icon">
                <FaGraduationCap size={17} color="#0a0a0a" />
              </div>
              Student Feedback Hub
            </Link>

            {/* Mobile Toggle */}
            <button
              className="navbar-toggler border-0 shadow-none d-lg-none ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              style={{ border: '1px solid rgba(212,160,23,0.3)', borderRadius: '8px', padding: '6px 10px' }}
            >
              <span className="navbar-toggler-icon" style={{ filter: 'brightness(0.8) sepia(1) hue-rotate(5deg) saturate(3)' }}></span>
            </button>

            {/* Nav Items */}
            <div className="collapse navbar-collapse sfh-collapse" id="navbarNav">
              <ul className="sfh-nav-list ms-auto">

                {authenticated ? (
                  <>
                    <li className="sfh-nav-item">
                      <span className="sfh-welcome">
                        Welcome, <strong>{user.fullName}</strong>
                      </span>
                    </li>

                    <li className="sfh-nav-item">
                      <Link
                        className="sfh-nav-link"
                        to={user.role === 'admin' ? '/admin' : '/student'}
                      >
                        Dashboard
                      </Link>
                    </li>

                    <div className="sfh-divider" />

                    <li className="sfh-nav-item">
                      <button onClick={handleLogout} className="sfh-btn-logout">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="sfh-nav-item">
                      <Link className="sfh-nav-link" to="/login">Login</Link>
                    </li>

                    <li className="sfh-nav-item ms-1">
                      <Link className="sfh-btn-signup" to="/signup">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}

                <div className="sfh-divider" />

                <li className="sfh-nav-item">
                  <button onClick={toggleTheme} className="sfh-theme-btn" title="Toggle theme">
                    {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
                  </button>
                </li>

              </ul>
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;