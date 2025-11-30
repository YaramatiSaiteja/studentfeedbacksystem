import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // CAPTCHA states
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");

  const navigate = useNavigate();

  // Load role from URL
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "student" || roleParam === "teacher") {
      setRole(roleParam);
    }
  }, [searchParams]);

  // Generate CAPTCHA on load
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const value = Math.floor(10000 + Math.random() * 90000);
    setCaptcha(value.toString());
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // CAPTCHA Validation
    if (userCaptcha !== captcha) {
      alert("❌ Incorrect CAPTCHA! Please try again.");
      generateCaptcha();
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (!user) {
      alert("Invalid credentials or role mismatch!");
      generateCaptcha();
      return;
    }

    // ⭐ Fix: Save only loggedUser & remove old key
    localStorage.setItem("loggedUser", JSON.stringify(user));
    localStorage.removeItem("loggedInUser");  // ❗IMPORTANT: fixes notification bug

    alert("Login successful!");

    if (role === "teacher") navigate("/teacher");
    else navigate("/student");
  };

  const isTeacher = role === "teacher";
  const iconUrl = isTeacher
    ? "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const title = isTeacher ? "Teacher Login" : "Student Login";
  const subtitle = isTeacher
    ? "Access your teacher dashboard"
    : "Access your student dashboard";

  const buttonColor = isTeacher ? "#2563eb" : "#9333ea";

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card shadow-lg p-4 p-md-5 rounded-4">
        <div className="text-center mb-4">
          <img src={iconUrl} alt="icon" className="login-icon mb-2" />
          <h3 className="fw-bold">{title}</h3>
          <p className="text-muted small">{subtitle}</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Role */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Role</label>
            <select
              className="form-select rounded-3"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control rounded-3"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* CAPTCHA */}
          <div className="mb-4">
            <label className="form-label fw-semibold">CAPTCHA</label>

            <div className="d-flex align-items-center mt-2">
              <div
                style={{
                  background: "#e0efff",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "1.1rem",
                  letterSpacing: "4px",
                  color: "#1e40af",
                  minWidth: "110px",
                  textAlign: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {captcha}
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ms-3"
                style={{
                  padding: "6px 12px",
                  fontSize: "0.85rem",
                  borderRadius: "8px",
                }}
                onClick={generateCaptcha}
              >
                ↻ Refresh
              </button>
            </div>

            <input
              type="text"
              className="form-control rounded-3 mt-3"
              style={{ padding: "10px" }}
              placeholder="Enter CAPTCHA"
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn w-100 text-white fw-semibold py-2 rounded-3"
            style={{ backgroundColor: buttonColor }}
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-3">
          <p className="text-muted small">
            Don't have an account?{" "}
            <span
              className="fw-semibold register-link"
              onClick={() => navigate(`/register?role=${role}`)}
            >
              Register here
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          padding: 20px;
        }

        .login-card {
          width: 420px;
          background: #ffffff;
          border-radius: 20px;
        }

        .login-icon {
          width: 70px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        .register-link {
          color: #2563eb;
          cursor: pointer;
        }

        .register-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
