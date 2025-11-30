import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaClock } from "react-icons/fa";

export default function ViewGrades() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  // Safety check
  if (!user) return <p>Loading...</p>;

  const [grades, setGrades] = useState([]);

  // ✅ FIX: Remove dependency loop by using empty array []
  useEffect(() => {
    const storedGrades = JSON.parse(localStorage.getItem("grades")) || [];

    const email = user.email; // extract email once

    const filtered = storedGrades.filter(
      (g) => g.studentEmail === email
    );

    setGrades(filtered);
  }, []); // 🔥 runs ONLY once → no infinite loop

  const handleBack = () => navigate("/student");

  const getBadgeClass = (grade) => {
    if (grade === "Pending") return "bg-warning text-dark";
    if (grade?.startsWith("A+")) return "bg-success";
    if (grade?.startsWith("A")) return "bg-primary";
    if (grade?.startsWith("B")) return "bg-info";
    return "bg-secondary";
  };

  const getStatusIcon = (status) => {
    if (status === "Graded") return <FaCheckCircle className="text-success" />;
    if (status === "Pending") return <FaClock className="text-warning" />;
    return null;
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
      }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        <h2 className="fw-bold text-success mb-4">🎓 Your Grades</h2>

        {grades.length === 0 ? (
          <p className="text-muted">No grades available yet.</p>
        ) : (
          grades.map((item, index) => (
            <div
              key={index}
              className="card p-4 mb-3 shadow-sm"
              style={{ borderRadius: "12px", background: "#fff8e1" }}
            >
              <h5 className="fw-bold">📘 {item.assignmentTitle}</h5>

              <div className="d-flex align-items-center gap-2 mt-2 mb-2">
                <span className={`badge ${getBadgeClass(item.grade)}`}>
                  Grade: {item.grade}
                </span>

                <span className="badge bg-light text-dark">
                  {getStatusIcon(item.status)}
                  <span className="ms-2">{item.status}</span>
                </span>
              </div>

              <small className="text-muted d-block">
                📅 Submitted: {item.submittedOn}
              </small>
              <small className="text-muted d-block">
                ✅ Graded: {item.gradedOn}
              </small>
            </div>
          ))
        )}

        <button className="btn btn-outline-success mt-3" onClick={handleBack}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
