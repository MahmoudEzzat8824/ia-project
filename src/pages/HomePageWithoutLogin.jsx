import React from "react";
import TopBar from "../components/top_bar";
import UserInfoCard from "../components/UserInfoCard";
import Posts from "../components/Posts";

function HomePageWithoutLogin({ currentUser, books, onLoginClick }) {

    
    return (
        <>
            <TopBar />
            <div className="main-page">
                <UserInfoCard user={currentUser} />
                <Posts />
            </div>
        </>
    );
}

export default HomePageWithoutLogin;
