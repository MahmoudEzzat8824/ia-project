import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import TopBar from "../components/top_bar";
import UserInfoCard from "../components/UserInfoCard";
import Posts from "../components/Posts";
import authService from '../services/auth.service';

  
function HomePageWithLogin({ currentUser, books, onLoginClick }) {

  useEffect(() => {
    const interval = setInterval(() => {
      authService.refreshTokenIfNeeded();
    }, 60000); // Check every 60 seconds
  
    return () => clearInterval(interval);
    }, []);
    
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If there is NO token, redirect to HomePageWithoutLogin
      navigate("/HomePageWithoutLogin");
    }
  }, [navigate]);

  return (
    <>
      <TopBar />
      <div className="main-page">
        <UserInfoCard />
        <Posts />
      </div>
    </>
  );
}

export default HomePageWithLogin;
