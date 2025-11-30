import React from "react";

export default function Footer() {
  const role = localStorage.getItem("role") || "Guest";

  return (
    <footer className="mt-auto bg-dark text-light py-3 shadow-lg footer-custom">
      <div className="container text-center">
        <small>
          © {new Date().getFullYear()} Online Grading Portal 
        </small>
      </div>
    </footer>
  );
}
