import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaCheckCircle, FaUndo, FaFileAlt } from "react-icons/fa";
import { addNotification } from "../utils/notify";   // ✅ NOTIFICATION IMPORT

export default function GradeAssignments() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("submissions")) || [];
    setSubmissions(stored);
  }, []);

  const updateSubmissions = (data) => {
    setSubmissions(data);
    localStorage.setItem("submissions", JSON.stringify(data));
  };

  // ⭐ SAVE FEEDBACK
  const saveFeedbackToLocalStorage = (submission) => {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const teacher = JSON.parse(localStorage.getItem("loggedUser"));

    const feedbackObj = {
      assignmentId: submission.assignmentId,
      assignmentTitle: submission.assignmentTitle,
      studentName: submission.studentName,
      studentEmail: submission.studentEmail,
      feedback: submission.feedback,
      teacherName: teacher?.name || "Teacher",
      submittedOn: submission.submittedOn,
      gradedOn: new Date().toLocaleString(),
    };

    feedbacks.push(feedbackObj);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
  };

  // ⭐ SAVE GRADES
  const saveGradeToLocalStorage = (submission) => {
    const grades = JSON.parse(localStorage.getItem("grades")) || [];
    const teacher = JSON.parse(localStorage.getItem("loggedInUser"));

    const gradeObj = {
      assignmentId: submission.assignmentId,
      assignmentTitle: submission.assignmentTitle,
      studentName: submission.studentName,
      studentEmail: submission.studentEmail,
      grade: submission.grade,
      status: "Graded",
      submittedOn: submission.submittedOn,
      gradedOn: new Date().toLocaleString(),
      teacherName: teacher?.name || "Teacher",
    };

    grades.push(gradeObj);
    localStorage.setItem("grades", JSON.stringify(grades));
  };

  // ⭐ GRADE FUNCTION + NOTIFICATIONS
  const handleGrade = (index, grade) => {
    const updated = [...submissions];

    updated[index].graded = true;
    updated[index].grade = grade;

    // Clean feedback 
    updated[index].feedback = "Great work!";

    updateSubmissions(updated);

    // Save in two separate storage buckets
    saveGradeToLocalStorage(updated[index]);
    saveFeedbackToLocalStorage(updated[index]);

    // ------------------------------------------------------------
    // 🔔 SEND NOTIFICATIONS TO STUDENT
    // ------------------------------------------------------------
    const studentEmail = updated[index].studentEmail;
    const title = updated[index].assignmentTitle;

    // Grade notification
    addNotification(
      studentEmail,
      `🎓 Your assignment "${title}" was graded: ${grade}`
    );

    // Feedback notification
    addNotification(
      studentEmail,
      `💬 New feedback received for "${title}"`
    );
    // ------------------------------------------------------------

    setSuccessMsg(
      `✅ ${updated[index].studentName}'s ${updated[index].assignmentTitle} graded successfully!`
    );

    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleUndo = (index) => {
    const updated = [...submissions];
    updated[index].graded = false;
    updated[index].grade = "";
    updated[index].feedback = "";
    updateSubmissions(updated);
  };

  const getBadgeClass = (grade) => {
    if (grade.startsWith("A+")) return "bg-success";
    if (grade.startsWith("A")) return "bg-primary";
    if (grade.startsWith("B")) return "bg-info";
    if (grade.startsWith("C")) return "bg-warning text-dark";
    return "bg-secondary";
  };

  const pendingCount = submissions.filter((s) => !s.graded).length;
  const gradedCount = submissions.filter((s) => s.graded).length;

  return (
    <div className="grade-page">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">📝 Grade Assignments</h2>
          <p className="text-muted">Review student submissions and assign grades</p>

          <div className="d-flex justify-content-center gap-3 mt-3">
            <span className="badge bg-warning text-dark px-3 py-2">
              ⏳ Pending: {pendingCount}
            </span>
            <span className="badge bg-success px-3 py-2">
              ✅ Graded: {gradedCount}
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center mb-4 rounded-3">
            <FaCheckCircle className="me-2" />
            {successMsg}
          </div>
        )}

        <div className="card shadow-lg border-0 rounded-4 grade-card">
          <div className="card-body p-4 p-md-5">
            <h4 className="fw-bold text-primary mb-4">
              📋 Student Submissions ({submissions.length})
            </h4>

            {submissions.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {submissions.map((sub, index) => (
                  <div key={sub.submissionId} className="card border-0 shadow-sm rounded-4 grade-item">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5 className="fw-bold mb-2">👤 {sub.studentName}</h5>

                          <p className="text-muted small mb-1">
                            <FaFileAlt className="me-2" />
                            {sub.assignmentTitle}
                          </p>

                          <small className="text-muted">
                            📅 Submitted: {sub.submittedOn}
                          </small>
                        </div>

                        {sub.graded && (
                          <span className={`badge ${getBadgeClass(sub.grade)} px-3 py-2`}>
                            <FaStar className="me-1" />
                            {sub.grade}
                          </span>
                        )}
                      </div>

                      {!sub.graded ? (
                        <div className="mt-3">
                          <p className="text-muted small mb-1"><strong>Assign Grade:</strong></p>

                          <div className="d-flex flex-wrap gap-2">
                            {["A+", "A", "B+", "B", "C", "D"].map((g) => (
                              <button
                                key={g}
                                className={`btn px-4 py-2 rounded-3 btn-${
                                  g === "C"
                                    ? "warning"
                                    : g === "D"
                                    ? "secondary"
                                    : g.includes("A")
                                    ? "primary"
                                    : "info"
                                }`}
                                onClick={() => handleGrade(index, g)}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div className="p-2 rounded-3 bg-light-success flex-grow-1">
                            <small className="text-success fw-semibold">
                              ✔ Graded – {sub.feedback}
                            </small>
                          </div>

                          <button
                            className="btn btn-outline-danger btn-sm rounded-3 ms-3"
                            onClick={() => handleUndo(index)}
                          >
                            <FaUndo className="me-1" />
                            Undo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
                <p className="text-muted mt-3">No submissions to grade.</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary px-5 py-2 rounded-3"
            onClick={() => navigate("/teacher")}
          >
            ⬅ Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
