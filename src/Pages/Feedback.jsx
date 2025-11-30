import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  if (!user) return <p>Loading...</p>;

  const [feedbacks, setFeedbacks] = useState([]);

  // ✅ Load feedback initially
  const loadFeedbacks = () => {
    const stored = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const filtered = stored.filter((fb) => fb.studentEmail === user.email);
    setFeedbacks(filtered);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  // ⭐ LIVE UPDATE WHEN NEW FEEDBACK ADDED
  useEffect(() => {
    const updateOnStorage = () => loadFeedbacks();

    window.addEventListener("storage", updateOnStorage);
    return () => window.removeEventListener("storage", updateOnStorage);
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
      }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        <h2 className="fw-bold mb-4 text-primary">💬 Teacher Feedback</h2>

        {feedbacks.length === 0 ? (
          <p className="text-muted">No feedback available.</p>
        ) : (
          feedbacks.map((item, index) => (
            <div
              key={index}
              className="card p-4 mb-3 shadow-sm"
              style={{ borderRadius: "12px", background: "#e8f5e9" }}
            >
              <h5 className="fw-bold">📘 {item.assignmentTitle}</h5>

              <p className="mt-2 mb-1 fw-semibold">Teacher's Feedback:</p>
              <p className="text-muted">{item.feedback}</p>

              <small className="text-muted d-block">
                📅 Submitted: {item.submittedOn}
              </small>
              <small className="text-muted d-block">
                ✅ Graded: {item.gradedOn}
              </small>
            </div>
          ))
        )}

        <button
          className="btn btn-outline-success mt-3"
          onClick={() => navigate("/student")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
