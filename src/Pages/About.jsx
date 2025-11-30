import React from "react";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaHeart,
} from "react-icons/fa";

export default function About() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "calc(100vh - 120px)",
        width: "100%",
        padding: "60px 20px 40px",
        background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
      }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Main Card */}
        <div className="card shadow-2xl border-0 rounded-5 about-main overflow-hidden position-relative">
          <div className="position-absolute top-0 start-0 w-100 h-50 bg-gradient-primary opacity-10"></div>
          <div className="card-body p-5 p-lg-6 position-relative">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="section-badge mb-4">About Assignment Portal</div>
              <h2 className="display-4 fw-bold mb-3 text-dark">
                Streamlining education through digital innovation
              </h2>
            </div>

            {/* Mission */}
            <div className="mb-6">
              <p className="text-dark about-text lead">
                The <span className="fw-bold text-primary">Assignment Portal</span> is a
                modern platform designed to bridge the gap between teachers and
                students, offering a seamless experience for assignment
                management, grading, and feedback.
              </p>
            </div>

            {/* Features Grid */}
            <div className="row g-4 mb-6">
              <div className="col-md-4">
                <div className="feature-card text-center p-5 rounded-4 position-relative overflow-hidden">
                  <div className="feature-icon mb-4">
                    <FaChalkboardTeacher className="icon-blue" />
                  </div>
                  <h5 className="fw-bold mb-3 text-dark">For Teachers</h5>
                  <p className="text-muted">
                    Upload assignments, grade submissions, and provide feedback
                    efficiently.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="feature-card text-center p-5 rounded-4 position-relative overflow-hidden">
                  <div className="feature-icon mb-4">
                    <FaGraduationCap className="icon-purple" />
                  </div>
                  <h5 className="fw-bold mb-3 text-dark">For Students</h5>
                  <p className="text-muted">
                    Submit work, track progress, and receive feedback in one
                    place.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="feature-card text-center p-5 rounded-4 position-relative overflow-hidden">
                  <div className="feature-icon mb-4">
                    <FaClipboardCheck className="icon-orange" />
                  </div>
                  <h5 className="fw-bold mb-3 text-dark">Easy Tracking</h5>
                  <p className="text-muted">
                    Track deadlines, monitor performance, and stay organized.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h4 className="fw-bold mb-5 text-primary display-6">Key Features</h4>

              <div className="row g-4">
                {[
                  "Real-time assignment submission & grading",
                  "Personalized feedback system",
                  "Deadline tracking & notifications",
                  "Performance analytics dashboard",
                  "Subject-wise organization",
                  "Secure, user-friendly design",
                ].map((item, idx) => (
                  <div className="col-lg-6" key={idx}>
                    <div className="feature-item p-4 rounded-4 shadow-sm border-start border-4 border-primary d-flex align-items-start position-relative overflow-hidden">
                      <div className="feature-number position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 mb-3">
                        <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{idx + 1}</span>
                      </div>
                      <div className="feature-check me-3 mt-1">
                        <i className="fas fa-check-circle text-primary fs-5"></i>
                      </div>
                      <span className="fw-medium">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center mt-6 pt-5 border-top border-light">
              <div className="mb-4">
                <FaHeart className="text-danger fs-1 mb-3" />
                <p className="text-dark lead fw-semibold mb-0">
                  Built with passion to enhance education
                </p>
              </div>
              <p className="text-muted opacity-75 fs-6">
                Designed for seamless communication between educators and
                learners.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Styling */}
      <style>{`
        .about-main {
          background: #ffffff;
          transition: all 0.4s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .about-main:hover {
          transform: translateY(-10px);
          box-shadow: 0 50px 100px rgba(0,0,0,0.15);
        }

        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 14px 36px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
          letter-spacing: 0.5px;
        }

        .about-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #374151;
        }

        .feature-card {
          background: linear-gradient(145deg, #ffffff, #fafbfc);
          border: 2px solid transparent;
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05));
          border-radius: 20px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .feature-card:hover {
          transform: translateY(-15px) scale(1.03);
          border-color: #3b82f6;
          box-shadow: 0 30px 60px rgba(59, 130, 246, 0.15);
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-icon svg {
          width: 80px;
          height: 80px;
          padding: 20px;
          border-radius: 24px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 2px solid rgba(255,255,255,0.5);
        }

        .feature-card:hover .feature-icon svg {
          transform: scale(1.15) rotate(8deg);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }

        .icon-blue { color: #3b82f6; }
        .icon-purple { color: #8b5cf6; }
        .icon-orange { color: #f59e0b; }

        .feature-item {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          transition: all 0.3s ease;
          border-radius: 20px;
        }

        .feature-item:hover {
          transform: translateX(12px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.12);
        }

        .feature-number {
          width: 36px;
          height: 36px;
          font-size: 0.9rem;
        }

        /* Dark Mode */
        .dark-theme .about-main {
          background: #1e293b !important;
          color: #f1f5f9 !important;
        }

        .dark-theme .feature-card {
          background: linear-gradient(145deg, #334155, #475569);
        }

        .dark-theme .feature-item {
          background: linear-gradient(135deg, #334155, #475569);
          color: #f1f5f9;
        }

        .dark-theme .about-text {
          color: #e2e8f0;
        }

        .dark-theme .text-muted {
          color: #94a3b8 !important;
        }
      `}</style>
    </div>
  );
}
