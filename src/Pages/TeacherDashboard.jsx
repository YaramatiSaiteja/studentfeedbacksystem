import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { addNotification } from "../utils/notify";   

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  return (
    <div className="teacher-dashboard-page d-flex flex-column align-items-center">
      
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary" style={{ fontSize: "2rem" }}>
          👩‍🏫 Welcome, {user?.name || "Teacher"}!
        </h2>
        <p className="text-muted" style={{ fontSize: "1.1rem" }}>
          Manage assignments, grade submissions, and provide feedback.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="row w-100 justify-content-center g-4" style={{ maxWidth: "1200px" }}>

        {/* Upload Assignments */}
        <DashboardCard
          title="Upload Assignments"
          icon="📤"
          color="primary"
          text="Create and upload new assignments for your students."
          onClick={() => {
            navigate("/upload-assignment");
          }}
        />

        {/* Grade Assignments */}
        <DashboardCard
          title="Grade Assignments"
          icon="🏆"
          color="success"
          text="Review and grade student submissions with feedback."
          onClick={() => {
            navigate("/grade");
          }}
        />

        {/* Provide Feedback */}
        <DashboardCard
          title="Provide Feedback"
          icon="💬"
          color="warning"
          text="Write personalized feedback for your students."
          onClick={() => {
            navigate("/teacher-feedback");
          }}
        />

      </div>

      {/* Styles */}
      <style>
        {`
          .teacher-dashboard-page {
            min-height: calc(100vh - 120px);
            width: 100%;
            padding: 60px 20px;
            background-color: #f5f7fa;
            transition: 0.3s;
          }

          .dashboard-card {
            border-radius: 15px;
            background-color: var(--bs-body-bg);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .dashboard-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.15);
          }

          /* Dark Mode */
          .dark-theme .teacher-dashboard-page {
            background-color: #121212 !important;
          }

          .dark-theme .dashboard-card {
            background-color: #1f1f1f !important;
            color: #e0e0e0 !important;
          }

          .dark-theme .text-muted {
            color: #b5b5b5 !important;
          }
        `}
      </style>
    </div>
  );
}

/* Reusable Dashboard Card Component */
function DashboardCard({ title, icon, color, text, onClick }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-lg border-0 dashboard-card text-center">
        <div className="card-body p-5">

          {/* Icon */}
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>
            {icon}
          </div>

          {/* Title */}
          <h5
            className={`fw-bold text-${color} mb-3`}
            style={{ fontSize: "1.5rem" }}
          >
            {title}
          </h5>

          {/* Description */}
          <p className="text-muted mb-4" style={{ fontSize: "1rem" }}>
            {text}
          </p>

          {/* Button */}
          <button
            className={`btn btn-${color} w-100 py-2 text-white rounded-3 fw-semibold`}
            style={{ fontSize: "1.1rem" }}
            onClick={onClick}
          >
            Go <FaArrowRight className="ms-2" />
          </button>

        </div>
      </div>
    </div>
  );
}
