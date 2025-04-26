import React from "react";

function UserNotLoggedCard() {
  return (
    <div className="user-info-card">
      <p>Not logged in</p>
      <a href="/">Login</a>
    </div>
  );
}

export default UserNotLoggedCard;