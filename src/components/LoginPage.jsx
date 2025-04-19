import { useState } from 'react';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';
import SwitchLink from './SwitchLink';

function LoginPage({ setPage }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!userName || !password) {
      setError('Username and password are required');
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
      <div>
        <UsernameInput
            userName={userName}
            setuserName={setUserName}
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