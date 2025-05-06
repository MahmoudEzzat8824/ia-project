import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsernameInput from './UsernameInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';
import SwitchLink from './SwitchLink';
import authService from '../services/auth.service';
import LoginRoleSelector from './LoginRoleSelector';
import '../Styles/auth/login.css'; // Shared auth styles
import '../styles/auth/login.css'; // Login page specific styles
import '../styles/auth/components/buttons.css'; // Button styles
import '../styles/auth/components/forms.css'; // Form container styles
import '../styles/auth/components/inputs.css'; // Input field styles
import '../styles/auth/components/role-selector.css'; // Role selector component styles

function LoginPage({ setPage }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      try {
        const { token, role } = JSON.parse(stored);
        if (token) {
          navigate(role === 'admin' ? '/AdminDashboard' : '/ProfilePage', { replace: true });
        }
      } catch (err) {
        console.error('Error reading token:', err);
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!userName || !password) {
      setError('Username and password are required');
      return;
    }
  
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
  
    setIsLoading(true);
  
    try {
      let response;
      
      // Call the appropriate login method based on selected role
      switch (selectedRole) {
        case 'admin':
          response = await authService.AdminLogin(userName, password);
          break;
        case 'book_owner':
          response = await authService.BookOwnerLogin(userName, password);
          break;
        case 'reader':
          response = await authService.ReaderLogin(userName, password);
          break;
        default:
          throw new Error('Invalid role selected');
      }
  
      // Store token and role in localStorage
      localStorage.setItem('token', JSON.stringify({
        token: response.token,
        role: selectedRole,
        ...(selectedRole === 'reader' && {
          readerID: response.user?.readerID,
          readerName: response.user?.readerName,
          readerEmail: response.user?.email
        }),
        ...(selectedRole === 'book_owner' && {
          bookOwnerID: response.user?.bookOwnerID
        })
      }));
  
      // Redirect based on role
      if (selectedRole === 'admin') {
        navigate('/AdminDashboard', { replace: true });
      } else {
        navigate('/HomePageWithLogin', { replace: true });
      }
  
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to access your account</p>
        </div>
        
        
        <LoginRoleSelector 
          onSelect={handleRoleSelect} 
          selectedRole={selectedRole}
        />
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <UsernameInput
            userName={userName}
            setuserName={setUserName}
          />
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <SubmitButton 
            handleLogin={handleLogin} 
            isLoading={isLoading}
          />
        </form>
        
        <div className="login-footer">
          <SwitchLink />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;