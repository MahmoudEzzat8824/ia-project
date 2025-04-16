import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function Signup({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10,15}$/;
    return re.test(phone);
  };

  const checkPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (pwd.length < 10) return 'Medium';
    return 'Strong';
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!userName || !email || !password || !phoneNumber) {
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setPhoneError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    if (passwordStrength === 'Weak') {
      setError('Password is too weak. Use at least 6 characters.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (email === 'test@example.com') {
        throw new Error('Email already exists');
      }
      alert('Signup successful (mock response)');
      setPage('login');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Sign Up for Bookstore</h2>
      {error && <p className="error-text">{error}</p>}
      {emailError && <p className="error-text">{emailError}</p>}
      {phoneError && <p className="error-text">{phoneError}</p>}
      <div>
        <div className="input-group">
          <label className="input-label">User Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="input-field"
            placeholder="John Doe"
            required
          />
        </div>
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
        <div className="input-group">
          <label className="input-label">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div className="input-group relative">
          <label className="input-label">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
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
          {/* {password && (
            <div className="password-strength">
              Password Strength:{' '}
              <span
                className={
                  passwordStrength === 'Weak'
                    ? 'text-red-500'
                    : passwordStrength === 'Medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }
              >
                {passwordStrength}
              </span>
            </div>
          )} */}
        </div>
        <button
          onClick={handleSignup}
          className="submit-button signup-button"
        >
          Sign Up
        </button>
      </div>
      <p className="switch-text">
        Already have an account?{' '}
        <button onClick={() => setPage('login')} className="switch-link signup-link">
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;