import { useState } from 'react';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';
import SwitchLink from './SwitchLink';

function LoginPage({ setPage }) {
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
        <EmailInput
          email={email}
          setEmail={setEmail}
          className="input-group"
        />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          className="input-group relative"
        />
        <SubmitButton handleLogin={handleLogin} />
      </div>
      <SwitchLink />
    </div>
  );
}

export default LoginPage;