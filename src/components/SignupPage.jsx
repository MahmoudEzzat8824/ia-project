import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import PhoneNumberInput from './PhoneNumberInput';
import UsernameInput from './UsernameInput';
import SSNInput from './SSNInput';

function SignupPage({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [ssn, setSsn] = useState('');
  const [ssnError, setSsnError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('reader');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\d{10,15}$/;
    return re.test(phone);
  };

  const validateSsn = (ssn) => {
    // Accepts XXX-XX-XXXX or XXXXXXXXX format
    const re = /^\d{3}-?\d{2}-?\d{4}$/;
    return re.test(ssn.replace(/\s/g, '')); // Remove spaces for validation
  };


  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('handleSignup called with:', { userName, email, phoneNumber, userType, ssn });
    setError('');
    setEmailError('');
    setPhoneError('');
    setSsnError('');

    if (!userName || !email || !password || !phoneNumber || (userType === 'bookowner' && !ssn)) {
      console.log('Missing fields:', { userName, email, password, phoneNumber, ssn });
      setError('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      console.log('Invalid email:', email);
      setEmailError('Please enter a valid email');
      return;
    }

    if (!validatePhone(phoneNumber)) {
      console.log('Invalid phone:', phoneNumber);
      setPhoneError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    if (userType === 'bookowner' && !validateSsn(ssn)) {
      console.log('Invalid SSN:', ssn);
      setSsnError('Please enter a valid SSN (XXX-XX-XXXX or 9 digits)');
      return;
    }

    try {
      let response;
      const headers = { 'Content-Type': 'application/json' };
      console.log('Sending fetch request for:', userType);

      switch (userType) {
        case 'bookowner':
          response = await fetch('https://localhost:7200/api/bookowner/signup', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              bookOwnerName: userName,
              password,
              ssn: ssn.replace(/[-\s]/g, ''),
              requestStatus: 'Pending',
              email,
              phoneNumber,
            }),
          });
          break;

        case 'reader':
          response = await fetch('https://localhost:7200/api/reader/signup', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              readerName: userName,
              password,
              email,
              phoneNumber,
            }),
          });
          break;

        default:
          throw new Error('Invalid user type');
      }

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Signup failed: ${response.status} ${response.statusText}`;

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.errors
            ? Object.values(errorData.errors).flat().join('; ')
            : errorData.title || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await response.json();
      }

      console.log('Signup successful, redirecting to login');
      alert(`Signup successful as ${userType === 'bookowner' ? 'Book Owner' : 'Reader'}`);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please check your network or server configuration.');
    }
  };

  return (
    <div className="form-container signup-page-container">
      <div className="signup-page-card">
        <h2 className="form-title signup-header">Sign Up for Bookstore</h2>
        {error && <p className="error-text error-message">{error}</p>}
        {emailError && <p className="error-text error-message">{emailError}</p>}
        {phoneError && <p className="error-text error-message">{phoneError}</p>}
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
          {userType === 'bookowner' &&
            <div className="input-group">
              <SSNInput
                ssn={ssn}
                setSsn={setSsn}
                className="input-group"
              />
            </div>
          }
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
          
          <div className="input-group role-selector">
            <label className="block mb-2">Account Type:</label>
            <div className="flex space-x-4 role-options">
              <label className="flex items-center space-x-2 role-option">
                <input
                  type="radio"
                  name="userType"
                  value="reader"
                  checked={userType === 'reader'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="form-radio"
                />
                <span className={userType === 'reader' ? 'active' : ''}>Reader</span>
              </label>
              <label className="flex items-center space-x-2 role-option">
                <input
                  type="radio"
                  name="userType"
                  value="bookowner"
                  checked={userType === 'bookowner'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="form-radio"
                />
                <span className={userType === 'bookowner' ? 'active' : ''}>Book Owner</span>
              </label>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignup}
            className="submit-button signup-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
        <p className="switch-text login-redirect">
          Already have an account?{' '}
          <Link to="/login">
            <button className="switch-link login-link">
              Login
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
    }

    export default SignupPage;