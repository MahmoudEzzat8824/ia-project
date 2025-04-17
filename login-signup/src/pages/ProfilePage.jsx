import React from 'react';
import TopBar from "../components/top_bar";
import UserName from '../components/UserName';
import { Link } from 'react-router-dom';

function ProfilePage() {
    return (
      <>
        <TopBar />
        <UserName />
        <Link to="/EditProfilePage"> 
            <button className="edit_profile_button">
                edit profile
            </button>
        </Link>
      </>
    );
}

export default ProfilePage;
