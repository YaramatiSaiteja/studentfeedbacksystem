import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../utils/notify";

export default function TeacherFeedback() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [grade, setGrade] = useState("Pending");
  const [feedbackText, setFeedbackText] = useState("");
  const [submittedDate, setSubmittedDate] = useState("");
  const [gradedDate, setGradedDate] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ Load REAL students list (from users)
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const stuList = users.filter((u) => u.role === "student");
    setStudents(stuList);
  }, []);

  // When selecting a student
  const handleStudentSelect = (email) => {
    setSelectedStudent(email);
    setStudentEmail(email);

    const submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    const studentData = submissions.find((s) => s.studentEmail === email);

    if (studentData) {
      setAssignmentTitle(studentData.assignmentTitle);

      const formattedDate = new Date(studentData.submittedOn)
        .toISOString()
        .split("T")[0];

      setSubmittedDate(formattedDate);
    } else {
      setAssignmentTitle("");
      setSubmittedDate("");
    }
  };

  // Submit feedback
  const handleSubmit = () => {
    if (
      !assignmentTitle ||
      !teacherName ||
      !studentEmail ||
      !feedbackText ||
      !submittedDate
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const feedbackList = JSON.parse(localStorage.getItem("feedbacks")) || [];

    const newFeedback = {
      assignmentTitle,
      teacherName,
      grade,
      feedback: feedbackText,
      submittedOn: submittedDate,
      gradedOn: gradedDate || new Date().toISOString().split("T")[0],
      status: grade === "Pending" ? "Pending" : "Graded",
      studentEmail,
    };

    feedbackList.push(newFeedback);
    localStorage.setItem("feedbacks", JSON.stringify(feedbackList));

    // -------------------------------------------------------
    // 🔔 SEND NOTIFICATIONS TO STUDENT
    // -------------------------------------------------------

    // Feedback Notification
    addNotification(
      studentEmail,
      `💬 New feedback added for "${assignmentTitle}"`
    );

    // Grade Notification (only if grade is NOT Pending)
    if (grade !== "Pending") {
      addNotification(
        studentEmail,
        `🎓 Your assignment "${assignmentTitle}" was graded: ${grade}`
      );
    }

    // -------------------------------------------------------

    setSuccessMsg("✅ Feedback added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);

    // Reset fields
    setSelectedStudent("");
    setAssignmentTitle("");
    setTeacherName("");
    setGrade("Pending");
    setFeedbackText("");
    setSubmittedDate("");
    setGradedDate("");
    setStudentEmail("");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "calc(100vh - 120px)",
        background: "linear-gradient(135deg, #e3f2fd, #e8f5e9)",
        padding: "40px 20px",
      }}
    >
      <div
        className="card shadow-lg p-4 p-md-5"
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <h2 className="text-primary fw-bold text-center mb-4">
          💬 Add Feedback for Student
        </h2>

        {successMsg && (
          <div className="alert alert-success text-center">{successMsg}</div>
        )}

        {/* Student Dropdown */}
        <select
          className="form-select mb-3"
          value={selectedStudent}
          onChange={(e) => handleStudentSelect(e.target.value)}
        >
          <option value="">Select Student</option>
          {students.map((stu) => (
            <option key={stu.email} value={stu.email}>
              {stu.name} ({stu.email})
            </option>
          ))}
        </select>

        {/* Student Email */}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Student Email"
          value={studentEmail}
          disabled
        />

        {/* Assignment Title */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Assignment Title"
          value={assignmentTitle}
          disabled
        />

        {/* Teacher Name */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />

        {/* Feedback */}
        <textarea
          className="form-control mb-3"
          placeholder="Write Feedback..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={3}
        />

        {/* Submitted Date */}
        <input
          type="date"
          className="form-control mb-3"
          value={submittedDate}
          disabled
        />

        {/* Graded Date */}
        <input
          type="date"
          className="form-control mb-3"
          value={gradedDate}
          onChange={(e) => setGradedDate(e.target.value)}
        />

        {/* Grade */}
        <select
          className="form-select mb-4"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>

        {/* Submit Button */}
        <button
          className="btn btn-primary w-100 mb-3 fw-semibold"
          onClick={handleSubmit}
          style={{ padding: "12px", borderRadius: "10px" }}
        >
          Submit Feedback
        </button>

        {/* Back Button */}
        <button
          className="btn btn-secondary w-100 fw-semibold"
          onClick={() => navigate("/teacher")}
          style={{ padding: "12px", borderRadius: "10px" }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
