import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { addNotification } from "../utils/notify";  // ⭐ ADDED

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const [assignments, setAssignments] = useState([]);

  // Load assignments
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("assignments")) || [];
    setAssignments(data);
  }, []);

  const totalAssignments = assignments.length;
  const pendingDeadlines = assignments.filter(
    (a) => new Date(a.deadline) > new Date()
  ).length;

  // Helper → Trigger notifications
  const notify = (msg) => {
    addNotification(user.email, msg);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        width: "100%",
        background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
        padding: "60px 20px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-success fw-bold" style={{ fontSize: "2rem" }}>
          🎓 Welcome, {user?.name || "Student"}!
        </h2>
        <p className="text-muted" style={{ fontSize: "1.1rem" }}>
          You have <b>{totalAssignments}</b> assignments &{" "}
          <b>{pendingDeadlines}</b> upcoming deadlines.
        </p>
      </div>

      {/* Cards */}
      <div className="row justify-content-center w-100 g-4" style={{ maxWidth: "1200px" }}>

        {/* Upload Assignments */}
        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="card h-100 shadow-lg border-0 text-center"
            style={{ borderRadius: "15px", transition: "0.3s", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body p-5">
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>📤</div>
              <h5 className="text-success fw-bold mb-3">Upload Assignments</h5>

              <button
                className="btn btn-success w-100 py-2"
                onClick={() => {
                  notify("📤 You opened Upload Assignment page.");
                  navigate("/upload");
                }}
              >
                Go <FaArrowRight className="ms-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="card h-100 shadow-lg border-0 text-center"
            style={{ borderRadius: "15px", transition: "0.3s", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body p-5">
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>📝</div>
              <h5 className="text-primary fw-bold mb-3">Review Feedback</h5>

              <button
                className="btn btn-primary w-100 py-2"
                onClick={() => {
                  notify("📝 You checked teacher feedback.");
                  navigate("/feedback");
                }}
              >
                Go <FaArrowRight className="ms-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Deadlines */}
        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="card h-100 shadow-lg border-0 text-center"
            style={{ borderRadius: "15px", transition: "0.3s", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body p-5">
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>⏰</div>
              <h5 className="text-warning fw-bold mb-3">View Deadlines</h5>

              <button
                className="btn btn-warning w-100 py-2 text-white"
                onClick={() => {
                  notify("⏰ You viewed upcoming deadlines.");
                  navigate("/deadlines");
                }}
              >
                Go <FaArrowRight className="ms-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Grades */}
        <div className="col-12 col-md-6 col-lg-4">
          <div
            className="card h-100 shadow-lg border-0 text-center"
            style={{ borderRadius: "15px", transition: "0.3s", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div className="card-body p-5">
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🏅</div>
              <h5 className="text-danger fw-bold mb-3">View Grades</h5>

              <button
                className="btn btn-danger w-100 py-2"
                onClick={() => {
                  notify("🏅 You checked your grades.");
                  navigate("/viewgrades");
                }}
              >
                Go <FaArrowRight className="ms-2" />
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
