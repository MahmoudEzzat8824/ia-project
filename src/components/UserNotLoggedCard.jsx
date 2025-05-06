import React from "react";
import '../Styles/UserInfoCard.css'

function UserNotLoggedCard() {
  return (
    <div className="user-info-card">
      <p>Not logged in</p>
      <a href="/login">Login</a>
    </div>
  );
}

export default UserNotLoggedCard;