import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  // Logged user state
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser"))
  );

  const role = loggedUser?.role;

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ------------------------------------------------------------
  // 🔥 LOAD NOTIFICATIONS FOR THIS USER
  // ------------------------------------------------------------
  const loadNotifications = () => {
    if (!loggedUser) return;

    const all = JSON.parse(localStorage.getItem("notifications")) || [];

    const userNotes = all.filter(
      (n) => n.userEmail === loggedUser.email
    );

    setNotifications([...userNotes].reverse());
  };

  // Load whenever user changes
  useEffect(() => {
    loadNotifications();
  }, [loggedUser]);

  // ------------------------------------------------------------
  // 🔥 LISTEN FOR CHANGES IN LOCAL STORAGE (LIVE UPDATE)
  // ------------------------------------------------------------
  useEffect(() => {
    const updateOnStorage = () => loadNotifications();

    window.addEventListener("storage", updateOnStorage);
    return () => window.removeEventListener("storage", updateOnStorage);
  }, []);

  // Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark all as read
  const markRead = () => {
    const all = JSON.parse(localStorage.getItem("notifications")) || [];

    const updated = all.map((n) =>
      n.userEmail === loggedUser.email ? { ...n, read: true } : n
    );

    localStorage.setItem("notifications", JSON.stringify(updated));

    loadNotifications(); // refresh UI
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container-fluid">

        {/* Brand */}
        <Link className="navbar-brand brand-text" to="/">
          📝 Assignment Portal
        </Link>

        <div className="navbar-nav ms-auto align-items-center gap-3">

          <Link className="nav-link gold-link" to="/">Home</Link>
          <Link className="nav-link gold-link" to="/about">About</Link>
          <Link className="nav-link gold-link" to="/contact">Contact</Link>

          {/* 🔔 Notification Bell */}
          {loggedUser && (
            <div className="position-relative bell-wrapper">
              <FaBell
                size={20}
                className="gold-link"
                style={{ cursor: "pointer" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />

              {/* Badge */}
              {unreadCount > 0 && (
                <span
                  className="badge bg-danger text-white position-absolute"
                  style={{
                    top: "-5px",
                    right: "-8px",
                    fontSize: "0.65rem",
                    padding: "4px 6px",
                    borderRadius: "50%",
                  }}
                >
                  {unreadCount}
                </span>
              )}

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  className="card shadow-sm p-2 dropdown-box"
                  style={{
                    position: "absolute",
                    top: "28px",
                    right: "-20px",
                    width: "260px",
                    background: "#1f1f1f",
                    color: "white",
                    borderRadius: "10px",
                    zIndex: 2000,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  <h6 className="fw-bold mb-2" style={{ fontSize: "0.9rem" }}>
                    Notifications
                  </h6>

                  {notifications.length === 0 ? (
                    <p className="text-muted small">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 mb-2 rounded"
                        style={{
                          background: n.read ? "#2c2c2c" : "#3a3a3a",
                          fontSize: "0.85rem",
                        }}
                      >
                        {n.message}
                        <br />
                        <small className="text-muted">{n.time}</small>
                      </div>
                    ))
                  )}

                  <button
                    className="btn btn-sm btn-warning mt-1 w-100 fw-semibold"
                    onClick={markRead}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}

          {loggedUser && (
            <span className="nav-link logout-btn" onClick={handleLogout}>
              Logout
            </span>
          )}

        </div>
      </div>

      <style>{`
        .custom-navbar {
          background: #121212;
          padding: 10px 0;
          border-bottom: 1px solid rgba(200,200,200,0.15);
        }

        .brand-text {
          font-size: 1.45rem;
          font-weight: 700;
          background: linear-gradient(135deg, #bfa76f, #d4c28a);
          -webkit-background-clip: text;
          color: transparent !important;
        }

        .gold-link {
          color: #c9b27d !important;
          transition: 0.25s ease;
        }

        .gold-link:hover {
          color: #e0d7b8 !important;
          transform: translateY(-1px);
        }

        .logout-btn {
          color: #c9b27d !important;
          cursor: pointer;
        }

        .logout-btn:hover {
          color: #e0d7b8 !important;
        }
      `}</style>
    </nav>
  );
}
