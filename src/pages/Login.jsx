import LoginPage from '../components/LoginPage';
import authService from '../services/auth.service';
import { useEffect } from 'react';



function Login({ setPage }) {
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     authService.refreshTokenIfNeeded();
  //   }, 60000); // Check every 60 seconds
  
  //   return () => clearInterval(interval);
  // }, []);
  
  return <LoginPage />;
}

export default Login;