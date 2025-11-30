// ⭐ SubmitAssignment.jsx (FINAL FIXED VERSION)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../utils/notify";

export default function SubmitAssignment() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [file, setFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("assignments")) || [];
    setAssignments(data);
  }, []);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!selectedAssignment) {
      alert("Please select an assignment!");
      return;
    }
    if (!file) {
      alert("Please choose a file to upload!");
      return;
    }

    const selected = assignments.find((a) => a.id === selectedAssignment);

    const newSubmission = {
      submissionId: Date.now(),
      assignmentId: selected.id,
      assignmentTitle: selected.title,
      studentName: user.name,
      studentEmail: user.email,
      fileName: file.name,
      submittedOn: new Date().toLocaleString(),
      graded: false,
      grade: "",
      feedback: ""
    };

    const existing = JSON.parse(localStorage.getItem("submissions")) || [];
    localStorage.setItem("submissions", JSON.stringify([...existing, newSubmission]));

    // 🔔 Notify Teachers
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const teachers = users.filter((u) => u.role === "teacher");

    teachers.forEach((t) => {
      addNotification(
        t.email,
        `📥 ${user.name} submitted assignment "${selected.title}".`
      );
    });

    // ⭐ Update notification badge instantly
    window.dispatchEvent(new Event("storage"));

    setFile(null);
    setSelectedAssignment("");
    document.getElementById("uploadInput").value = "";

    setSuccessMsg("✅ Assignment submitted successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="submit-page d-flex align-items-center justify-content-center">
      <div className="card submit-card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <h3 className="text-primary text-center mb-4 fw-bold">
          📤 Submit Assignment
        </h3>

        <div className="mb-3">
          <label className="form-label fw-semibold">Choose Assignment</label>
          <select
            className="form-select rounded-3"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(Number(e.target.value))}
          >
            <option value="">-- Select --</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} — Due: {new Date(a.deadline).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <input
          id="uploadInput"
          type="file"
          className="form-control rounded-3 mb-3"
          onChange={handleFileUpload}
        />

        <button
          className="btn btn-primary w-100 mb-3 rounded-3 fw-semibold"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {successMsg && (
          <div className="alert alert-success text-center py-2 rounded-3">
            {successMsg}
          </div>
        )}

        <button
          onClick={() => navigate("/student")}
          className="btn btn-secondary w-100 mt-4 rounded-3 fw-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
