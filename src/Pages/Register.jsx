import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Auto-set role from URL
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "student" || roleParam === "teacher") {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Prevent duplicate accounts
    if (users.find((u) => u.email === email && u.role === role)) {
      alert("User already exists! Please login instead.");
      navigate(`/login?role=${role}`);
      return;
    }

    const newUser = { name, email, password, role };

    // Save into main users list
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // -------------------------------------------
    // ADD NEW STUDENT TO "students" LIST
    // -------------------------------------------
    if (role === "student") {
      const students = JSON.parse(localStorage.getItem("students")) || [];
      students.push({ name, email });
      localStorage.setItem("students", JSON.stringify(students));
    }
    // -------------------------------------------

    alert("Registration successful! Please login.");
    navigate(`/login?role=${role}`);
  };

  const isTeacher = role === "teacher";

  const iconUrl = isTeacher
    ? "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
    : "https://cdn-icons-png.flaticon.com/512/906/906343.png";

  const title = isTeacher ? "Teacher Registration" : "Student Registration";
  const subtitle = isTeacher
    ? "Create your teacher account to get started"
    : "Create your student account to get started";

  const headerColor = isTeacher ? "#28a745" : "#0d6efd";

  return (
    <div className="register-page d-flex align-items-center justify-content-center">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 register-card">
        {/* Header */}
        <div className="text-center mb-3">
          <img src={iconUrl} alt="icon" className="register-icon" />
          <h3 className="fw-bold mb-1" style={{ color: headerColor }}>
            {title}
          </h3>
          <p className="text-muted small mb-0">{subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister}>
          {/* Role */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Role</label>
            <select
              className="form-select rounded-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Full Name</label>
            <input
              type="text"
              className="form-control rounded-3 py-2"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold small">Email</label>
            <input
              type="email"
              className="form-control rounded-3 py-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <input
              type="password"
              className="form-control rounded-3 py-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Register Button */}
          <button
            className="btn w-100 text-white fw-semibold py-2 rounded-3"
            style={{ backgroundColor: headerColor }}
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-3">
          <p className="text-muted small mb-0">
            Already have an account?{" "}
            <span
              className="fw-semibold"
              style={{ color: headerColor, cursor: "pointer" }}
              onClick={() => navigate(`/login?role=${role}`)}
            >
              Login here
            </span>
          </p>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
    .register-page {
      min-height: calc(100vh - 120px);
      width: 100%;
      padding: 40px 20px;
      background: #e6e9ef;
      transition: 0.3s;
    }

    .register-card {
      width: 420px;
      background: #ffffff;
      border-radius: 20px;
    }

    .register-icon {
      width: 70px;
      margin-bottom: 10px;
    }

    /* Dark Theme */
    .dark-theme .register-page {
      background-color: #121212 !important;
    }

    .dark-theme .register-card {
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
