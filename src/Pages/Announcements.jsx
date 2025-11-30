import React, { useEffect, useState } from "react";

export default function Announcements() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/posts?limit=5")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #e3f2fd, #e8f5e9)"
      }}
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold text-primary mb-4">📢 Announcements</h2>

        {/* Loading */}
        {loading && <p className="text-muted">Loading announcements...</p>}

        {/* Error */}
        {error && (
          <p className="text-danger">
            Failed to load announcements. Try again later.
          </p>
        )}

        {/* Announcements */}
        {!loading &&
          !error &&
          posts.map((post) => (
            <div
              key={post.id}
              className="card p-3 mb-3 shadow-sm announcement-card"
              style={{
                borderRadius: "12px",
                transition: "0.3s ease"
              }}
            >
              <h5 className="fw-bold">{post.title}</h5>
              <p className="text-muted">{post.body}</p>
            </div>
          ))}
      </div>

      {/* Hover Effect */}
      <style>{`
        .announcement-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
        }
      `}</style>
    </div>
  );
}
