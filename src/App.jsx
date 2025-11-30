import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import UploadAssignment from "./Pages/UploadAssignment";
import SubmitAssignment from "./Pages/SubmitAssignment";
import Feedback from "./Pages/Feedback";
import GradeAssignments from "./Pages/GradeAssignments";
import TeacherFeedback from "./Pages/TeacherFeedback";
import Deadlines from "./Pages/Deadlines";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import ViewGrades from "./Pages/ViewGrades";
import { useTheme } from "./context/ThemeContext";
import Announcements from "./Pages/Announcements";


// ---------------------------
// Separate AppContent component
// ---------------------------
function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (!visited) {
      localStorage.setItem("visited", "true");
      navigate("/register");
    }
  }, [navigate]);

  return (
    <Routes>
      {/* 🌍 General Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* 🎓 Student Pages */}
      <Route path="/student" element={<StudentDashboard />} />

      {/* Student Upload (Submit Assignment) */}
      <Route path="/upload" element={<SubmitAssignment />} />

      {/* Student Feedback Page */}
      <Route path="/feedback" element={<Feedback />} />

      {/* Student Grades Page */}
      <Route path="/viewgrades" element={<ViewGrades />} />

      {/* Deadlines */}
      <Route path="/deadlines" element={<Deadlines />} />
      {/* Announcements */}
      <Route path="/announcements" element={<Announcements />} />


      {/* 👩‍🏫 Teacher Pages */}
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/upload-assignment" element={<UploadAssignment />} />
      <Route path="/grade" element={<GradeAssignments />} />
      <Route path="/teacher-feedback" element={<TeacherFeedback />} />
    </Routes>
  );
}

// ---------------------------
// MAIN APP COMPONENT (DEFAULT EXPORT)
// ---------------------------
export default function App() {
  const { darkMode } = useTheme();

  return (
    <Router>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "100%"
        }}
        className={darkMode ? "bg-dark text-light" : "bg-light text-dark"}
      >
        <Navbar />

        <main style={{ flex: 1, width: "100%" }}>
          <AppContent />
        </main>

        <Footer />
      </div>
    </Router>
  );
}
