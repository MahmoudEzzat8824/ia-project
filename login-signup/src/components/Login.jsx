import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function Login({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert('Login successful (mock response)');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login to Bookstore</h2>
      {error && <p className="error-text">{error}</p>}
      {emailError && <p className="error-text">{emailError}</p>}
      <div>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="input-group relative">
          <label className="input-label">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pr-10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="submit-button login-button"
        >
          Login
        </button>
      </div>
      <p className="switch-text">
        Don't have an account?{' '}
        <button onClick={() => setPage('signup')} className="switch-link login-link">
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;