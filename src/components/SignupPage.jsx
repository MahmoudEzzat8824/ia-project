import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import PhoneNumberInput from './PhoneNumberInput';
import UsernameInput from './UsernameInput';

function SignupPage({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10,15}$/;
    return re.test(phone);
  };


  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
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
            <UsernameInput
            userName={userName}
            setuserName={setUserName}
            className="input-group"
            />
            <EmailInput
          email={email}
          setEmail={setEmail}
          className="input-group"
            />
            <PhoneNumberInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            className="input-group"
          />
            <PasswordInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          className="input-group relative"
            />
            <button
              onClick={handleSignup}
              className="submit-button signup-button"
            >
              Sign Up
            </button>
          </div>
          <p className="switch-text">
            Already have an account?{' '}
            <Link to="/">
              <button className="switch-link signup-link">
                Login
              </button>
            </Link>
          </p>
        </div>
      );
    }

    export default SignupPage;