import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/top_bar";
import UserNotLoggedCard from "../components/UserNotLoggedCard";
import Posts from "../components/Posts";
import '../Styles/HomePageWithLogin.css';

function HomePageWithoutLogin({ currentUser, books, onLoginClick }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("HomePageWithoutLogin: Checking token");
    const token = localStorage.getItem("token");
    if (token) {
      console.log("HomePageWithoutLogin: Token found, navigating to HomePageWithLogin");
      navigate("/HomePageWithLogin");
    } else {
      console.log("HomePageWithoutLogin: No token found, staying on page");
    }
  }, [navigate]);

  console.log("HomePageWithoutLogin: Rendering", { currentUser, books, onLoginClick });

  return (
    <>
      <TopBar />
      <div className="HomePageWithLogin"> 
        <div className="main-page">
          <UserNotLoggedCard onLoginClick={onLoginClick} />
          <Posts books={books} />
        </div>
      </div>
    </>
  );
}

export default HomePageWithoutLogin;