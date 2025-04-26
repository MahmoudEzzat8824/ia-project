import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import TopBar from "../components/top_bar";
import UserNotLoggedCard from "../components/UserNotLoggedCard"; 
import Posts from "../components/Posts";

function HomePageWithoutLogin({ currentUser, books, onLoginClick }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/HomePageWithLogin");
    }
  }, [navigate]);

  return (
    <>
      <TopBar />
      <div className="main-page">
        <UserNotLoggedCard />
        <Posts />
      </div>
    </>
  );
}

export default HomePageWithoutLogin;
