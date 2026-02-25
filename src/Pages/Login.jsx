import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Captcha from '../components/Captcha';
import { loginUser } from '../utils/auth';
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!captchaValid) {
      setError('Please pass the human verification before logging in.');
      return;
    }

    try {
      const user = loginUser({ email, password });
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        /* Light white base with cyan radial glow top-right — matches screenshot */
        background: 'radial-gradient(ellipse at top right, rgba(180,230,230,0.55) 0%, rgba(255,255,255,0) 60%), #ffffff',
        /* Subtle cyan grid lines on top */
        backgroundImage: `
          radial-gradient(ellipse at top right, rgba(180,230,230,0.55) 0%, rgba(255,255,255,0) 60%),
          linear-gradient(rgba(100,200,210,0.12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,200,210,0.12) 1px, transparent 1px)
        `,
        backgroundSize: 'cover, 60px 60px, 60px 60px',
        backgroundPosition: 'center, 0 0, 0 0',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5 mt-5">
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card shadow-lg border-0" style={{ borderRadius: '16px' }}>
            <div
              className="card-header bg-primary text-white text-center py-4 position-relative"
              style={{ borderRadius: '16px 16px 0 0', background: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)' }}
            >
              <Link
                to="/"
                className="btn btn-outline-light btn-sm d-inline-flex align-items-center justify-content-center position-absolute top-0 start-0 m-3"
                style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
                title="Back to Home"
              >
                <FaArrowLeft />
              </Link>
              <h3 className="mb-0 fw-bold mt-2">Welcome Back</h3>
              <p className="text-light mb-0 small">Login to your account</p>
            </div>

            <div className="card-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label text-muted fw-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted fw-bold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Captcha onValidate={(isValid) => setCaptchaValid(isValid)} />

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold mb-3"
                  disabled={!captchaValid}
                >
                  Sign In
                </button>

                <div className="text-center text-muted small mt-2">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-decoration-none fw-bold text-primary">
                    Sign up here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;