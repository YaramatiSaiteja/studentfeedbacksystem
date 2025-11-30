import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../utils/notify";

export default function Deadlines() {
  const navigate = useNavigate();
  const [deadlines, setDeadlines] = useState([]);

  const user = JSON.parse(localStorage.getItem("loggedUser"));   // ✅ FIXED

  useEffect(() => {
    const assignments = JSON.parse(localStorage.getItem("assignments")) || [];

    const upcoming = assignments.filter(
      (a) => new Date(a.deadline) > new Date()
    );

    upcoming.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    setDeadlines(upcoming);

    checkDeadlineNotifications(upcoming);
  }, []);

  // Run checker every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      const assignments = JSON.parse(localStorage.getItem("assignments")) || [];

      const upcoming = assignments.filter(
        (a) => new Date(a.deadline) > new Date()
      );

      checkDeadlineNotifications(upcoming);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const checkDeadlineNotifications = (assignments) => {
    const notified =
      JSON.parse(localStorage.getItem("deadlineNotified")) || [];

    assignments.forEach((task) => {
      const deadlineTime = new Date(task.deadline).getTime();
      const now = Date.now();
      const hoursLeft = Math.floor((deadlineTime - now) / (1000 * 60 * 60));

      if (notified.includes(task.id)) return;

      if (hoursLeft <= 24 && hoursLeft > 0) {
        addNotification(
          user.email,
          `⏰ Reminder: Deadline tomorrow for "${task.title}"`
        );
        notified.push(task.id);
      }

      if (hoursLeft <= 0 && hoursLeft > -24) {
        addNotification(
          user.email,
          `⚠️ Final Reminder: Deadline today for "${task.title}"`
        );
        notified.push(task.id);
      }
    });

    localStorage.setItem("deadlineNotified", JSON.stringify(notified));
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f1f8e9, #e3f2fd)",
        padding: "20px",
      }}
    >
      <div
        className="card p-4 shadow-lg border-0"
        style={{
          width: "480px",
          borderRadius: "18px",
          backgroundColor: "#ffffff",
        }}
      >
        <h3 className="text-center text-success mb-4">
          📅 Upcoming Deadlines
        </h3>

        {deadlines.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
            <p className="text-muted mt-3" style={{ fontSize: "1.1rem" }}>
              No upcoming deadlines. Enjoy your time! 😄
            </p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {deadlines.map((task) => (
              <div
                key={task.id}
                className="card border-0 shadow-sm p-3"
                style={{
                  backgroundColor: "#f1f8e9",
                  borderRadius: "12px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-1">📘 {task.title}</h5>
                    <small className="text-muted">Submit before deadline</small>
                    <p
                      className="text-muted mt-1 mb-0"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {task.description}
                    </p>
                  </div>

                  <span
                    className="badge bg-danger text-white px-3 py-2"
                    style={{
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(task.deadline).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/student")}
          className="btn btn-secondary w-100 mt-4 fw-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
