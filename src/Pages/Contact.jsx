import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "calc(100vh - 120px)",
        width: "100%",
        padding: "60px 20px 40px",
      }}
    >
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="row g-4">
          {/* Contact Information */}
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 contact-card h-100">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-primary">Get In Touch</h2>
                <p className="text-muted mb-4">
                  Have questions or suggestions? We'd love to hear from you!
                </p>

                {/* Details */}
                <div className="d-flex flex-column gap-4">

                  {/* Email */}
                  <div className="d-flex align-items-start">
                    <div className="icon-box bg-light-primary">
                      <FaEnvelope className="icon-primary" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Email</h6>
                      <p className="text-muted small mb-0">
                        assignmentportal@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="d-flex align-items-start">
                    <div className="icon-box bg-light-info">
                      <FaPhone className="icon-info" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Phone</h6>
                      <p className="text-muted small mb-0">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="d-flex align-items-start">
                    <div className="icon-box bg-light-warning">
                      <FaMapMarkerAlt className="icon-warning" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Address</h6>
                      <p className="text-muted small mb-0">
                        123 Education Street<br />
                        Learning City, EDU 12345
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="mt-5 p-3 rounded-4 office-box">
                  <h6 className="fw-bold mb-2">Office Hours</h6>
                  <p className="text-muted small mb-1">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-muted small mb-0">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="card shadow-lg border-0 rounded-4 contact-card">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-primary">Send Us a Message</h2>

                {submitted && (
                  <div className="alert alert-success rounded-3 mb-4">
                    <strong>✔ Message Sent!</strong> We’ll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {["name", "email", "subject"].map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label fw-semibold">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        className="form-control rounded-3 py-2"
                        placeholder={
                          field === "name"
                            ? "Enter your full name"
                            : field === "email"
                            ? "your.email@example.com"
                            : "What is this regarding?"
                        }
                        value={formData[field]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ))}

                  {/* Message */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      className="form-control rounded-3 py-2"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 rounded-3 fw-semibold"
                  >
                    <FaPaperPlane className="me-2" />
                    Send Message
                  </button>
                </form>

                <p className="text-muted text-center mt-4 mb-0 small">
                  Our team will respond within 24–48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          .contact-card {
            background-color: var(--bs-body-bg);
            transition: 0.3s;
          }

          .office-box {
            background-color: #f1f3f4;
            transition: 0.3s;
          }

          .icon-box {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
          }

          .bg-light-primary { background-color: #e3f2fd; }
          .bg-light-info { background-color: #e8f5e9; }
          .bg-light-warning { background-color: #fff3e0; }

          .icon-primary { color: #1565C0; font-size: 1.4rem; }
          .icon-info { color: #2E7D32; font-size: 1.4rem; }
          .icon-warning { color: #EF6C00; font-size: 1.4rem; }

          /* Dark Mode */
          .dark-theme .contact-card {
            background-color: #1f1f1f !important;
            color: #e0e0e0 !important;
          }

          .dark-theme .office-box {
            background-color: #2a2a2a !important;
          }

          .dark-theme .text-muted {
            color: #cfcfcf !important;
          }
        `}
      </style>
    </div>
  );
}
