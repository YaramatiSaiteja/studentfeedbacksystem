import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTrash, FaCheckCircle, FaClock } from "react-icons/fa";
import { addNotification } from "../utils/notify";   // ✅ IMPORT NOTIFICATIONS

export default function UploadAssignment() {
  const navigate = useNavigate();

  // Load assignments from localStorage
  const loadAssignments = () =>
    JSON.parse(localStorage.getItem("assignments")) || [];

  const [assignments, setAssignments] = useState(loadAssignments);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Sync to localStorage whenever assignments change
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // UPLOAD ASSIGNMENT
  const handleUpload = () => {
    if (!title.trim() || !description.trim() || !deadline || !file) {
      alert("Please fill all fields and select a file!");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const newAssignment = {
        id: Date.now(),
        title,
        description,
        deadline,
        fileName: file.name,
        uploadedAt: new Date().toLocaleString(),
        status: "Uploaded",
      };

      const updated = [newAssignment, ...assignments];
      setAssignments(updated);

      // -----------------------------------------------------------------------
      // 🔔 SEND NOTIFICATION TO ALL STUDENTS
      // -----------------------------------------------------------------------
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const students = users.filter((u) => u.role === "student");

      students.forEach((s) => {
        addNotification(
          s.email,
          `📘 New assignment uploaded: "${title}"`
        );
      });
      // -----------------------------------------------------------------------

      // Reset form
      setTitle("");
      setDescription("");
      setDeadline("");
      setFile(null);
      document.getElementById("fileInput").value = "";

      setUploading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  // Delete assignment
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const updated = assignments.filter((a) => a.id !== id);
      setAssignments(updated);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        width: "100%",
        background: "linear-gradient(135deg, #e8f5e9, #e3f2fd)",
        padding: "40px 20px",
      }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold" style={{ fontSize: "2rem" }}>
            📤 Upload Assignments
          </h2>
          <p className="text-muted" style={{ fontSize: "1.1rem" }}>
            Create and manage assignments for your students
          </p>
        </div>

        {/* Upload Card */}
        <div
          className="card shadow-lg border-0 mb-4"
          style={{ borderRadius: "15px", backgroundColor: "white" }}
        >
          <div className="card-body p-4 p-md-5">
            <h4 className="text-success fw-bold mb-4">
              <FaUpload className="me-2" /> Create New Assignment
            </h4>

            {/* Success message */}
            {success && (
              <div
                className="alert alert-success d-flex align-items-center mb-4"
                style={{ borderRadius: "10px" }}
              >
                <FaCheckCircle className="me-2" style={{ fontSize: "1.5rem" }} />
                <span style={{ fontSize: "1.1rem" }}>
                  ✅ Assignment uploaded successfully!
                </span>
              </div>
            )}

            {/* Title */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Assignment Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Math Homework - Chapter 5"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px" }}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Provide assignment details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px" }}
              />
            </div>

            {/* Deadline */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <FaClock className="me-2" /> Deadline
              </label>
              <input
                type="datetime-local"
                className="form-control"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px" }}
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Upload File (PDF, DOCX, etc.)
              </label>
              <input
                id="fileInput"
                type="file"
                className="form-control"
                onChange={handleFileChange}
                style={{ padding: "12px", borderRadius: "8px" }}
              />
              {file && (
                <small className="text-muted d-block mt-2">
                  Selected: <strong>{file.name}</strong>
                </small>
              )}
            </div>

            {/* Upload Button */}
            <button
              className="btn btn-success w-100 py-3"
              style={{ borderRadius: "10px", fontSize: "1.1rem" }}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload className="me-2" />
                  Upload Assignment
                </>
              )}
            </button>
          </div>
        </div>

        {/* Assignments List */}
        <div
          className="card shadow-lg border-0"
          style={{ borderRadius: "15px", backgroundColor: "white" }}
        >
          <div className="card-body p-4 p-md-5">
            <h4 className="text-primary fw-bold mb-4">
              📋 Uploaded Assignments ({assignments.length})
            </h4>

            {assignments.length > 0 ? (
              <div className="row g-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="col-12">
                    <div
                      className="card border-0 shadow-sm"
                      style={{
                        borderRadius: "12px",
                        borderLeft: "4px solid #28a745",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="fw-bold text-dark">{assignment.title}</h5>
                            <p className="text-muted">{assignment.description}</p>

                            <div className="d-flex flex-wrap gap-3 mt-3">
                              <span className="badge bg-success px-3 py-2">
                                <FaCheckCircle className="me-1" />
                                {assignment.status}
                              </span>
                              <span className="badge bg-info px-3 py-2">
                                <FaClock className="me-1" />
                                Due: {new Date(assignment.deadline).toLocaleString()}
                              </span>
                              <span className="badge bg-secondary px-3 py-2">
                                📎 {assignment.fileName}
                              </span>
                            </div>

                            <small className="text-muted d-block mt-2">
                              Uploaded: {assignment.uploadedAt}
                            </small>
                          </div>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(assignment.id)}
                            style={{ borderRadius: "8px" }}
                          >
                            <FaTrash className="me-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div style={{ fontSize: "4rem", opacity: 0.3 }}>📭</div>
                <p className="text-muted mt-3" style={{ fontSize: "1.1rem" }}>
                  No assignments yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-success px-5 py-2"
            style={{ borderRadius: "10px", fontSize: "1.1rem" }}
            onClick={() => navigate("/teacher")}
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
