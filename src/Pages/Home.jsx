import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="hero-section min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Content */}
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="hero-title mb-4">
                Smart Assignment & Submission Portal
              </h1>
              <p className="hero-subtitle mb-5">
                Streamline assignment workflows for teachers and students. Upload, submit, grade, and track — all in one smart platform.
              </p>
              <button
                className="btn btn-get-started btn-lg px-5 py-3 fw-semibold rounded-pill"
                onClick={() => navigate("/login")}
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-lg-6">
            <div className="hero-image-wrapper">
             <img
               src={`${import.meta.env.BASE_URL}images/assignment.png`}
                alt="Smart Assignment Portal Illustration"
                 className="hero-image img-fluid"
                />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .hero-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
          color: #1e293b;
          padding: 3rem 0;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          color: #1e293b;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: #475569;
          font-weight: 400;
          max-width: 480px;
          line-height: 1.6;
          margin-bottom: 2rem;
          font-family: 'Inter', sans-serif;
        }

        .btn-get-started {
          background: linear-gradient(135deg, #22c55e, #14b8a6);
          border: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1.1rem;
          box-shadow: 0 12px 30px rgba(20, 184, 166, 0.4);
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .btn-get-started:hover {
          background: linear-gradient(135deg, #16a34a, #0f766e);
          transform: translateY(-4px);
          box-shadow: 0 18px 42px rgba(20, 184, 166, 0.5);
        }

        .hero-image-wrapper {
          text-align: center;
        }

        .hero-image {
          max-width: 100%;
          border-radius: 24px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
          transition: transform 0.3s ease;
        }

        .hero-image:hover {
          transform: scale(1.05);
        }

        @media (max-width: 992px) {
          .hero-section {
            text-align: center;
          }
          .hero-image {
            max-width: 360px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
