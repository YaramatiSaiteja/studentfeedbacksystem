import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="pt-5 pb-4 mt-auto border-top footer-border shadow-sm" style={{ background: 'var(--navbar-bg)', transition: 'background 0.3s ease' }}>
      <div className="container py-3">
        <div className="row gy-5">

          {/* Column 1: Brand & Description */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-uppercase fw-bold mb-3 d-flex align-items-center text-white">
              Student Feedback Hub
            </h5>
            <p className="footer-text mb-4 pe-lg-4">
              A premium, seamless, and professional platform dedicated to capturing actionable feedback to structurally improve education quality and foster transparency.
            </p>
          </div>

          {/* Column 2: Product Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase fw-bold mb-3 pb-2 d-inline-block text-white footer-border" style={{ borderBottom: '2px solid' }}>Product</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="#" className="footer-link">Features</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Pricing</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Testimonials</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Integrations</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="text-uppercase fw-bold mb-3 pb-2 d-inline-block text-white footer-border" style={{ borderBottom: '2px solid' }}>Resources</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><Link to="#" className="footer-link">Documentation</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">API Reference</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Blog</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Community</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div className="col-lg-4 col-md-6">
            <h6 className="text-uppercase fw-bold mb-3 pb-2 d-inline-block text-white footer-border" style={{ borderBottom: '2px solid' }}>Connect</h6>
            <p className="footer-text mb-3">Join our newsletter to stay up to date on features and releases.</p>
            <div className="d-flex gap-3 mb-4">
              <a href="#" className="footer-link fs-4"><FaGithub /></a>
              <a href="#" className="footer-link fs-4"><FaTwitter /></a>
              <a href="#" className="footer-link fs-4"><FaLinkedin /></a>
              <a href="#" className="footer-link fs-4"><FaEnvelope /></a>
            </div>
          </div>

        </div>

        <hr className="my-4 footer-border" />

        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="footer-text mb-0">
              &copy; {new Date().getFullYear()} Student Feedback Hub. All rights reserved.
            </p>
          </div>
          <div className="col-md-5 col-lg-4">
            <div className="text-md-end footer-text mt-3 mt-md-0">
              <Link to="#" className="footer-link me-3">Privacy Policy</Link>
              <Link to="#" className="footer-link">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
