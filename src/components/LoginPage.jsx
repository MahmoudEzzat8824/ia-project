import { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';
import SwitchLink from './SwitchLink';
import authService from '../services/auth.service';
import LoginRoleSelector from './LoginRoleSelector';

function LoginPage({ setPage }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      try {
        const { token, role } = JSON.parse(stored);
        if (token) {
          if (role === 'admin') {
            navigate('/AdminDashboard', { replace: true });
          } else {
            navigate('/ProfilePage', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error reading token:', err);
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    console.log('Selected role:', role);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!userName || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      if(selectedRole ==="admin"){
        let response;
      const headers = { 'Content-Type': 'application/json' };

      await authService.AdminLogin(userName,password)

      window.open('/AdminDashboard',"_blank")
      }
      else if(selectedRole ==="book_owner"){
        let response;
      const headers = { 'Content-Type': 'application/json' };

      await authService.BookOwnerLogin(userName,password)

      window.open('/BookOwnerPage ',"_blank")
      }
      else if(selectedRole ==="reader"){
        let response;
      const headers = { 'Content-Type': 'application/json' };

      await authService.ReaderLogin(userName,password)

      window.open('/ProfilePage',"_blank")
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your network or server configuration.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login to Bookstore</h2>
      <LoginRoleSelector onSelect={handleRoleSelect}/>
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