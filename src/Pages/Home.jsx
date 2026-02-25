import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStar, FaChartBar, FaShieldAlt, FaGraduationCap, FaClipboardList } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="d-flex align-items-center justify-content-center text-center position-relative overflow-hidden"
        style={{
          minHeight: '100vh',
          paddingTop: '66px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1800&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(10,14,35,0.72)' }}
        />

        <div className="container position-relative py-5" style={{ zIndex: 2 }}>

          <p className="fw-semibold mb-3" style={{ color: '#60a5fa', fontSize: '0.78rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Student Feedback Platform
          </p>

          <h1 className="fw-bold text-white mb-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: 1.15 }}>
            Empowering Students,<br />
            <span style={{ color: '#60a5fa' }}>Improving Education</span>
          </h1>

          <p className="mx-auto mb-5" style={{ maxWidth: 460, fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
            Collect honest feedback, gain real-time insights, and build a better learning experience.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/login"
              className="btn btn-lg rounded-pill fw-semibold px-5 py-3"
              style={{ background: '#2563eb', color: '#fff', border: 'none', fontSize: '0.92rem' }}
            >
              Get Started
            </Link>
            <Link
              to="/signup"
              className="btn btn-lg rounded-pill fw-semibold px-5 py-3"
              style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', fontSize: '0.92rem' }}
            >
              Sign Up Free
            </Link>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-5 bg-white">
        <div className="container py-4">

          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '1.75rem' }}>Why Choose Us</h2>
            <p className="text-secondary mb-0" style={{ fontSize: '0.95rem' }}>Simple, powerful tools for better education.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { icon: <FaStar size={22} />, color: '#2563eb', bg: 'rgba(37,99,235,0.09)', title: 'Honest Feedback', text: 'Anonymous, constructive reviews from students.' },
              { icon: <FaChartBar size={22} />, color: '#0891b2', bg: 'rgba(8,145,178,0.09)', title: 'Live Analytics', text: 'Instant insights and reports for admins.' },
              { icon: <FaShieldAlt size={22} />, color: '#059669', bg: 'rgba(5,150,105,0.09)', title: 'Secure & Private', text: 'Role-based access keeps all data safe.' },
            ].map(f => (
              <div className="col-md-4" key={f.title}>
                <div
                  className="bg-white text-center p-4 h-100"
                  style={{ borderRadius: 14, border: '1px solid #e2e8f0', transition: 'all 0.2s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(15,23,42,0.09)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 52, height: 52, borderRadius: 12, background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#0f172a' }}>{f.title}</h6>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>{f.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CHOOSE YOUR PATH ── */}
      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Light overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(240,247,255,0.93)' }}
        />

        <div className="container py-4 position-relative" style={{ zIndex: 1 }}>

          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '1.75rem' }}>Choose Your Path</h2>
            <p className="text-secondary mb-0" style={{ fontSize: '0.95rem' }}>Tailored tools for every user.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { icon: <FaGraduationCap size={26} color="#fff" />, grad: 'linear-gradient(135deg,#2563eb,#60a5fa)', glow: 'rgba(37,99,235,0.25)', title: 'Student', text: 'Submit feedback and track your course insights.' },
              { icon: <FaClipboardList size={26} color="#fff" />, grad: 'linear-gradient(135deg,#7c3aed,#a78bfa)', glow: 'rgba(124,58,237,0.25)', title: 'Instructor', text: 'View ratings and improve your teaching.' },
              { icon: <FaShieldAlt size={26} color="#fff" />, grad: 'linear-gradient(135deg,#059669,#34d399)', glow: 'rgba(5,150,105,0.25)', title: 'Admin', text: 'Manage users, courses, and system settings.' },
            ].map(p => (
              <div className="col-lg-4 col-md-6" key={p.title}>
                <div
                  className="bg-white text-center p-4 h-100"
                  style={{ borderRadius: 14, border: '1px solid #e2e8f0', transition: 'all 0.2s ease', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 36px rgba(15,23,42,0.1)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 64, height: 64, borderRadius: 16, background: p.grad, boxShadow: `0 6px 18px ${p.glow}` }}
                  >
                    {p.icon}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#0f172a', fontSize: '1rem' }}>{p.title}</h6>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.85rem', lineHeight: 1.55 }}>{p.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;